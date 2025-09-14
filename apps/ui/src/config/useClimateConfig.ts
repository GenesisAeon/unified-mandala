import { useMemo } from "react";
import YAML from "yaml";
// Vite: '?raw' importiert Datei als String
// Pfad via Alias: ~config → config/...
// @ts-ignore
import raw from "~config/climate-dashboard.yaml?raw";

export type KpiConfig = {
  id: string;
  label: string;
  threshold: number;
  warn: number;
  unit: string;
};
export type ClimateConfig = { kpis: KpiConfig[] };

export function useClimateConfig(): ClimateConfig {
  return useMemo(() => {
    try {
      const parsed = YAML.parse(String(raw)) as ClimateConfig;
      if (!parsed?.kpis?.length) throw new Error("missing kpis");
      return parsed;
    } catch (e) {
      console.error("Failed to parse climate-dashboard.yaml", e);
      return { kpis: [] };
    }
  }, []);
}
