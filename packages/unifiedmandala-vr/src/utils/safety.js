function sanitizeInput(text) {
  if (/\battack\b/i.test(text)) return null;
  return text;
}
module.exports = { sanitizeInput };

