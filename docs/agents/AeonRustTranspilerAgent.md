# AeonRustTranspilerAgent

## Responsibilities

- Wandelt Aeon-Quelltext in ein Rust-Snippet um.
- Nutzt `transpileToRust()` aus `aeon-universal`.
- Speichert das Ergebnis in einer Datei (Standard: `aeon-output.rs`).

## Example usage

```ts
const agent = new AeonRustTranspilerAgent('out.rs');
await agent.handle({ id: '1', description: 'TASK Demo' });
```
