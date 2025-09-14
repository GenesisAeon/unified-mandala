import { useEffect, useState } from "react";
import type { KpiConfig } from "../config/useClimateConfig";
import { pollKpis, type KpiValue } from "../services/kpi-engine";
import YAML from "yaml";
import SigilBadge from "./SigilBadge";
import CrepResonanceCard from "./CrepResonanceCard";
// @ts-ignore
import raw from "~config/climate-dashboard.yaml?raw";
const vizCfg = (() => { try { return YAML.parse(String(raw))?.visualization || {}; } catch { return {}; } })();

const BASE_POLL_MS = Number((import.meta as any)?.env?.VITE_KPI_POLL_MS ?? 10000);

function Badge({ status }: { status: KpiValue["status"] }) {
  const color = status === "alarm" ? "#c62828" : status === "warn" ? "#ef6c00" : "#2e7d32";
  const label = status === "alarm" ? "ALARM" : status === "warn" ? "WARN" : "OK";
  return (
    <span style={{ background: color, color: "#fff", padding: "2px 6px", borderRadius: 6, fontSize: 12 }}>
      {label}
    </span>
  );
}

function KpiCard({ cfg, val }: { cfg: KpiConfig; val?: KpiValue }) {
  const sigKey = `__LAST_${cfg.id.toUpperCase()}_SIGIL__`;
  const sigil = (window as any)[sigKey] as string | undefined;
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 12,
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 8
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 600 }}>{cfg.label}</div>
        {val && <Badge status={val.status} />}
      </div>
      <div style={{ fontSize: 24, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
        {val ? `${val.value} ${cfg.unit}` : "…"}
        {vizCfg.show_sigils && <SigilBadge sigil={sigil} map={vizCfg.sigil_mapping} />}
      </div>
      <div style={{ fontSize: 12, color: "#555" }}>
        Warn: {cfg.warn} · Alarm: {cfg.threshold} {cfg.unit}
      </div>
    </div>
  );
}

export default function KpiBoard({ kpis }: { kpis: KpiConfig[] }) {
  const [values, setValues] = useState<Record<string, KpiValue>>({});
  useEffect(() => {
    let stop = false;
    async function tick() {
      try {
        const vals = await pollKpis(kpis);
        if (stop) return;
        const map: Record<string, KpiValue> = {};
        for (const v of vals) map[v.id] = v;
        setValues(map);
      } catch (e) {
        console.error("KPI poll error", e);
      }
    }
    tick();
    const poll = () => Math.round(BASE_POLL_MS * ((window as any).__MANDALA_THROTTLE__ || 1));
    const id = setInterval(tick, poll());
    return () => {
      stop = true;
      clearInterval(id);
    };
  }, [JSON.stringify(kpis)]);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 12 }}>
      {kpis.map(k =>
        k.id === "crep_resonance" ? (
          <CrepResonanceCard key={k.id} />
        ) : (
          <KpiCard key={k.id} cfg={k} val={values[k.id]} />
        )
      )}
    </div>
  );
}
