import fs from 'fs';
function randomId() {
  return Math.random().toString(36).substring(2, 10);
}

export interface SigillinTemplate {
  id: string;
  phrase: string;
}

export function generateSigillin(phrase: string): SigillinTemplate {
  return { id: randomId(), phrase };
}

export function saveSigillin(template: SigillinTemplate, file: string): void {
  fs.writeFileSync(file, JSON.stringify(template, null, 2), 'utf-8');
}
