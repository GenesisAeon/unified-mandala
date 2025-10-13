import React, { useEffect, useRef, useState } from 'react';
import { getGrafanaBaseUrl, isGrafanaUrlValid } from '../lib/grafana';
import { announceGrafanaValidity } from '../lib/uiBus';

export default function SettingsRUM() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  // Inline toast state
  const [toastMsg, setToastMsg] = useState<string>('');
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<number | null>(null);

  function showToast(msg: string, ms = 2600) {
    setToastMsg(msg);
    setToastVisible(true);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastVisible(false), ms) as unknown as number;
  }
  const [enabled, setEnabled] = useState<boolean>(false);
  const [url, setUrl] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [grafanaUrl, setGrafanaUrl] = useState<string>(() => {
    try {
      const ls = typeof window !== 'undefined' ? localStorage.getItem('mandala_grafana_url') : null;
      return (
        ls || ((import.meta as any)?.env?.VITE_GRAFANA_URL as string) || 'http://localhost:3000'
      );
    } catch {
      return 'http://localhost:3000';
    }
  });
  const [grafanaValid, setGrafanaValid] = useState<boolean>(() => isGrafanaUrlValid(grafanaUrl));

  function validateGrafana(u: string) {
    const ok = isGrafanaUrlValid(u);
    setGrafanaValid(ok);
    return ok;
  }

  function normalizeGrafanaUrl(u: string) {
    try {
      return new URL(u).toString().replace(/\/+$/, '');
    } catch {
      return u.trim().replace(/\/+$/, '');
    }
  }

  function normalizeCollectorUrl(u: string) {
    try {
      return new URL(u).toString().replace(/\/+$/, '');
    } catch {
      return u.trim().replace(/\/+$/, '');
    }
  }

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

  useEffect(() => {
    const onOpen = () => {
      try {
        rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const input = document.getElementById('rum-url-input') as HTMLInputElement | null;
        input?.focus();
        showToast('Hier kannst du die Grafana Explore-URL einstellen.');
      } catch {}
    };
    window.addEventListener('open-settings:rum', onOpen);
    return () => {
      window.removeEventListener('open-settings:rum', onOpen);
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      id="settings-rum"
      className="relative rounded-2xl border p-3 md:p-4 bg-white shadow-sm"
    >
      {/* inline toast */}
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-none transition-all duration-200 ${
          toastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
        } absolute -top-3 right-0`}
      >
        <div className="pointer-events-auto rounded-xl bg-slate-900/90 text-white text-xs px-3 py-2 shadow-lg backdrop-blur">
          {toastMsg}
          <button
            type="button"
            className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded hover:bg-white/10"
            onClick={() => setToastVisible(false)}
            aria-label="Hinweis schließen"
          >
            ✕
          </button>
        </div>
      </div>
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
          id="rum-collector-url"
          className="rounded-xl border p-2 text-sm"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onBlur={() => {
            const candidate = url?.trim();
            if (!candidate) return;
            let valid = false;
            try {
              // Basic URL validation
              // eslint-disable-next-line no-new
              new URL(candidate);
              valid = true;
            } catch {
              valid = false;
            }
            if (valid) {
              const normalized = normalizeCollectorUrl(candidate);
              setUrl(normalized);
              try {
                localStorage.setItem('mandala_rum_url', normalized);
              } catch {}
              try {
                (window as any).__rum?.setCollectorUrl?.(normalized);
              } catch {}
              showToast('Gespeichert ✓');
            }
          }}
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

      <div className="mt-4 grid gap-2">
        <label className="text-sm font-medium text-slate-700">Grafana URL (Explore)</label>
        <input
          id="rum-url-input"
          className={`rounded-xl border p-2 ${grafanaValid ? 'border-slate-300' : 'border-red-400 ring-1 ring-red-200'}`}
          value={grafanaUrl}
          onChange={(e) => {
            const v = e.target.value;
            setGrafanaUrl(v);
            validateGrafana(v);
          }}
          onFocus={() => showToast('Hier kannst du die Grafana Explore-URL einstellen.')}
          onBlur={() => {
            const beforeValid = isGrafanaUrlValid(getGrafanaBaseUrl());
            const candidate = grafanaUrl?.trim();
            if (!candidate) return;
            let valid = false;
            try {
              // eslint-disable-next-line no-new
              new URL(candidate);
              valid = true;
            } catch {
              valid = false;
            }
            if (valid) {
              const normalized = normalizeGrafanaUrl(candidate);
              setGrafanaUrl(normalized);
              try {
                localStorage.setItem('mandala_grafana_url', normalized);
              } catch {}
              validateGrafana(normalized);
              showToast('Gespeichert ✓');
            }
            const afterValid = isGrafanaUrlValid(getGrafanaBaseUrl());
            if (afterValid !== beforeValid) {
              announceGrafanaValidity(afterValid);
              showToast(afterValid ? 'Explore aktiviert' : 'Explore deaktiviert');
            }
          }}
          placeholder="http://localhost:3000"
        />
        <p className={`text-xs ${grafanaValid ? 'text-slate-500' : 'text-red-600'}`} role="note">
          {grafanaValid
            ? 'Wird für Open in Grafana verwendet.'
            : 'Bitte http(s):// angeben (z. B. http://localhost:3000)'}
        </p>
      </div>
    </div>
  );
}
