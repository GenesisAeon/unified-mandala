import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';

export interface OpaEvalResult {
  enforced: boolean;
  allow: boolean;
  deny: boolean;
  reasons: string[];
  neededEvidence: unknown[];
  policyRev?: string;
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

function resolveOpaBinary(): string {
  const fromEnv = process.env.OPA_BIN?.trim();
  if (fromEnv) {
    return fromEnv;
  }
  const localBin = process.platform === 'win32' ? 'bin/opa.exe' : 'bin/opa';
  if (existsSync(localBin)) {
    return localBin;
  }
  return 'opa';
}

function buildArgs(): string[] | null {
  const defaultQuery = process.env.ETHICS_OPA_QUERY ?? 'data.mandala.ethics.output';
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

export async function runOpaEval(input: unknown): Promise<OpaEvalResult> {
  const args = buildArgs();
  if (!args) {
    return { enforced: false, allow: true, deny: false, reasons: [], neededEvidence: [] };
  }

  return await new Promise<OpaEvalResult>((resolve) => {
    const opaBin = resolveOpaBinary();
    const proc = spawn(opaBin, args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: process.platform === 'win32',
    });

    const finish = (result: OpaEvalResult) => {
      resolve(result);
    };

    const timer = setTimeout(() => {
      proc.kill('SIGKILL');
      finish({
        enforced: true,
        allow: false,
        deny: true,
        reasons: ['opa_timeout'],
        neededEvidence: [],
      });
    }, timeoutMs > 0 ? timeoutMs : 1500);

    const stdoutChunks: Buffer[] = [];
    const stderrChunks: Buffer[] = [];

    proc.stdout.on('data', (chunk) => stdoutChunks.push(Buffer.from(chunk)));
    proc.stderr.on('data', (chunk) => stderrChunks.push(Buffer.from(chunk)));

    proc.on('error', (error) => {
      clearTimeout(timer);
      finish({
        enforced: true,
        allow: false,
        deny: true,
        reasons: [`opa_spawn_error:${error?.message ?? 'unknown'}`],
        neededEvidence: [],
      });
    });

    proc.on('close', (code) => {
      clearTimeout(timer);
      if (code !== 0) {
        const err = stderrChunks.length > 0 ? Buffer.concat(stderrChunks).toString('utf8').trim() : 'opa_nonzero_exit';
        finish({
          enforced: true,
          allow: false,
          deny: true,
          reasons: [`opa_exit:${err}`],
          neededEvidence: [],
        });
        return;
      }

      try {
        const raw = Buffer.concat(stdoutChunks).toString('utf8') || '{}';
        const parsed = JSON.parse(raw) as {
          result?: Array<{ expressions?: Array<{ value: unknown }> }>;
        };
        const expressions = parsed.result?.[0]?.expressions ?? [];

        let decision: Record<string, unknown> | null = null;
        let denyFlag = false;
        let allowFlag = false;

        for (const expr of expressions) {
          const value = expr.value;
          if (value && typeof value === 'object' && !Array.isArray(value)) {
            decision = value as Record<string, unknown>;
          } else if (typeof value === 'boolean') {
            denyFlag = denyFlag || Boolean(value);
            allowFlag = allowFlag || !value;
          }
        }

        if (!decision) {
          decision = {};
        }

        const deny = typeof decision.deny === 'boolean' ? Boolean(decision.deny) : denyFlag;
        const allow = typeof decision.allow === 'boolean' ? Boolean(decision.allow) : (decision.deny === undefined ? allowFlag : !deny);
        const reasons = Array.isArray(decision.reasons)
          ? (decision.reasons as unknown[]).map((entry) => String(entry))
          : deny && !denyFlag
            ? ['policy_denied']
            : [];
        const needed = Array.isArray(decision.needed_evidence)
          ? (decision.needed_evidence as unknown[])
          : [];
        const policyRev = typeof decision.policy_rev === 'string' ? decision.policy_rev : undefined;

        finish({
          enforced: true,
          allow,
          deny,
          reasons,
          neededEvidence: needed,
          policyRev,
          output: decision,
        });
      } catch (error) {
        finish({
          enforced: true,
          allow: false,
          deny: true,
          reasons: [`opa_parse_error:${error instanceof Error ? error.message : 'unknown'}`],
          neededEvidence: [],
        });
      }
    });

    try {
      proc.stdin.write(JSON.stringify(input));
      proc.stdin.end();
    } catch (error) {
      clearTimeout(timer);
      finish({
        enforced: true,
        allow: false,
        deny: true,
        reasons: [`opa_write_failed:${error instanceof Error ? error.message : 'unknown'}`],
        neededEvidence: [],
      });
    }
  });
}
