import fs from 'fs';
import { NeuronMembrane } from './neuronMembrane';
import { depthSync } from './depthSync';
import { selfTrain } from './selfTrainer';
import { CREPSignature } from './crepAdapter';
import { extractConvoMemory, type ConvoMemory } from '../nukleon-scanner';
import { memoryToTone } from '../nukleon-sonifier';
import { scanEnergy } from './nukleonScanner';

/**
 * AeonUniversalMembrane kombiniert die Spiegel-Funktion der NeuronMembrane
 * mit CREP-basiertem Selbsttraining und Nukleon/Sonifier-Feedback.
 *
 * Beispiel:
 * ```ts
 * import { AeonUniversalMembrane } from './aeonUniversalMembrane';
 * import { CREPSignature } from './crepAdapter';
 *
 * const crep: CREPSignature = { coherence: 6, resonance: 6, emergence: 6, poetics: 6 };
 * const mem = new AeonUniversalMembrane();
 * mem.train([[1, 2]], [0], crep);
 * const res = mem.harmonize([[1, 2]], [0], 'Hallo KI');
 * console.log(res.energy, res.tone);
 * ```
 */
export interface HistoryEntry {
  energy: number;
  tone: string;
  depth: number;
}

export interface HarmonizeOptions {
  data: [number, number][];
  answers: number[];
  text: string;
  energyThreshold?: number;
}

export interface HarmonyResult {
  conv: ConvoMemory;
  energy: number;
  tone: string;
  depth: number;
}

export interface AeonUniversalOptions {
  persistHistory?: boolean;
  historyPath?: string;
  maxDepth?: number;
}

const DEFAULT_OPTIONS: Required<AeonUniversalOptions> = {
  persistHistory: false,
  historyPath: 'aeon-history.json',
  maxDepth: 10,
};
export class AeonUniversalMembrane {
  private mem: NeuronMembrane;
  private history: HistoryEntry[] = [];
  private opts: Required<AeonUniversalOptions>;

  private logHistory(entry: HistoryEntry) {
    this.history.push(entry);
    if (this.opts.persistHistory) {
      this.saveHistoryToFile();
    }
  }

  private saveHistoryToFile() {
    fs.writeFileSync(this.opts.historyPath, JSON.stringify(this.history, null, 2));
  }

  constructor(
    mem: NeuronMembrane = new NeuronMembrane(),
    reflections = 1,
    options: AeonUniversalOptions = {},
  ) {
    this.mem = mem;
    this.opts = { ...DEFAULT_OPTIONS, ...options };
    if (reflections > 0) this.mem.reflect(reflections);
    if (this.mem.getNetworks().length === 0) {
      throw new Error('AeonUniversalMembrane: keine Netzwerke initialisiert');
    }
  }

  /** Aktuelle Tiefe der Membran */
  get depth(): number {
    return this.mem.depth;
  }

  /** Verlauf der Harmonize-Ergebnisse */
  getHistory(): HistoryEntry[] {
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
  train(data: [number, number][], answers: number[], crep: CREPSignature): void {
    if (data.length !== answers.length) {
      throw new Error('train: Data und Answers m\u00fcssen gleich lang sein');
    }
    const base = this.mem.getNetworks()[0];
    selfTrain(base, data, answers, crep, 5);
    depthSync(this.mem, data);
  }

  /** Asynchrone Variante von train */
  async trainAsync(
    data: [number, number][],
    answers: number[],
    crep: CREPSignature,
  ): Promise<void> {
    if (data.length !== answers.length) {
      throw new Error('trainAsync: Data und Answers m\u00fcssen gleich lang sein');
    }
    const base = this.mem.getNetworks()[0];
    await new Promise<void>((resolve) =>
      setTimeout(() => {
        selfTrain(base, data, answers, crep, 5);
        resolve();
      }, 0),
    );
    await new Promise<void>((resolve) =>
      setTimeout(() => {
        depthSync(this.mem, data);
        resolve();
      }, 0),
    );
  }

  /**
   * Analysiert einen Gesprächstext, um daraus CREP-Werte und einen Ton abzuleiten.
   */
  analyzeConversation(text: string): { conv: ConvoMemory; tone: string } {
    const conv = extractConvoMemory(text);
    if (!conv.crepSignature) {
      throw new Error('analyzeConversation: fehlende CREP-Signatur');
    }
    const tone = memoryToTone(conv.crepSignature.resonance / 10);
    return { conv, tone };
  }

  /**
   * Vollständiger Selbstreflexionszyklus. Trainiert anhand des
   * Gesprächs-Textes und erzeugt bei hoher Energie eine neue Spiegelung.
   */
  harmonize(options: HarmonizeOptions): HarmonyResult {
    const { data, answers, text, energyThreshold = 5 } = options;
    try {
      if (!text.trim()) {
        throw new Error('harmonize: Text darf nicht leer sein');
      }
      if (data.length !== answers.length) {
        throw new Error('harmonize: Data und Answers m\u00fcssen gleich lang sein');
      }
      const conv = extractConvoMemory(text);
      const base = this.mem.getNetworks()[0];
      selfTrain(base, data, answers, conv.crepSignature, 5);
      depthSync(this.mem, data);

      const energy = scanEnergy(base);
      const depthFactor = this.mem.depth || 1;
      const tone = memoryToTone(energy / (10 * depthFactor));
      if (this.mem.depth < this.opts.maxDepth && energy / depthFactor > energyThreshold) {
        this.mem.reflect();
      }
      const result = { conv, energy, tone, depth: this.mem.depth };
      this.logHistory({ energy, tone, depth: this.mem.depth });
      return result;
    } catch (err) {
      console.error('harmonize failed', err);
      throw err;
    }
  }

  /**
   * Führt mehrere Harmonize-Zyklen aus und speichert die Ergebnisse.
   */
  selfReflectCycle(iterations: number, options: HarmonizeOptions): HarmonyResult {
    let last = undefined as unknown as HarmonyResult;
    for (let i = 0; i < iterations; i++) {
      last = this.harmonize(options);
    }
    return last;
  }

  /**
   * Liefert f\u00fcr jede Netzebene die aktuelle Energie und den zugeh\u00f6rigen Ton.
   */
  scanResonance(): { energy: number; tone: string }[] {
    return this.mem.getNetworks().map((net) => {
      const energy = scanEnergy(net);
      const tone = memoryToTone(energy / 10);
      return { energy, tone };
    });
  }

  /**
   * Provides a detailed resonance map with the layer index included.
   */
  resonanceMap(): { layer: number; energy: number; tone: string }[] {
    return this.mem.getNetworks().map((net, idx) => {
      const energy = scanEnergy(net);
      const tone = memoryToTone(energy / 10);
      return { layer: idx, energy, tone };
    });
  }
}
