import React, { useState } from 'react';

type PlaygroundState = 'idle' | 'loading' | 'done' | 'error';

function resolveApiBase(): string {
  try {
    const viteEnv = (import.meta as any)?.env?.VITE_API_BASE;
    if (typeof viteEnv === 'string' && viteEnv.length > 0) {
      return viteEnv;
    }
  } catch {
    // ignore
  }

  if (typeof process !== 'undefined') {
    const base = (process as any)?.env?.NEXT_PUBLIC_API_BASE;
    if (typeof base === 'string' && base.length > 0) {
      return base;
    }
  }

  return '';
}

const API_BASE = resolveApiBase();

export default function MandalaAIPlayground() {
  const [system, setSystem] = useState('Du bist ein hilfreicher Assistent.');
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [state, setState] = useState<PlaygroundState>('idle');
  const [error, setError] = useState<string | null>(null);

  async function send() {
    if (!prompt.trim()) {
      return;
    }

    setState('loading');
    setError(null);
    setAnswer(null);

    try {
      const response = await fetch(`${API_BASE}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: prompt }
          ],
          temperature: 0.2
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Request failed');
      }

      setAnswer(data?.text ?? '');
      setState('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setState('error');
    }
  }

  return (
    <div className="max-w-2xl mx-auto grid gap-4 rounded-2xl border bg-white/40 p-6 shadow">
      <header className="grid gap-2">
        <h1 className="text-2xl font-semibold">Mandala AI Playground</h1>
        <p className="text-sm text-neutral-600">
          Test a Responses API bridge exposed via <code>/api/ai/chat</code>. Configure
          the system prompt, send a question, and inspect the answer returned by the
          Unified Mandala AI worker.
        </p>
      </header>

      <label className="grid gap-2">
        <span className="text-sm font-medium text-neutral-700">Systemnachricht</span>
        <input
          className="rounded-xl border border-neutral-200 p-3 shadow-sm focus:border-indigo-400 focus:outline-none"
          value={system}
          onChange={(event) => setSystem(event.target.value)}
          placeholder="Du bist ein hilfreicher Assistent."
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-medium text-neutral-700">Prompt</span>
        <textarea
          className="min-h-[120px] rounded-xl border border-neutral-200 p-3 shadow-sm focus:border-indigo-400 focus:outline-none"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Frage die Mandala-AI nach etwas..."
        />
      </label>

      <button
        className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 font-medium text-white shadow disabled:cursor-not-allowed disabled:bg-indigo-300"
        disabled={state === 'loading' || !prompt.trim()}
        onClick={send}
      >
        {state === 'loading' ? 'Frage wird gesendet…' : 'Antwort anfordern'}
      </button>

      {state === 'error' && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {state === 'done' && (
        <div className="whitespace-pre-wrap rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm leading-relaxed text-neutral-800">
          {answer ?? ''}
        </div>
      )}
    </div>
  );
}
