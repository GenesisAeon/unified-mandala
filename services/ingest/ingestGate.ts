import { createHash } from 'crypto';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { load } from 'js-yaml';
import { writeLedger } from './ledger';

const policy = load(
  readFileSync(resolve(__dirname, '../../config/data-ingest-policy.yaml'), 'utf-8'),
) as any;

interface Meta {
  url: string;
  domain: string;
  license?: string;
  tosSnapshotUrl?: string;
  spdxId?: string;
}

export async function admit(file: Buffer, meta: Meta) {
  if (!policy.sources.allowlist.some((a: any) => a.domain === meta.domain)) {
    throw new Error('Domain not allowlisted');
  }
  if (policy.sources.forbidden_domains.some((f: string) => new RegExp(f).test(meta.domain))) {
    throw new Error('Forbidden source');
  }
  if (policy.rules.require_license_evidence && !meta.license) {
    throw new Error('License missing');
  }
  if (policy.rules.require_spdx_id && !meta.spdxId) {
    throw new Error('SPDX id missing');
  }
  const sha256 = createHash('sha256').update(file).digest('hex');
  await writeLedger({
    sha256,
    url: meta.url,
    domain: meta.domain,
    license: meta.license!,
    spdxId: meta.spdxId!,
    tosSnapshotUrl: meta.tosSnapshotUrl,
    acquiredAt: new Date().toISOString(),
    jurisdiction: 'US/EU',
  });
  return { ok: true, sha256 };
}
