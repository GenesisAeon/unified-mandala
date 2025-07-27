import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export function archiveAdvancedTodos(
  srcJson = 'advancedToDo.json',
  srcYaml = 'advancedToDo.yaml',
  archiveDir = 'GenesisAeonZIPMEM'
) {
  const jsonData: any[] = fs.existsSync(srcJson)
    ? JSON.parse(fs.readFileSync(srcJson, 'utf-8'))
    : [];
  const yamlData: any[] = fs.existsSync(srcYaml)
    ? (yaml.load(fs.readFileSync(srcYaml, 'utf-8')) as any[])
    : [];
  const doneJson = jsonData.filter((i) => i.status === 'done');
  const doneYaml = yamlData.filter((i: any) => i.status === 'done');
  fs.mkdirSync(archiveDir, { recursive: true });
  fs.writeFileSync(
    path.join(archiveDir, 'advancedToDoArchive.json'),
    JSON.stringify(doneJson, null, 2)
  );
  fs.writeFileSync(
    path.join(archiveDir, 'advancedToDoArchive.yaml'),
    yaml.dump(doneYaml)
  );
  fs.writeFileSync(
    srcJson,
    JSON.stringify(jsonData.filter((i) => i.status !== 'done'), null, 2)
  );
  fs.writeFileSync(srcYaml, yaml.dump(yamlData.filter((i: any) => i.status !== 'done')));
  return 'archived';
}

if (require.main === module) {
  console.log(archiveAdvancedTodos());
}
