import yaml from 'js-yaml';

export interface ResonanceBlueprint {
  service: string;
  endpoints: string[];
  metrics: string[];
}

export class ExtendedResonanceBlueprint {
  static create(service: string, endpoints: string[], metrics: string[] = []): ResonanceBlueprint {
    return { service, endpoints, metrics };
  }

  static toYAML(bp: ResonanceBlueprint): string {
    return yaml.dump(bp);
  }
}
