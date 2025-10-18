import { spawn } from 'node:child_process';

interface OpaResult {
  enforced: boolean;
  deny: boolean;
  reason?: string;
}

const query = process.env.ETHICS_OPA_QUERY;
const bundle = process.env.ETHICS_OPA_BUNDLE;
const timeoutMs = Number.parseInt(process.env.ETHICS_OPA_TIMEOUT_MS ?? '400', 10);

export async function evaluateOpa(input: unknown): Promise<OpaResult> {
  if (!query || !bundle) {
    return { enforced: false, deny: false };
  }

  return await new Promise<OpaResult>((resolve) => {
    const proc = spawn('opa', ['eval', '--format=json', '-I', '-d', bundle, query], {
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
    }, timeoutMs > 0 ? timeoutMs : 400);

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
        const deny = expressions.some((expr) => Boolean(expr.value));
        finish({ enforced: true, deny, reason: deny ? 'opa_policy_deny' : undefined });
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
