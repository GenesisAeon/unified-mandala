export type PromptFinding = { type: "conflict"|"missing_role"|"vagueness"; where: string; note: string };
export type PromptAdvice = { optimized: string; reasons: string[]; findings: PromptFinding[] };

export function heuristicOptimize(raw: string): PromptAdvice {
  const reasons: string[] = [];
  const findings: PromptFinding[] = [];
  let out = raw;

  if (!/^(system|role)\s*:/im.test(raw)) {
    reasons.push("Rolle/Systemkontext ergänzt");
    findings.push({type:"missing_role", where:"top", note:"Keine Rolle definiert"});
    out = `system: Du bist ein präziser, ethischer Assistent.\n${out}`;
  }
  if (/sei kurz/i.test(raw) && /ausführlich/i.test(raw)) {
    reasons.push("Konflikt kurz vs. ausführlich aufgelöst");
    findings.push({type:"conflict", where:"style", note:"Kurz & ausführlich"});
    out = out.replace(/ausführlich/ig, "prägnant aber vollständig");
  }
  if (!/Output:\s+(`{3}|JSON|YAML)/i.test(raw)) {
    reasons.push("Explizites Output-Format hinzugefügt (JSON)");
    out += `\n\nOutput: JSON mit Feldern { "answer": string, "citations": string[] }`;
  }
  return { optimized: out, reasons, findings };
}
