import { describe, it, expect } from 'vitest';
import path from 'path';
import { validateNewAdvancedConversations } from './validate-newadvanced-conversations';

describe('validateNewAdvancedConversations', () => {
  it('flags duplicate titles', () => {
    const file = path.join(
      __dirname,
      '../tests/fixtures/newadvanced-duplicate-titles.json'
    );
    const res = validateNewAdvancedConversations(file);
    expect(res.duplicateTitles).toEqual(['foo']);
  });

  it('flags duplicate titles case-insensitively', () => {
    const file = path.join(
      __dirname,
      '../tests/fixtures/newadvanced-duplicate-titles-case.json'
    );
    const res = validateNewAdvancedConversations(file);
    expect(res.duplicateTitles).toEqual(['foo']);
  });

  it('flags titles with extra whitespace and normalizes for duplicates', () => {
    const file = path.join(
      __dirname,
      '../tests/fixtures/newadvanced-title-whitespace.json'
    );
    const res = validateNewAdvancedConversations(file);
    expect(res.duplicateTitles).toEqual(['foo']);
    expect(res.conversationsWithTitleWhitespace).toEqual([1]);
  });

  it('flags titles with control characters', () => {
    const file = path.join(
      __dirname,
      '../tests/fixtures/newadvanced-invalid-title-chars.json'
    );
    const res = validateNewAdvancedConversations(file);
    expect(res.conversationsWithInvalidTitleChars).toEqual([0]);
  });

  it('flags titles exceeding 100 characters', () => {
    const file = path.join(
      __dirname,
      '../tests/fixtures/newadvanced-long-title.json'
    );
    const res = validateNewAdvancedConversations(file);
    expect(res.conversationsWithLongTitles).toEqual([0]);
  });

  it('flags nodes with invalid author roles', () => {
    const file = path.join(
      __dirname,
      '../tests/fixtures/newadvanced-invalid-role.json'
    );
    const res = validateNewAdvancedConversations(file);
    expect(res.conversationsWithInvalidRoles).toEqual([0]);
  });

  it('flags nodes missing author roles', () => {
    const file = path.join(
      __dirname,
      '../tests/fixtures/newadvanced-missing-role.json'
    );
    const res = validateNewAdvancedConversations(file);
    expect(res.conversationsWithMissingRoles).toEqual([0]);
  });

  it('flags conversations with message timestamps outside conversation range', () => {
    const file = path.join(
      __dirname,
      '../tests/fixtures/newadvanced-message-time-out-of-range.json'
    );
    const res = validateNewAdvancedConversations(file);
    expect(res.conversationsWithMessageTimeOutOfRange).toEqual([0]);
  });

  it('detects out-of-order message timestamps', () => {
    const file = path.join(
      __dirname,
      '../tests/fixtures/newadvanced-out-of-order.json'
    );
    const res = validateNewAdvancedConversations(file);
    expect(res.outOfOrderConversations).toEqual([0]);
  });

  it('flags conversations where update_time precedes create_time', () => {
    const file = path.join(
      __dirname,
      '../tests/fixtures/newadvanced-invalid-times.json'
    );
    const res = validateNewAdvancedConversations(file);
    expect(res.invalidTimestamps).toEqual([0]);
  });

  it('flags conversations missing root node', () => {
    const file = path.join(
      __dirname,
      '../tests/fixtures/newadvanced-missing-root.json'
    );
    const res = validateNewAdvancedConversations(file);
    expect(res.conversationsMissingRoot).toEqual([0]);
  });

  it('flags nodes referencing non-existent parents', () => {
    const file = path.join(
      __dirname,
      '../tests/fixtures/newadvanced-missing-parent.json'
    );
    const res = validateNewAdvancedConversations(file);
    expect(res.conversationsWithMissingParents).toEqual([0]);
  });

  it('flags nodes with mismatched ids', () => {
    const file = path.join(
      __dirname,
      '../tests/fixtures/newadvanced-mismatched-node-ids.json'
    );
    const res = validateNewAdvancedConversations(file);
    expect(res.conversationsWithMismatchedNodeIds).toEqual([0]);
  });

  it('detects cyclic parent references', () => {
    const file = path.join(
      __dirname,
      '../tests/fixtures/newadvanced-parent-cycle.json'
    );
    const res = validateNewAdvancedConversations(file);
    expect(res.conversationsWithParentCycles).toEqual([0]);
  });

  it('flags nodes referencing missing children', () => {
    const file = path.join(
      __dirname,
      '../tests/fixtures/newadvanced-missing-child.json'
    );
    const res = validateNewAdvancedConversations(file);
    expect(res.conversationsWithInvalidChildRefs).toEqual([0]);
  });

  it('flags unreachable nodes', () => {
    const file = path.join(
      __dirname,
      '../tests/fixtures/newadvanced-unreachable-node.json'
    );
    const res = validateNewAdvancedConversations(file);
    expect(res.conversationsWithUnreachableNodes).toEqual([0]);
  });

  it('flags conversations with empty message content', () => {
    const file = path.join(
      __dirname,
      '../tests/fixtures/newadvanced-empty-message.json'
    );
    const res = validateNewAdvancedConversations(file);
    expect(res.conversationsWithEmptyMessages).toEqual([0]);
  });

  it('flags nodes missing message objects', () => {
    const file = path.join(
      __dirname,
      '../tests/fixtures/newadvanced-missing-message.json'
    );
    const res = validateNewAdvancedConversations(file);
    expect(res.conversationsWithMissingMessages).toEqual([0]);
  });

  it('flags nodes missing message ids', () => {
    const file = path.join(
      __dirname,
      '../tests/fixtures/newadvanced-missing-message-id.json'
    );
    const res = validateNewAdvancedConversations(file);
    expect(res.conversationsWithMissingMessageIds).toEqual([0]);
  });

  it('flags nodes whose parents do not list them as children', () => {
    const file = path.join(
      __dirname,
      '../tests/fixtures/newadvanced-unlinked-child.json'
    );
    const res = validateNewAdvancedConversations(file);
    expect(res.conversationsWithUnlistedChildren).toEqual([0]);
  });

  it('flags duplicate child references', () => {
    const file = path.join(
      __dirname,
      '../tests/fixtures/newadvanced-duplicate-children.json'
    );
    const res = validateNewAdvancedConversations(file);
    expect(res.conversationsWithDuplicateChildIds).toEqual([0]);
  });

  it('flags self-referential child nodes', () => {
    const file = path.join(
      __dirname,
      '../tests/fixtures/newadvanced-self-referential-child.json'
    );
    const res = validateNewAdvancedConversations(file);
    expect(res.conversationsWithSelfReferencingChildren).toEqual([0]);
  });

  it('flags nodes missing message timestamps', () => {
    const file = path.join(
      __dirname,
      '../tests/fixtures/newadvanced-missing-message-timestamp.json'
    );
    const res = validateNewAdvancedConversations(file);
    expect(res.conversationsWithMessagesMissingTimestamps).toEqual([0]);
  });

  it('flags nodes with invalid message timestamps', () => {
    const file = path.join(
      __dirname,
      '../tests/fixtures/newadvanced-invalid-message-times.json'
    );
    const res = validateNewAdvancedConversations(file);
    expect(res.conversationsWithInvalidMessageTimestamps).toEqual([0]);
  });

  it('flags non-string message parts', () => {
    const file = path.join(
      __dirname,
      '../tests/fixtures/newadvanced-invalid-part-types.json'
    );
    const res = validateNewAdvancedConversations(file);
    expect(res.conversationsWithInvalidContentParts).toEqual([0]);
  });

  it('flags invalid id formats', () => {
    const file = path.join(
      __dirname,
      '../tests/fixtures/newadvanced-invalid-id-format.json'
    );
    const res = validateNewAdvancedConversations(file);
    expect(res.conversationsWithInvalidIds).toEqual([0]);
  });

  it('flags duplicate message ids', () => {
    const file = path.join(
      __dirname,
      '../tests/fixtures/newadvanced-duplicate-message-id.json'
    );
    const res = validateNewAdvancedConversations(file);
    expect(res.conversationsWithDuplicateMessageIds).toEqual([0]);
  });

  it('flags invalid current_node references', () => {
    const file = path.join(
      __dirname,
      '../tests/fixtures/newadvanced-invalid-current-node.json'
    );
    const res = validateNewAdvancedConversations(file);
    expect(res.conversationsWithInvalidCurrentNode).toEqual([0]);
  });

  it('flags mismatched conversation_id', () => {
    const file = path.join(
      __dirname,
      '../tests/fixtures/newadvanced-mismatched-conversation-id.json'
    );
    const res = validateNewAdvancedConversations(file);
    expect(res.conversationsWithMismatchedConversationIds).toEqual([0]);
  });

  it('flags invalid plugin and URL fields', () => {
    const file = path.join(
      __dirname,
      '../tests/fixtures/newadvanced-invalid-extras.json'
    );
    const res = validateNewAdvancedConversations(file);
    expect(res.conversationsWithInvalidPluginIds).toEqual([0]);
    expect(res.conversationsWithInvalidDisabledToolIds).toEqual([0]);
    expect(res.conversationsWithInvalidBlockedUrls).toEqual([0]);
    expect(res.conversationsWithInvalidSafeUrls).toEqual([0]);
  });

  it('flags messages with weight outside 0-1', () => {
    const file = path.join(
      __dirname,
      '../tests/fixtures/newadvanced-invalid-message-weight.json'
    );
    const res = validateNewAdvancedConversations(file);
    expect(res.conversationsWithInvalidMessageWeights).toEqual([0]);
  });

  it('flags messages with invalid status values', () => {
    const file = path.join(
      __dirname,
      '../tests/fixtures/newadvanced-invalid-message-status.json'
    );
    const res = validateNewAdvancedConversations(file);
    expect(res.conversationsWithInvalidMessageStatuses).toEqual([0]);
  });

  it('flags messages with invalid channel values', () => {
    const file = path.join(
      __dirname,
      '../tests/fixtures/newadvanced-invalid-message-channel.json'
    );
    const res = validateNewAdvancedConversations(file);
    expect(res.conversationsWithInvalidMessageChannels).toEqual([0]);
  });

  it('flags messages with invalid recipient values', () => {
    const file = path.join(
      __dirname,
      '../tests/fixtures/newadvanced-invalid-message-recipient.json'
    );
    const res = validateNewAdvancedConversations(file);
    expect(res.conversationsWithInvalidMessageRecipients).toEqual([0]);
  });

  it('flags cyclic child references', () => {
    const file = path.join(
      __dirname,
      '../tests/fixtures/newadvanced-cyclic-reference.json'
    );
    const res = validateNewAdvancedConversations(file);
    expect(res.conversationsWithCyclicReferences).toEqual([0]);
  });
});
