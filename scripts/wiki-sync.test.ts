import { strict as assert } from 'assert';
import path from 'path';
import { syncWiki } from './wiki-sync.js';

const files = syncWiki({ docsDir: path.join(__dirname, '..', 'docs') });
assert.ok(Array.isArray(files));
assert.ok(files.length > 0);
console.log('wiki-sync test passed');
