import { readFileSync, readdirSync } from "fs";
import { join } from "path";

export type Query = { subject: "ai" | "river" | "forest" | "tree" | "org"; claims: string[]; context?: string };
export type Finding = { level: string; confidence: number; similar_cases: string[]; rationale: string };

function tfidfCosine(query: string, docs: { id: string; text: string }[]): { id: string; score: number }[] {
  const toks = (s: string) => s.toLowerCase().match(/[a-zäöüß0-9]+/gi) || [];
  const q = toks(query);
  const df: Record<string, number> = {};
  const corp = docs.map(d => {
    const tt = toks(d.text);
    const tf: Record<string, number> = {};
    tt.forEach(t => (tf[t] = (tf[t] || 0) + 1));
    Object.keys(tf).forEach(t => (df[t] = (df[t] || 0) + 1));
    return { id: d.id, tf, n: tt.length };
  });
  const N = corp.length || 1;
  const idf = (t: string) => Math.log((N + 1) / ((df[t] || 0) + 1));
  const qtf: Record<string, number> = {};
  q.forEach(t => (qtf[t] = (qtf[t] || 0) + 1));
  const qvec = Object.keys(qtf).map(t => ({ t, w: qtf[t] * idf(t) }));
  function dot(a: Record<string, number>, b: Record<string, number>) {
    let s = 0;
    for (const t of Object.keys(a)) if (b[t]) s += a[t] * b[t];
    return s;
  }
  function norm(a: Record<string, number>) {
    return Math.sqrt(dot(a, a));
  }
  return corp
    .map(d => {
      const w: Record<string, number> = {};
      for (const [t, f] of Object.entries(d.tf)) w[t] = f * idf(t);
      const score =
        dot(w, Object.fromEntries(qvec.map(x => [x.t, x.w]))) /
        ((norm(w) || 1) * (Math.sqrt(qvec.reduce((s, x) => s + x.w * x.w, 0)) || 1));
      return { id: d.id, score: isFinite(score) ? score : 0 };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}

export function analyze(query: Query): Finding {
  const casesDir = "data/personhood/cases";
  const files = readdirSync(casesDir).filter(f => f.endsWith(".md"));
  const docs = files.map(f => ({ id: f, text: readFileSync(join(casesDir, f), "utf8") }));
  const joined = [query.subject, ...query.claims, query.context || ""].join(" ");
  const sims = tfidfCosine(joined, docs);
  const topIds = sims.filter(x => x.score > 0.12).map(x => x.id);
  const level =
    query.subject === "river" || query.subject === "forest" || query.subject === "tree"
      ? "P1"
      : query.subject === "ai"
      ? "P2"
      : "P0";
  const confidence = Math.min(0.95, 0.4 + Math.min(0.4, sims[0]?.score || 0));
  return {
    level,
    confidence,
    similar_cases: topIds,
    rationale: `Selected by policy criteria & tfidf_cosine; top=${sims[0]?.id || "none"}`
  };
}
