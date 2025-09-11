import React from "react";
// @ts-ignore
const data: any = (()=>{ try { return require("../../out/sigillin_index.json"); } catch { return {}; } })();
import { SigillinCard } from "../components/SigillinCard";

export default function SigillinIndexPanel(){
  const items=(data?.sigils??[]).slice(0,500);
  return (
    <div className="p-4 grid gap-3">
      {items.map((s:any)=>(
        <SigillinCard key={s.id} sigillin={s} />
      ))}
    </div>
  );
}
