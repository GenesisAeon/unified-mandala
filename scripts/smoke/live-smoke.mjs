#!/usr/bin/env node
import process from 'node:process';

const AI_URL = process.env.MANDALA_AI_API_ORIGIN || 'http://localhost:4000';
const AGG_URL = `http://localhost:${process.env.UM_HEALTH_PORT || 3999}`;

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

  if (okHealth && okChat) {
    console.log('✅ live-smoke: health and chat endpoints respond');
    return 0;
  }
  if (!okHealth) console.error('❌ live-smoke: health aggregator not reachable');
  if (!okChat) console.error('❌ live-smoke: AI chat endpoint not reachable');
  return 1;
}

const code = await smoke();
process.exit(code);
