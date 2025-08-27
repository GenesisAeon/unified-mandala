import fs from "fs";
import path from "path";

export type DecisionRecord = {
  id: string;
  ts: string;
  actor: "human" | "agent" | "co";
  domain: string;
  context: Record<string, any>;
  expected: Record<string, number>;
  guardrails: Record<string, any>;
  action: Record<string, any>;
};

export type OutcomeRecord = {
  id: string;
  ts: string;
  observed: Record<string, number>;
  notes?: string;
};

const SINK = path.resolve(process.cwd(), "data/mrv/actions");

export function logDecision(d: DecisionRecord) {
  fs.mkdirSync(SINK, { recursive: true });
  const file = path.join(SINK, `${d.id}.decision.json`);
  fs.writeFileSync(file, JSON.stringify(d, null, 2));
  return file;
}

export function logOutcome(o: OutcomeRecord) {
  fs.mkdirSync(SINK, { recursive: true });
  const file = path.join(SINK, `${o.id}.outcome.json`);
  fs.writeFileSync(file, JSON.stringify(o, null, 2));
  return file;
}
