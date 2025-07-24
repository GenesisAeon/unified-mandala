export interface Discontinuity {
  id: string;
  data: unknown;
}

export class BoundaryDiscoveryAgent {
  detect(data: unknown[]): Discontinuity[] {
    return data.map((d, i) => ({ id: `disc-${i}`, data: d }));
  }
}
