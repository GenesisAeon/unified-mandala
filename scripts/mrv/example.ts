import { logDecision, logOutcome } from "./action-log";

const id = "DEC-2025-08-27-001";

logDecision({
  id, ts: new Date().toISOString(),
  actor: "co",
  domain: "hydro",
  context: { region: "Rheinland/Köln", reason: "HeavyRain Watch" },
  expected: { cso_overflow_minutes: -20, lead_time_hours: 12 },
  guardrails: {
    max_daily_change_pct: 10,
    hard_caps: { reservoir_level_pct: [15, 95] }
  },
  action: { cso_setpoint_shift_pct: +5, valid_hours: 12 }
});

setTimeout(() => {
  logOutcome({
    id, ts: new Date().toISOString(),
    observed: { cso_overflow_minutes: -18, lead_time_hours: 11 },
    notes: "Kein Abort; Nebenwirkung: 0 Beschwerden"
  });
}, 1000);
