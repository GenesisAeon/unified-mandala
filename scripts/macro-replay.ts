import { createReadStream } from 'fs';
import path from 'path';
import readline from 'readline';

interface MacroEvent {
  action: string;
  [key: string]: any;
}

async function replayMacro(filePath: string, baseUrl: string = 'http://localhost:3030') {
  const abs = path.resolve(filePath);
  const rl = readline.createInterface({
    input: createReadStream(abs),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    if (!line.trim()) continue;
    const event: MacroEvent = JSON.parse(line);
    switch (event.action) {
      case 'sleep':
        await new Promise((r) => setTimeout(r, event.ms ?? 0));
        break;
      case 'uia':
        await fetch(baseUrl + '/uia', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command: event.command }),
        });
        break;
      case 'clipboard.write':
        await fetch(baseUrl + '/clipboard', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: event.text ?? '' }),
        });
        break;
      default:
        console.log('Unknown event', event);
    }
  }
}

if (require.main === module) {
  const file = process.argv[2] || path.resolve(process.cwd(), 'logs/automation-session.jsonl');
  replayMacro(file).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
