import fs from 'fs';
import path from 'path';

export interface Fragment {
  id: string;
  content: any;
}

export class ZIPMEMManagementAgent {
  constructor(private baseDir = 'GenesisAeonZIPMEM/fragments') {}

  organize(fragments: Fragment[]): void {
    fragments.forEach((f) => {
      const dir = path.join(this.baseDir, f.id);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'fragment.json'), JSON.stringify(f, null, 2));
    });
  }

  detectLinks(fragments: Fragment[]): Record<string, string[]> {
    const links: Record<string, string[]> = {};
    const regex = /[a-f0-9]{8}-[a-f0-9-]{27}/g;
    fragments.forEach((f) => {
      const str = JSON.stringify(f.content);
      const matches = str.match(regex);
      if (matches && matches.length) {
        links[f.id] = Array.from(new Set(matches));
      }
    });
    return links;
  }
}
