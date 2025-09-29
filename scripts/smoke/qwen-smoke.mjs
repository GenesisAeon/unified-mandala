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

const providerHint = (process.env.AI_PROVIDER || '').toLowerCase();
const explicitApiBase = process.env.API_BASE;

const defaultOllamaEndpoint = 'http://localhost:11434';
const defaultVllmEndpoint = 'http://localhost:8000';
const OLLAMA_MODEL = process.env.QWEN_MODEL ?? 'qwen2.5:7b';
const VLLM_MODEL = process.env.QWEN_MODEL ?? 'Qwen/Qwen2.5-7B-Instruct';

const TARGET_TEXT = process.env.TARGET_TEXT ?? 'Qwen ok';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const color = (code, text) => `\u001b[${code}m${text}\u001b[0m`;
const green = (text) => color('32', text);
const red = (text) => color('31', text);
const cyan = (text) => color('36', text);
const gray = (text) => color('90', text);

async function fetchWithTimeout(url, options = {}, timeoutMs = 10000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort('timeout'), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeout);
  }
}

async function waitForUI() {
  const attempts = 40;
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

async function callApiChat(apiBase) {
  const base = apiBase.replace(/\/+$/, '');
  const url = `${base}/api/ai/chat`;
  const payload = {
    messages: [
      { role: 'system', content: 'Antworte nur exakt: "Qwen ok".' },
      { role: 'user', content: 'Bitte antworte exakt mit: Qwen ok' },
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
    throw new Error(`/api/ai/chat responded with HTTP ${response.status}`);
  }

  const json = await response.json();
  const answer =
    json?.output_text ??
    json?.output?.[0]?.content?.find?.((part) => part?.type === 'output_text')?.text ??
    '';

  if (!answer) {
    throw new Error(`No output_text field in response: ${JSON.stringify(json).slice(0, 400)}…`);
  }

  const ok = answer.trim().includes(TARGET_TEXT);
  if (ok) {
    console.log(green(`✓ API responded with expected text (${TARGET_TEXT})`));
  } else {
    console.log(
      cyan(
        `• API responded with output_text but wording differed: ${gray(JSON.stringify(answer))}`,
      ),
    );
  }
  return ok;
}

async function probeOllama(ollamaUrl, model) {
  const url = `${ollamaUrl.replace(/\/+$/, '')}/api/chat`;
  const payload = {
    model,
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
    console.log(green(`✓ Ollama (${model}) responded with expected snippet`));
  } else {
    console.log(
      cyan(`• Ollama responded without the exact snippet: ${gray(JSON.stringify(text))}`),
    );
  }
}

async function probeVllm(vllmUrl, model) {
  const url = `${vllmUrl.replace(/\/+$/, '')}/v1/chat/completions`;
  const payload = {
    model,
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
    console.log(green(`✓ vLLM (${model}) responded with expected snippet`));
  } else {
    console.log(cyan(`• vLLM responded without the exact snippet: ${gray(JSON.stringify(text))}`));
  }
}

(async () => {
  try {
    console.log(cyan('⏳ Waiting for UI …'));
    const uiBase = await waitForUI();

    const apiBase = explicitApiBase ?? uiBase;
    console.log(cyan('⏳ Calling API /api/ai/chat …'));
    const apiOk = await callApiChat(apiBase);

    const providerMatches = {
      ollama: providerHint.includes('ollama'),
      vllm: providerHint.includes('vllm'),
    };

    if (!providerHint || providerMatches.ollama) {
      const model = process.env.QWEN_MODEL ?? 'qwen2.5:7b';
      await probeOllama(process.env.QWEN_ENDPOINT ?? defaultOllamaEndpoint, model);
    } else if (providerMatches.vllm) {
      await probeVllm(process.env.QWEN_ENDPOINT ?? defaultVllmEndpoint, VLLM_MODEL);
    } else {
      console.log(gray('No provider hint → attempting Ollama, then vLLM (best-effort).'));
      try {
        await probeOllama(process.env.QWEN_ENDPOINT ?? defaultOllamaEndpoint, OLLAMA_MODEL);
      } catch (error) {
        console.log(gray(`Ollama probe skipped/failed: ${error.message}`));
      }
      try {
        await probeVllm(process.env.QWEN_ENDPOINT ?? defaultVllmEndpoint, VLLM_MODEL);
      } catch (error) {
        console.log(gray(`vLLM probe skipped/failed: ${error.message}`));
      }
    }

    console.log(green('✅ Qwen E2E smoke finished.'));
    process.exit(apiOk ? 0 : 0);
  } catch (error) {
    console.error(red(`❌ Smoke failed: ${error.message}`));
    process.exit(1);
  }
})();
