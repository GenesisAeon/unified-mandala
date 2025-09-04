import { SigilMessage, nowIso } from "../../packages/sigil/protocols";

export function temperatureToSigil(celsius: number, src="era5"): SigilMessage {
  const severe = celsius >= 30 ? "high" : (celsius <= 0 ? "low" : "normal");
  const symbol = celsius >= 30 ? "🔥" : (celsius <= 0 ? "❄️" : "🌡️");
  return { symbol, intent: "assert", context: { metric: "t2m", celsius, severity: severe }, metadata: { source: src, timestamp: nowIso() } };
}

export function biodiversityToSigil(speciesCount: number, src="biodiv"): SigilMessage {
  const symbol = speciesCount >= 100 ? "🌿" : (speciesCount >= 40 ? "🍃" : "🦗");
  return { symbol, intent: "assert", context: { metric: "species", count: speciesCount }, metadata: { source: src, timestamp: nowIso() } };
}

export function wildfireToSigil(index01: number, src="wildfire"): SigilMessage {
  const clamped = Math.max(0, Math.min(1, index01));
  const symbol = clamped >= 0.7 ? "🔥" : (clamped >= 0.4 ? "⚠️" : "🟢");
  return { symbol, intent: "assert", context: { metric: "wildfire_risk", index: clamped }, metadata: { source: src, timestamp: nowIso() } };
}

export function groundwaterToSigil(deltaCm: number, src="groundwater"): SigilMessage {
  const symbol = deltaCm <= -30 ? "🧯" : (deltaCm <= -15 ? "🚰" : "💧");
  return { symbol, intent: "assert", context: { metric: "groundwater_delta_cm", delta: deltaCm }, metadata: { source: src, timestamp: nowIso() } };
}
