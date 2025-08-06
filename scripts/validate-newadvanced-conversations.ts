#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';

export interface ValidationResult {
  conversationCount: number;
  duplicateIds: string[];
  duplicateTitles: string[];
  missingFields: { index: number; fields: string[] }[];
  outOfOrderConversations: number[];
  invalidTimestamps: number[];
  conversationsWithInvalidRoles: number[];
  conversationsMissingRoot: number[];
  conversationsWithMissingParents: number[];
  conversationsWithMismatchedNodeIds: number[];
  conversationsWithParentCycles: number[];
  conversationsWithInvalidChildRefs: number[];
  conversationsWithUnlistedChildren: number[];
  conversationsWithOrphanNodes: number[];
  conversationsWithUnreachableNodes: number[];
  conversationsWithEmptyMessages: number[];
  conversationsWithMissingMessages: number[];
  conversationsWithDuplicateChildIds: number[];
  conversationsWithMissingMessageIds: number[];
  conversationsWithMessagesMissingTimestamps: number[];
  conversationsWithInvalidMessageTimestamps: number[];
  conversationsWithInvalidContentParts: number[];
}

export function validateNewAdvancedConversations(filePath: string): ValidationResult {
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const seenIds = new Set<string>();
  const seenTitles = new Set<string>();
  const duplicateIds: string[] = [];
  const duplicateTitles: string[] = [];
  const missingFields: { index: number; fields: string[] }[] = [];
  const outOfOrder: number[] = [];
  const invalidTimestamps: number[] = [];
  const invalidRoles: number[] = [];
  const missingRoot: number[] = [];
  const missingParents: number[] = [];
  const mismatchedNodeIds: number[] = [];
  const parentCycles: number[] = [];
  const invalidChildren: number[] = [];
  const unlistedChildren: number[] = [];
  const orphanNodes: number[] = [];
  const unreachableNodes: number[] = [];
  const emptyMessages: number[] = [];
  const missingMessages: number[] = [];
  const duplicateChildIds: number[] = [];
  const missingMessageIds: number[] = [];
  const messagesMissingTimestamps: number[] = [];
  const invalidMessageTimestamps: number[] = [];
  const invalidContentParts: number[] = [];

  raw.forEach((conv: any, idx: number) => {
    const missing: string[] = [];
    if (!conv.id) missing.push('id');
    if (!conv.title) missing.push('title');
    if (typeof conv.mapping !== 'object') missing.push('mapping');
    if (typeof conv.create_time !== 'number') missing.push('create_time');
    if (typeof conv.update_time !== 'number') missing.push('update_time');
    if (
      typeof conv.create_time === 'number' &&
      typeof conv.update_time === 'number' &&
      conv.update_time < conv.create_time
    ) {
      invalidTimestamps.push(idx);
    }
    if (missing.length) missingFields.push({ index: idx, fields: missing });
    if (conv.id) {
      if (seenIds.has(conv.id)) duplicateIds.push(conv.id);
      else seenIds.add(conv.id);
    }
    if (conv.title) {
      const key = conv.title.toLowerCase();
      if (seenTitles.has(key)) duplicateTitles.push(conv.title);
      else seenTitles.add(key);
    }

    const nodes = Object.values(conv.mapping || {});
    const times = nodes
      .map((n: any) => n?.message?.create_time)
      .filter((t: any): t is number => typeof t === 'number');
    for (let i = 1; i < times.length; i++) {
      if (times[i] < times[i - 1]) {
        outOfOrder.push(idx);
        break;
      }
    }

    const roles = nodes
      .map((n: any) => n?.message?.author?.role)
      .filter((r: any): r is string => typeof r === 'string');
    if (roles.some((r) => !['system', 'user', 'assistant'].includes(r))) {
      invalidRoles.push(idx);
    }

    for (const [key, node] of Object.entries(conv.mapping || {}) as [string, any][]) {
      if (key !== 'client-created-root' && !node.message) {
        missingMessages.push(idx);
        break;
      }
      if (key !== 'client-created-root' && node.message && typeof node.message.id !== 'string') {
        missingMessageIds.push(idx);
        break;
      }
      if (node.id && node.id !== key) {
        mismatchedNodeIds.push(idx);
        break;
      }
      if (node.parent && !conv.mapping[node.parent]) {
        missingParents.push(idx);
        break;
      }
      if ((node.parent === null || node.parent === undefined) && key !== 'client-created-root') {
        orphanNodes.push(idx);
        break;
      }

      // Detect cyclic parent references
      const visited = new Set<string>([key]);
      let current = node.parent;
      while (current) {
        if (visited.has(current)) {
          parentCycles.push(idx);
          current = null;
          break;
        }
        visited.add(current);
        const parentNode = conv.mapping[current];
        current = parentNode ? parentNode.parent : null;
      }
      if (parentCycles.includes(idx)) break;

      if (node.parent) {
        const parent = conv.mapping[node.parent];
        if (
          parent &&
          Array.isArray(parent.children) &&
          !parent.children.includes(key)
        ) {
          unlistedChildren.push(idx);
          break;
        }
      }

      if (Array.isArray(node.children)) {
        let childInvalid = false;
        let duplicateChild = false;
        const seenChildren = new Set<string>();
        for (const childId of node.children) {
          if (seenChildren.has(childId)) {
            duplicateChild = true;
            break;
          }
          seenChildren.add(childId);
          const child = conv.mapping[childId];
          if (!child || child.parent !== key) {
            childInvalid = true;
            break;
          }
        }
        if (childInvalid) {
          invalidChildren.push(idx);
        }
        if (duplicateChild) {
          duplicateChildIds.push(idx);
        }
      }
      if (key !== 'client-created-root' && node.message) {
        const m = node.message;
        if (
          typeof m.create_time !== 'number' ||
          typeof m.update_time !== 'number'
        ) {
          messagesMissingTimestamps.push(idx);
          break;
        }
        if (m.update_time < m.create_time) {
          invalidMessageTimestamps.push(idx);
          break;
        }
      }
    }

    if (
      nodes.some((n: any) => {
        const parts = n?.message?.content?.parts;
        return !parts || parts.length === 0 || parts.every((p: any) => typeof p === 'string' && p.trim() === '');
      })
    ) {
      emptyMessages.push(idx);
    }

    if (
      nodes.some((n: any) => {
        const parts = n?.message?.content?.parts;
        return Array.isArray(parts) && parts.some((p: any) => typeof p !== 'string');
      })
    ) {
      invalidContentParts.push(idx);
    }

    const root = conv.mapping?.['client-created-root'];
    if (!root || root.parent !== null) {
      missingRoot.push(idx);
    } else {
      const visited = new Set<string>();
      const stack = ['client-created-root'];
      while (stack.length) {
        const id = stack.pop()!;
        if (visited.has(id)) continue;
        visited.add(id);
        const node = conv.mapping[id];
        if (Array.isArray(node?.children)) {
          for (const childId of node.children) {
            stack.push(childId);
          }
        }
      }
      if (visited.size !== Object.keys(conv.mapping || {}).length) {
        unreachableNodes.push(idx);
      }
    }
  });

  return {
    conversationCount: raw.length,
    duplicateIds,
    duplicateTitles,
    missingFields,
    outOfOrderConversations: outOfOrder,
    invalidTimestamps,
    conversationsWithInvalidRoles: invalidRoles,
    conversationsMissingRoot: missingRoot,
    conversationsWithMissingParents: missingParents,
    conversationsWithMismatchedNodeIds: mismatchedNodeIds,
    conversationsWithParentCycles: parentCycles,
    conversationsWithInvalidChildRefs: invalidChildren,
    conversationsWithUnlistedChildren: unlistedChildren,
    conversationsWithOrphanNodes: orphanNodes,
    conversationsWithUnreachableNodes: unreachableNodes,
    conversationsWithEmptyMessages: emptyMessages,
    conversationsWithMissingMessages: missingMessages,
    conversationsWithDuplicateChildIds: duplicateChildIds,
    conversationsWithMissingMessageIds: missingMessageIds,
    conversationsWithMessagesMissingTimestamps: messagesMissingTimestamps,
    conversationsWithInvalidMessageTimestamps: invalidMessageTimestamps,
    conversationsWithInvalidContentParts: invalidContentParts,
  };
}

