import YAML from 'yaml';

export interface PantheonRelation {
  target: string;
  type: string;
}

export interface PantheonEntry {
  id: string;
  name: string;
  relations?: PantheonRelation[];
}

export class PantheonArchiveExporter {
  exportData(data: PantheonEntry[]) {
    const json = JSON.stringify(data, null, 2);
    const yaml = YAML.stringify(data);
    const graph = data
      .flatMap((d) => d.relations?.map((r) => `${d.id} -> ${r.target} [${r.type}]`) || [])
      .join('\n');
    return { json, yaml, graph };
  }
}
