import { spawn } from 'node:child_process';

interface OpaResult {
  enforced: boolean;
  deny: boolean;
  reason?: string;
  reasons?: string[];
  output?: Record<string, unknown>;
}

const timeoutMs = Number.parseInt(process.env.ETHICS_OPA_TIMEOUT_MS ?? '1500', 10);

function shouldEnable(path?: string): boolean {
  const flag = (process.env.ETHICS_OPA_ENABLE ?? '').toLowerCase();
  if (!path) {
    return false;
  }
  return flag === '1' || flag === 'true' || flag === 'yes';
}

function buildArgs(): string[] | null {
  const defaultQuery = process.env.ETHICS_OPA_QUERY ?? 'data.ethics.deny';
  const opaPath = process.env.ETHICS_OPA_PATH;
  const dataPath = process.env.ETHICS_OPA_DATA_PATH;
  if (shouldEnable(opaPath)) {
    const args = ['eval', '--format=json', '--stdin-input'];
    if (dataPath) {
      args.push('-d', dataPath);
    }
    args.push('-d', opaPath as string, defaultQuery);
    return args;
  }

  const legacyBundle = process.env.ETHICS_OPA_BUNDLE;
  const legacyQuery = process.env.ETHICS_OPA_QUERY;
  if (legacyBundle && legacyQuery) {
    return ['eval', '--format=json', '--stdin-input', '-d', legacyBundle, legacyQuery];
  }
  return null;
}

export async function evaluateOpa(input: unknown): Promise<OpaResult> {
  const args = buildArgs();
  if (!args) {
    return { enforced: false, deny: false };
  }

  return await new Promise<OpaResult>((resolve) => {
    const proc = spawn('opa', args, {
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let settled = false;
    const finish = (result: OpaResult) => {
      if (!settled) {
        settled = true;
        resolve(result);
      }
    };

    const timer = setTimeout(() => {
      proc.kill('SIGKILL');
      finish({ enforced: true, deny: true, reason: 'opa_timeout' });
    }, timeoutMs > 0 ? timeoutMs : 1500);

    const stdoutChunks: Buffer[] = [];
    const stderrChunks: Buffer[] = [];

    proc.stdout.on('data', (chunk) => stdoutChunks.push(Buffer.from(chunk)));
    proc.stderr.on('data', (chunk) => stderrChunks.push(Buffer.from(chunk)));

    proc.on('error', (error) => {
      clearTimeout(timer);
      finish({ enforced: true, deny: true, reason: error.message });
    });

    proc.on('close', (code) => {
      clearTimeout(timer);
      if (code !== 0) {
        finish({
          enforced: true,
          deny: true,
          reason: stderrChunks.length > 0 ? Buffer.concat(stderrChunks).toString('utf8') : 'opa_nonzero_exit',
        });
        return;
      }
      try {
        const raw = Buffer.concat(stdoutChunks).toString('utf8') || '{}';
        const parsed = JSON.parse(raw) as { result?: Array<{ expressions?: Array<{ value: unknown }> }> };
        const expressions = parsed.result?.[0]?.expressions ?? [];
        let deny = false;
        let reasons: string[] | undefined;
        let output: Record<string, unknown> | undefined;
        for (const expr of expressions) {
          const value = expr.value as unknown;
          if (typeof value === 'boolean') {
            deny = deny || Boolean(value);
          } else if (value && typeof value === 'object' && 'deny' in (value as Record<string, unknown>)) {
            const objectValue = value as Record<string, unknown>;
            deny = deny || Boolean(objectValue.deny);
            if (Array.isArray(objectValue.reasons)) {
              reasons = objectValue.reasons.map((entry) => String(entry));
            }
            output = objectValue;
          }
        }
        finish({ enforced: true, deny, reason: deny ? (reasons?.[0] ?? 'opa_policy_deny') : undefined, reasons, output });
      } catch (error) {
        finish({ enforced: true, deny: true, reason: error instanceof Error ? error.message : 'opa_parse_error' });
      }
    });

    try {
      proc.stdin.write(JSON.stringify(input));
      proc.stdin.end();
    } catch (error) {
      clearTimeout(timer);
      finish({ enforced: true, deny: true, reason: error instanceof Error ? error.message : 'opa_write_failed' });
    }
  });
}
