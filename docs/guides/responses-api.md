# Responses API and Reasoning-Effort

The Mandala Responses API allows agents and tools to request answers while specifying how much reasoning effort the model should invest.

## Reasoning-Effort Levels

- **low**: quick heuristic reasoning for lightweight queries.
- **medium**: balanced depth and speed for everyday tasks.
- **high**: thorough analysis for complex or safety-critical decisions.

## Example Usage

```ts
import { ResponsesClient } from '@unifiedmandala/responses';

const client = new ResponsesClient({ baseUrl: 'http://localhost:8080' });

const result = await client.ask({
  prompt: 'Explain the CREP framework',
  reasoning_effort: 'medium',
});

console.log(result.answer);
console.log(result.citations);
```

For shell based workflows the same endpoint can be called with `curl`:

```bash
curl -X POST http://localhost:8080/ask \
  -H 'Content-Type: application/json' \
  -d '{"prompt":"Explain the CREP framework","reasoning_effort":"high"}'
```

The server responds with an `answer` field and, when available, a list of `citations`. Adjust the `reasoning_effort` parameter to trade between speed and depth.
