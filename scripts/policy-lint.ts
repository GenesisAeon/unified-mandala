#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

function findPolicyFiles(base: string): string[] {
  const stack = [base];
  const files: string[] = [];
  while (stack.length) {
    const dir = stack.pop()!;
    if (!fs.existsSync(dir)) continue;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
      } else if (/\.(ya?ml|json)$/i.test(entry.name) && /(policy|permissions)/i.test(full)) {
        files.push(full);
      }
    }
  }
  return files;
}

function lintFile(file: string): string[] {
  const text = fs.readFileSync(file, 'utf8');
  let data: any;
  try {
    data = file.endsWith('.json') ? JSON.parse(text) : yaml.parse(text);
  } catch (err: any) {
    return [`failed to parse: ${err.message}`];
  }
  const errs: string[] = [];
  const walk = (node: any, loc: string) => {
    if (Array.isArray(node)) {
      node.forEach((v, i) => walk(v, `${loc}[${i}]`));
    } else if (node && typeof node === 'object') {
      for (const [k, v] of Object.entries(node)) {
        walk(v, `${loc}.${k}`);
      }
    } else if (node === '*') {
      errs.push(`wildcard '*' found at ${loc}`);
    }
  };
  walk(data, '');
  return errs;
}

function main() {
  const roots = ['governance', 'plugins', 'services'];
  const policyFiles = roots.flatMap(findPolicyFiles);
  if (policyFiles.length === 0) {
    console.log('No policy files found');
    return;
  }
  let hasError = false;
  for (const file of policyFiles) {
    const errs = lintFile(file);
    if (errs.length) {
      hasError = true;
      console.error(`Policy issues in ${file}:`);
      errs.forEach((e) => console.error(`  - ${e}`));
    }
  }
  if (hasError) {
    process.exit(1);
  } else {
    console.log(`All ${policyFiles.length} policy files passed baseline lint.`);
  }
}

if (require.main === module) {
  main();
}
