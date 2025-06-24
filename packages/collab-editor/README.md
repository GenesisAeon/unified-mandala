# Collab Editor

Lightweight collaborative editor with optional federation via HTTPS.

## Key modules
- `CollaborativeEditor.ts` – event-based local editor model.
- `AutomergeFederation.ts` – merges remote changes and tracks sync status.
- `federationRoutes.ts` – helper to send updates to a remote endpoint.

## Basic usage
```ts
import { CollaborativeEditor } from '@unified-mandala/collab-editor';
const editor = new CollaborativeEditor('https://peer/sync');
editor.applyLocalChange('Hello');
```

## Tests
See `CollaborativeEditor.test.ts` and `AutomergeFederation.test.ts` for usage.
