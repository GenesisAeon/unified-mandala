const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { grepJsonArrayFile } = require('../packages/shared-utils/jsonFragmenter');

function parseAdvancedConversations(filePath, destDir, keyword = 'TODO') {
  const regex = new RegExp(keyword, 'i');
  return grepJsonArrayFile(filePath, destDir, regex);
}

/**
 * Convert a plain voice note transcript into advancedToDo entries.
 * Each line beginning with "TODO:" becomes a task object.
 *
 * @param {string} transcript - Raw transcript text
 * @param {string} [outDir] - Optional output directory for JSON/YAML files
 * @returns {Array} List of task objects
 */
function extractTodosFromVoiceNote(transcript, outDir) {
  const tasks = [];
  transcript.split(/\r?\n/).forEach((line) => {
    const match = line.match(/TODO:\s*(.+)/i);
    if (match) {
      tasks.push({
        commit: match[0].trim(),
        path: '',
        task: match[1].trim(),
        test: '',
        status: 'open',
      });
    }
  });

  if (outDir) {
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'advancedToDo.voice.json'), JSON.stringify(tasks, null, 2));
    fs.writeFileSync(path.join(outDir, 'advancedToDo.voice.yaml'), yaml.dump(tasks));
  }

  return tasks;
}

if (require.main === module) {
  const arg = process.argv[2];
  if (arg === '--voice-note') {
    const voiceFile = process.argv[3];
    if (!voiceFile) {
      console.error('Usage: parse-advanced-conversations.js --voice-note <file>');
      process.exit(1);
    }
    const transcript = fs.readFileSync(voiceFile, 'utf8');
    const outDir = path.join(__dirname, '../advancedToDo_parts');
    const tasks = extractTodosFromVoiceNote(transcript, outDir);
    console.log(`Extracted ${tasks.length} tasks from voice note to ${outDir}`);
  } else {
    const file = path.join(__dirname, '../docs/sigils/advancedconversations.json');
    const dest = path.join(__dirname, '../docs/sigils/advancedconversations');
    const keyword = arg || 'TODO';
    const matches = parseAdvancedConversations(file, dest, keyword);
    console.log(`Parsed ${matches.length} fragments containing '${keyword}'. Output: ${dest}`);
  }
}

module.exports = { parseAdvancedConversations, extractTodosFromVoiceNote };
