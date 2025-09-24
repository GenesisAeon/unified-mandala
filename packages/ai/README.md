# @unified-mandala/ai

Wrapper utilities for the OpenAI Responses API plus an optional NATS bridge.

## Getting started

1. Install dependencies from the repository root:
   ```bash
   pnpm install --filter @unified-mandala/ai...
   ```
2. Copy the environment template and add your API key:
   ```bash
   cp packages/ai/.env.example packages/ai/.env
   ```
3. Run a local test prompt:
   ```bash
   pnpm -F @unified-mandala/ai dev
   ```

## Usage

```ts
import { askOpenAI } from '@unified-mandala/ai';

const result = await askOpenAI({
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Explain the Unified Mandala in one sentence.' },
  ],
});

console.log(result.text);
```

The helper reads `OPENAI_API_KEY` from the environment (load `.env` during
local development). `OPENAI_MODEL` defaults to `gpt-4.1-mini` if not supplied
per call.

## NATS worker

Launch a reply worker that listens on `ai.request`:

```bash
pnpm -F @unified-mandala/ai nats
```

Requests must include a `messages` array using the Chat Completions roles.
Optional fields `model`, `temperature`, and `max_tokens` are forwarded to the
OpenAI Responses API.
