import fs from 'fs';
import { MemoryManager, MemoryCategory } from './memory-manager';

export class CodexMemoryKernel {
  constructor(
    private file = 'codex-memory.json',
    private manager = new MemoryManager()
  ) {
    this.load();
  }

  add(category: MemoryCategory, text: string) {
    this.manager.add(category, text);
    this.save();
  }

  get(category: MemoryCategory) {
    return this.manager.get(category);
  }

  load() {
    if (fs.existsSync(this.file)) {
      const data = JSON.parse(fs.readFileSync(this.file, 'utf8')) as Record<MemoryCategory, string[]>;
      Object.entries(data).forEach(([cat, entries]) => {
        entries.forEach((e) => this.manager.add(cat as MemoryCategory, e));
      });
    }
  }

  save() {
    const data: Record<MemoryCategory, string[]> = {} as any;
    this.manager.getCategories().forEach((cat) => {
      data[cat] = this.manager.get(cat);
    });
    fs.writeFileSync(this.file, JSON.stringify(data, null, 2), 'utf8');
  }

  stop() {
    this.manager.stop();
  }
}

export default CodexMemoryKernel;
