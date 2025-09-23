import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import Ajv from 'ajv/dist/2020';

const readJson = (relative: string) => JSON.parse(fs.readFileSync(relative, 'utf8'));
const ensureStac = () => {
  const target = path.resolve('out/stac/cosmic-web/item.json');
  if (!fs.existsSync(target)) {
    execSync('node scripts/demos/build-cosmic-web-stac.mjs', { stdio: 'inherit' });
  }
};

describe('Cosmic-Web demo artefacts', () => {
  it('sigillin conforms to schema', () => {
    const schema = readJson('schemas/sigillin-demo.schema.json');
    const sigill = readJson('sigils/demos/cosmic-web.sigill.json');
    const ajv = new Ajv({ allErrors: true, strict: false });
    const validate = ajv.compile(schema);
    const ok = validate(sigill);
    if (!ok) {
      console.error(validate.errors);
    }
    expect(ok).toBe(true);
  });

  it('stac item references relative assets', () => {
    ensureStac();
    const item = readJson('out/stac/cosmic-web/item.json');
    expect(item.assets).toBeTruthy();
    for (const key of Object.keys(item.assets ?? {})) {
      const href: string = item.assets[key]?.href;
      expect(typeof href).toBe('string');
      expect(path.isAbsolute(href)).toBe(false);
      expect(href.startsWith('http')).toBe(false);
    }
  });
});
