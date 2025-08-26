import express from 'express';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import path from 'path';

const app = express();
app.use(express.json());

let recorder: ChildProcessWithoutNullStreams | null = null;
let currentFile: string | null = null;

app.post('/start', (req, res) => {
  if (recorder) return res.status(400).json({ error: 'recording already in progress' });
  currentFile = req.body?.output || path.join(process.cwd(), 'recording.mp4');
  const display = process.platform === 'win32' ? 'desktop' : process.env.DISPLAY || ':0.0';
  const args =
    process.platform === 'win32'
      ? ['-y', '-f', 'gdigrab', '-i', display, currentFile]
      : ['-y', '-f', 'x11grab', '-i', display, currentFile];
  recorder = spawn('ffmpeg', args);
  recorder.on('exit', () => {
    recorder = null;
  });
  res.json({ status: 'started', file: currentFile });
});

app.post('/stop', (req, res) => {
  if (!recorder) return res.status(400).json({ error: 'no recording in progress' });
  recorder.once('exit', () => {
    const file = currentFile;
    recorder = null;
    currentFile = null;
    res.json({ status: 'stopped', file });
  });
  recorder.kill('SIGINT');
});

const port = parseInt(process.env.PORT || '4001', 10);
app.listen(port, () => {
  console.log(`Recorder API listening on ${port}`);
});

export default app;
