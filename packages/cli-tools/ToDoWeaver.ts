import fs from 'fs';

/**
 * Weaves a list of cluster strings into a simple YAML todo file.
 */
export function weaveTodos(clusters: string[], output = 'todo.yaml') {
  const yamlLines = clusters.map((c, i) => `- id: task-${i}\n  text: ${c}`);
  fs.writeFileSync(output, yamlLines.join('\n'));
}
