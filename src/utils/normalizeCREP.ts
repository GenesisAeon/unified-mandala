type CREP = { coherence?:number; resonance?:number; emergence?:number; poetics?:number; score?:number } & Record<string,unknown>;
export function normalizeCREP(raw:any): {score:number, parts:Required<Omit<CREP,'score'>>} | undefined {
  if (!raw) return;
  const c = pickNum(raw.coherence ?? raw.C ?? raw.c);
  const r = pickNum(raw.resonance ?? raw.R ?? raw.r);
  const e = pickNum(raw.emergence ?? raw.E ?? raw.e);
  const p = pickNum(raw.poetics ?? raw.P ?? raw.p);
  const parts = { coherence: clamp(c), resonance: clamp(r), emergence: clamp(e), poetics: clamp(p) };
  const score = typeof raw.score === 'number' ? clamp(raw.score) :
    avg(Object.values(parts).filter(v=>typeof v==='number')) ?? undefined;
  if (score==null) return;
  return { score, parts: parts as any };
}
const clamp=(v?:number)=> typeof v==='number' ? Math.max(0,Math.min(1,v)) : undefined;
const avg=(arr:number[])=> arr.length? arr.reduce((a,b)=>a+b,0)/arr.length: undefined;
const pickNum=(v:any)=> typeof v==='number'?v: undefined;
