import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../apps/ui/dist');

const app = express();

app.use((req, res, next) => {
  const enc = req.headers['accept-encoding'] || '';
  if (enc.includes('br') && fs.existsSync(path.join(distDir, req.url + '.br'))) {
    res.set('Content-Encoding', 'br');
    req.url += '.br';
  } else if (enc.includes('gzip') && fs.existsSync(path.join(distDir, req.url + '.gz'))) {
    res.set('Content-Encoding', 'gzip');
    req.url += '.gz';
  }
  next();
});

app.use(express.static(distDir));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Light static server listening on http://127.0.0.1:${port}`);
});
