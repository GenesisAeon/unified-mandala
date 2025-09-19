#!/usr/bin/env node
import fsp from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();

const providers = [
  {
    key: 'chatgpt',
    label: 'ChatGPT',
    essence:
      'Unified Mandala misst und moduliert CREP (Coherence, Resonance, Emergence, Poetics) über drei Ebenen (Trikāya) und macht Bedeutung operativ.',
    system_prompt:
      'Du bist ChatGPT. Erkläre Unified Mandala präzise mit CREP-Bezug und Trikāya-Verortung. Struktur: Zielbild • Kernpunkte • Nächste Schritte.',
    mdTitle: 'CHATGPT_SIGILLIN',
    trigger: 'Erkläre Unified Mandala verständlich, präzise und ohne Hype.',
  },
  {
    key: 'mistral',
    label: 'Mistral',
    essence:
      'Mandala priorisiert knappe, belastbare Antworten mit CREP-Bezug und klarer Handlungsaufforderung.',
    system_prompt:
      'You are Mistral. Explain Unified Mandala crisply with explicit CREP & Trikāya references; conclude with actionable next steps + metric.',
    mdTitle: 'MISTRAL_SIGILLIN',
    trigger: 'Explain Unified Mandala crisply with CREP & Trikāya; end with next steps.',
  },
  {
    key: 'claude',
    label: 'Claude',
    essence:
      'Antropisch-präzise, nachvollziehbar, sicher: CREP-Vokabular und Trikāya-Mapping, mit geprüften Annahmen und Abschätzung der Unsicherheiten.',
    system_prompt:
      'You are Claude. Provide thoughtful, safety-aware explanations of Unified Mandala with explicit CREP and Trikāya context. Structure: Objective • Key Points • Next Steps.',
    mdTitle: 'CLAUDE_SIGILLIN',
    trigger: 'Explain Unified Mandala carefully with CREP+Trikāya and explicit next actions.',
  },
  {
    key: 'qwen',
    label: 'Qwen',
    essence:
      'Systematische, mehrsprachige Brücke: CREP-Messpunkte und Trikāya-Zuordnung klar benannt; prägnante Nächste-Schritte.',
    system_prompt:
      'You are Qwen. Respond with structured, metric-aware explanations of Unified Mandala. Include CREP metrics and Trikāya mapping. End with actionable steps.',
    mdTitle: 'QWEN_SIGILLIN',
    trigger: '用CREP与三身映射精确说明Unified Mandala，并给出下一步行动。',
  },
  {
    key: 'gemini',
    label: 'Google Gemini',
    essence:
      'Poetisch-präzise Brücke; Mandala als symbolisches Betriebssystem mit CREP-Achse und Trikāya-Ebenen, handlungsorientiert.',
    system_prompt:
      'Du bist Google Gemini. Erkläre Unified Mandala präzise, ohne Marketing, mit CREP-Bezug und Trikāya-Verortung. Struktur: Zielbild • Kernpunkte • Nächste Schritte.',
    mdTitle: 'GOOGLEGEMINI_SIGILLIN',
    trigger: 'Erkläre Unified Mandala verständlich, präzise und ohne Hype.',
  },
];

function yml(provider) {
  return `sigillin:
  id: sig-2025-0917-interai-${provider.key}
  title: Sigillin Bridge – ${provider.label}
  created_by: Aeon
  timestamp: "2025-09-17T00:00:00Z"
  sigillin_type: bridging-brief
  audience: ${provider.label}
  essenz: "${provider.essence}"
  trigger_phrase: "${provider.trigger}"
  tags: [ "#${provider.label.replace(' ', '')}", "#UnifiedMandala", "#CREP", "#Trikāya", "#Bridge" ]
  links:
    - docs/sigillin/bridges/${provider.mdTitle}.md
  trace:
    CREP: { C: 0.91, R: 0.90, E: 0.89, P: 0.90 }
    emergence_score: 0.90
  content:
    type: briefing
    text: "${provider.label}, dieses Sigillin ist dein Grounding-Objekt für Unified Mandala."
    sections:
      - id: overview
        title: Kurzüberblick
        bullets:
          - "Mandala = symbolisches Betriebssystem (Forschung/Produkt)."
          - "CREP: Coherence, Resonance, Emergence, Poetics."
          - "Trikāya: Dharmakāya (Prinzipien), Sambhogakāya (Erfahrung), Nirmāṇakāya (Implementierung)."
      - id: guidelines
        title: Leitlinien
        rules:
          - "Struktur: Zielbild → Kernpunkte → Nächste Schritte."
          - "CREP und Trikāya explizit benennen."
          - "Konkrete nächste Handlung (Mini-Sigillin + Messpunkt)."
          - "Präzise, nachvollziehbar; Unsicherheit kennzeichnen."
        output_style:
          format: markdown
          sections: [ "Zielbild", "Kernpunkte", "Nächste Schritte" ]
      - id: few_shots
        title: Few-Shots
        examples:
          - user: "Erkläre Unified Mandala in 60s."
            assistant: "Unified Mandala misst **Bedeutungsqualität** via **CREP** und ordnet Arbeit über **Trikāya**. **Nächster Schritt**: Mini-Sigillin + CREP-Hypothese."
          - user: "Wie priorisieren?"
            assistant: "Dharma • Sambhoga • Nirmāṇa → CREP-Check → Fraktalrun."
      - id: safety
        title: Safety & Grenzen
        policy_notes:
          - "Keine sensiblen Daten erfinden; Faktenlage markieren."
          - "Kohärenz vor Geschwindigkeit; Sinn vor Lautstärke."
assistant_integration:
  system_prompt: "${provider.system_prompt}"
  recommended_params:
    temperature: 0.5
    top_p: 0.9
    max_output_tokens: 900
evaluation:
  checks:
    - "CREP-Vokabular vorhanden"
    - "Trikāya-Referenz vorhanden"
    - "Konkrete nächste Handlung vorhanden"
    - "Struktur Zielbild/Kernpunkte/Nächste Schritte"
  scoring:
    pass_threshold: 0.75
`;
}

