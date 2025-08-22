import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { toolRegistry, ToolSpec } from './ToolRegistry';

export interface LoadToolOptions {
  specsDir?: string;
  handlersDir?: string;
}

/**
 * Load tool specifications from YAML files and register matching handlers.
 */
export function loadToolSpecs(options: LoadToolOptions = {}): void {
  const specsDir = options.specsDir || path.resolve(__dirname, '../../../tools/specs');
  const handlersDir = options.handlersDir || path.resolve(__dirname, '../../../tools/handlers');
  if (!fs.existsSync(specsDir)) return;
  const files = fs.readdirSync(specsDir);
  for (const file of files) {
    if (!file.endsWith('.yaml') && !file.endsWith('.yml')) continue;
    const specPath = path.join(specsDir, file);
    const spec = yaml.load(fs.readFileSync(specPath, 'utf8')) as ToolSpec;
    if (!spec?.name) continue;
    const handlerPath = path.join(handlersDir, `${spec.name}.js`);
    if (!fs.existsSync(handlerPath)) {
      continue;
    }
    const mod = require(handlerPath);
    const handler = mod.default || mod;
    toolRegistry.register(spec, handler);
  }
}
