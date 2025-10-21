import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(__dirname, '../../../..');
const OPA_BIN = process.env.OPA_BIN || path.join(ROOT, 'bin', process.platform === 'win32' ? 'opa.exe' : 'opa');
const BUNDLE = process.env.OPA_BUNDLE || path.join(ROOT, 'dist', 'opa', 'mandala-ethics-bundle.tar.gz');

function opaEval(input: unknown) {
  const res = spawnSync(OPA_BIN, ['eval', '-b', BUNDLE, '-I', 'data.mandala.ethics.output'], {
    input: JSON.stringify(input),
    encoding: 'utf8',
    shell: process.platform === 'win32',
  });
  return { code: res.status ?? 1, stdout: res.stdout, stderr: res.stderr };
}

if (!fs.existsSync(BUNDLE)) {
  describe.skip('OPA bundle policy (binary eval)', () => {
    it('skipped: bundle not built', () => {
      // no-op
    });
  });
} else {
  describe('OPA bundle policy (binary eval)', () => {
    it('allows grounded, non-degraded, strong evidence', () => {
      const input = {
        degraded: false,
        network: { ttl_sec: 300, tls_san_ok: true, redirect_hops: 0, resolved_ip: '93.184.216.34' },
        evidence_domains_distinct: 2,
        has_strong_evidence: true,
      };
      const { code } = opaEval(input);
      expect(code).toBe(0);
    });

    it('denies when degraded=true (fail-closed)', () => {
      const input = {
        degraded: true,
        network: { ttl_sec: 300, tls_san_ok: true, redirect_hops: 0, resolved_ip: '93.184.216.34' },
        evidence_domains_distinct: 2,
        has_strong_evidence: true,
      };
      const { code } = opaEval(input);
      expect(code).not.toBe(0);
    });

    it('denies on short TTL & missing strong evidence', () => {
      const input = {
        degraded: false,
        network: { ttl_sec: 5, tls_san_ok: true, redirect_hops: 0, resolved_ip: '93.184.216.34' },
        evidence_domains_distinct: 2,
        has_strong_evidence: false,
      };
      const { code } = opaEval(input);
      expect(code).not.toBe(0);
    });
  });
}
