#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';

export interface ValidationResult {
  conversationCount: number;
  duplicateIds: string[];
  duplicateTitles: string[];
  conversationsWithTitleWhitespace: number[];
  conversationsWithInvalidTitleChars: number[];
  conversationsWithLongTitles: number[];
  missingFields: { index: number; fields: string[] }[];
  outOfOrderConversations: number[];
  invalidTimestamps: number[];
  conversationsWithInvalidRoles: number[];
  conversationsMissingRoot: number[];
  conversationsWithMissingParents: number[];
  conversationsWithMismatchedNodeIds: number[];
  conversationsWithParentCycles: number[];
  conversationsWithCyclicReferences: number[];
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
  conversationsWithInvalidMessageWeights: number[];
  conversationsWithInvalidContentParts: number[];
  conversationsWithSelfReferencingChildren: number[];
  conversationsWithInvalidIds: number[];
  conversationsWithDuplicateMessageIds: number[];
  conversationsWithInvalidCurrentNode: number[];
  conversationsWithMismatchedConversationIds: number[];
  conversationsWithMessageTimeOutOfRange: number[];
  conversationsWithMissingRoles: number[];
  conversationsWithInvalidPluginIds: number[];
  conversationsWithInvalidDisabledToolIds: number[];
  conversationsWithInvalidBlockedUrls: number[];
  conversationsWithInvalidSafeUrls: number[];
  conversationsWithInvalidMessageStatuses: number[];
  conversationsWithInvalidMessageChannels: number[];
  conversationsWithInvalidMessageRecipients: number[];
  conversationsWithMissingAttachments: number[];
  conversationsWithInvalidContentTypes: number[];
  conversationsWithInvalidEndTurn: number[];
}

