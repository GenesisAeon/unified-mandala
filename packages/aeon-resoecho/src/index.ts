/**
 * @module aeon-resoecho
 *
 * CREP-Zeitlinienarchiv und Resonanz-Echo System
 *
 * "Was einmal resonierte, kann wieder resonieren.
 *  Was emergierte, hinterlässt Spuren.
 *  Das Echo erinnert sich."
 *
 * ResoEcho ist das Gedächtnis des Mandalas:
 * - Speichert CREP-Scores über Zeit
 * - Erkennt wiederkehrende Muster
 * - Gibt Feedback basierend auf vergangenen Resonanzen
 * - Ermöglicht Notfall-Rekontextualisierung
 */

import type { CREP } from '@mandala/crep';

/**
 * Ein Echo - eine gespeicherte CREP-Messung mit Kontext
 */
export interface Echo {
  /** Eindeutige ID des Echos */
  id: string;

  /** Zeitstempel der Messung */
  timestamp: number;

  /** Die CREP-Metriken */
  crep: CREP;

  /** Kontext/Tag der Messung (z.B. "agent-interaction", "data-pipeline") */
  context: string;

  /** Optional: Zusätzliche Metadaten */
  metadata?: Record<string, unknown>;
}

/**
 * Ein erkanntes Resonanz-Muster
 */
export interface ResonancePattern {
  /** Art des Musters */
  type: 'high-emergence' | 'stable-coherence' | 'increasing-resonance' | 'declining-poetics';

  /** Konfidenz der Erkennung (0-1) */
  confidence: number;

  /** Beschreibung des Musters */
  description: string;

  /** Beteiligte Echos */
  echoes: Echo[];

  /** Durchschnittliche CREP-Werte im Muster */
  averageCREP: CREP;
}

/**
 * Feedback basierend auf historischen Daten
 */
export interface Feedback {
  /** Ähnliche vergangene Situationen */
  similarEchoes: Echo[];

  /** Erkannte Muster */
  patterns: ResonancePattern[];

  /** Empfehlungen */
  recommendations: string[];

  /** Trend-Analyse */
  trends: {
    coherence: 'rising' | 'stable' | 'falling';
    resonance: 'rising' | 'stable' | 'falling';
    emergence: 'rising' | 'stable' | 'falling';
    poetics: 'rising' | 'stable' | 'falling';
  };
}

/**
 * Konfiguration für ResoEcho
 */
export interface ResoEchoConfig {
  /** Maximale Anzahl gespeicherter Echos (default: 1000) */
  maxEchoes?: number;

  /** Schwellwert für Muster-Erkennung (default: 0.7) */
  patternThreshold?: number;

  /** Zeitfenster für Trend-Analyse in ms (default: 1 Stunde) */
  trendWindowMs?: number;
}

/**
 * ResoEcho - Das Gedächtnis des Mandalas
 *
 * Speichert CREP-Messungen über Zeit und erkennt Muster.
 * In-Memory Implementierung (kann später zu Redis/DB erweitert werden).
 */
export class ResoEcho {
  private echoes: Echo[] = [];
  private config: Required<ResoEchoConfig>;

  constructor(config: ResoEchoConfig = {}) {
    this.config = {
      maxEchoes: config.maxEchoes ?? 1000,
      patternThreshold: config.patternThreshold ?? 0.7,
      trendWindowMs: config.trendWindowMs ?? 60 * 60 * 1000, // 1 hour
    };
  }

  /**
   * Speichert eine neue CREP-Messung
   */
  remember(crep: CREP, context: string, metadata?: Record<string, unknown>): Echo {
    const echo: Echo = {
      id: this.generateId(),
      timestamp: Date.now(),
      crep,
      context,
      metadata,
    };

    this.echoes.push(echo);

    // Limit speicher wenn zu viele Echos
    if (this.echoes.length > this.config.maxEchoes) {
      this.echoes.shift(); // Entferne ältestes Echo
    }

    return echo;
  }

  /**
   * Ruft alle Echos für einen bestimmten Kontext ab
   */
  recall(context?: string): Echo[] {
    if (!context) {
      return [...this.echoes];
    }

    return this.echoes.filter(echo => echo.context === context);
  }

  /**
   * Ruft Echos in einem Zeitfenster ab
   */
  recallTimeWindow(startMs: number, endMs: number): Echo[] {
    return this.echoes.filter(
      echo => echo.timestamp >= startMs && echo.timestamp <= endMs
    );
  }

