import React from "react";
// @ts-ignore
const data: any = (()=>{ try { return require("../../out/sigillin_index.json"); } catch { return {}; } })();
import { CREPBadge } from "../components/CREPBadge";

export default function SigillinIndexPanel(){
  const items=(data?.sigils??[]).slice(0,500);
  return (
    <div className="p-4 grid gap-3">
      {items.map((s:any)=>(
        <div key={s.id} className="border rounded p-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{s.name || s.id}</h3>
            {s.crep?.score!=null && <CREPBadge value={s.crep.score}/>} 
          </div>
          <pre className="text-xs opacity-70 overflow-auto">{JSON.stringify(s.connections??[],null,2)}</pre>
        </div>
      ))}
    </div>
  );
}