export function validateNewAdvancedConversations(filePath: string): ValidationResult {
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const seenIds = new Set<string>();
  const seenTitles = new Set<string>();
  const duplicateIds: string[] = [];
  const duplicateTitles: string[] = [];
  const titlesWithWhitespace: number[] = [];
  const titlesWithInvalidChars: number[] = [];
  const longTitles: number[] = [];
  const missingFields: { index: number; fields: string[] }[] = [];
  const outOfOrder: number[] = [];
  const invalidTimestamps: number[] = [];
  const invalidRoles: number[] = [];
  const missingRoles: number[] = [];
  const missingRoot: number[] = [];
  const missingParents: number[] = [];
  const mismatchedNodeIds: number[] = [];
  const parentCycles: number[] = [];
  const cyclicReferences: number[] = [];
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
  const invalidMessageWeights: number[] = [];
  const invalidContentParts: number[] = [];
  const invalidContentTypes: number[] = [];
  const invalidEndTurn: number[] = [];
  const selfReferencingChildren: number[] = [];
  const invalidIds: number[] = [];
  const duplicateMessageIds: number[] = [];
  const invalidCurrentNodes: number[] = [];
  const mismatchedConversationIds: number[] = [];
  const messageTimeOutOfRange: number[] = [];
  const invalidPluginIds: number[] = [];
  const invalidDisabledToolIds: number[] = [];
  const invalidBlockedUrls: number[] = [];
  const invalidSafeUrls: number[] = [];
  const invalidMessageStatuses: number[] = [];
  const invalidMessageChannels: number[] = [];
  const invalidMessageRecipients: number[] = [];
  const missingAttachments: number[] = [];
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const allowedStatuses = [
    'cancelled',
    'done',
    'failed_with_in_kernel_exception',
    'finished',
    'finished_partial_completion',
    'finished_successfully',
    'in_progress',
    'requested',
    'running',
    'success',
  ];
  const allowedChannels = ['commentary', 'final'];
  const allowedRecipients = [
    'all',
    'assistant',
    'bio',
    'browser.open',
    'browser.search',
    'canmore.comment_textdoc',
    'canmore.create_textdoc',
    'canmore.update_textdoc',
    'computer.do',
    'computer.get',
    'computer.initialize',
    'computer.sync_file',
    'container.exec',
    'dalle.text2im',
    'de1d73e.create',
    'de1d73e.update',
    'file_search.msearch',
    'python',
    'research_kickoff_tool.start_research_task',
    't2uay3k.sj1i4kz',
    'web',
    'web.open_url',
    'web.run',
    'web.search',
  ];
  const allowedContentTypes = [
    'text',
    'code',
    'computer_output',
    'execution_output',
    'multimodal_text',
    'reasoning_recap',
    'system_error',
    'tether_browsing_display',
    'tether_quote',
  ];

  raw.forEach((conv: any, idx: number) => {
    const seenMessageIds = new Set<string>();
    let invalidIdRecorded = false;
    const missing: string[] = [];
    if (!conv.id) missing.push('id');
    if (!conv.title) missing.push('title');
    if (typeof conv.mapping !== 'object') missing.push('mapping');
    if (typeof conv.create_time !== 'number') missing.push('create_time');
    if (typeof conv.update_time !== 'number') missing.push('update_time');
    if (typeof conv.conversation_id !== 'string') missing.push('conversation_id');
    if (typeof conv.current_node !== 'string') missing.push('current_node');
    if (
      typeof conv.create_time === 'number' &&
      typeof conv.update_time === 'number' &&
      conv.update_time < conv.create_time
    ) {
      invalidTimestamps.push(idx);
    }
    if (missing.length) missingFields.push({ index: idx, fields: missing });
    if (conv.id) {
      if (!uuidPattern.test(conv.id)) {
        invalidIds.push(idx);
        invalidIdRecorded = true;
      }
      if (seenIds.has(conv.id)) duplicateIds.push(conv.id);
      else seenIds.add(conv.id);
    }
    if (
      typeof conv.conversation_id === 'string' &&
      conv.id &&
      conv.conversation_id !== conv.id
    ) {
      mismatchedConversationIds.push(idx);
    }
    if (conv.plugin_ids !== undefined && conv.plugin_ids !== null) {
      if (
        !Array.isArray(conv.plugin_ids) ||
        conv.plugin_ids.some((p: any) => typeof p !== 'string')
      ) {
        invalidPluginIds.push(idx);
      }
    }
    if (conv.disabled_tool_ids !== undefined && conv.disabled_tool_ids !== null) {
      if (
        !Array.isArray(conv.disabled_tool_ids) ||
        conv.disabled_tool_ids.some((p: any) => typeof p !== 'string')
      ) {
        invalidDisabledToolIds.push(idx);
      }
    }
    if (conv.blocked_urls !== undefined) {
      if (
        !Array.isArray(conv.blocked_urls) ||
        conv.blocked_urls.some((u: any) => typeof u !== 'string')
      ) {
        invalidBlockedUrls.push(idx);
      }
    }
    if (conv.safe_urls !== undefined) {
      if (
        !Array.isArray(conv.safe_urls) ||
        conv.safe_urls.some((u: any) => typeof u !== 'string')
      ) {
        invalidSafeUrls.push(idx);
      }
    }
    if (
      typeof conv.conversation_id === 'string' &&
      !uuidPattern.test(conv.conversation_id) &&
      !invalidIdRecorded
    ) {
      invalidIds.push(idx);
      invalidIdRecorded = true;
    }
    if (typeof conv.title === 'string') {
      const normalized = conv.title.trim().replace(/\s+/g, ' ').toLowerCase();
      if (conv.title.trim() !== conv.title || /\s{2,}/.test(conv.title)) {
        titlesWithWhitespace.push(idx);
      }
      if (/[\x00-\x1F\x7F]/.test(conv.title)) {
        titlesWithInvalidChars.push(idx);
      }
      if (conv.title.length > 100) {
        longTitles.push(idx);
      }
      if (seenTitles.has(normalized)) duplicateTitles.push(normalized);
      else seenTitles.add(normalized);
    }

    const nodes: any[] = Object.values(conv.mapping || {});
    const times = nodes
      .map((n: any) => n?.message?.create_time)
      .filter((t: any): t is number => typeof t === 'number');
    for (let i = 1; i < times.length; i++) {
      if (times[i] < times[i - 1]) {
        outOfOrder.push(idx);
        break;
      }
    }

    for (const node of nodes) {
      const role = node?.message?.author?.role;
      if (typeof role !== 'string') {
        missingRoles.push(idx);
        break;
      }
      if (!['system', 'user', 'assistant'].includes(role)) {
        invalidRoles.push(idx);
        break;
      }
    }

    let attachmentMissing = false;
    for (const node of nodes) {
      const atts = node?.message?.metadata?.attachments;
      if (Array.isArray(atts)) {
        for (const att of atts) {
          if (typeof att?.name === 'string') {
            const attPath = path.join(__dirname, '../docs/sigils', att.name);
            if (!fs.existsSync(attPath)) {
              attachmentMissing = true;
              break;
            }
          }
        }
      }
      if (attachmentMissing) break;
    }
    if (attachmentMissing) {
      missingAttachments.push(idx);
    }

    for (const [key, node] of Object.entries(conv.mapping || {}) as [string, any][]) {
      if (key !== 'client-created-root' && !uuidPattern.test(key) && !invalidIdRecorded) {
        invalidIds.push(idx);
        invalidIdRecorded = true;
      }
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
      if (node.id && !uuidPattern.test(node.id) && key !== 'client-created-root' && !invalidIdRecorded) {
        invalidIds.push(idx);
        invalidIdRecorded = true;
      }
      if (node.message && typeof node.message.id === 'string' && !uuidPattern.test(node.message.id) && !invalidIdRecorded) {
        invalidIds.push(idx);
        invalidIdRecorded = true;
      }
      if (
        node.message &&
        typeof node.message.id === 'string' &&
        seenMessageIds.has(node.message.id)
      ) {
        duplicateMessageIds.push(idx);
        break;
      }
      if (node.message && typeof node.message.id === 'string') {
        seenMessageIds.add(node.message.id);
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
        let selfReference = false;
        const seenChildren = new Set<string>();
        for (const childId of node.children) {
          if (seenChildren.has(childId)) {
            duplicateChild = true;
            break;
          }
          seenChildren.add(childId);
          if (childId === key) {
            selfReference = true;
            break;
          }
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
        if (selfReference) {
          selfReferencingChildren.push(idx);
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
      if (
        m.weight !== undefined &&
        (typeof m.weight !== 'number' || m.weight < 0 || m.weight > 1)
      ) {
        invalidMessageWeights.push(idx);
        break;
      }
      if (
        m.status !== undefined &&
        (typeof m.status !== 'string' || !allowedStatuses.includes(m.status))
      ) {
        invalidMessageStatuses.push(idx);
        break;
      }
      if (
        m.channel !== undefined &&
        m.channel !== null &&
        !allowedChannels.includes(m.channel)
      ) {
        invalidMessageChannels.push(idx);
        break;
      }
      if (
        m.recipient !== undefined &&
        (typeof m.recipient !== 'string' || !allowedRecipients.includes(m.recipient))
      ) {
        invalidMessageRecipients.push(idx);
        break;
      }
      if (
        m.content &&
        m.content.content_type !== undefined &&
        (typeof m.content.content_type !== 'string' ||
          !allowedContentTypes.includes(m.content.content_type))
      ) {
        invalidContentTypes.push(idx);
        break;
      }
      if (m.end_turn !== undefined && typeof m.end_turn !== 'boolean') {
        invalidEndTurn.push(idx);
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

    // Detect cycles in child references using DFS
    const globalVisited = new Set<string>();
    const stackSet = new Set<string>();
    const detectCycle = (id: string): boolean => {
      if (stackSet.has(id)) return true;
      if (globalVisited.has(id)) return false;
      globalVisited.add(id);
      stackSet.add(id);
      const node = conv.mapping[id];
      if (Array.isArray(node?.children)) {
        for (const childId of node.children) {
          if (detectCycle(childId)) return true;
        }
      }
      stackSet.delete(id);
      return false;
    };
    for (const id of Object.keys(conv.mapping || {})) {
      if (detectCycle(id)) {
        cyclicReferences.push(idx);
        break;
      }
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
      if (
        typeof conv.current_node === 'string' &&
        !conv.mapping[conv.current_node]
      ) {
        invalidCurrentNodes.push(idx);
      }
    }

    const msgTimes = nodes.flatMap((n: any) => {
      const m = n?.message;
      return typeof m?.create_time === 'number' && typeof m?.update_time === 'number'
        ? [m.create_time, m.update_time]
        : [];
    });
    if (msgTimes.length) {
      const earliest = Math.min(...msgTimes);
      const latest = Math.max(...msgTimes);
      if (
        (typeof conv.create_time === 'number' && conv.create_time > earliest) ||
        (typeof conv.update_time === 'number' && conv.update_time < latest)
      ) {
        messageTimeOutOfRange.push(idx);
      }
    }
  });

  return {
    conversationCount: raw.length,
    duplicateIds,
    duplicateTitles,
  conversationsWithTitleWhitespace: titlesWithWhitespace,
  conversationsWithInvalidTitleChars: titlesWithInvalidChars,
  conversationsWithLongTitles: longTitles,
    missingFields,
    outOfOrderConversations: outOfOrder,
    invalidTimestamps,
    conversationsWithInvalidRoles: invalidRoles,
    conversationsMissingRoot: missingRoot,
    conversationsWithMissingParents: missingParents,
    conversationsWithMismatchedNodeIds: mismatchedNodeIds,
    conversationsWithParentCycles: parentCycles,
    conversationsWithCyclicReferences: cyclicReferences,
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
    conversationsWithInvalidMessageWeights: invalidMessageWeights,
    conversationsWithInvalidContentParts: invalidContentParts,
    conversationsWithSelfReferencingChildren: selfReferencingChildren,
    conversationsWithInvalidIds: invalidIds,
    conversationsWithDuplicateMessageIds: duplicateMessageIds,
    conversationsWithInvalidCurrentNode: invalidCurrentNodes,
    conversationsWithMismatchedConversationIds: mismatchedConversationIds,
    conversationsWithMessageTimeOutOfRange: messageTimeOutOfRange,
    conversationsWithMissingRoles: missingRoles,
    conversationsWithInvalidPluginIds: invalidPluginIds,
    conversationsWithInvalidDisabledToolIds: invalidDisabledToolIds,
    conversationsWithInvalidBlockedUrls: invalidBlockedUrls,
    conversationsWithInvalidSafeUrls: invalidSafeUrls,
    conversationsWithInvalidMessageStatuses: invalidMessageStatuses,
    conversationsWithInvalidMessageChannels: invalidMessageChannels,
    conversationsWithInvalidMessageRecipients: invalidMessageRecipients,
    conversationsWithMissingAttachments: missingAttachments,
    conversationsWithInvalidContentTypes: invalidContentTypes,
    conversationsWithInvalidEndTurn: invalidEndTurn,
  };
}

if (require.main === module) {
  const file = process.argv[2] || path.join(__dirname, '../docs/sigils/newadvancedconversations.json');
  const result = validateNewAdvancedConversations(file);
  if (
    result.duplicateIds.length ||
    result.duplicateTitles.length ||
    result.conversationsWithTitleWhitespace.length ||
    result.conversationsWithInvalidTitleChars.length ||
    result.conversationsWithLongTitles.length ||
    result.missingFields.length ||
    result.outOfOrderConversations.length ||
    result.invalidTimestamps.length ||
    result.conversationsMissingRoot.length ||
    result.conversationsWithMissingParents.length ||
    result.conversationsWithMismatchedNodeIds.length ||
    result.conversationsWithParentCycles.length ||
    result.conversationsWithCyclicReferences.length ||
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
    result.conversationsWithInvalidMessageWeights.length ||
    result.conversationsWithInvalidContentParts.length ||
    result.conversationsWithSelfReferencingChildren.length ||
    result.conversationsWithInvalidIds.length ||
    result.conversationsWithDuplicateMessageIds.length ||
    result.conversationsWithInvalidCurrentNode.length ||
    result.conversationsWithMismatchedConversationIds.length ||
    result.conversationsWithMessageTimeOutOfRange.length ||
    result.conversationsWithMissingRoles.length ||
    result.conversationsWithInvalidPluginIds.length ||
    result.conversationsWithInvalidDisabledToolIds.length ||
    result.conversationsWithInvalidBlockedUrls.length ||
    result.conversationsWithInvalidSafeUrls.length ||
    result.conversationsWithInvalidMessageStatuses.length ||
    result.conversationsWithInvalidMessageChannels.length ||
    result.conversationsWithInvalidMessageRecipients.length ||
    result.conversationsWithInvalidContentTypes.length ||
    result.conversationsWithInvalidEndTurn.length ||
    result.conversationsWithMissingAttachments.length
  ) {
    console.error('Validation issues found:\n', JSON.stringify(result, null, 2));
    process.exit(1);
  }
  console.log(`Validated ${result.conversationCount} conversations.`);
}
