import React, { useEffect, useState } from 'react';

export default function RumTopbarToggle() {
  const [on, setOn] = useState<boolean>(false);

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
      if (on) await api.disable?.();
      else await api.enable?.();
      const st = api.status?.();
      setOn(!!st?.enabled);
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`ml-auto rounded-full border px-3 py-1 text-xs ${on ? 'border-emerald-300 text-emerald-700 bg-emerald-50' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}
      title={on ? 'RUM enabled – click to disable' : 'RUM disabled – click to enable'}
    >
      RUM: {on ? 'on' : 'off'}
    </button>
  );
}