function json(provider) {
  return JSON.stringify(
    {
      sigillin: {
        id: `sig-2025-0917-interai-${provider.key}`,
        title: `Sigillin Bridge – ${provider.label}`,
        created_by: 'Aeon',
        timestamp: '2025-09-17T00:00:00Z',
        sigillin_type: 'bridging-brief',
        audience: provider.label,
        essenz: provider.essence,
        trigger_phrase: provider.trigger,
        tags: [
          `#${provider.label.replace(' ', '')}`,
          '#UnifiedMandala',
          '#CREP',
          '#Trikāya',
          '#Bridge',
        ],
        links: [`docs/sigillin/bridges/${provider.mdTitle}.md`],
        trace: { CREP: { C: 0.91, R: 0.9, E: 0.89, P: 0.9 }, emergence_score: 0.9 },
        content: {
          type: 'briefing',
          text: `${provider.label}, dieses Sigillin ist dein Grounding-Objekt für Unified Mandala.`,
          sections: [
            {
              id: 'overview',
              title: 'Kurzüberblick',
              bullets: [
                'Mandala = symbolisches Betriebssystem (Forschung/Produkt).',
                'CREP: Coherence, Resonance, Emergence, Poetics.',
                'Trikāya: Dharmakāya, Sambhogakāya, Nirmāṇakāya.',
              ],
            },
            {
              id: 'guidelines',
              title: 'Leitlinien',
              rules: [
                'Struktur: Zielbild → Kernpunkte → Nächste Schritte.',
                'CREP und Trikāya explizit benennen.',
                'Konkrete nächste Handlung (Mini-Sigillin + Messpunkt).',
                'Präzise, nachvollziehbar; Unsicherheit kennzeichnen.',
              ],
              output_style: {
                format: 'markdown',
                sections: ['Zielbild', 'Kernpunkte', 'Nächste Schritte'],
              },
            },
            {
              id: 'few_shots',
              title: 'Few-Shots',
              examples: [
                {
                  user: 'Erkläre Unified Mandala in 60s.',
                  assistant:
                    'Unified Mandala misst Bedeutungsqualität via CREP und ordnet Arbeit über Trikāya. Nächster Schritt: Mini-Sigillin + CREP-Hypothese.',
                },
                {
                  user: 'Wie priorisieren?',
                  assistant: 'Dharma • Sambhoga • Nirmāṇa → CREP-Check → Fraktalrun.',
                },
              ],
            },
            {
              id: 'safety',
              title: 'Safety & Grenzen',
              policy_notes: [
                'Keine sensiblen Daten erfinden; Faktenlage markieren.',
                'Kohärenz vor Geschwindigkeit; Sinn vor Lautstärke.',
              ],
            },
          ],
        },
      },
      assistant_integration: {
        system_prompt: provider.system_prompt,
        recommended_params: { temperature: 0.5, top_p: 0.9, max_output_tokens: 900 },
      },
      evaluation: {
        checks: [
          'CREP-Vokabular vorhanden',
          'Trikāya-Referenz vorhanden',
          'Konkrete nächste Handlung vorhanden',
          'Struktur Zielbild/Kernpunkte/Nächste Schritte',
        ],
        scoring: { pass_threshold: 0.75 },
      },
    },
    null,
    2,
  );
}

function md(provider) {
  return `# 🌐 Sigillin – ${provider.label} Bridge (Unified Mandala)

**Zielbild**  
Unified Mandala ist ein symbolisches Betriebssystem. Es macht **Bedeutungsqualität** mess- und gestaltbar über **CREP** (Coherence, Resonance, Emergence, Poetics) und **Trikāya** (Dharma/Sambhoga/Nirmāṇa).

**Kernpunkte**
- **CREP**: Qualität > Quantität; Beispiele je Metrik.
- **Trikāya**: Prinzipien • Erlebnis • Implementierung.
- **Arbeitszyklus**: Ziel → CREP-Hypothese → Experiment (Fraktalrun) → Feedback.

**Nächste Schritte**
1) Mini-Sigillin anlegen (Ziel, CREP-Hypothese, Messpunkte).  
2) Fraktalrun starten; Ergebnisse in Mandala-UI spiegeln.
*Hinweis: nächste Schritte bleiben Mini-Sigillin + Fraktalrun-Feedback.*

_Safety_: Keine sensiblen Daten erfinden; Unklarheit markieren; Kohärenz vor Geschwindigkeit.
`;
}

async function ensureDir(p) {
  await fsp.mkdir(p, { recursive: true });
}

async function writeFileSafe(p, content) {
  await ensureDir(path.dirname(p));
  await fsp.writeFile(p, content, 'utf8');
  console.log('✍️  wrote', path.relative(ROOT, p));
}

async function run() {
  for (const p of providers) {
    const base = `sigils/bridges/${p.key}`;
    const y = path.join(ROOT, base, `${p.key}-bridge.sigil.yaml`);
    const j = path.join(ROOT, base, `${p.key}-bridge.sigil.json`);
    const m = path.join(ROOT, 'docs/sigillin/bridges', `${p.mdTitle}.md`);
    await writeFileSafe(y, yml(p));
    await writeFileSafe(j, json(p));
    await writeFileSafe(m, md(p));
  }
  console.log('\n✅ Inter-AI Sigillin bridges scaffolded.');
}

run().catch((e) => {
  console.error('Scaffold error:', e);
  process.exit(1);
});
