#!/usr/bin/env node
import process from 'node:process';

const args = new Set(process.argv.slice(2));
const AI_URL = process.env.MANDALA_AI_API_ORIGIN || 'http://localhost:4000';
const AGG_URL = `http://localhost:${process.env.UM_HEALTH_PORT || 3999}`;
const asJson = args.has('--json');
const softMode =
  args.has('--soft') || args.has('--diagnostic') || process.env.UM_SMOKE_LIVE_SOFT === '1';
const diagMode = args.has('--diagnostic');

async function ping(url) {
  try {
    const r = await fetch(url);
    return r.ok;
  } catch {
    return false;
  }
}

async function smoke() {
  const okHealth = await ping(`${AGG_URL}/health`);
  const chatBody = { messages: [{ role: 'user', content: 'Ping' }] };
  let okChat = false;
  try {
    const r = await fetch(`${AI_URL}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(chatBody),
    });
    okChat = r.ok;
  } catch {}

  const ok = okHealth && okChat;

  if (asJson) {
    console.log(
      JSON.stringify({
        healthUrl: `${AGG_URL}/health`,
        chatUrl: `${AI_URL}/api/ai/chat`,
        okHealth,
        okChat,
        ok,
        mode: diagMode ? 'diagnostic' : 'standard',
      }),
    );
  } else if (ok) {
    console.log('✅ live-smoke: health and chat endpoints respond');
  } else {
    if (!okHealth) console.error('❌ live-smoke: health aggregator not reachable');
    if (!okChat) console.error('❌ live-smoke: AI chat endpoint not reachable');
  }

  if (ok) {
    return 0;
  }

  return softMode ? 0 : 1;
}

const code = await smoke();
process.exit(code);
