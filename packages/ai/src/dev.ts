import { askOpenAI } from './index.js';

async function main() {
  const result = await askOpenAI({
    messages: [
      { role: 'system', content: 'You are a friendly assistant.' },
      { role: 'user', content: 'Sag einen freundlichen Gruß auf Deutsch.' }
    ]
  });

  console.log('[ai]', result.text);
}

main().catch((error) => {
  console.error('[ai] dev run failed:', error);
  process.exitCode = 1;
});
