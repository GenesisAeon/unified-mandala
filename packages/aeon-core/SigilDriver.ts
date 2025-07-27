export interface SigilMetadata {
  id: string;
  description?: string;
}

export abstract class SigilDriver {
  constructor(public readonly meta: SigilMetadata) {}
  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;
}
