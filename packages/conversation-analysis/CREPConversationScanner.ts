import fs from 'fs';

export interface CREPConvoReport {
  total: number;
}

export function scanConversations(file = 'docs/sigils/conversations.json'): CREPConvoReport {
  const raw = fs.readFileSync(file, 'utf-8');
  const data = JSON.parse(raw);
  return { total: Array.isArray(data) ? data.length : 0 };
}

if (require.main === module) {
  const report = scanConversations(process.argv[2]);
  fs.writeFileSync('CREPConvoReport.json', JSON.stringify(report, null, 2));
}
