import fs from 'fs';
import { parse } from 'yaml';
import Ajv from 'ajv';

const ajv = new Ajv();
const schemaRepo = {type:'object',required:['repo']};
const schemaFlow = {type:'object',required:['meta','nodes','flows']};

function check(file, schema){
  const data = parse(fs.readFileSync(file, 'utf8'));
  const validate = ajv.compile(schema);
  if (!validate(data)) {
    console.error(`${file} invalid`, validate.errors);
    process.exitCode = 1;
  } else {
    console.log(`${file} ok`);
  }
}

check('docs/maps/RepoMap.yaml', schemaRepo);
check('docs/maps/ProgramFlow.yaml', schemaFlow);
