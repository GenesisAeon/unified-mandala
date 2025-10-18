#!/usr/bin/env node
import process from 'node:process';

const args = new Set(process.argv.slice(2));
const offset = Number.parseInt(process.env.PORT_OFFSET || '0', 10) || 0;
const defaultApiOrigin = `http://localhost:${4000 + offset}`;
const aiOrigin = process.env.MANDALA_AI_API_ORIGIN || defaultApiOrigin;
const parsedHealthPort = Number.parseInt(process.env.UM_HEALTH_PORT || '', 10);
const resolvedHealthPort = Number.isFinite(parsedHealthPort) ? parsedHealthPort : 3999 + offset;
const healthOrigin = `http://localhost:${resolvedHealthPort}`;
const asJson = args.has('--json');
const softMode =
  args.has('--soft') || args.has('--diagnostic') || process.env.UM_SMOKE_LIVE_SOFT === '1';
const diagMode = args.has('--diagnostic');

const ethicsPort = Number.parseInt(process.env.ETHICS_PORT || '', 10);
const resolvedEthicsPort = Number.isFinite(ethicsPort) ? ethicsPort + offset : 3110 + offset;
const ethicsOrigin = `http://127.0.0.1:${resolvedEthicsPort}`;

const verifyPort = Number.parseInt(process.env.VERIFY_PORT || '', 10);
const resolvedVerifyPort = Number.isFinite(verifyPort) ? verifyPort + offset : 3111 + offset;
const verifyOrigin = `http://127.0.0.1:${resolvedVerifyPort}`;

async function ping(url) {
  try {
    const r = await fetch(url);
    return r.ok;
  } catch {
    return false;
  }
}

async function smoke() {
  const okHealth = await ping(`${healthOrigin}/health`);
  const chatBody = { messages: [{ role: 'user', content: 'Ping' }] };
  let okChat = false;
  try {
    const r = await fetch(`${aiOrigin}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(chatBody),
    });
    okChat = r.ok;
  } catch {}

  const okEthics = await ping(`${ethicsOrigin}/readyz`);
  const okVerify = await ping(`${verifyOrigin}/health`);

  const ok = okHealth && okChat && okEthics && okVerify;

  if (asJson) {
    console.log(
      JSON.stringify({
        healthUrl: `${healthOrigin}/health`,
        chatUrl: `${aiOrigin}/api/ai/chat`,
        ethicsUrl: `${ethicsOrigin}/readyz`,
        verifyUrl: `${verifyOrigin}/health`,
        okHealth,
        okChat,
        okEthics,
        okVerify,
        ok,
        mode: diagMode ? 'diagnostic' : 'standard',
      }),
    );
  } else if (ok) {
    console.log(
      '✅ live-smoke: health aggregator, ethics readyz, verify gate and chat endpoints respond',
    );
  } else {
    if (!okHealth) console.error('❌ live-smoke: health aggregator not reachable');
    if (!okChat) console.error('❌ live-smoke: AI chat endpoint not reachable');
    if (!okEthics) console.error('❌ live-smoke: ethics /readyz not reachable');
    if (!okVerify) console.error('❌ live-smoke: verify-gate /health not reachable');
  }

  if (ok) {
    return 0;
  }

  return softMode ? 0 : 1;
}

const code = await smoke();
process.exit(code);
