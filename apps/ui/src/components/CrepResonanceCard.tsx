import { useEffect, useState } from "react";
import SigilBadge from "./SigilBadge";

type TraceItem = { symbol: string; intent?: "query" | "assert" | "ritual"; ts?: string };
type Resp = { ok: boolean; data: { value: number; unit: string; sigil: string; n: number; trace?: TraceItem[] } };

function colorFor(v: number) {
  return v >= 0.8 ? "#2e7d32" : v >= 0.5 ? "#ef6c00" : "#c62828";
}

export default function CrepResonanceCard() {
  const [val, setVal] = useState<number>(0);
  const [sig, setSig] = useState<string>("🌀");
  const [trace, setTrace] = useState<TraceItem[]>([]);
  const [open, setOpen] = useState(false);

  async function fetchRes() {
    const r = await fetch("/api/crep/resonance?trace=1");
    if (!r.ok) return;
    const j: Resp = await r.json();
    setVal(j.data.value);
    setSig(j.data.sigil);
    setTrace(j.data.trace || []);
    (window as any).__LAST_CREP_RESONANCE_SIGIL__ = j.data.sigil;
  }

  useEffect(() => {
    fetchRes();
    const id = setInterval(fetchRes, 8000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ border: "1px solid #eee", borderRadius: 10, padding: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            background: colorFor(val),
            color: "#fff",
            padding: "4px 10px",
            borderRadius: 8,
            fontWeight: 600
          }}
        >
          CREP Resonanz
        </div>
        <SigilBadge sigil={sig} />
        <span style={{ fontVariantNumeric: "tabular-nums" }}>{val.toFixed(2)}</span>
        <button
          onClick={() => setOpen(true)}
          style={{ marginLeft: "auto", padding: "4px 8px", borderRadius: 6, border: "1px solid #ddd" }}
        >
          Details
        </button>
      </div>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "grid", placeItems: "center" }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 16,
              width: "min(560px, 92vw)",
              maxHeight: "80vh",
              overflow: "auto",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>Sigil-Trace (letzte {trace.length})</h3>
              <button onClick={() => setOpen(false)} style={{ marginLeft: "auto" }}>
                ✖
              </button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
              {trace.map((t, i) => (
                <span
                  key={i}
                  title={`${t.intent || ""} ${t.ts || ""}`}
                  style={{ padding: "2px 6px", border: "1px solid #eee", borderRadius: 8 }}
                >
                  {t.symbol}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
