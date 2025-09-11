import fs from 'fs';
import glob from 'fast-glob';
import YAML from 'yaml';

const ROOTS=["docs/sigils/**/*.{yaml,yml,json,md}","data/sigils/**/*.jsonl"];

async function main(){
  const errors: any[]=[];
  const files=await glob(ROOTS,{dot:false,onlyFiles:true,unique:true});
  for(const file of files){
    try{
      const content=fs.readFileSync(file,'utf8');
      if(file.endsWith('.json')||file.endsWith('.jsonl')){
        JSON.parse(file.endsWith('.jsonl')?content.split('\n').filter(Boolean)[0]:content);
      }else if(file.endsWith('.yaml')||file.endsWith('.yml')){
        YAML.parse(content);
      }else if(file.endsWith('.md')){
        if(content.startsWith('---')) YAML.parse(content.split('---')[1]);
      }
    }catch(err){
      errors.push({file,message:String(err)});
    }
  }
  fs.mkdirSync('out',{recursive:true});
  fs.writeFileSync('out/sigils_errors.json',JSON.stringify(errors,null,2));
  fs.writeFileSync('out/sigils_errors_classified.json',JSON.stringify(errors.map(e=>({...e,type:'parse_error'})),null,2));
}

main();
