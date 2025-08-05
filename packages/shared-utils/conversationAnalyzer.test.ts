import fs from 'fs';
import path from 'path';
import { analyzeConversations, extractTodosFromConversations, extractImplicitTodosFromConversations, loadConversations, countTodosByConversation } from './conversationAnalyzer';

describe('conversationAnalyzer', () => {
  const sample = path.join(__dirname, 'sample-conv.json');
  beforeAll(() => {
    const data = [
      {
        id: 'a',
        mapping: {
          root: { id: 'root', message: { id: 'm1', author: { role: 'user' }, content: { parts: ['Hallo TODO teste'] } } }
        }
      }
    ];
    fs.writeFileSync(sample, JSON.stringify(data), 'utf8');
  });
  afterAll(() => { fs.unlinkSync(sample); });

  it('analyzes conversations', () => {
    const stats = analyzeConversations(sample);
    expect(stats.conversationCount).toBe(1);
    expect(stats.messageCount).toBe(1);
    expect(stats.authorCounts.user).toBe(1);
  });

  it('extracts TODOs', () => {
    const todos = extractTodosFromConversations(sample);
    expect(todos).toEqual(['teste']);
  });

  it('counts TODO markers per conversation', () => {
    const counts = countTodosByConversation(sample);
    expect(counts['a']).toBe(1);
  });

  it('extracts implicit todos', () => {
    const file = path.join(__dirname, 'implicit.json');
    const data = [
      {
        id: 'b',
        mapping: {
          root: {
            message: { id: 'm2', author: { role: 'user' }, content: { parts: ['Wir sollten mehr Tests schreiben.'] } }
          }
        }
      }
    ];
    fs.writeFileSync(file, JSON.stringify(data), 'utf8');
    const todos = extractImplicitTodosFromConversations(file);
    expect(todos).toEqual(['mehr Tests schreiben']);
    fs.unlinkSync(file);
  });

  it('loads newline-delimited json', () => {
    const file = path.join(__dirname, 'lines.jsonl');
    const line1 = JSON.stringify({ id: 'x', mapping: { r: { message: { content: { parts: ['A'] } } } } });
    const line2 = JSON.stringify({ id: 'y', mapping: { r: { message: { content: { parts: ['B'] } } } } });
    fs.writeFileSync(file, `${line1}\n${line2}`);
    const convs = loadConversations(file);
    expect(convs.length).toBe(2);
    fs.unlinkSync(file);
  });
});
