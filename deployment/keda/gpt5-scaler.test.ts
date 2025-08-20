import fs from 'fs';
import yaml from 'js-yaml';

test('gpt-5 scaler defines daily token limit', () => {
  const raw = fs.readFileSync('deployment/keda/gpt5-scaler.yaml', 'utf8');
  const conf = yaml.load(raw) as any;
  const trigger = (conf.spec?.triggers || []).find((t: any) => t.type === 'metrics-api');
  expect(trigger).toBeDefined();
  expect(trigger.metadata?.value).toBe('MAX_DAILY_TOKENS');
});
