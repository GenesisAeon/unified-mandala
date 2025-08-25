import { spawn } from 'child_process';

function assertWindows() {
  if (process.platform !== 'win32') {
    throw new Error('Windows PowerShell helper can only run on Windows');
  }
}

export interface ExecResult {
  stdout: string;
  stderr: string;
}

/**
 * Execute a PowerShell command and return its output.
 */
export function runPS(command: string): Promise<ExecResult> {
  assertWindows();
  return new Promise((resolve, reject) => {
    const ps = spawn('powershell.exe', ['-NoLogo', '-NoProfile', '-Command', command]);
    let stdout = '';
    let stderr = '';
    ps.stdout.on('data', (d) => (stdout += d));
    ps.stderr.on('data', (d) => (stderr += d));
    ps.on('error', reject);
    ps.on('close', (code) => {
      if (code === 0) resolve({ stdout: stdout.trim(), stderr: stderr.trim() });
      else reject(new Error(`PowerShell exited with code ${code}: ${stderr}`));
    });
  });
}

export async function getClipboard(): Promise<string> {
  const { stdout } = await runPS('Get-Clipboard');
  return stdout;
}

export async function setClipboard(text: string): Promise<void> {
  await runPS(`Set-Clipboard -Value @"${text}"@`);
}

export async function openApp(filePath: string): Promise<void> {
  await runPS(`Start-Process -FilePath \"${filePath}\"`);
}
