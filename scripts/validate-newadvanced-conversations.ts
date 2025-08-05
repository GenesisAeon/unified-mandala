#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';

export interface ValidationResult {
  conversationCount: number;
  duplicateIds: string[];
  duplicateTitles: string[];
  missingFields: { index: number; fields: string[] }[];
  outOfOrderConversations: number[];
}

export function validateNewAdvancedConversations(filePath: string): ValidationResult {
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const seenIds = new Set<string>();
  const seenTitles = new Set<string>();
  const duplicateIds: string[] = [];
  const duplicateTitles: string[] = [];
  const missingFields: { index: number; fields: string[] }[] = [];
  const outOfOrder: number[] = [];

  raw.forEach((conv: any, idx: number) => {
    const missing: string[] = [];
    if (!conv.id) missing.push('id');
    if (!conv.title) missing.push('title');
    if (typeof conv.mapping !== 'object') missing.push('mapping');
    if (missing.length) missingFields.push({ index: idx, fields: missing });
    if (conv.id) {
      if (seenIds.has(conv.id)) duplicateIds.push(conv.id);
      else seenIds.add(conv.id);
    }
    if (conv.title) {
      if (seenTitles.has(conv.title)) duplicateTitles.push(conv.title);
      else seenTitles.add(conv.title);
    }

    const times = Object.values(conv.mapping || {})
      .map((n: any) => n?.message?.create_time)
      .filter((t: any): t is number => typeof t === 'number');
    for (let i = 1; i < times.length; i++) {
      if (times[i] < times[i - 1]) {
        outOfOrder.push(idx);
        break;
      }
    }
  });

  return {
    conversationCount: raw.length,
    duplicateIds,
    duplicateTitles,
    missingFields,
    outOfOrderConversations: outOfOrder,
  };
}

if (require.main === module) {
  const file = process.argv[2] || path.join(__dirname, '../docs/sigils/newadvancedconversations.json');
  const result = validateNewAdvancedConversations(file);
  if (
    result.duplicateIds.length ||
    result.duplicateTitles.length ||
    result.missingFields.length ||
    result.outOfOrderConversations.length
  ) {
    console.error('Validation issues found:\n', JSON.stringify(result, null, 2));
    process.exit(1);
  }
  console.log(`Validated ${result.conversationCount} conversations.`);
}
