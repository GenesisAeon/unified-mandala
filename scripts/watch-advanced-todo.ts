#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';

export function watchAdvancedToDo(
  file: string = path.join(__dirname, '../advancedToDo.json'),
  interval = 5000,
  onChange?: () => void
) {
  let lastMtime = fs.statSync(file).mtimeMs;
  const timer = setInterval(() => {
    fs.stat(file, (err, stats) => {
      if (err) return;
      if (stats.mtimeMs !== lastMtime) {
        lastMtime = stats.mtimeMs;
        onChange && onChange();
      }
    });
  }, interval);
  return () => clearInterval(timer);
}

if (require.main === module) {
  const file = process.argv[2]
    ? path.resolve(process.argv[2])
    : path.join(__dirname, '../advancedToDo.json');
  const interval = Number(process.argv[3]) || 5000;
  watchAdvancedToDo(file, interval, () => {
    console.log(`${file} changed`);
  });
}
