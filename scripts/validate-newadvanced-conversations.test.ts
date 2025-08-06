import { describe, it, expect } from 'vitest';
import path from 'path';
import { validateNewAdvancedConversations } from './validate-newadvanced-conversations';

describe('validateNewAdvancedConversations', () => {
  it('flags duplicate titles', () => {
    const file = path.join(__dirname, '../tests/fixtures/newadvanced-duplicate-titles.json');
    const res = validateNewAdvancedConversations(file);
    expect(res.duplicateTitles).toEqual(['Foo']);
  });

  it('flags duplicate titles case-insensitively', () => {
    const file = path.join(
      __dirname,
      '../tests/fixtures/newadvanced-duplicate-titles-case.json'
    );
    const res = validateNewAdvancedConversations(file);
    expect(res.duplicateTitles).toEqual(['foo']);
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
});
