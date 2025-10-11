export interface FeedbackEntry {
  score: number;
  profile: string;
  entropy: number;
  variance: number;
  SI: number;
  timestamp: string;
}

import fs from 'fs';

export function logFeedback(
  entry: Omit<FeedbackEntry, 'timestamp'>,
  file: string = 'feedback_log.json',
): FeedbackEntry[] {
  const data: FeedbackEntry[] = fs.existsSync(file)
    ? JSON.parse(fs.readFileSync(file, 'utf8'))
    : [];
  const record: FeedbackEntry = { ...entry, timestamp: new Date().toISOString() };
  data.push(record);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  return data;
}
