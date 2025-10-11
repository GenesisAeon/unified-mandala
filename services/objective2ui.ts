import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import { sendToGPT } from '../packages/gpt-bridges/aeon-gpt-synapse';
import { GPTRole } from '../packages/gpt-bridges/gptRoles';

export async function objectiveToLayout(objective: string): Promise<string> {
  const prompt = `Create a YAML layout for the UI objective:\n${objective}`;
  const layoutYaml = await sendToGPT({ role: GPTRole.AEON, input: prompt });
  return layoutYaml;
}

export function storeLayoutSuggestion(
  pluginName: string,
  layoutYaml: string,
  manifestPath = path.join(__dirname, '../plugins/manifest.yaml'),
) {
  const manifest = YAML.parse(fs.readFileSync(manifestPath, 'utf8'));
  const plugin = manifest.plugins.find((p: any) => p.name === pluginName);
  if (!plugin) {
    throw new Error(`Plugin ${pluginName} not found`);
  }
  plugin.layoutSuggestion = layoutYaml;
  fs.writeFileSync(manifestPath, YAML.stringify(manifest));
}
