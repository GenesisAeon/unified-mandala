import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { EventEmitter } from 'events';
import vm from 'vm';

export interface PluginManifest {
  name: string;
  type: string;
  description: string;
  version: string;
  author: string;
  entry: string;
  apiVersion: string;
  permissions: string[];
}

const CORE_API_VERSION = '1.0';
const PLUGIN_DIR = path.join(__dirname, '..', 'plugins');
const manifests = new Map<string, PluginManifest>();
const modules = new Map<string, any>();
const emitter = new EventEmitter();

function loadPlugin(name: string) {
  const manifestPath = path.join(PLUGIN_DIR, name, 'manifest.yaml');
  const content = fs.readFileSync(manifestPath, 'utf8');
  const manifest = yaml.load(content) as PluginManifest;
  if (manifest.apiVersion !== CORE_API_VERSION) {
    throw new Error(`Plugin ${name} expects API ${manifest.apiVersion}, core is ${CORE_API_VERSION}`);
  }
  manifests.set(name, manifest);
  const entryPath = path.join(PLUGIN_DIR, name, manifest.entry);
  const code = fs.readFileSync(entryPath, 'utf8');
  const sandbox: any = { module: { exports: {} }, exports: {}, require, console };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: entryPath });
  modules.set(name, sandbox.module.exports || sandbox.exports);
  emitter.emit('loaded', name);
  console.log(`🔌 Loaded plugin ${name}@${manifest.version}`);
}

function watch() {
  fs.watch(PLUGIN_DIR, { recursive: true }, (event, filename) => {
    if (!filename?.endsWith('manifest.yaml')) return;
    const name = path.basename(path.dirname(path.join(PLUGIN_DIR, filename)));
    try {
      loadPlugin(name);
    } catch (err) {
      console.error(err);
    }
  });
}

fs.readdirSync(PLUGIN_DIR).forEach(dir => {
  if (fs.existsSync(path.join(PLUGIN_DIR, dir, 'manifest.yaml'))) {
    try {
      loadPlugin(dir);
    } catch (err) {
      console.error(err);
    }
  }
});
if (process.env.NODE_ENV !== 'test') {
  watch();
}

export function getPlugin(name: string) {
  return modules.get(name);
}
export function listPlugins() {
  return Array.from(manifests.values());
}
export { emitter as pluginEvents };
