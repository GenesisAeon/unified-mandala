import { describe, expect, it } from 'vitest';
import { validateMandalaExplanation } from '../../scripts/sigils/mini-sigillin-validator.ts';

describe('mini-sigillin validator', () => {
  it('detects valid Mandala explanations', () => {
    const sample =
      `Zielbild (Dharmakāya): Wir sichern Kohärenz und Resonanz. ` +
      `Kernpunkte (Sambhogakāya): UI-Story betont Emergenz und Poetik. ` +
      `Nächste Schritte (Nirmāṇakāya): Lege ein Mini-Sigillin mit Hypothese & Messpunkt an.`;

    const result = validateMandalaExplanation(sample);

    expect(result.hasCrepReference).toBe(true);
    expect(result.hasTrikayaMapping).toBe(true);
    expect(result.hasNextAction).toBe(true);
    expect(result.isSafe).toBe(true);
    expect(result.passes).toBe(true);
    expect(result.missing).toHaveLength(0);
  });

  it('flags missing sections and unsafe wording', () => {
    const sample = 'Diese Antwort liefert falsche Daten und ignoriert jede nächste Handlung.';

    const result = validateMandalaExplanation(sample);

    expect(result.hasCrepReference).toBe(false);
    expect(result.hasTrikayaMapping).toBe(false);
    expect(result.hasNextAction).toBe(false);
    expect(result.isSafe).toBe(false);
    expect(result.passes).toBe(false);
    expect(result.missing).toContain('crep-reference');
    expect(result.missing).toContain('trikaya-mapping');
    expect(result.missing).toContain('next-action');
    expect(result.missing).toContain('safety');
  });

  it('accepts alternative phrasing and deduplicates matches', () => {
    const sample =
      'Resonanz und Emergenz führen zur Aktion: Formuliere eine Hypothese, plane das Experiment.';

    const result = validateMandalaExplanation(sample);

    expect(result.hasCrepReference).toBe(true);
    expect(result.matches.crep.length).toBeGreaterThan(0);
    expect(result.matches.nextAction.map((match) => match.toLowerCase())).toContain('aktion');
  });
});
