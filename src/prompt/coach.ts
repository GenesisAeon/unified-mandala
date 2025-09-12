export type PromptFindingType = "conflict"|"missing_role"|"vagueness"|"missing_output";
export type PromptAdvice = {
  optimized: string;
  reasons: string[];
  findings: { type: PromptFindingType; where: string; note: string }[];
};

export function heuristicOptimize(raw: string): PromptAdvice {
  const reasons:string[] = [];
  const findings: PromptAdvice["findings"] = [];
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
  if (!/Output:\s*(```|JSON|YAML)/i.test(raw)) {
    reasons.push("Explizites Output-Format hinzugefügt (JSON)");
    findings.push({type:"missing_output", where:"end", note:"Output nicht spezifiziert"});
    out += `\n\nOutput: JSON mit Feldern { "answer": string, "citations": string[] }`;
  }
  return { optimized: out, reasons, findings };
}
