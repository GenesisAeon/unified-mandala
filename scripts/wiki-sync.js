const fs = require('fs');
const path = require('path');

/**
 * Synchronize modules with UnifiedMandala Wiki.
 * Currently returns list of markdown files in docs directory.
 * @param {object} [options]
 * @param {string} [options.docsDir] - Optional path to docs directory.
 * @returns {string[]} Array of markdown file names processed.
 */
function syncWiki(options = {}) {
  const docsDir = options.docsDir || path.join(__dirname, '..', 'docs');
  if (!fs.existsSync(docsDir)) return [];
  return fs.readdirSync(docsDir).filter((f) => f.endsWith('.md'));
}

if (require.main === module) {
  const files = syncWiki();
  console.log(`Wiki sync processed ${files.length} markdown files`);
}

module.exports = { syncWiki };
