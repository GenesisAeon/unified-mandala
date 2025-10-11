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

/**
 * Capture the current screen and return a base64 encoded PNG.
 *
 * This is a lightweight placeholder that relies on a PowerShell
 * script available on the host. The function throws if the platform
 * is not Windows or the capture fails.
 */
export async function captureScreen(): Promise<string> {
  assertWindows();
  // Uses a small PowerShell snippet to grab a screenshot and emit it as Base64.
  const { stdout } = await runPS(
    'Add-Type -AssemblyName System.Windows.Forms, System.Drawing; ' +
      '$bmp = New-Object System.Drawing.Bitmap([System.Windows.Forms.Screen]::PrimaryScreen.Bounds.Width, ' +
      '[System.Windows.Forms.Screen]::PrimaryScreen.Bounds.Height); ' +
      '$graphics = [System.Drawing.Graphics]::FromImage($bmp); ' +
      '$graphics.CopyFromScreen(0,0,0,0,$bmp.Size); ' +
      '$ms = New-Object System.IO.MemoryStream; ' +
      '$bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png); ' +
      '[Convert]::ToBase64String($ms.ToArray())',
  );
  return stdout;
}

/**
 * Execute a UI Automation command. The given PowerShell snippet is
 * passed through directly which allows higher level tooling such as
 * WinUABridge to drive the UI.
 */
export async function runUIACommand(command: string): Promise<void> {
  assertWindows();
  await runPS(command);
}
