# AeonCoreAssembler

## Responsibilities
- Koordiniert registrierte Aeon-Agenten und verteilt kompilierte Tasks.
- Nutzt `compile()` aus `aeon-universal` und reicht die Ergebnisse an Agenten weiter.
- Optionales Whitelisting über die `allowedAgents`-Liste.
- Erkennt `route`-Angaben aus Aeon Universal und leitet Tasks nur an den passenden Agenten weiter.

## Parameters
- `allowedAgents` – Array erlaubter Agent-IDs. Ist es leer, werden alle akzeptiert.

## Example usage
```ts
import { AeonCoreAssembler } from 'aeon-universal';
import { AeonTranspilerAgent } from '../packages/agents/AeonTranspilerAgent';

const assembler = new AeonCoreAssembler(['AeonTranspiler']);
assembler.register(new AeonTranspilerAgent());
await assembler.processSource(`
ROUTE AeonTranspiler
  TASK Demo
ENDROUTE
`);
```
