export interface EmitOptions {
  personhood?: 'P0' | 'P1' | 'P2' | 'P3';
  actor?: { id: string; role: string };
}

export interface BusTransport {
  emit(topic: string, payload: any, options?: EmitOptions): Promise<void>;
  on(topic: string, handler: (evt: any) => void): void;
}
