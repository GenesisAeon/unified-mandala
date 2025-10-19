import { useMemo, useState } from 'react';
import MetricsWidget from './MetricsWidget';
import BoundaryMiniTile from './BoundaryMiniTile';
import SettingsRUM from './SettingsRUM';
import EthicsBadge from './EthicsBadge';
import { EvidenceChips, type EvidenceChipItem } from './EvidenceChips';
import { fetchJsonWithEthics, type DegradedMeta } from '../lib/fetchWithEthics';

type PlaygroundState = 'idle' | 'loading' | 'done' | 'error';

function resolveApiBase(): string {
  const viteBase = (import.meta as any)?.env?.VITE_API_BASE;
  if (typeof viteBase === 'string' && viteBase.trim().length > 0) {
    return viteBase.trim();
  }
  return '';
}

function buildEndpoint(base: string): string {
  const trimmed = base.trim().replace(/\/$/, '');
  if (!trimmed) {
    return '/api/ai/chat';
  }
  return `${trimmed}/api/ai/chat`;
}

export function MandalaAIPlayground() {
  const [systemPrompt, setSystemPrompt] = useState('Du bist ein hilfreicher Assistent.');
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [state, setState] = useState<PlaygroundState>('idle');
  const [error, setError] = useState<string | null>(null);

  const endpoint = useMemo(() => buildEndpoint(resolveApiBase()), []);

  // Tools panel state
  const [uri, setUri] = useState('repo://docs');
  const [exts, setExts] = useState('.md,.json,.yaml,.yml');
  const [listOut, setListOut] = useState<string>('');
  const [readUri, setReadUri] = useState('repo://README.md');
  const [readOut, setReadOut] = useState<string>('');
  const [nsRoot, setNsRoot] = useState<string>('repo://');
  const [pickerOpen, setPickerOpen] = useState<boolean>(false);
  const [pickerItems, setPickerItems] = useState<string[]>([]);
  const [memText, setMemText] = useState('Qwen Memory Note');
  const [memTags, setMemTags] = useState('qwen,playground');
  const [memQuery, setMemQuery] = useState('playground');
  const [memOut, setMemOut] = useState<string>('');
  const [copyNote, setCopyNote] = useState<string>(''); // verify copy feedback
  // RAG state
  const [ragRoots, setRagRoots] = useState('repo://docs,data://logs/metrics');
  const [ragQuery, setRagQuery] = useState('mandala');
  const [ragOut, setRagOut] = useState<string>('');

  // Intent Bridge state
  const [autoIntent, setAutoIntent] = useState<boolean>(true);
  const [intentLog, setIntentLog] = useState<IntentLog[]>([]);
  const [autoFollowUp, setAutoFollowUp] = useState<boolean>(true);
  // Verify-Gate state
  const [requireVerify, setRequireVerify] = useState<boolean>(true);
  const [verifyBlock, setVerifyBlock] = useState<VerifyBlock | null>(null);
  const evidenceItems = useMemo(() => toEvidenceChipItems(verifyBlock), [verifyBlock]);
  const [verifyScore, setVerifyScore] = useState<'red' | 'yellow' | 'green'>('red');
  const [publishBusy, setPublishBusy] = useState<boolean>(false);
  const [publishNote, setPublishNote] = useState<string>('');
  const [ethicsVerdict, setEthicsVerdict] = useState<'green' | 'yellow' | 'red' | 'unknown'>('unknown');
  const [ethicsEvidenceCount, setEthicsEvidenceCount] = useState<number>(0);
  const [verifyDegraded, setVerifyDegraded] = useState<DegradedMeta>({ active: false });

  async function maybeRunIntentsFrom(text: string) {
    try {
      if (!autoIntent) return;
      const raw = tryParseIntentsFrom(text).slice(0, MAX_INTENTS_PER_TURN);
      const canonSet = new Set<ToolName>([
        'fs.list',
        'fs.read',
        'memory.remember',
        'memory.recall',
        'rag.index',
        'rag.query',
      ]);
      const intents = raw
        .map((i) => {
          const t = mapToolName((i as any).tool);
          if (!t || !canonSet.has(t)) return null;
          const args = normalizeArgs(t, (i as any).args);
          return { tool: t, args } as ToolIntent;
        })
        .filter(Boolean) as ToolIntent[];
      if (!intents.length) return;
      const logs: IntentLog[] = [];
      for (const i of intents) {
        const log = await runIntent(i);
        logs.push(log);
        setIntentLog((prev) => [...prev, log]);
      }
      // Append a compact summary under the assistant answer
      try {
        const summary = formatIntentSummary(logs);
        setAnswer((prev) =>
          prev ? `${prev}\n\nIntentBridge:\n${summary}` : `IntentBridge:\n${summary}`,
        );
      } catch {}
      // optional follow-up: send tool results back to the model for a final answer
      if (autoFollowUp) {
        try {
          const final = await followUpWithToolResults({
            endpoint,
            systemPrompt,
            userPrompt: prompt,
            initialAssistant: text,
            logs,
          });
          if (final) {
            setAnswer((prev) => (prev ? `${prev}\n\nFinal:\n${final}` : `Final:\n${final}`));
            try {
              const v2 = tryParseVerifyBlock(final);
              if (v2) {
                setVerifyBlock(v2);
                setVerifyScore(assessVerify(v2));
              }
            } catch {}
          }
        } catch (e) {
          setAnswer((prev) =>
            prev ? `${prev}\n\n[follow-up failed: ${String((e as Error)?.message ?? e)}]` : prev,
          );
        }
      }
    } catch {}
  }

  async function send() {
    if (!prompt.trim()) return;

    setState('loading');
    setError(null);
    setAnswer(null);
    setEthicsVerdict('unknown');
    setEthicsEvidenceCount(0);
    setVerifyDegraded({ active: false });

    try {
      const { data: payload, ethics, response } = await fetchJsonWithEthics<any>(endpoint, {
        method: 'POST',
        jsonBody: {
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt },
          ],
          temperature: 0.2,
        },
      });

      setEthicsVerdict(ethics.verdict);
      setEthicsEvidenceCount(ethics.evidenceCount);
      setVerifyDegraded(ethics.degraded);

      if (!response.ok) {
        throw new Error((payload as any)?.error ?? `Request failed with status ${response.status}`);
      }

      function pickOutputText(result: any): string {
        return (
          result?.output_text ??
          result?.message?.content ??
          (Array.isArray(result?.choices) ? result?.choices?.[0]?.message?.content : undefined) ??
          result?.text ??
          ''
        );
      }

      const text = pickOutputText(payload);
      setAnswer(text);
      // Auto-run tool intents if present in the model output
      await maybeRunIntentsFrom(text);
      setState('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setState('error');
      setEthicsVerdict('red');
    }
  }

  async function ragIndex() {
    try {
      const payload = {
        roots: ragRoots
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        exts: ['.md', '.txt'],
        max_depth: 2,
        limit: 100,
        chunk_chars: 600,
        chunk_overlap: 120,
      };
      const r = await fetch('/api/tools/rag/index', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const j = await safeJson(r);
      if (!r.ok) throw new Error(j?.error ?? `rag index failed: ${r.status}`);
      setRagOut(JSON.stringify(j, null, 2));
    } catch (e) {
      setRagOut(String(e instanceof Error ? e.message : e));
    }
  }

  async function ragSearch() {
    try {
      const r = await fetch('/api/tools/rag/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: ragQuery, top_k: 5 }),
      });
      const j = await safeJson(r);
      if (!r.ok) throw new Error(j?.error ?? `rag query failed: ${r.status}`);
      setRagOut(JSON.stringify(j, null, 2));
    } catch (e) {
      setRagOut(String(e instanceof Error ? e.message : e));
    }
  }
  async function fsList() {
    try {
      const payload = {
        uri,
        exts: exts
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        max_depth: 3,
        limit: 200,
      };
      const r = await fetch('/api/tools/fs/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const j = await safeJson(r);
      if (!r.ok) throw new Error(j?.error ?? `list failed: ${r.status}`);
      setListOut(JSON.stringify(j, null, 2));
    } catch (e) {
      setListOut(String(e instanceof Error ? e.message : e));
    }
  }

  async function fsRead() {
    try {
      const payload = { uri: readUri, encoding: 'utf8' };
      const r = await fetch('/api/tools/fs/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const j = await safeJson(r);
      if (!r.ok) throw new Error(j?.error ?? `read failed: ${r.status}`);
      setReadOut(typeof j?.content === 'string' ? j.content : JSON.stringify(j, null, 2));
    } catch (e) {
      setReadOut(String(e instanceof Error ? e.message : e));
    }
  }

  async function openPicker(startRoot?: string) {
    try {
      const root = (startRoot || nsRoot).replace(/\/+$/, '//');
      const payload = {
        uri: root,
        exts: ['.md', '.json', '.yaml', '.yml', '.txt'],
        max_depth: 3,
        limit: 200,
      };
      const r = await fetch('/api/tools/fs/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const j = await safeJson(r);
      if (!r.ok) throw new Error(j?.error ?? `list failed: ${r.status}`);
      setPickerItems(Array.isArray(j?.items) ? j.items : []);
      setPickerOpen(true);
    } catch (e) {
      setPickerItems([]);
      setPickerOpen(true);
    }
  }

  async function memRemember() {
    try {
      const payload = {
        text: memText,
        tags: memTags
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      };
      const r = await fetch('/api/tools/memory/remember', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const j = await safeJson(r);
      if (!r.ok) throw new Error(j?.error ?? `remember failed: ${r.status}`);
      setMemOut(JSON.stringify(j, null, 2));
    } catch (e) {
      setMemOut(String(e instanceof Error ? e.message : e));
    }
  }

  async function memRecall() {
    try {
      const payload = { query: memQuery, top_k: 5 };
      const r = await fetch('/api/tools/memory/recall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const j = await safeJson(r);
      if (!r.ok) throw new Error(j?.error ?? `recall failed: ${r.status}`);
      setMemOut(JSON.stringify(j, null, 2));
    } catch (e) {
      setMemOut(String(e instanceof Error ? e.message : e));
    }
  }

  // Approve & remember: store verify block as a note when green
  async function approveAndRemember() {
    if (verifyScore !== 'green' || !verifyBlock) return;
    try {
      setPublishBusy(true);
      setPublishNote('');
      const ev = Array.isArray(verifyBlock.evidence)
        ? verifyBlock.evidence.filter(Boolean)
        : typeof verifyBlock.evidence === 'string' && verifyBlock.evidence.trim()
          ? [verifyBlock.evidence]
          : [];
      const lines: string[] = [];
      lines.push('VERIFY APPROVED');
      lines.push(`claim: ${verifyBlock.claim ?? '-'}`);
      lines.push(`status: ${verifyBlock.status ?? 'grounded'}`);
      lines.push(`updated: ${verifyBlock.updated ?? new Date().toISOString()}`);
      lines.push('evidence:');
      if (ev.length) ev.forEach((e: any, i: number) => lines.push(` - ${i + 1}. ${String(e)}`));
      const payload = { text: lines.join('\n'), tags: ['verify', 'approved', 'grounded'] };
      const r = await fetch('/api/tools/memory/remember', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const j = await safeJson(r);
      if (!r.ok) throw new Error(j?.error ?? `remember failed: ${r.status}`);
      setPublishNote('Freigabe protokolliert.');
    } catch (e: any) {
      setPublishNote(`Fehler: ${e?.message ?? String(e)}`);
    } finally {
      setPublishBusy(false);
    }
  }

  // Copy current verify block to clipboard
  async function copyVerifyJson() {
    try {
      if (!verifyBlock) return;
      const json = JSON.stringify({ verify: verifyBlock }, null, 2);
      await navigator.clipboard?.writeText(json);
      setCopyNote('Verify-JSON kopiert');
      setTimeout(() => setCopyNote(''), 1500);
    } catch (e) {
      setCopyNote('Kopieren fehlgeschlagen');
      setTimeout(() => setCopyNote(''), 1500);
    }
  }

  return (
    <div className="mx-auto grid max-w-3xl gap-5 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow">
      <header className="grid gap-2">
        <h1 className="text-2xl font-semibold text-slate-900">Mandala AI Playground</h1>
        <p className="text-sm text-slate-600">
          Sende Nachrichten an <code>/api/ai/chat</code> und inspiziere die Antworten der
          Unified-Mandala-AI. Der Dev-Server proxyt die Anfragen an den AI-API-Service (
          <code>apps/api</code>) auf Port 4000.
        </p>
      </header>

      {verifyDegraded.active && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-amber-900 shadow-sm">
          <p className="text-sm font-semibold">Fail-closed Mode aktiv</p>
          <p className="text-sm">
            Evidenz erforderlich / Veröffentlichung blockiert.
            {verifyDegraded.source ? (
              <span className="ml-1 font-normal text-amber-800">
                Quelle: {verifyDegraded.source}
              </span>
            ) : null}
          </p>
        </div>
      )}

      <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-start">
        <div className="flex-1" />
        <div className="flex flex-col items-end gap-2">
          <EthicsBadge verdict={ethicsVerdict} evidenceCount={ethicsEvidenceCount} />
          <MetricsWidget />
        </div>
      </div>

      {/* Quick tiles row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <BoundaryMiniTile />
      </div>

      {/* RUM Settings */}
      <section className="mt-2">
        <SettingsRUM />
      </section>

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
        disabled={state === 'loading' || !prompt.trim()}
        className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 font-medium text-white shadow transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300"
      >
        {state === 'loading' ? 'Sende Anfrage…' : 'Antwort anfordern'}
      </button>

      {state === 'error' && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {state === 'done' && (
        <div className="whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-900">
          {answer ?? ''}
        </div>
      )}
      <section className="grid gap-3 border-t pt-4">
        <h2 className="text-lg font-semibold text-slate-900">Tools</h2>
        {/* Intent Bridge controls */}
        <div className="grid gap-2">
          <div className="flex items-center gap-2">
            <input
              id="autoIntent"
              type="checkbox"
              checked={autoIntent}
              onChange={(e) => setAutoIntent(e.target.checked)}
            />
            <label htmlFor="autoIntent" className="text-sm text-slate-700">
              IntentBridge (auto)
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="autoFollowUp"
              type="checkbox"
              checked={autoFollowUp}
              onChange={(e) => setAutoFollowUp(e.target.checked)}
            />
            <label htmlFor="autoFollowUp" className="text-sm text-slate-700">
              Follow-up (auto)
            </label>
          </div>
          <pre className="max-h-48 overflow-auto rounded-xl border bg-slate-50 p-2 text-xs whitespace-pre-wrap">
            {intentLog.length ? JSON.stringify(intentLog, null, 2) : 'No intents executed yet.'}
          </pre>
        </div>
        {/* Verify-Gate */}
        <div className="grid gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <input
              id="requireVerify"
              type="checkbox"
              checked={requireVerify}
              onChange={(e) => setRequireVerify(e.target.checked)}
            />
            <label htmlFor="requireVerify" className="text-sm text-slate-700">
              Verify-Gate vor Empfehlungen erzwingen
            </label>
            <span className="text-sm inline-flex items-center gap-2">
              Ampel:
              <span
                className={`inline-block h-2 w-2 rounded-full ${verifyScore === 'red' ? 'bg-red-500' : verifyScore === 'yellow' ? 'bg-yellow-400' : 'bg-emerald-500'}`}
              ></span>
              <span className="text-slate-600">{verifyScore.toUpperCase()}</span>
              {/* Status-Pille */}
              <span
                aria-live="polite"
                className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                  verifyScore === 'green'
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                    : verifyScore === 'yellow'
                      ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                      : 'bg-red-100 text-red-700 border-red-200'
                }`}
                title={
                  verifyScore === 'green'
                    ? String(verifyBlock?.status ?? 'grounded')
                    : verifyScore === 'yellow'
                      ? 'partial'
                      : 'unverified'
                }
              >
                {verifyScore === 'green'
                  ? String(verifyBlock?.status ?? 'grounded')
                  : verifyScore === 'yellow'
                    ? 'partial'
                    : 'unverified'}
              </span>
            </span>
          </div>
          <EvidenceChips evidence={evidenceItems} />
          <pre className="max-h-48 overflow-auto rounded-xl border bg-slate-50 p-2 text-xs whitespace-pre-wrap">
            {verifyBlock ? JSON.stringify(verifyBlock, null, 2) : 'No verify block detected.'}
          </pre>
          {/* Ampel-Legende (barrierearm) */}
          <div className="text-xs text-slate-600" role="note" aria-label="Verify Legende">
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-2">
                <span
                  aria-hidden
                  className="inline-block h-2 w-2 rounded-full bg-emerald-500"
                ></span>
                <span>
                  <strong>grün</strong>: <code>status: "grounded"</code> &nbsp;+ 2 Evidenzen
                </span>
              </span>
              <span className="inline-flex items-center gap-2">
                <span
                  aria-hidden
                  className="inline-block h-2 w-2 rounded-full bg-yellow-400"
                ></span>
                <span>
                  <strong>gelb</strong>: teilweise belegt / unklare Evidenz
                </span>
              </span>
              <span className="inline-flex items-center gap-2">
                <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-red-500"></span>
                <span>
                  <strong>rot</strong>: unbelegt / keine Evidenz
                </span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={approveAndRemember}
              disabled={verifyScore !== 'green' || !verifyBlock || publishBusy}
              className={`rounded-xl px-3 py-2 ${verifyScore === 'green' ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700 cursor-not-allowed'}`}
              title={
                verifyScore === 'green'
                  ? 'Freigeben & im Gedächtnis protokollieren'
                  : 'Freigabe erst bei grün möglich'
              }
            >
              {publishBusy ? 'Speichere…' : 'Freigeben & protokollieren'}
            </button>
            <button
              type="button"
              onClick={copyVerifyJson}
              disabled={!verifyBlock}
              className="rounded-xl px-3 py-2 border bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              title="Verify-Block als JSON kopieren"
            >
              Copy verify JSON
            </button>
            {publishNote && <span className="text-xs text-slate-600">{publishNote}</span>}
            {copyNote && <span className="text-xs text-slate-600">{copyNote}</span>}
          </div>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          <div className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">FS list</span>
            <div className="flex gap-2">
              <select
                value={nsRoot}
                onChange={(e) => setNsRoot(e.target.value)}
                className="rounded-xl border p-2"
              >
                <option value="repo://">repo://</option>
                <option value="scratch://">scratch://</option>
                <option value="data://">data://</option>
              </select>
              <input
                value={uri}
                onChange={(e) => setUri(e.target.value)}
                className="flex-1 rounded-xl border p-2"
              />
              <button
                type="button"
                onClick={() => openPicker(nsRoot)}
                className="rounded-xl bg-slate-600 px-3 py-2 text-white"
              >
                Browse
              </button>
            </div>
            <input
              value={exts}
              onChange={(e) => setExts(e.target.value)}
              className="rounded-xl border p-2"
            />
            <button
              type="button"
              onClick={fsList}
              className="rounded-xl bg-slate-700 px-3 py-2 text-white"
            >
              Listen
            </button>
            <pre className="max-h-48 overflow-auto rounded-xl border bg-slate-50 p-2 text-xs">
              {listOut}
            </pre>
          </div>
          <div className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">FS read</span>
            <div className="flex gap-2">
              <input
                value={readUri}
                onChange={(e) => setReadUri(e.target.value)}
                className="flex-1 rounded-xl border p-2"
              />
              <button
                type="button"
                onClick={() => openPicker()}
                className="rounded-xl bg-slate-600 px-3 py-2 text-white"
              >
                Browse
              </button>
            </div>
            <button
              type="button"
              onClick={fsRead}
              className="rounded-xl bg-slate-700 px-3 py-2 text-white"
            >
              Lesen
            </button>
            <pre className="max-h-48 overflow-auto rounded-xl border bg-slate-50 p-2 text-xs whitespace-pre-wrap">
              {readOut}
            </pre>
          </div>
        </div>
        {pickerOpen && (
          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm font-medium text-slate-700">Select a file ({nsRoot})</div>
              <button
                type="button"
                onClick={() => setPickerOpen(false)}
                className="text-sm text-slate-500 hover:underline"
              >
                close
              </button>
            </div>
            <div className="max-h-56 overflow-auto">
              {pickerItems.length === 0 ? (
                <div className="text-sm text-slate-500">No items or listing failed.</div>
              ) : (
                <ul className="text-sm">
                  {pickerItems.map((it) => (
                    <li
                      key={it}
                      className="cursor-pointer truncate rounded px-2 py-1 hover:bg-slate-100"
                      onClick={() => {
                        setReadUri(it);
                        setUri(it.replace(/\/[^/]*$/, ''));
                        setPickerOpen(false);
                      }}
                    >
                      {it}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
        <div className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">Memory</span>
          <input
            value={memText}
            onChange={(e) => setMemText(e.target.value)}
            className="rounded-xl border p-2"
          />
          <input
            value={memTags}
            onChange={(e) => setMemTags(e.target.value)}
            className="rounded-xl border p-2"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={memRemember}
              className="rounded-xl bg-indigo-600 px-3 py-2 text-white"
            >
              Remember
            </button>
            <input
              value={memQuery}
              onChange={(e) => setMemQuery(e.target.value)}
              className="flex-1 rounded-xl border p-2"
            />
            <button
              type="button"
              onClick={memRecall}
              className="rounded-xl bg-indigo-600 px-3 py-2 text-white"
            >
              Recall
            </button>
          </div>
          <pre className="max-h-48 overflow-auto rounded-xl border bg-slate-50 p-2 text-xs whitespace-pre-wrap">
            {memOut}
          </pre>
        </div>
        <div className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">RAG</span>
          <input
            value={ragRoots}
            onChange={(e) => setRagRoots(e.target.value)}
            className="rounded-xl border p-2"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={ragIndex}
              className="rounded-xl bg-emerald-600 px-3 py-2 text-white"
            >
              Index
            </button>
            <input
              value={ragQuery}
              onChange={(e) => setRagQuery(e.target.value)}
              className="flex-1 rounded-xl border p-2"
            />
            <button
              type="button"
              onClick={ragSearch}
              className="rounded-xl bg-emerald-600 px-3 py-2 text-white"
            >
              Query
            </button>
          </div>
          <pre className="max-h-48 overflow-auto rounded-xl border bg-slate-50 p-2 text-xs whitespace-pre-wrap">
            {ragOut}
          </pre>
        </div>
      </section>
    </div>
  );
}

export default MandalaAIPlayground;

// Tolerant JSON parsing helper: returns {} on empty/non-JSON bodies
async function safeJson(r: Response): Promise<any> {
  try {
    const txt = await r.text();
    if (!txt || !txt.trim()) return {};
    return JSON.parse(txt);
  } catch {
    return {};
  }
}

// --- Intent Bridge helpers/types ---
type ToolName =
  | 'fs.list'
  | 'fs.read'
  | 'memory.remember'
  | 'memory.recall'
  | 'rag.index'
  | 'rag.query';

type ToolIntent = { tool: ToolName; args?: Record<string, any> };

type IntentLog = {
  intent: ToolIntent;
  ok: boolean;
  status?: number;
  error?: string;
  result?: any;
};

const MAX_INTENTS_PER_TURN = 3;

function tryParseIntentsFrom(text: string): ToolIntent[] {
  try {
    if (!text) return [];
    const m = text.match(/```json\s*([\s\S]*?)```/i);
    const candidate = m ? m[1] : text;
    const firstBrace = candidate.indexOf('{');
    if (firstBrace < 0) return [];
    const sliced = candidate.slice(firstBrace);
    let parsed: any;
    try {
      parsed = JSON.parse(sliced);
    } catch {
      return [];
    }
    const arr: any[] = Array.isArray(parsed) ? parsed : [parsed];
    // Be tolerant; validate/match aliases later
    return arr.filter((x) => x && typeof x.tool === 'string');
  } catch {
    return [];
  }
}

async function postJSON(
  path: string,
  body: any,
): Promise<{ ok: boolean; status: number; data: any }> {
  const r = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body ?? {}),
  });
  const data = await safeJson(r);
  return { ok: r.ok, status: r.status, data };
}

async function runIntent(i: ToolIntent): Promise<IntentLog> {
  try {
    switch (i.tool) {
      case 'fs.list': {
        const res = await postJSON('/api/tools/fs/list', i.args);
        return {
          intent: i,
          ok: res.ok,
          status: res.status,
          result: res.data,
          error: res.ok ? undefined : res.data?.error,
        };
      }
      case 'fs.read': {
        const res = await postJSON('/api/tools/fs/read', i.args);
        return {
          intent: i,
          ok: res.ok,
          status: res.status,
          result: res.data,
          error: res.ok ? undefined : res.data?.error,
        };
      }
      case 'memory.remember': {
        const res = await postJSON('/api/tools/memory/remember', i.args);
        return {
          intent: i,
          ok: res.ok,
          status: res.status,
          result: res.data,
          error: res.ok ? undefined : res.data?.error,
        };
      }
      case 'memory.recall': {
        const res = await postJSON('/api/tools/memory/recall', i.args);
        return {
          intent: i,
          ok: res.ok,
          status: res.status,
          result: res.data,
          error: res.ok ? undefined : res.data?.error,
        };
      }
      case 'rag.index': {
        const res = await postJSON('/api/tools/rag/index', i.args);
        return {
          intent: i,
          ok: res.ok,
          status: res.status,
          result: res.data,
          error: res.ok ? undefined : res.data?.error,
        };
      }
      case 'rag.query': {
        const res = await postJSON('/api/tools/rag/query', i.args);
        return {
          intent: i,
          ok: res.ok,
          status: res.status,
          result: res.data,
          error: res.ok ? undefined : res.data?.error,
        };
      }
      default:
        return { intent: i, ok: false, error: 'unsupported_tool' } as IntentLog;
    }
  } catch (e: any) {
    return { intent: i, ok: false, error: String(e?.message ?? e) } as IntentLog;
  }
}

const TRUNC_SUMMARY_CHARS = 12000;

function formatIntentSummary(logs: IntentLog[]): string {
  const chunks = logs.map((l) => {
    const h = l.ok ? 'ok' : `fail:${l.error ?? l.status}`;
    let sample = '';
    try {
      sample = JSON.stringify(l.result);
    } catch {}
    if (sample && sample.length > 600) sample = sample.slice(0, 600) + '…';
    return `[tool:${l.intent.tool}] ${h}\n${sample}`;
  });
  let summary = chunks.join('\n\n');
  if (summary.length > TRUNC_SUMMARY_CHARS) {
    summary = summary.slice(0, TRUNC_SUMMARY_CHARS) + '\n…(truncated)';
  }
  return summary;
}

async function followUpWithToolResults(args: {
  endpoint: string;
  systemPrompt: string;
  userPrompt: string;
  initialAssistant: string;
  logs: IntentLog[];
}): Promise<string | null> {
  const { endpoint, systemPrompt, userPrompt, initialAssistant, logs } = args;
  const summary = formatIntentSummary(logs);
  const followUser = `Hier sind Tool-Ergebnisse aus dem Intent-Bridge-Lauf. Bitte integriere diese in eine finale, präzise Antwort.\n\n${summary}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
        { role: 'assistant', content: initialAssistant },
        { role: 'user', content: followUser },
      ],
      temperature: 0.2,
    }),
  });
  const payload = await safeJson(response);
  if (!response.ok) return null;
  const txt =
    payload?.output_text ??
    payload?.message?.content ??
    (Array.isArray(payload?.choices) ? payload?.choices?.[0]?.message?.content : undefined) ??
    payload?.text ??
    '';
  return typeof txt === 'string' && txt.trim().length ? txt : null;
}

// ---- Intent alias/normalization (Soft Mode) ----
const TOOL_ALIASES: Record<string, ToolName> = {
  list: 'fs.list',
  fs_ls: 'fs.list',
  'fs.listing': 'fs.list',
  read: 'fs.read',
  open: 'fs.read',
  remember: 'memory.remember',
  note: 'memory.remember',
  'mem.add': 'memory.remember',
  recall: 'memory.recall',
  'mem.search': 'memory.recall',
  search: 'memory.recall',
  'semantic.search': 'rag.query',
  index: 'rag.index',
};

function mapToolName(name: string): ToolName | null {
  if (!name) return null;
  const n = String(name).trim();
  const canon = [
    'fs.list',
    'fs.read',
    'memory.remember',
    'memory.recall',
    'rag.index',
    'rag.query',
  ] as const;
  if ((canon as readonly string[]).includes(n)) return n as ToolName;
  return (TOOL_ALIASES[n] ?? null) as ToolName | null;
}

function normalizeArgs(tool: ToolName, args: any): Record<string, any> {
  const a: any = { ...(args ?? {}) };
  if (a.path && !a.uri) a.uri = a.path;
  if (a.file && !a.uri) a.uri = a.file;
  if (a.extensions && !a.exts) a.exts = a.extensions;
  if (a.q && !a.query) a.query = a.q;
  if (a.k && !a.top_k) a.top_k = a.k;
  if (a.n && !a.top_k) a.top_k = a.n;
  if (tool === 'fs.list') {
    if (!a.exts || (Array.isArray(a.exts) && a.exts.length === 0)) {
      a.exts = ['.md', '.json', '.yaml', '.yml'];
    }
    a.max_depth ??= 2;
    a.limit ??= 50;
  }
  if (tool === 'fs.read') a.encoding ??= 'utf8';
  if (tool === 'memory.recall') a.top_k ??= 5;
  if (tool === 'rag.query') a.top_k ??= 5;
  return a;
}

// ---- Verify-Gate helpers ----
type VerifyBlock = {
  claim?: string;
  checks?: any;
  evidence?: any;
  status?: string;
  updated?: string;
};

function extractFirstJsonCandidate(text: string): string | null {
  if (!text) return null;
  const block = text.match(/```json\s*([\s\S]*?)```/i);
  const candidate = block ? block[1] : text;
  const first = candidate.indexOf('{');
  if (first < 0) return null;
  return candidate.slice(first);
}

function tryParseVerifyBlock(text: string): VerifyBlock | null {
  try {
    const sliced = extractFirstJsonCandidate(text);
    if (!sliced) return null;
    let parsed: any;
    try {
      parsed = JSON.parse(sliced);
    } catch {
      return null;
    }
    const v = parsed?.verify && typeof parsed.verify === 'object' ? parsed.verify : parsed;
    if (!v || typeof v !== 'object') return null;
    const hasSignal = ['claim', 'checks', 'evidence', 'status'].some((k) => k in v);
    if (!hasSignal) return null;
    return v as VerifyBlock;
  } catch {
    return null;
  }
}

function assessVerify(v: VerifyBlock | null): 'red' | 'yellow' | 'green' {
  if (!v) return 'red';
  const ev: any[] = Array.isArray(v.evidence)
    ? (v.evidence as any[]).filter(Boolean)
    : typeof v.evidence === 'string' && v.evidence.trim()
      ? [v.evidence]
      : [];
  const grounded = String(v.status ?? '').toLowerCase() === 'grounded';
  if (grounded && ev.length >= 2) return 'green';
  if (ev.length >= 1 || String(v.status ?? '').length > 0) return 'yellow';
  return 'red';
}

function domainFromUrl(value: string): string {
  if (!value) return '';
  try {
    const hostname = new URL(value).hostname;
    return hostname.replace(/^www\./, '');
  } catch {
    return value.replace(/^https?:\/\/(www\.)?/, '').split('/')[0] ?? value;
  }
}

function toEvidenceChipItems(block: VerifyBlock | null): EvidenceChipItem[] {
  if (!block) {
    return [];
  }
  const raw: any[] = Array.isArray(block.evidence)
    ? (block.evidence as any[]).filter(Boolean)
    : typeof block.evidence === 'string' && block.evidence.trim().length > 0
      ? [block.evidence]
      : [];
  const items: EvidenceChipItem[] = [];
  for (const entry of raw) {
    if (typeof entry === 'string') {
      const url = entry;
      const domain = domainFromUrl(url);
      items.push({ url, domain, strength: 'standard' });
      continue;
    }
    if (entry && typeof entry === 'object') {
      const record = entry as Record<string, unknown>;
      const url = typeof record.url === 'string'
        ? record.url
        : typeof record.uri === 'string'
          ? record.uri
          : '';
      const explicitDomain = typeof record.domain === 'string' ? record.domain : '';
      const domain = explicitDomain || (url ? domainFromUrl(url) : '');
      const strengthRaw = typeof record.strength === 'string' ? record.strength.toLowerCase() : undefined;
      const strength: EvidenceChipItem['strength'] = strengthRaw === 'strong'
        ? 'strong'
        : strengthRaw === 'weak'
          ? 'weak'
          : strengthRaw === 'standard'
            ? 'standard'
            : undefined;
      if (domain || url) {
        items.push({ url: url || domain || 'unknown', domain: domain || 'unknown', strength });
      }
    }
  }
  return items;
}

// end of file helpers
