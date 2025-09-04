import { useClimateConfig } from "../config/useClimateConfig";
import KpiBoard from "../components/KpiBoard";
import OpsPanel from "../components/OpsPanel";

export default function App() {
  const cfg = useClimateConfig();
  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ margin: "8px 0 16px" }}>Mandala Climate Dashboard</h1>
      <h2 style={{ margin: "0 0 8px", fontSize: 16, color: "#333" }}>KPIs (live, aus Config)</h2>
      <OpsPanel />
      <KpiBoard kpis={cfg.kpis} />
    </div>
  );
}
