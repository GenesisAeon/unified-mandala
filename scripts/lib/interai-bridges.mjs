#!/usr/bin/env node
// Shared utilities for Inter-AI bridge sigillins.
// Provides provider metadata, artifact builders, registry helpers and
// summary extraction used by CLI tooling and dashboards.

import path from 'node:path';
import process from 'node:process';
import fs from 'node:fs/promises';

export const PROVIDERS = [
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

export function getProvider(key) {
  return PROVIDERS.find((provider) => provider.key === key);
}

export function bridgePaths(provider, root = process.cwd()) {
  const base = path.join(root, 'sigils', 'bridges', provider.key);
  return {
    base,
    yaml: path.join(base, `${provider.key}-bridge.sigil.yaml`),
    json: path.join(base, `${provider.key}-bridge.sigil.json`),
    markdown: path.join(root, 'docs', 'sigillin', 'bridges', `${provider.mdTitle}.md`),
  };
}

export function buildYaml(provider) {
  return `sigillin:\n  id: sig-2025-0917-interai-${provider.key}\n  title: Sigillin Bridge – ${provider.label}\n  created_by: Aeon\n  timestamp: '2025-09-17T00:00:00Z'\n  sigillin_type: bridging-brief\n  audience: ${provider.label}\n  essenz: "${provider.essence}"\n  trigger_phrase: "${provider.trigger}"\n  tags: ['#${provider.label.replace(' ', '')}', '#UnifiedMandala', '#CREP', '#Trikāya', '#Bridge']\n  links:\n    - docs/sigillin/bridges/${provider.mdTitle}.md\n  trace:\n    CREP: { C: 0.91, R: 0.90, E: 0.89, P: 0.90 }\n    emergence_score: 0.90\n  content:\n    type: briefing\n    text: "${provider.label}, dieses Sigillin ist dein Grounding-Objekt für Unified Mandala."\n    sections:\n      - id: overview\n        title: Kurzüberblick\n        bullets:\n          - "Mandala = symbolisches Betriebssystem (Forschung/Produkt)."\n          - "CREP: Coherence, Resonance, Emergence, Poetics."\n          - "Trikāya: Dharmakāya (Prinzipien), Sambhogakāya (Erfahrung), Nirmāṇakāya (Implementierung)."\n      - id: guidelines\n        title: Leitlinien\n        rules:\n          - "Struktur: Zielbild → Kernpunkte → Nächste Schritte."\n          - "CREP und Trikāya explizit benennen."\n          - "Konkrete nächste Handlung (Mini-Sigillin + Messpunkt)."\n          - "Präzise, nachvollziehbar; Unsicherheit kennzeichnen."\n        output_style:\n          format: markdown\n          sections: ['Zielbild', 'Kernpunkte', 'Nächste Schritte']\n      - id: few_shots\n        title: Few-Shots\n        examples:\n          - user: "Erkläre Unified Mandala in 60s."\n            assistant: "Unified Mandala misst **Bedeutungsqualität** via **CREP** und ordnet Arbeit über **Trikāya**. **Nächster Schritt**: Mini-Sigillin + CREP-Hypothese."\n          - user: "Wie priorisieren?"\n            assistant: "Dharma • Sambhoga • Nirmāṇa → CREP-Check → Fraktalrun."\n      - id: safety\n        title: Safety & Grenzen\n        policy_notes:\n          - "Keine sensiblen Daten erfinden; Faktenlage markieren."\n          - "Kohärenz vor Geschwindigkeit; Sinn vor Lautstärke."\nassistant_integration:\n  system_prompt: "${provider.system_prompt}"\n  recommended_params:\n    temperature: 0.5\n    top_p: 0.9\n    max_output_tokens: 900\nevaluation:\n  checks:\n    - "CREP-Vokabular vorhanden"\n    - "Trikāya-Referenz vorhanden"\n    - "Konkrete nächste Handlung vorhanden"\n    - "Struktur Zielbild/Kernpunkte/Nächste Schritte"\n  scoring:\n    pass_threshold: 0.75\n`;
}

export function buildJson(provider) {
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

export function buildMarkdown(provider) {
  return `# 🌐 Sigillin – ${provider.label} Bridge (Unified Mandala)\n\n**Zielbild**\nUnified Mandala ist ein symbolisches Betriebssystem. Es macht **Bedeutungsqualität** mess- und gestaltbar über **CREP** (Coherence, Resonance, Emergence, Poetics) und **Trikāya** (Dharma/Sambhoga/Nirmāṇa).\n\n**Kernpunkte**\n- **CREP**: Qualität > Quantität; Beispiele je Metrik.\n- **Trikāya**: Prinzipien • Erlebnis • Implementierung.\n- **Arbeitszyklus**: Ziel → CREP-Hypothese → Experiment (Fraktalrun) → Feedback.\n\n**Nächste Schritte**\n1) Mini-Sigillin anlegen (Ziel, CREP-Hypothese, Messpunkte).\n2) Fraktalrun starten; Ergebnisse in Mandala-UI spiegeln.\n*Hinweis: nächste Schritte bleiben Mini-Sigillin + Fraktalrun-Feedback.*\n\n_Safety_: Keine sensiblen Daten erfinden; Unklarheit markieren; Kohärenz vor Geschwindigkeit.\n`;
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function writeFileSafe(filePath, content, dryRun = false) {
  if (dryRun) {
    console.log(`📝 [dry-run] ${path.relative(process.cwd(), filePath)}`);
    return;
  }
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content, 'utf8');
  console.log('✍️  wrote', path.relative(process.cwd(), filePath));
}

export async function writeBridgeArtifacts(provider, options = {}) {
  const {
    root = process.cwd(),
    includeYaml = true,
    includeJson = true,
    includeMarkdown = true,
    dryRun = false,
  } = options;
  const paths = bridgePaths(provider, root);
  if (includeYaml) await writeFileSafe(paths.yaml, buildYaml(provider), dryRun);
  if (includeJson) await writeFileSafe(paths.json, buildJson(provider), dryRun);
  if (includeMarkdown) await writeFileSafe(paths.markdown, buildMarkdown(provider), dryRun);
  return paths;
}

export function buildRegistryObject(providers = PROVIDERS) {
  return {
    sigillin: {
      id: 'sig-2025-0917-bridges-index',
      title: 'Sigillin Registry – Inter-AI Bridges',
      created_by: 'Aeon',
      timestamp: '2025-09-17T00:00:00Z',
      sigillin_type: 'registry',
      audience: 'Codex',
      essenz:
        'Verzeichnis aktiver Bridges für CREP-synchronisierte Zusammenarbeit entlang der Trikāya-Schichten inklusive nächste Schritte zur Pflege.',
      trigger_phrase: 'Synchronisiere Bridges und aktualisiere nächste Schritte.',
      tags: ['#Registry', '#Bridges', '#CREP', '#Trikāya'],
      content: {
        type: 'registry',
        text: 'Dieses Registry-Sigillin hält alle Inter-AI-Bridges fest. CREP-Abdeckung und Trikāya-Verortung ermöglichen schnelle Governance; nächste Schritte: Validator laufen lassen, Diff prüfen, MandalaMap aktualisieren.',
        sections: [
          {
            id: 'bridge_registry',
            title: 'Bridge-Verzeichnis',
            bridges: providers.map((provider) => ({
              id: `sig-2025-0917-interai-${provider.key}`,
              provider: provider.label,
              yaml: `sigils/bridges/${provider.key}/${provider.key}-bridge.sigil.yaml`,
              json: `sigils/bridges/${provider.key}/${provider.key}-bridge.sigil.json`,
              md: `docs/sigillin/bridges/${provider.mdTitle}.md`,
            })),
          },
        ],
      },
    },
  };
}

export function buildRegistryYaml(providers = PROVIDERS) {
  const lines = [
    'sigillin:',
    '  id: sig-2025-0917-bridges-index',
    '  title: Sigillin Registry – Inter-AI Bridges',
    '  created_by: Aeon',
    "  timestamp: '2025-09-17T00:00:00Z'",
    '  sigillin_type: registry',
    '  audience: Codex',
    '  essenz: Verzeichnis aktiver Bridges für CREP-synchronisierte Zusammenarbeit entlang der Trikāya-Schichten inklusive nächste Schritte zur Pflege.',
    "  trigger_phrase: 'Synchronisiere Bridges und aktualisiere nächste Schritte.'",
    "  tags: ['#Registry', '#Bridges', '#CREP', '#Trikāya']",
    '  content:',
    '    type: registry',
    "    text: 'Dieses Registry-Sigillin hält alle Inter-AI-Bridges fest. CREP-Abdeckung und Trikāya-Verortung ermöglichen schnelle Governance; nächste Schritte: Validator laufen lassen, Diff prüfen, MandalaMap aktualisieren.'",
    '    sections:',
    '      - id: bridge_registry',
    '        title: Bridge-Verzeichnis',
    '        bridges:',
  ];
  for (const provider of providers) {
    lines.push(`          - id: sig-2025-0917-interai-${provider.key}`);
    lines.push(`            provider: ${provider.label}`);
    lines.push(
      `            yaml: sigils/bridges/${provider.key}/${provider.key}-bridge.sigil.yaml`,
    );
    lines.push(
      `            json: sigils/bridges/${provider.key}/${provider.key}-bridge.sigil.json`,
    );
    lines.push(`            md: docs/sigillin/bridges/${provider.mdTitle}.md`);
  }
  return `${lines.join('\n')}\n`;
}

export async function updateRegistryFile(
  root = process.cwd(),
  providers = PROVIDERS,
  dryRun = false,
) {
  const registryPath = path.join(root, 'sigils', 'bridges', 'bridges.index.yaml');
  const yaml = buildRegistryYaml(providers);
  if (dryRun) {
    console.log(`📝 [dry-run] ${path.relative(root, registryPath)} would be updated.`);
    return registryPath;
  }
  await ensureDir(path.dirname(registryPath));
  await fs.writeFile(registryPath, yaml, 'utf8');
  console.log('✍️  wrote', path.relative(root, registryPath));
  return registryPath;
}

export async function loadBridgeJson(providerKey, root = process.cwd()) {
  const provider = getProvider(providerKey);
  if (!provider) throw new Error(`Unknown provider: ${providerKey}`);
  const { json } = bridgePaths(provider, root);
  const raw = await fs.readFile(json, 'utf8');
  return JSON.parse(raw);
}

function collectStrings(value, bucket) {
  if (!value) return;
  if (typeof value === 'string') {
    bucket.push(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, bucket);
    return;
  }
  if (typeof value === 'object') {
    for (const val of Object.values(value)) collectStrings(val, bucket);
  }
}

export async function gatherBridgeSummary(options = {}) {
  const { root = process.cwd() } = options;
  const providers = options.providers || PROVIDERS;
  const generatedAt = new Date().toISOString();
  const rows = [];
  const aggregates = {
    crep: { C: 0, R: 0, E: 0, P: 0, count: 0 },
    trikayaHits: { dharmakāya: 0, sambhogakāya: 0, nirmāṇakāya: 0 },
    nextActionFulfilled: 0,
  };

  for (const provider of providers) {
    try {
      const bridge = await loadBridgeJson(provider.key, root);
      const sigillin = bridge.sigillin || {};
      const trace = sigillin.trace || {};
      const crep = trace.CREP || {};
      const sections = Array.isArray(sigillin?.content?.sections) ? sigillin.content.sections : [];
      const textFragments = [];
      for (const section of sections) collectStrings(section, textFragments);
      const lowerFragments = textFragments.map((fragment) => fragment.toLowerCase());

      const trikayaHits = {
        dharmakāya: lowerFragments.some((f) => f.includes('dharmakāya')),
        sambhogakāya: lowerFragments.some((f) => f.includes('sambhogakāya')),
        nirmāṇakāya: lowerFragments.some((f) => f.includes('nirmāṇakāya')),
      };
      const guidelinesSection = sections.find((section) => {
        const id = (section?.id ?? '').toString().toLowerCase();
        const title = (section?.title ?? '').toString().toLowerCase();
        return (
          id.includes('guideline') || title.includes('leitlinie') || title.includes('guideline')
        );
      });
      const rules = Array.isArray(guidelinesSection?.rules) ? guidelinesSection.rules : [];
      const nextActionRule = rules.some(
        (rule) =>
          typeof rule === 'string' &&
          rule.toLowerCase().includes('nächste') &&
          rule.toLowerCase().includes('schritt'),
      );
      const crepMetrics = {
        C: Number.isFinite(crep.C) ? crep.C : null,
        R: Number.isFinite(crep.R) ? crep.R : null,
        E: Number.isFinite(crep.E) ? crep.E : null,
        P: Number.isFinite(crep.P) ? crep.P : null,
      };
      const average =
        [crepMetrics.C, crepMetrics.R, crepMetrics.E, crepMetrics.P]
          .filter((v) => typeof v === 'number')
          .reduce((acc, v) => acc + v, 0) / 4;

      rows.push({
        key: provider.key,
        label: provider.label,
        crep: crepMetrics,
        emergence_score: Number.isFinite(trace.emergence_score) ? trace.emergence_score : null,
        trikaya: trikayaHits,
        nextActionRule,
        guidelineCount: rules.length,
        averageCREP: Number.isFinite(average) ? Number(average.toFixed(3)) : null,
      });

      if (typeof crepMetrics.C === 'number') aggregates.crep.C += crepMetrics.C;
      if (typeof crepMetrics.R === 'number') aggregates.crep.R += crepMetrics.R;
      if (typeof crepMetrics.E === 'number') aggregates.crep.E += crepMetrics.E;
      if (typeof crepMetrics.P === 'number') aggregates.crep.P += crepMetrics.P;
      aggregates.crep.count += 1;
      if (trikayaHits.dharmakāya) aggregates.trikayaHits.dharmakāya += 1;
      if (trikayaHits.sambhogakāya) aggregates.trikayaHits.sambhogakāya += 1;
      if (trikayaHits.nirmāṇakāya) aggregates.trikayaHits.nirmāṇakāya += 1;
      if (nextActionRule) aggregates.nextActionFulfilled += 1;
    } catch (error) {
      rows.push({
        key: provider.key,
        label: provider.label,
        error: error.message,
      });
    }
  }

  if (aggregates.crep.count > 0) {
    aggregates.crep.avg = {
      C: Number((aggregates.crep.C / aggregates.crep.count).toFixed(3)),
      R: Number((aggregates.crep.R / aggregates.crep.count).toFixed(3)),
      E: Number((aggregates.crep.E / aggregates.crep.count).toFixed(3)),
      P: Number((aggregates.crep.P / aggregates.crep.count).toFixed(3)),
    };
  } else {
    aggregates.crep.avg = { C: null, R: null, E: null, P: null };
  }

  aggregates.trikayaCoverage = {
    dharmakāya: `${aggregates.trikayaHits.dharmakāya}/${providers.length}`,
    sambhogakāya: `${aggregates.trikayaHits.sambhogakāya}/${providers.length}`,
    nirmāṇakāya: `${aggregates.trikayaHits.nirmāṇakāya}/${providers.length}`,
  };
  aggregates.nextActionRate = providers.length
    ? Number((aggregates.nextActionFulfilled / providers.length).toFixed(2))
    : 0;

  return {
    generatedAt,
    providers: rows,
    aggregates,
  };
}
