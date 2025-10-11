# AeonGoTranspilerAgent

## Responsibilities

- Wandelt Aeon-Quelltext in ein Go-Snippet um.
- Nutzt `transpileToGo()` aus `aeon-universal`.
- Speichert das Ergebnis in einer Datei (Standard: `aeon-output.go`).

## Example usage

```ts
const agent = new AeonGoTranspilerAgent('out.go');
await agent.handle({ id: '1', description: 'TASK Demo' });
```
