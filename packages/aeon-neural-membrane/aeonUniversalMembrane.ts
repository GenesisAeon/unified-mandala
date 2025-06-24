import { NeuronMembrane } from './neuronMembrane';
import { depthSync } from './depthSync';
import { selfTrain } from './selfTrainer';
import { CREPSignature } from './crepAdapter';
import { extractConvoMemory } from '../nukleon-scanner';
import { memoryToTone } from '../nukleon-sonifier';

/**
 * AeonUniversalMembrane kombiniert die Spiegel-Funktion der NeuronMembrane
 * mit CREP-basiertem Selbsttraining und Nukleon/Sonifier-Feedback.
 */
export class AeonUniversalMembrane {
  private mem: NeuronMembrane;

  constructor(reflections = 1) {
    this.mem = new NeuronMembrane();
    if (reflections > 0) this.mem.reflect(reflections);
  }

  /** Aktuelle Tiefe der Membran */
  get depth() {
    return this.mem.depth;
  }

  /** Mittelt Vorhersagen aller Spiegelungen */
  predict(i1: number, i2: number): number {
    return this.mem.predict(i1, i2);
  }

  /**
   * Trainiert das Grundnetz mit einem CREP-Faktor und synchronisiert
   * anschließend alle Spiegelungen.
   */
  train(data: [number, number][], answers: number[], crep: CREPSignature) {
    const base = this.mem.getNetworks()[0];
    selfTrain(base, data, answers, crep, 5);
    depthSync(this.mem, data);
  }

  /**
   * Analysiert einen Gesprächstext, um daraus CREP-Werte und einen Ton abzuleiten.
   */
  analyzeConversation(text: string) {
    const conv = extractConvoMemory(text);
    const tone = memoryToTone(conv.crepSignature.resonance / 10);
    return { conv, tone };
  }
}