if (require.main === module) {
  const file = process.argv[2] || path.join(__dirname, '../docs/sigils/newadvancedconversations.json');
  const result = validateNewAdvancedConversations(file);
  if (
    result.duplicateIds.length ||
    result.duplicateTitles.length ||
    result.missingFields.length ||
    result.outOfOrderConversations.length ||
    result.invalidTimestamps.length ||
    result.conversationsMissingRoot.length ||
    result.conversationsWithMissingParents.length ||
    result.conversationsWithMismatchedNodeIds.length ||
    result.conversationsWithParentCycles.length ||
    result.conversationsWithInvalidChildRefs.length ||
    result.conversationsWithUnlistedChildren.length ||
    result.conversationsWithOrphanNodes.length ||
    result.conversationsWithUnreachableNodes.length ||
    result.conversationsWithEmptyMessages.length ||
    result.conversationsWithMissingMessages.length ||
    result.conversationsWithDuplicateChildIds.length ||
    result.conversationsWithMissingMessageIds.length ||
    result.conversationsWithMessagesMissingTimestamps.length ||
    result.conversationsWithInvalidMessageTimestamps.length ||
    result.conversationsWithInvalidContentParts.length
  ) {
    console.error('Validation issues found:\n', JSON.stringify(result, null, 2));
    process.exit(1);
  }
  console.log(`Validated ${result.conversationCount} conversations.`);
}
