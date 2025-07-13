export interface FourierLayerConfig {
  depth: number;
  threshold?: number;
  /**
   * Optional path to export the generated SVG metrics. If provided,
   * `analyze` will write the SVG output to this location.
   */
  exportPath?: string;
}

export interface EmergenceMetrics {
  maxAmplitude: number;
  avgAmplitude: number;
}

import { EventEmitter } from 'events';
import { writeFileSync } from 'fs';

export const FourierLayerEvents = new EventEmitter();

export class FourierLayer {
  id: string;
  level: number;
  weight: number;
  private threshold: number;
  private data: number[];
  private config: FourierLayerConfig;

  constructor(id: string, level: number, data: number[], config: FourierLayerConfig) {
    this.id = id;
    this.level = level;
    this.threshold = config.threshold ?? 0.1;
    this.weight = data.length / (config.depth || 1);
    this.data = data;
    this.config = config;
  }

  private dft(): [number, number][] {
    const N = this.data.length;
    const result: [number, number][] = [];
    for (let k = 0; k < N; k++) {
      let real = 0;
      let imag = 0;
      for (let n = 0; n < N; n++) {
        const angle = (2 * Math.PI * k * n) / N;
        real += this.data[n] * Math.cos(angle);
        imag -= this.data[n] * Math.sin(angle);
      }
      result.push([real, imag]);
    }
    return result;
  }

  analyze(): EmergenceMetrics {
    const phasors = this.dft();
    const amps = phasors.map(([re, im]) => Math.hypot(re, im));
    const maxAmplitude = Math.max(...amps);
    const avgAmplitude = amps.reduce((a, b) => a + b, 0) / amps.length;
    const metrics = { maxAmplitude, avgAmplitude };
    FourierLayerEvents.emit('metrics', { id: this.id, metrics });
    const svg = metricsToSVG(metrics);
    FourierLayerEvents.emit('metrics-svg', { id: this.id, svg });
    if (this.config.exportPath) {
      writeFileSync(this.config.exportPath, svg, 'utf8');
    }
    return metrics;
  }
}

export function metricsToSVG(metrics: EmergenceMetrics): string {
  const h = metrics.maxAmplitude.toFixed(2);
  const w = metrics.avgAmplitude.toFixed(2);
  return `<svg width="100" height="50"><rect width="${w}" height="10" fill="blue"/><rect y="20" width="${h}" height="10" fill="red"/></svg>`;
}
