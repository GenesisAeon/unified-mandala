/* @jest-environment node */
import fs from 'fs';
import yaml from 'js-yaml';

describe('Ghostshell configuration validation', () => {
  test('nginx config includes required placeholders', () => {
    const conf = fs.readFileSync('config/nginx/ghostshell.conf', 'utf8');
    expect(conf).toMatch(/server 127\.0\.0\.1:\${PORT_BASE:-3000};/);
    expect(conf).toMatch(/server 127\.0\.0\.1:\${PORT_NEXT:-3001};/);
    expect(conf).toContain('proxy_pass http://ghostshell;');
  });

  test('helm values contain expected defaults', () => {
    const values = yaml.load(fs.readFileSync('charts/ghostshell/values.yaml', 'utf8')) as any;
    expect(values.replicaCount).toBeGreaterThan(0);
    expect(values.service.port).toBe(80);
    expect(values.ingress.enabled).toBe(true);
    expect(typeof values.image.repository).toBe('string');
  });

  test('chart metadata is correct', () => {
    const chart = yaml.load(fs.readFileSync('charts/ghostshell/Chart.yaml', 'utf8')) as any;
    expect(chart.name).toBe('ghostshell');
    expect(chart.type).toBe('application');
    expect(typeof chart.version).toBe('string');
  });

  test('deployment template exposes container port 3000', () => {
    const deployment = fs.readFileSync('charts/ghostshell/templates/deployment.yaml', 'utf8');
    expect(deployment).toMatch(/containerPort: 3000/);
  });
});
