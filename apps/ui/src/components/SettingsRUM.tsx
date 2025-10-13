import React, { useEffect, useState } from 'react';

export default function SettingsRUM() {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [url, setUrl] = useState<string>('');
  const [note, setNote] = useState<string>('');

  useEffect(() => {
    try {
      const st = (window as any).__rum?.status?.();
      if (st) {
        setEnabled(!!st.enabled);
        setUrl(st.url || '');
      }
    } catch {}
  }, []);

  async function onEnable() {
    try {
      await (window as any).__rum?.enable?.(url);
      const st = (window as any).__rum?.status?.();
      setEnabled(!!st?.enabled);
      setNote('RUM aktiviert.');
    } catch (e) {
      setNote('Aktivieren fehlgeschlagen');
    } finally {
      setTimeout(() => setNote(''), 1500);
    }
  }

  async function onDisable() {
    try {
      await (window as any).__rum?.disable?.();
      const st = (window as any).__rum?.status?.();
      setEnabled(!!st?.enabled);
      setNote('RUM deaktiviert.');
    } catch (e) {
      setNote('Deaktivieren fehlgeschlagen');
    } finally {
      setTimeout(() => setNote(''), 1500);
    }
  }

  function onSaveUrl() {
    try {
      (window as any).__rum?.setCollectorUrl?.(url);
      setNote('Collector-URL gespeichert.');
    } catch (e) {
      setNote('Speichern fehlgeschlagen');
    } finally {
      setTimeout(() => setNote(''), 1500);
    }
  }

  return (
    <div className="rounded-2xl border p-3 md:p-4 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-900">Settings · RUM</h3>
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}
        >
          {enabled ? 'enabled' : 'disabled'}
        </span>
      </div>
      <div className="mt-3 grid gap-2 md:grid-cols-[1fr_auto_auto_auto] items-center">
        <input
          className="rounded-xl border p-2 text-sm"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="http://localhost:4318/v1/traces"
          aria-label="OTLP Collector URL"
        />
        <button onClick={onSaveUrl} className="rounded-xl px-3 py-2 text-sm bg-slate-700 text-white">
          URL speichern
        </button>
        {enabled ? (
          <button onClick={onDisable} className="rounded-xl px-3 py-2 text-sm bg-red-600 text-white">
            Deaktivieren
          </button>
        ) : (
          <button onClick={onEnable} className="rounded-xl px-3 py-2 text-sm bg-emerald-600 text-white">
            Aktivieren
          </button>
        )}
        {note && <div className="self-center text-xs text-slate-600">{note}</div>}
      </div>
      <div className="mt-2 text-[11px] text-slate-500">
        Hinweis: Status wird in <code>localStorage</code> gespeichert (<code>mandala_rum</code>, <code>mandala_rum_url</code>). Aktivieren lädt OTel-Instrumente lazy.
      </div>
    </div>
  );
}

