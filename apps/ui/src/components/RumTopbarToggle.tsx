import React, { useEffect, useRef, useState } from 'react';
import { getGrafanaBaseUrl, openGrafanaExplore, isGrafanaUrlValid } from '../lib/grafana';
import { openRUMSettings, onGrafanaValidity } from '../lib/uiBus';

export default function RumTopbarToggle() {
  const [on, setOn] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);
  const [pulse, setPulse] = useState(false);
  const pulseTimer = useRef<number | null>(null);

  function showTopbarToast(msg: string) {
    setToast(msg);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2000) as unknown as number;
  }

  useEffect(() => {
    try {
      const st = (window as any).__rum?.status?.();
      if (st) setOn(!!st.enabled);
    } catch {}
  }, []);

  async function toggle() {
    try {
      const api = (window as any).__rum;
      if (!api) return;
      if (on) {
        await api.disable?.();
        showTopbarToast('RUM deaktiviert');
      } else {
        await api.enable?.();
        showTopbarToast('RUM aktiviert');
      }
      const st = api.status?.();
      setOn(!!st?.enabled);
    } catch {}
  }

  useEffect(() => {
    const off = onGrafanaValidity((v) => {
      showTopbarToast(v ? 'Explore aktiviert' : 'Explore deaktiviert');
      if (v) {
        setPulse(true);
        if (pulseTimer.current) window.clearTimeout(pulseTimer.current);
        pulseTimer.current = window.setTimeout(() => setPulse(false), 1200) as unknown as number;
      }
    });
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
      if (pulseTimer.current) window.clearTimeout(pulseTimer.current);
      off?.();
    };
  }, []);

  return (
    <div className="ml-auto relative flex items-center gap-2">
      {(() => {
        const canOpenGrafana = isGrafanaUrlValid(getGrafanaBaseUrl());
        return (
          <button
            type="button"
            onClick={() => openGrafanaExplore('service.name = "mandala-ui"')}
            className={`rounded-xl border px-3 py-1 text-sm ${canOpenGrafana ? '' : 'opacity-50 cursor-not-allowed'} ${pulse ? 'ring-2 ring-emerald-300' : ''}`}
            title={
              canOpenGrafana
                ? 'Open Grafana Explore (Tempo) mit TraceQL: service.name="mandala-ui"'
                : 'Grafana URL ungültig – stelle sie in Settings → RUM ein'
            }
            disabled={!canOpenGrafana}
          >
            Explore
          </button>
        );
      })()}
      {(() => {
        const canOpenGrafana = isGrafanaUrlValid(getGrafanaBaseUrl());
        if (canOpenGrafana) return null;
        return (
          <button
            type="button"
            className="rounded-xl border px-2 py-1 text-xs"
            title="Settings → RUM öffnen"
            onClick={openRUMSettings}
          >
            open settings
          </button>
        );
      })()}
      <button
        type="button"
        onClick={toggle}
        className={`rounded-full border px-3 py-1 text-xs ${on ? 'border-emerald-300 text-emerald-700 bg-emerald-50' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}
        title={on ? 'RUM enabled - click to disable' : 'RUM disabled - click to enable'}
      >
        RUM: {on ? 'on' : 'off'}
      </button>
      {/* inline toast (styling aligned with Settings toast) */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none transition-all duration-200 absolute top-full right-0 mt-1 opacity-100 translate-y-0"
        >
          <div className="pointer-events-auto rounded-xl bg-slate-900/90 text-white text-xs px-3 py-2 shadow-lg backdrop-blur">
            {toast}
            <button
              type="button"
              className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded hover:bg-white/10"
              onClick={() => setToast(null)}
              aria-label="Hinweis schließen"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
