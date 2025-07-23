import fs from 'fs';
import { createAgentService } from '../init-agent-service';

const TMP_DIR = 'tmp-test-agent';

afterEach(() => {
  fs.rmSync(TMP_DIR, { recursive: true, force: true });
});

describe('createAgentService', () => {
  it('creates agent service skeleton', () => {
    const file = createAgentService('TestAgent', TMP_DIR);
    expect(fs.existsSync(file)).toBe(true);
    const content = fs.readFileSync(file, 'utf8');
    expect(content).toMatch('class TestAgent');
  });
});
