const fs = require('fs');

function splitJsonArray(items, chunkSize) {
  const chunks = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize));
  }
  return chunks;
}

function splitJsonArrayFile(filePath, chunkSize) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw);
  if (!Array.isArray(data)) {
    throw new Error('Input JSON must be an array');
  }
  return splitJsonArray(data, chunkSize);
}

function writeJsonChunks(filePath, destDir, chunkSize) {
  const chunks = splitJsonArrayFile(filePath, chunkSize);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  const base = filePath.replace(/\.json$/i, '');
  chunks.forEach((chunk, idx) => {
    const outPath = `${destDir}/${base.split('/').pop()}-${idx + 1}.json`;
    fs.writeFileSync(outPath, JSON.stringify(chunk, null, 2), 'utf8');
  });
}

module.exports = { splitJsonArray, splitJsonArrayFile, writeJsonChunks };
