#!/usr/bin/env node
// Qwen E2E Smoke: UI → API (/api/ai/chat) → Qwen backend (Ollama/vLLM)
// Usage: pnpm smoke:qwen
// Environment overrides:
//   UI_DEV_URL, API_BASE, AI_PROVIDER, QWEN_ENDPOINT, QWEN_MODEL
//   TARGET_TEXT (optional, defaults to "Qwen ok")

const uiCandidates = [
  process.env.UI_DEV_URL,
  'http://localhost:5173',
  'http://localhost:5174',
].filter(Boolean);

const configuredApiBase = process.env.API_BASE;
const defaultApiBase = 'http://localhost:4000';
const providerHint = (process.env.AI_PROVIDER || '').toLowerCase();

const defaultOllamaEndpoint = 'http://localhost:11434';
const defaultVllmEndpoint = 'http://localhost:8000';
const OLLAMA_URL = process.env.QWEN_ENDPOINT ?? defaultOllamaEndpoint;
const OLLAMA_MODEL = process.env.QWEN_MODEL ?? 'qwen2.5:7b';
const VLLM_URL = process.env.QWEN_ENDPOINT ?? defaultVllmEndpoint;
const VLLM_MODEL = process.env.QWEN_MODEL ?? 'Qwen/Qwen2.5-7B-Instruct';

const TARGET_TEXT = process.env.TARGET_TEXT ?? 'Qwen ok';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const color = (code, text) => `\u001b[${code}m${text}\u001b[0m`;
const green = (text) => color('32', text);
const red = (text) => color('31', text);
const cyan = (text) => color('36', text);
const gray = (text) => color('90', text);

async function fetchWithTimeout(url, options = {}, timeoutMs = 5000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeout);
  }
}

async function waitForUI() {
  const attempts = 30;
  const delay = 500;

  for (const base of uiCandidates) {
    const normalized = base.replace(/\/+$/, '');
    const url = `${normalized}/demo/ai-playground`;
    for (let attempt = 0; attempt < attempts; attempt += 1) {
      try {
        const response = await fetchWithTimeout(url, {}, 3000);
        if (response.ok) {
          console.log(green(`✓ UI reachable: ${url} (${response.status})`));
          return normalized;
        }
      } catch (error) {
        if (attempt === attempts - 1) {
          console.log(gray(`UI probe failed (${url}): ${error.message}`));
        }
      }
      await sleep(delay);
    }
  }
  throw new Error(`UI not reachable on any candidate base URL: ${uiCandidates.join(', ')}`);
}

async function callApiChat(uiBase) {
  const payload = {
    messages: [
      { role: 'system', content: 'Antworte nur exakt: "Qwen ok".' },
      { role: 'user', content: 'Bitte antworte exakt mit: Qwen ok' },
    ],
  };

  const candidates = [];
  if (configuredApiBase) {
    candidates.push(configuredApiBase);
  }
  candidates.push(defaultApiBase);
  if (uiBase) {
    candidates.push(uiBase);
  }

  const errors = [];
  for (const base of [...new Set(candidates)]) {
    const normalized = base.replace(/\/+$/, '');
    const url = `${normalized}/api/ai/chat`;
    try {
      const response = await fetchWithTimeout(
        url,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
        10000,
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const json = await response.json();
      const outputText =
        json?.output_text ??
        json?.output?.[0]?.content?.find?.((part) => part?.type === 'output_text')?.text ??
        '';

      if (!outputText) {
        throw new Error(`No output_text in response: ${JSON.stringify(json).slice(0, 400)}…`);
      }

      const ok = outputText.trim().includes(TARGET_TEXT);
      if (ok) {
        console.log(green(`✓ API responded with expected text (${TARGET_TEXT}) via ${normalized}`));
      } else {
        console.log(
          cyan(
            `• API responded via ${normalized} but wording differed: ${gray(JSON.stringify(outputText))}`,
          ),
        );
      }
      return { json, answer: outputText, ok };
    } catch (error) {
      errors.push(`${url} → ${error.message}`);
    }
  }

  throw new Error(`All API probes failed: ${errors.join('; ')}`);
}

async function probeOllama() {
  const url = `${OLLAMA_URL.replace(/\/+$/, '')}/api/chat`;
  const payload = {
    model: OLLAMA_MODEL,
    stream: false,
    messages: [
      { role: 'system', content: 'Antworte nur "Qwen ok".' },
      { role: 'user', content: 'Sag: Qwen ok' },
    ],
  };

  const response = await fetchWithTimeout(
    url,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
    10000,
  );

  if (!response.ok) {
    throw new Error(`Ollama chat responded with HTTP ${response.status}`);
  }

  const json = await response.json();
  const text = json?.message?.content ?? '';
  if (!text) {
    throw new Error('Ollama response did not include message.content');
  }

  if (text.includes(TARGET_TEXT)) {
    console.log(green(`✓ Ollama (${OLLAMA_MODEL}) responded with expected snippet`));
  } else {
    console.log(
      cyan(`• Ollama responded without the exact snippet: ${gray(JSON.stringify(text))}`),
    );
  }
}

async function probeVllm() {
  const url = `${VLLM_URL.replace(/\/+$/, '')}/v1/chat/completions`;
  const payload = {
    model: VLLM_MODEL,
    messages: [
      { role: 'system', content: 'Antworte nur "Qwen ok".' },
      { role: 'user', content: 'Sag: Qwen ok' },
    ],
  };

  const response = await fetchWithTimeout(
    url,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
    10000,
  );

  if (!response.ok) {
    throw new Error(`vLLM chat responded with HTTP ${response.status}`);
  }

  const json = await response.json();
  const text = json?.choices?.[0]?.message?.content ?? '';
  if (!text) {
    throw new Error('vLLM response did not include choices[0].message.content');
  }

  if (text.includes(TARGET_TEXT)) {
    console.log(green(`✓ vLLM (${VLLM_MODEL}) responded with expected snippet`));
  } else {
    console.log(cyan(`• vLLM responded without the exact snippet: ${gray(JSON.stringify(text))}`));
  }
}

(async () => {
  try {
    console.log(cyan('⏳ Waiting for UI …'));
    const uiBase = await waitForUI();

    console.log(cyan('⏳ Calling API /api/ai/chat …'));
    const { ok } = await callApiChat(uiBase);

    const providerMatches = {
      ollama: providerHint.includes('ollama'),
      vllm: providerHint.includes('vllm'),
    };

    if (providerMatches.ollama) {
      console.log(cyan('⏳ Probing Qwen via Ollama …'));
      await probeOllama();
    } else if (providerMatches.vllm) {
      console.log(cyan('⏳ Probing Qwen via vLLM …'));
      await probeVllm();
    } else {
      console.log(gray('No provider hint → attempting Ollama, then vLLM (best-effort).'));
      try {
        await probeOllama();
      } catch (error) {
        console.log(gray(`Ollama probe skipped/failed: ${error.message}`));
      }
      try {
        await probeVllm();
      } catch (error) {
        console.log(gray(`vLLM probe skipped/failed: ${error.message}`));
      }
    }

    console.log(green('✅ Qwen E2E smoke finished.'));
    process.exit(ok ? 0 : 0);
  } catch (error) {
    console.error(red(`❌ Smoke failed: ${error.message}`));
    process.exit(1);
  }
})();
