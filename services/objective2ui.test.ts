import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import { objectiveToLayout, storeLayoutSuggestion } from './objective2ui';
import { sendToGPT } from '../packages/gpt-bridges/aeon-gpt-synapse';

jest.mock('../packages/gpt-bridges/aeon-gpt-synapse', () => ({
  sendToGPT: jest.fn(() => Promise.resolve('layout: sample')),
  GPTRole: { AEON: 'aeon' }
}));

const manifestPath = path.join(__dirname, '../plugins/manifest.yaml');

function readManifest() {
  return YAML.parse(fs.readFileSync(manifestPath, 'utf8'));
}

test('objectiveToLayout calls sendToGPT', async () => {
  const yaml = await objectiveToLayout('show metrics');
  expect(sendToGPT).toHaveBeenCalled();
  expect(yaml).toBe('layout: sample');
});

test('storeLayoutSuggestion writes manifest', () => {
  const orig = fs.readFileSync(manifestPath, 'utf8');
  const manifest = readManifest();
  storeLayoutSuggestion(manifest.plugins[0].name, 'layout: sample', manifestPath);
  const updated = readManifest();
  expect(updated.plugins[0].layoutSuggestion).toBe('layout: sample');
  fs.writeFileSync(manifestPath, orig); // restore
});
