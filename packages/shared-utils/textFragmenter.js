const fs = require('fs');

function splitText(text, maxLength = 1000) {
  const chunks = [];
  for (let i = 0; i < text.length; i += maxLength) {
    chunks.push(text.slice(i, i + maxLength));
  }
  return chunks;
}

function splitFile(filePath, maxLength = 1000) {
  const content = fs.readFileSync(filePath, 'utf8');
  return splitText(content, maxLength);
}

module.exports = { splitText, splitFile };
