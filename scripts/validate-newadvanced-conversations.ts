#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';

export interface ValidationResult {
  conversationCount: number;
  duplicateIds: string[];
  missingFields: { index: number; fields: string[] }[];
}

export function validateNewAdvancedConversations(filePath: string): ValidationResult {
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const seen = new Set<string>();
  const duplicateIds: string[] = [];
  const missingFields: { index: number; fields: string[] }[] = [];

  raw.forEach((conv: any, idx: number) => {
    const missing: string[] = [];
    if (!conv.id) missing.push('id');
    if (!conv.title) missing.push('title');
    if (typeof conv.mapping !== 'object') missing.push('mapping');
    if (missing.length) missingFields.push({ index: idx, fields: missing });
    if (conv.id) {
      if (seen.has(conv.id)) duplicateIds.push(conv.id);
      else seen.add(conv.id);
    }
  });

  return { conversationCount: raw.length, duplicateIds, missingFields };
}

if (require.main === module) {
  const file = process.argv[2] || path.join(__dirname, '../docs/sigils/newadvancedconversations.json');
  const result = validateNewAdvancedConversations(file);
  if (result.duplicateIds.length || result.missingFields.length) {
    console.error('Validation issues found:\n', JSON.stringify(result, null, 2));
    process.exit(1);
  }
  console.log(`Validated ${result.conversationCount} conversations.`);
}
