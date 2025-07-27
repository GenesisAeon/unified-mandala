import { SigilDriver } from './SigilDriver';

export class ReflexDriverGPT extends SigilDriver {
  async connect(): Promise<void> {
    // placeholder: establish sensor link
  }
  async disconnect(): Promise<void> {
    // placeholder
  }
  async analyzeSensor(data: string): Promise<string> {
    return `analysis:${data}`;
  }
}
