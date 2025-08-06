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
});
