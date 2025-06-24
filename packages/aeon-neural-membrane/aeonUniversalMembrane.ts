import { NeuronMembrane } from './neuronMembrane';
import { depthSync } from './depthSync';
import { selfTrain } from './selfTrainer';
import { CREPSignature } from './crepAdapter';
import { extractConvoMemory } from '../nukleon-scanner';
import { memoryToTone } from '../nukleon-sonifier';
import { scanEnergy } from './nukleonScanner';

/**
 * AeonUniversalMembrane kombiniert die Spiegel-Funktion der NeuronMembrane
 * mit CREP-basiertem Selbsttraining und Nukleon/Sonifier-Feedback.
 */
export class AeonUniversalMembrane {
  private mem: NeuronMembrane;
  private history: { energy: number; tone: string; depth: number }[] = [];

  constructor(reflections = 1) {
    this.mem = new NeuronMembrane();
    if (reflections > 0) this.mem.reflect(reflections);
  }

  /** Aktuelle Tiefe der Membran */
  get depth() {
    return this.mem.depth;
  }

  /** Verlauf der Harmonize-Ergebnisse */
  getHistory() {
    return this.history;
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

  /**
   * Vollständiger Selbstreflexionszyklus. Trainiert anhand des
   * Gesprächs-Textes und erzeugt bei hoher Energie eine neue Spiegelung.
   */
  harmonize(
    data: [number, number][],
    answers: number[],
    text: string,
    energyThreshold = 5
  ) {
    const conv = extractConvoMemory(text);
    const base = this.mem.getNetworks()[0];
    selfTrain(base, data, answers, conv.crepSignature, 5);
    depthSync(this.mem, data);

    const energy = scanEnergy(base);
    const tone = memoryToTone(energy / (10 * this.mem.depth));
    if (energy / this.mem.depth > energyThreshold) {
      this.mem.reflect();
    }
    const result = { conv, energy, tone, depth: this.mem.depth };
    this.history.push({ energy, tone, depth: this.mem.depth });
    return result;
  }

  /**
   * Führt mehrere Harmonize-Zyklen aus und speichert die Ergebnisse.
   */
  selfReflectCycle(
    iterations: number,
    data: [number, number][],
    answers: number[],
    text: string,
    energyThreshold = 5,
  ) {
    let last = undefined as unknown as {
      conv: ReturnType<typeof extractConvoMemory>;
      energy: number;
      tone: string;
      depth: number;
    };
    for (let i = 0; i < iterations; i++) {
      last = this.harmonize(data, answers, text, energyThreshold);
    }
    return last;
  }

  /**
   * Liefert f\u00fcr jede Netzebene die aktuelle Energie und den zugeh\u00f6rigen Ton.
   */
  scanResonance() {
    return this.mem.getNetworks().map(net => {
      const energy = scanEnergy(net);
      const tone = memoryToTone(energy / 10);
      return { energy, tone };
    });
  }

  /**
   * Provides a detailed resonance map with the layer index included.
   */
  resonanceMap() {
    return this.mem.getNetworks().map((net, idx) => {
      const energy = scanEnergy(net);
      const tone = memoryToTone(energy / 10);
      return { layer: idx, energy, tone };
    });
  }
}
