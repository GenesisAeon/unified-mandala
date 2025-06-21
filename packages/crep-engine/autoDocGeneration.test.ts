import { autoDocGeneration } from './autoDocGeneration';
import { execSync } from 'child_process';

jest.mock('child_process');

describe('autoDocGeneration', () => {
  it('runs typedoc command', () => {
    autoDocGeneration('README.md', 'out');
    expect(execSync).toHaveBeenCalledWith('npx typedoc README.md --out out', { stdio: 'inherit' });
  });
});
