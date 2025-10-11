#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';
import StreamJson from 'stream-json';
import StreamArray from 'stream-json/streamers/StreamArray.js';

const { parser } = StreamJson;
const { streamArray } = StreamArray;

export interface ConversationStats {
  conversationCount: number;
  messageCount: number;
  authorCounts: Record<string, number>;
  averageMessagesPerConversation: number;
  timeRange: { start: number | null; end: number | null };
  todoCount: number;
  titles: string[];
}

export function analyzeNewAdvancedConversations(
  filePath: string,
  filterTitles?: string[],
  start = 0,
  count = Infinity,
): ConversationStats {
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const allSessions = Array.isArray(filterTitles)
    ? raw.filter((s: any) => filterTitles.includes(s.title))
    : raw;
  const sessions = allSessions.slice(start, start + count);
  let messageCount = 0;
  const authorCounts: Record<string, number> = {};
  let minTime: number | null = null;
  let maxTime: number | null = null;
  let todoCount = 0;
  const collectedTitles: string[] = [];
  sessions.forEach((session: any) => {
    collectedTitles.push(session.title || 'Untitled');
    const nodes = Object.values(session.mapping || {});
    nodes.forEach((node: any) => {
      const msg = node.message;
      if (msg && msg.author) {
        messageCount++;
        const role = msg.author.role || 'unknown';
        authorCounts[role] = (authorCounts[role] || 0) + 1;
        const ct = (msg as any).create_time;
        if (typeof ct === 'number') {
          minTime = minTime === null ? ct : Math.min(minTime, ct);
          maxTime = maxTime === null ? ct : Math.max(maxTime, ct);
        }
        const parts: string[] = msg.content?.parts || [];
        const text = parts.join(' ');
        const matches = text.match(/TODO/gi);
        if (matches) todoCount += matches.length;
      }
    });
  });
  return {
    conversationCount: sessions.length,
    messageCount,
    authorCounts,
    averageMessagesPerConversation: sessions.length ? messageCount / sessions.length : 0,
    timeRange: { start: minTime, end: maxTime },
    todoCount,
    titles: collectedTitles,
  };
}

export async function analyzeNewAdvancedConversationsStream(
  filePath: string,
  filterTitles?: string[],
  start = 0,
  count = Infinity,
): Promise<ConversationStats> {
  return new Promise((resolve, reject) => {
    const titleSet = filterTitles ? new Set(filterTitles) : undefined;
    const stats: ConversationStats = {
      conversationCount: 0,
      messageCount: 0,
      authorCounts: {},
      averageMessagesPerConversation: 0,
      timeRange: { start: null, end: null },
      todoCount: 0,
      titles: [],
    };
    let index = -1;
    const pipeline = fs
      .createReadStream(filePath, { encoding: 'utf8' })
      .pipe(parser())
      .pipe(streamArray());
    pipeline.on('data', ({ value }: { value: any }) => {
      index++;
      if (index < start) return;
      if (stats.conversationCount >= count) {
        pipeline.destroy();
        return;
      }
      if (titleSet && !titleSet.has(value.title)) return;
      stats.conversationCount++;
      stats.titles.push(value.title || 'Untitled');
      const nodes = Object.values(value.mapping || {});
      nodes.forEach((node: any) => {
        const msg = node.message;
        if (msg && msg.author) {
          stats.messageCount++;
          const role = msg.author.role || 'unknown';
          stats.authorCounts[role] = (stats.authorCounts[role] || 0) + 1;
          const ct = (msg as any).create_time;
          if (typeof ct === 'number') {
            stats.timeRange.start =
              stats.timeRange.start === null ? ct : Math.min(stats.timeRange.start, ct);
            stats.timeRange.end =
              stats.timeRange.end === null ? ct : Math.max(stats.timeRange.end, ct);
          }
          const parts: string[] = msg.content?.parts || [];
          const text = parts.join(' ');
          const matches = text.match(/TODO/gi);
          if (matches) stats.todoCount += matches.length;
        }
      });
    });
    const finalize = () => {
      stats.averageMessagesPerConversation = stats.conversationCount
        ? stats.messageCount / stats.conversationCount
        : 0;
      resolve(stats);
    };
    pipeline.on('end', finalize);
    pipeline.on('close', finalize);
    pipeline.on('error', reject);
  });
}

if (typeof require !== 'undefined' && require.main === module) {
  const args = process.argv.slice(2);
  const fileArgIndex = args.findIndex((a: string) => !a.startsWith('--'));
  const file =
    fileArgIndex >= 0
      ? args[fileArgIndex]
      : path.join(__dirname, '../docs/sigils/newadvancedconversations.json');
  const summaryIndex = args.indexOf('--summary');
  const summaryPath = summaryIndex >= 0 ? args[summaryIndex + 1] : null;
  const jsonIndex = args.indexOf('--json');
  const jsonPath = jsonIndex >= 0 ? args[jsonIndex + 1] : null;
  const titlesArgIndex = args.indexOf('--titles');
  const titleList =
    titlesArgIndex >= 0
      ? args[titlesArgIndex + 1].split(',').map((t: string) => t.trim())
      : undefined;
  const startIndex = args.indexOf('--start');
  const start = startIndex >= 0 ? parseInt(args[startIndex + 1], 10) : 0;
  const countIndex = args.indexOf('--count');
  const count = countIndex >= 0 ? parseInt(args[countIndex + 1], 10) : Infinity;
  const useStream = args.includes('--stream');

  (async () => {
    const stats = useStream
      ? await analyzeNewAdvancedConversationsStream(file, titleList, start, count)
      : analyzeNewAdvancedConversations(file, titleList, start, count);
    console.log(`Conversations: ${stats.conversationCount}`);
    console.log(`Messages: ${stats.messageCount}`);
    console.log('Authors:', stats.authorCounts);
    console.log('Titles:', stats.titles);
    if (summaryPath) {
      const lines = [
        '# New Advanced Conversations Stats',
        '',
        `- Conversations: ${stats.conversationCount}`,
        `- Messages: ${stats.messageCount}`,
        '- Authors:',
        ...Object.entries(stats.authorCounts).map(([role, count]) => `  - ${role}: ${count}`),
        '- Titles:',
        ...stats.titles.map((t) => `  - ${t}`),
        `- TODOs: ${stats.todoCount}`,
        `- Time range: ${stats.timeRange.start ?? 'n/a'} - ${stats.timeRange.end ?? 'n/a'}`,
      ];
      fs.writeFileSync(summaryPath, lines.join('\n') + '\n');
      console.log(`Summary written to ${summaryPath}`);
    }
    if (jsonPath) {
      fs.writeFileSync(jsonPath, JSON.stringify(stats, null, 2));
      console.log(`JSON summary written to ${jsonPath}`);
    }
  })();
}
