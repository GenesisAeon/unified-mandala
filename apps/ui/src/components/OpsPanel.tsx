import { useEffect, useState } from 'react';

type Health = {
  cpu_process_pct: number;
  mem_system_pct: number;
  mem_process_mb: number;
  cores: number;
  uptime_s: number;
  advice: 'normal' | 'degrade' | 'pause';
};

export default function OpsPanel() {
  const [h, setH] = useState<Health | null>(null);
  useEffect(() => {
    let stop = false;
    async function tick() {
      try {
        const r = await fetch('/api/ops/health');
        if (!r.ok) return;
        const j = await r.json();
        if (j?.ok && !stop) setH(j.data);
        // sanfte Drossel nach Advice: 1.0 (normal) · 1.5 (degrade) · 2.5 (pause)
        const factor =
          j?.data?.advice === 'pause' ? 2.5 : j?.data?.advice === 'degrade' ? 1.5 : 1.0;
        (window as any).__MANDALA_THROTTLE__ = factor;
      } catch {}
    }
    tick();
    const id = setInterval(tick, 8000);
    return () => {
      stop = true;
      clearInterval(id);
    };
  }, []);

  const badge = (h?.advice ?? 'normal').toUpperCase();
  const color = !h
    ? '#888'
    : h.advice === 'pause'
      ? '#c62828'
      : h.advice === 'degrade'
        ? '#ef6c00'
        : '#2e7d32';

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', margin: '8px 0 16px' }}>
      <span
        style={{
          background: color,
          color: '#fff',
          padding: '3px 8px',
          borderRadius: 6,
          fontSize: 12,
        }}
      >
        SYSTEM: {badge}
      </span>
      <small>
        CPU(proc): {h?.cpu_process_pct ?? '…'}% · RAM(sys): {h?.mem_system_pct ?? '…'}% · RAM(app):{' '}
        {h?.mem_process_mb ?? '…'} MB
      </small>
    </div>
  );
}
