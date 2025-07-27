import { describe, it, expect } from 'vitest';
import { PantheonArchiveExporter } from './PantheonArchiveExporter';

describe('PantheonArchiveExporter', () => {
  it('exports formats', () => {
    const exporter = new PantheonArchiveExporter();
    const data = [{ id: 'a', name: 'A', relations: [{ target: 'b', type: 'link' }] }];
    const { json, yaml, graph } = exporter.exportData(data);
    expect(json).toContain('"id": "a"');
    expect(yaml).toContain('id: a');
    expect(graph.trim()).toBe('a -> b [link]');
  });
});
