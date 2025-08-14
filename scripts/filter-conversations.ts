#!/usr/bin/env ts-node
/**
 * scripts/filter-conversations.ts
 *
 * Utility to filter conversation JSON arrays by keyword.
 * Reads an input JSON file containing an array of conversation
 * objects and outputs only those entries whose content includes
 * the provided keyword.
 */

import fs from 'fs';
import path from 'path';

export interface FilterOptions {
  keyword: string;
  file: string;
}

export function filterConversations(options: FilterOptions) {
  const filePath = path.resolve(options.file);
  const raw = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw) as any[];
  return data.filter((entry) =>
    JSON.stringify(entry).toLowerCase().includes(options.keyword.toLowerCase()),
  );
}

if (require.main === module) {
  const [keyword, file] = process.argv.slice(2);
  if (!keyword || !file) {
    console.error('Usage: filter-conversations <keyword> <file>');
    process.exit(1);
  }
  const results = filterConversations({ keyword, file });
  console.log(JSON.stringify(results, null, 2));
}
