import fs from "fs"; import path from "path";
type Rec = { ts:string; agent:string; ok:boolean; duration_ms:number; error?:string|null };
function q(arr:number[], p:number){ if(arr.length===0) return 0; const s=[...arr].sort((a,b)=>a-b); const i=Math.floor((s.length-1)*p); return s[i]; }
const dir = path.resolve(process.cwd(), "data/agents/metrics");
if (!fs.existsSync(dir)) { console.log(JSON.stringify({agents:[]},null,2)); process.exit(0); }
const files = fs.readdirSync(dir).filter(f=>f.endsWith(".jsonl"));
const out:any[] = [];
for (const f of files) {
  const lines = fs.readFileSync(path.join(dir,f),"utf8").trim().split("\n").filter(Boolean);
  const recs:Rec[] = lines.map(l=>JSON.parse(l));
  const ok = recs.filter(r=>r.ok).length;
  const fail = recs.length - ok;
  const dur = recs.map(r=>r.duration_ms||0);
  out.push({ agent: recs[0]?.agent || f.replace(/\.jsonl$/,""), count: recs.length, ok, fail, p50: q(dur,0.5), p95: q(dur,0.95) });
}
console.log(JSON.stringify({ agents: out }, null, 2));
