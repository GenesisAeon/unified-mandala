import fs from 'fs';
import path from 'path';
import glob from 'fast-glob';
import { normalizeCREP } from '../src/utils/normalizeCREP.js';
import { calculateMetrics, classifyEmergence } from '../src/utils/calculateMetrics.js';
import { safeParseSigilFile } from './lib/safeSigilParse.cjs';

const ROOTS=["docs/sigils/**/*.{yaml,yml,json,md}","data/sigils/**/*.jsonl"];
const errors=[]; let sigils=[];
for(const file of await glob(ROOTS,{dot:false,onlyFiles:true,unique:true})){
  const res=safeParseSigilFile(file);
  if(!res.ok){ continue; }
  const data=res.data||{};
  const id=data.id||path.basename(file).replace(path.extname(file),'');
  const title=data.title||data.name||id;
  const crep=normalizeCREP(data.crep??{score:data.score,C:data.C,R:data.R,E:data.E,P:data.P});
  sigils.push({id,name:title,crep,connections:data.connections||[],phase:data.phase,sourceId:data.sourceId});
}
const total=sigils.length;
sigils=sigils.map(s=>{
  const metrics=calculateMetrics(s,total);
  return {...s,metrics:{...metrics,class:classifyEmergence(metrics.emergencePotential??0)}};
});
sigils.sort((a,b)=>(b?.metrics?.emergencePotential??0)-(a?.metrics?.emergencePotential??0));
fs.mkdirSync('out',{recursive:true});
fs.writeFileSync('out/sigillin_index.json',JSON.stringify({sigils},null,2));
fs.writeFileSync('out/sigils_errors.json',JSON.stringify(errors,null,2));
if(process.env.SIGILS_STRICT==='true' && errors.length){
  console.error(`Sigil errors: ${errors.length}`); process.exit(1);
}
