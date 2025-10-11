import { spawn } from 'child_process';
const proc = spawn('pnpm', ['-s', 'agents:health'], { shell: true, stdio: 'inherit' });
proc.on('exit', (code) => process.exit(code ?? 1));