  /**
   * Findet ähnliche Echos basierend auf CREP-Ähnlichkeit
   */
  findSimilar(targetCREP: CREP, limit: number = 5, threshold: number = 0.8): Echo[] {
    const similarities = this.echoes.map(echo => ({
      echo,
      similarity: this.calculateSimilarity(targetCREP, echo.crep),
    }));

    return similarities
      .filter(item => item.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(item => item.echo);
  }

  /**
   * Erkennt Muster in gespeicherten Echos
   */
  detectPatterns(context?: string): ResonancePattern[] {
    const echoes = context ? this.recall(context) : this.echoes;

    if (echoes.length < 3) {
      return []; // Zu wenig Daten für Muster
    }

    const patterns: ResonancePattern[] = [];

    // Pattern 1: Hohe Emergenz
    const highEmergence = echoes.filter(e => e.crep.emergence >= this.config.patternThreshold);
    if (highEmergence.length >= 3) {
      patterns.push({
        type: 'high-emergence',
        confidence: Math.min(highEmergence.length / echoes.length, 1),
        description: `Hohe Emergenz erkannt: ${highEmergence.length} von ${echoes.length} Messungen zeigen E ≥ ${this.config.patternThreshold}`,
        echoes: highEmergence,
        averageCREP: this.calculateAverageCREP(highEmergence),
      });
    }

    // Pattern 2: Stabile Kohärenz
    const avgCoherence = echoes.reduce((sum, e) => sum + e.crep.coherence, 0) / echoes.length;
    const coherenceVariance = this.calculateVariance(echoes.map(e => e.crep.coherence));
    if (coherenceVariance < 0.05 && avgCoherence >= 0.6) {
      patterns.push({
        type: 'stable-coherence',
        confidence: 1 - coherenceVariance,
        description: `Stabile Kohärenz: Durchschnitt ${avgCoherence.toFixed(2)}, geringe Varianz`,
        echoes,
        averageCREP: this.calculateAverageCREP(echoes),
      });
    }

    // Pattern 3: Steigende Resonanz
    if (echoes.length >= 5) {
      const recentResonance = echoes.slice(-5).reduce((sum, e) => sum + e.crep.resonance, 0) / 5;
      const olderResonance = echoes.slice(0, 5).reduce((sum, e) => sum + e.crep.resonance, 0) / 5;

      if (recentResonance > olderResonance + 0.15) {
        patterns.push({
          type: 'increasing-resonance',
          confidence: Math.min((recentResonance - olderResonance) / 0.5, 1),
          description: `Resonanz steigt: von ${olderResonance.toFixed(2)} auf ${recentResonance.toFixed(2)}`,
          echoes: echoes.slice(-5),
          averageCREP: this.calculateAverageCREP(echoes.slice(-5)),
        });
      }
    }

    // Pattern 4: Sinkende Poetik
    if (echoes.length >= 5) {
      const recentPoetics = echoes.slice(-5).reduce((sum, e) => sum + e.crep.poetics, 0) / 5;
      const olderPoetics = echoes.slice(0, 5).reduce((sum, e) => sum + e.crep.poetics, 0) / 5;

      if (recentPoetics < olderPoetics - 0.15) {
        patterns.push({
          type: 'declining-poetics',
          confidence: Math.min((olderPoetics - recentPoetics) / 0.5, 1),
          description: `Poetik sinkt: von ${olderPoetics.toFixed(2)} auf ${recentPoetics.toFixed(2)}`,
          echoes: echoes.slice(-5),
          averageCREP: this.calculateAverageCREP(echoes.slice(-5)),
        });
      }
    }

    return patterns;
  }

  /**
   * Gibt Feedback basierend auf aktueller CREP-Messung
   */
  getFeedback(currentCREP: CREP, context?: string): Feedback {
    const similar = this.findSimilar(currentCREP, 5, 0.75);
    const patterns = this.detectPatterns(context);
    const trends = this.analyzeTrends(context);

    const recommendations: string[] = [];

    // Empfehlungen basierend auf Trends
    if (trends.coherence === 'falling') {
      recommendations.push('⚠️  Kohärenz sinkt - prüfe System-Integrität');
    }
    if (trends.emergence === 'rising') {
      recommendations.push('✨ Emergenz steigt - günstige Bedingungen für Innovation');
    }
    if (trends.resonance === 'falling') {
      recommendations.push('🔄 Resonanz schwächt - erwäge Rekontextualisierung');
    }
    if (trends.poetics === 'stable' && currentCREP.poetics >= 0.7) {
      recommendations.push('🎨 Poetik stabil und hoch - System in gutem Flow');
    }

    // Empfehlungen basierend auf Mustern
    for (const pattern of patterns) {
      if (pattern.type === 'high-emergence' && pattern.confidence > 0.7) {
        recommendations.push('🌟 Wiederkehrendes Emergenz-Muster erkannt - ideal für neue Features');
      }
      if (pattern.type === 'declining-poetics') {
        recommendations.push('📉 Poetik-Abfall erkannt - Zeit für kreative Erneuerung');
      }
    }

    if (recommendations.length === 0) {
      recommendations.push('✅ System läuft im normalen Bereich');
    }

    return {
      similarEchoes: similar,
      patterns,
      recommendations,
      trends,
    };
  }

  /**
   * Analysiert Trends über die Zeit
   */
  private analyzeTrends(context?: string): Feedback['trends'] {
    const now = Date.now();
    const windowStart = now - this.config.trendWindowMs;

    let echoes = this.recallTimeWindow(windowStart, now);
    if (context) {
      echoes = echoes.filter(e => e.context === context);
    }

    if (echoes.length < 3) {
      // Nicht genug Daten für Trend-Analyse
      return {
        coherence: 'stable',
        resonance: 'stable',
        emergence: 'stable',
        poetics: 'stable',
      };
    }

    const midpoint = Math.floor(echoes.length / 2);
    const older = echoes.slice(0, midpoint);
    const recent = echoes.slice(midpoint);

    const analyzeDimension = (dimension: keyof CREP): 'rising' | 'stable' | 'falling' => {
      const olderAvg = older.reduce((sum, e) => sum + e.crep[dimension], 0) / older.length;
      const recentAvg = recent.reduce((sum, e) => sum + e.crep[dimension], 0) / recent.length;

      const diff = recentAvg - olderAvg;
      if (diff > 0.1) return 'rising';
      if (diff < -0.1) return 'falling';
      return 'stable';
    };

    return {
      coherence: analyzeDimension('coherence'),
      resonance: analyzeDimension('resonance'),
      emergence: analyzeDimension('emergence'),
      poetics: analyzeDimension('poetics'),
    };
  }

  /**
   * Exportiert alle Echos (für Backup/Persistierung)
   */
  export(): Echo[] {
    return [...this.echoes];
  }

  /**
   * Importiert Echos (für Restore)
   */
  import(echoes: Echo[]): void {
    this.echoes = echoes.sort((a, b) => a.timestamp - b.timestamp);

    // Limit anwenden
    if (this.echoes.length > this.config.maxEchoes) {
      this.echoes = this.echoes.slice(-this.config.maxEchoes);
    }
  }

  /**
   * Löscht alle Echos
   */
  clear(): void {
    this.echoes = [];
  }

  /**
   * Gibt Statistiken zurück
   */
  stats(): {
    totalEchoes: number;
    contexts: string[];
    oldestTimestamp: number | null;
    newestTimestamp: number | null;
    averageCREP: CREP | null;
  } {
    if (this.echoes.length === 0) {
      return {
        totalEchoes: 0,
        contexts: [],
        oldestTimestamp: null,
        newestTimestamp: null,
        averageCREP: null,
      };
    }

    const contexts = [...new Set(this.echoes.map(e => e.context))];

    return {
      totalEchoes: this.echoes.length,
      contexts,
      oldestTimestamp: this.echoes[0].timestamp,
      newestTimestamp: this.echoes[this.echoes.length - 1].timestamp,
      averageCREP: this.calculateAverageCREP(this.echoes),
    };
  }

  // Hilfsfunktionen

  private generateId(): string {
    return `echo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private calculateSimilarity(a: CREP, b: CREP): number {
    // Euklidische Distanz im 4D CREP-Raum, invertiert zu Ähnlichkeit
    const distance = Math.sqrt(
      Math.pow(a.coherence - b.coherence, 2) +
      Math.pow(a.resonance - b.resonance, 2) +
      Math.pow(a.emergence - b.emergence, 2) +
      Math.pow(a.poetics - b.poetics, 2)
    );

    // Normalisiert auf 0-1, wobei 1 = identisch
    return Math.max(0, 1 - distance / 2);
  }

  private calculateAverageCREP(echoes: Echo[]): CREP {
    if (echoes.length === 0) {
      return { coherence: 0, resonance: 0, emergence: 0, poetics: 0, crep: 0 };
    }

    const sum = echoes.reduce(
      (acc, echo) => ({
        coherence: acc.coherence + echo.crep.coherence,
        resonance: acc.resonance + echo.crep.resonance,
        emergence: acc.emergence + echo.crep.emergence,
        poetics: acc.poetics + echo.crep.poetics,
        crep: acc.crep + echo.crep.crep,
      }),
      { coherence: 0, resonance: 0, emergence: 0, poetics: 0, crep: 0 }
    );

    const count = echoes.length;
    return {
      coherence: sum.coherence / count,
      resonance: sum.resonance / count,
      emergence: sum.emergence / count,
      poetics: sum.poetics / count,
      crep: sum.crep / count,
    };
  }

  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;

    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  }
}

/**
 * Singleton-Instanz für globale Verwendung
 */
export const globalResoEcho = new ResoEcho();
