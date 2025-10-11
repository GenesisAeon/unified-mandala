import type { KpiConfig } from '../config/useClimateConfig';
// Adapters liegen im Repo-Root unter src/adapters/*
// Pfad aus UI: ../../../..
import { ERA5Adapter } from '../../../../src/adapters/era5';
import { PegelAdapter } from '../../../../src/adapters/pegel';

export type KpiValue = {
  id: string;
  value: number;
  status: 'ok' | 'warn' | 'alarm';
  unit?: string;
};

// sehr einfache Heuristiken für Demo/Light:
async function computeKpi(k: KpiConfig): Promise<KpiValue> {
  if (k.id === 't2m_anomaly') {
    const s = await ERA5Adapter.fetchSeries({});
    const lastK = s.points.at(-1)?.v ?? 285; // Kelvin
    const lastC = lastK - 273.15;
    const anomaly = lastC - 15; // Dummy-Baseline 15°C (nur Demo!)
    return score(k, anomaly);
  }
  if (k.id === 'underground_water') {
    const s = await PegelAdapter.fetchSeries({ station: 'KOLN' });
    const last = s.points.at(-1)?.v ?? 300; // cm
    const delta = last - 300; // Dummy-Nullpunkt 300 cm (nur Demo!)
    return score(k, delta);
  }
  if (k.id === 'wildfire_risk') {
    // Proxy über Temperatur-Anomalie → 0..1 (Dummy)
    const base = await computeKpi({
      id: 't2m_anomaly',
      label: '',
      threshold: 2,
      warn: 1,
      unit: '°C',
    });
    const idx = Math.max(0, Math.min(1, (base.value - 0) / 4)); // 0..~4°C → 0..1
    return score(k, idx);
  }
  // Fallback: 0
  return score(k, 0);
}

function score(k: KpiConfig, val: number): KpiValue {
  let status: 'ok' | 'warn' | 'alarm' = 'ok';
  if (val >= k.threshold) status = 'alarm';
  else if (val >= k.warn) status = 'warn';
  return { id: k.id, value: Number(val.toFixed(2)), status, unit: k.unit };
}

// Polling-Hook für React-Komponenten
export async function pollKpis(kpis: KpiConfig[]): Promise<KpiValue[]> {
  // parallel berechnen, aber leichtgewichtig
  return await Promise.all(kpis.map(computeKpi));
}
