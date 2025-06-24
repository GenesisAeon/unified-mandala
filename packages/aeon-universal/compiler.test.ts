import fs from 'fs';
import path from 'path';
import { compile, transpileToTS } from './compiler';
import { AeonSigillinVault } from '../core/AeonSigillinVault';

const CHRONIK = path.resolve('mandala-chronik.yaml');

describe('AeonUniversal compile', () => {
  beforeEach(() => {
    if (fs.existsSync(CHRONIK)) fs.unlinkSync(CHRONIK);
  });

  it('creates tasks and records memory', () => {
    const result = compile('TASK Demo\nREM Erinnerung');
    expect(result.tasks[0].description).toBe('Demo');
    const content = fs.readFileSync(CHRONIK, 'utf-8');
    expect(content).toContain('Erinnerung');
  });

  it('records sigillin states', () => {
    const spy = jest.spyOn(AeonSigillinVault, 'record');
    compile('SIG Hallo');
    expect(spy).toHaveBeenCalled();
  });

  it('records guard states', () => {
    const spy = jest.spyOn(AeonSigillinVault, 'recordGuard');
    compile('GUARD Schutz');
    expect(spy).toHaveBeenCalled();
  });

  it('includes other files recursively', () => {
    const tmp = path.resolve('tmp.aeon');
    fs.writeFileSync(tmp, 'TASK Subtask');
    const result = compile(`INCLUDE ${tmp}`);
    expect(result.tasks[0].description).toBe('Subtask');
    fs.unlinkSync(tmp);
  });

  it('supports macro definitions and calls', () => {
    const source = [
      'DEFINE greet',
      'TASK Hello',
      'END',
      'CALL greet'
    ].join('\n');
    const result = compile(source);
    expect(result.tasks[0].description).toBe('Hello');
  });

  it('handles context blocks with WITH/ENDWITH', () => {
    const source = ['WITH A', 'TASK Test', 'ENDWITH'].join('\n');
    const result = compile(source);
    expect(result.tasks[0].context).toBe('A');
  });

  it('handles REPEAT blocks', () => {
    const source = ['REPEAT 2', 'TASK R', 'ENDREPEAT'].join('\n');
    const result = compile(source);
    expect(result.tasks.length).toBe(2);
  });

  it('transpiles tasks to TypeScript', () => {
    const res = compile('TASK Demo');
    const ts = transpileToTS(res);
    expect(ts).toContain('aeonTasks');
    expect(ts).toContain('Demo');
  });
});
