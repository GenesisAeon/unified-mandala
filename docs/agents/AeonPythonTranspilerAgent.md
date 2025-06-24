# AeonPythonTranspilerAgent

## Responsibilities
- Wandelt Aeon-Quelltext in ein Python-Snippet um.
- Nutzt `transpileToPython()` aus `aeon-universal`.
- Speichert das Ergebnis in einer Datei (Standard: `aeon-output.py`).

## Example usage
```ts
const agent = new AeonPythonTranspilerAgent('out.py');
await agent.handle({ id: '1', description: 'TASK Demo' });
```
