# AeonJsTranspilerAgent

## Responsibilities

- Wandelt Aeon-Quelltext in ein JavaScript-Snippet um.
- Nutzt `transpileToJS()` aus `aeon-universal`.
- Speichert das Ergebnis in einer Datei (Standard: `aeon-output.js`).

## Example usage

```ts
const agent = new AeonJsTranspilerAgent('out.js');
await agent.handle({ id: '1', description: 'TASK Demo' });
```
