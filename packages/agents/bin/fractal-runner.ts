import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import { exec } from 'child_process';

interface TaskEntry {
  command: string;
  sound?: boolean;
}

function playMandalaSoundscape(_metrics: any[]) {
  // Placeholder for future sound integration
  console.log('play soundscape');
}

export async function runTask(file: string) {
  const content = fs.readFileSync(file, 'utf8');
  const data = YAML.parse(content) as { tasks: TaskEntry[] };
  for (const task of data.tasks) {
    console.log('Executing', task.command);
    await new Promise<void>((resolve, reject) => {
      const child = exec(task.command, (err, stdout, stderr) => {
        if (stdout) process.stdout.write(stdout);
        if (stderr) process.stderr.write(stderr);
        if (err) return reject(err);
        resolve();
      });
      child.stdout?.pipe(process.stdout);
      child.stderr?.pipe(process.stderr);
    });
    if (task.sound) {
      playMandalaSoundscape([]);
    }
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);
  if (!args[0]) {
    console.error('Usage: fractal-runner <task-file.yaml>');
    process.exit(1);
  }
  runTask(path.resolve(args[0])).catch((err) => {
    console.error('Fractal-TaskRunner Error:', err);
    process.exit(1);
  });
}
