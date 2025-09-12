export type PromptFinding = { type: "conflict"|"missing_role"|"vagueness"; where: string; note: string };
export type PromptAdvice = { optimized: string; reasons: string[]; findings: PromptFinding[] };

export function heuristicOptimize(raw: string): PromptAdvice {
  const reasons: string[] = [];
  const findings: PromptFinding[] = [];
  let out = raw;

  if (!/^(system|role):/im.test(raw)) {
    reasons.push("Rolle/Systemkontext ergänzt");
    findings.push({ type: "missing_role", where: "top", note: "Keine Rolle definiert" });
    out = `system: Du bist ein präziser, ethischer Assistent.\n${out}`;
  }
  if (/sei kurz/i.test(raw) && /ausführlich/i.test(raw)) {
    reasons.push("Konflikt kurz vs. ausführlich aufgelöst");
    findings.push({ type: "conflict", where: "style", note: "Kurz & ausführlich" });
    out = out.replace(/ausführlich/ig, "prägnant aber vollständig");
  }
  if (!/Output: (`{3}|JSON|YAML)/i.test(raw)) {
    reasons.push("Explizites Output-Format hinzugefügt (JSON)");
    out += `\n\nOutput: JSON mit Feldern { "answer": string, "citations": string[] }`;
  }
  return { optimized: out, reasons, findings };
}

export async function maybeRemoteOptimize(raw: string, endpoint?: string, apiKey?: string): Promise<PromptAdvice|null> {
  const allow = process.env.ALLOW_NET === "1" && !!endpoint && !!apiKey;
  if (!allow) return null;
  const r = await fetch(endpoint!, {
    method: "POST",
    headers: { "content-type": "application/json", "authorization": `Bearer ${apiKey}` },
    body: JSON.stringify({ prompt: raw })
  });
  if (!r.ok) throw new Error(`optimizer HTTP ${r.status}`);
  const j = await r.json();
  return { optimized: j.optimized ?? raw, reasons: j.reasons ?? [], findings: j.findings ?? [] };
}
