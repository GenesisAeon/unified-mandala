import { useMemo, useState } from "react";

type PlaygroundState = "idle" | "loading" | "done" | "error";

function resolveApiBase(): string {
  const viteBase = (import.meta as any)?.env?.VITE_API_BASE;
  if (typeof viteBase === "string" && viteBase.trim().length > 0) {
    return viteBase.trim();
  }
  return "";
}

function buildEndpoint(base: string): string {
  const trimmed = base.trim().replace(/\/$/, "");
  if (!trimmed) {
    return "/api/ai/chat";
  }
  return `${trimmed}/api/ai/chat`;
}

export function MandalaAIPlayground() {
  const [systemPrompt, setSystemPrompt] = useState("Du bist ein hilfreicher Assistent.");
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [state, setState] = useState<PlaygroundState>("idle");
  const [error, setError] = useState<string | null>(null);

  const endpoint = useMemo(() => buildEndpoint(resolveApiBase()), []);

  async function send() {
    if (!prompt.trim()) return;

    setState("loading");
    setError(null);
    setAnswer(null);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt },
          ],
          temperature: 0.2,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.error ?? `Request failed with status ${response.status}`);
      }

      setAnswer(payload?.text ?? "");
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setState("error");
    }
  }

  return (
    <div className="mx-auto grid max-w-3xl gap-5 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow">
      <header className="grid gap-2">
        <h1 className="text-2xl font-semibold text-slate-900">Mandala AI Playground</h1>
        <p className="text-sm text-slate-600">
          Sende Nachrichten an <code>/api/ai/chat</code> und inspiziere die Antworten der Unified-Mandala-AI.
          Der Dev-Server proxyt die Anfragen an den AI-API-Service (<code>apps/api</code>) auf Port 4000.
        </p>
      </header>

      <label className="grid gap-2">
        <span className="text-sm font-medium text-slate-700">Systemnachricht</span>
        <input
          value={systemPrompt}
          onChange={(event) => setSystemPrompt(event.target.value)}
          className="rounded-xl border border-slate-200 p-3 shadow-sm focus:border-indigo-500 focus:outline-none"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-medium text-slate-700">Prompt</span>
        <textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          className="min-h-[140px] rounded-xl border border-slate-200 p-3 shadow-sm focus:border-indigo-500 focus:outline-none"
          placeholder="Frage die Mandala-AI nach etwas..."
        />
      </label>

      <button
        type="button"
        onClick={send}
        disabled={state === "loading" || !prompt.trim()}
        className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 font-medium text-white shadow transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300"
      >
        {state === "loading" ? "Sende Anfrage…" : "Antwort anfordern"}
      </button>

      {state === "error" && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      {state === "done" && (
        <div className="whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-900">
          {answer ?? ""}
        </div>
      )}
    </div>
  );
}

export default MandalaAIPlayground;
