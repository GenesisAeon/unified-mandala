import React from "react";
type Props={ value:number, size?:'sm'|'md'|'lg' }
export const CREPBadge:React.FC<Props>=({value,size='md'})=>{
  const pct=Math.round(value*100);
  return <span aria-label={`CREP ${pct}%`} className={`inline-flex rounded-full px-2 py-0.5 text-white ${pct>80?'bg-green-600':pct>60?'bg-amber-600':'bg-rose-600'}`}>{pct}%</span>;
};
