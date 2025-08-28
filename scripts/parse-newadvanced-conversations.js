const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { grepJsonArrayFile, grepJsonArrayFileStream } = require('../packages/shared-utils/jsonFragmenter');

function extractSessionTodos(filePath, titles) {
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const titleSet = new Set(titles);
  const tasks = [];
  raw.forEach(session => {
    if (!titleSet.has(session.title)) return;
    const nodes = Object.values(session.mapping || {});
    nodes.forEach(node => {
      const parts = node.message && node.message.content && node.message.content.parts;
      if (!parts) return;
      parts.forEach(part => {
        part.split('\n').forEach(line => {
          const trimmed = line.trim();
          if (
            /TODO:/i.test(trimmed) ||
            /scripts\/(sync-todo-progress|parse-advanced-conversations)/.test(trimmed) ||
            /(Feature-Extraktion|Progress-Tracking|CI\/CD|Deployment|Modul-Integrationen|UI-Upgrades)/i.test(trimmed)
          ) {
            const taskText = trimmed.replace(/^(?:[-*]|\d+\.)\s*/, '');
            tasks.push({
              commit: trimmed,
              path: '',
              task: taskText,
              test: '',
              status: 'planned'
            });
          }
        });
      });
    });
  });
  return tasks;
}

async function parseNewAdvancedConversations(filePath, destDir, keyword = 'TODO', options = {}) {
  let { writeYaml = false, limit, stream } = options;
  if (stream === undefined) {
    try {
      const size = fs.statSync(filePath).size;
      // Default to streaming for files larger than 10MB
      stream = size > 10 * 1024 * 1024;
    } catch {
      stream = false;
    }
  }
  const regex = new RegExp(keyword, 'i');
  const matches = stream
    ? await grepJsonArrayFileStream(filePath, destDir, regex, limit)
    : grepJsonArrayFile(filePath, destDir, regex, limit);
  if (writeYaml) {
    const base = filePath.replace(/\.json$/i, '');
    const outPath = path.join(destDir, `${path.basename(base)}-grep.yaml`);
    fs.writeFileSync(outPath, yaml.dump(matches));
  }
  return matches;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const opts = {
    file: path.join(__dirname, '../docs/sigils/newadvancedconversations.json'),
    dest: path.join(__dirname, '../GenesisAeonZIPMEM/newadvancedconversations'),
    keyword: 'TODO',
    extract: false,
    titles: [
      'Sigillin Entwicklungszusammenfassung',
      'Programm testen Feedback',
    ],
    yaml: false,
    limit: undefined,
    stream: undefined,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--file':
      case '-f':
        opts.file = path.resolve(args[++i]);
        break;
      case '--dest':
      case '-d':
        opts.dest = path.resolve(args[++i]);
        break;
      case '--keyword':
      case '-k':
        opts.keyword = args[++i] || opts.keyword;
        break;
      case '--extract-todos':
        opts.extract = true;
        break;
      case '--titles':
        opts.titles = (args[++i] || '')
          .split(',')
          .map(t => t.trim())
          .filter(Boolean);
        break;
      case '--yaml':
        opts.yaml = true;
        break;
      case '--limit':
      case '-n':
        opts.limit = parseInt(args[++i], 10);
        break;
      case '--stream':
        opts.stream = true;
        break;
      default:
        // legacy positional keyword
        if (!arg.startsWith('-')) opts.keyword = arg;
    }
  }

  if (opts.extract) {
    const tasks = extractSessionTodos(opts.file, opts.titles);
    const outJson = path.join(opts.dest, 'advancedToDo.part6.json');
    const outYaml = path.join(opts.dest, 'advancedToDo.part6.yaml');
    fs.mkdirSync(opts.dest, { recursive: true });
    fs.writeFileSync(outJson, JSON.stringify(tasks, null, 2));
    fs.writeFileSync(outYaml, yaml.dump(tasks));
    console.log(`Extracted ${tasks.length} tasks to ${outJson}`);
  } else {
    parseNewAdvancedConversations(opts.file, opts.dest, opts.keyword, {
      writeYaml: opts.yaml,
      limit: opts.limit,
      stream: opts.stream,
    }).then(matches => {
      console.log(`Parsed ${matches.length} fragments containing '${opts.keyword}'. Output: ${opts.dest}`);
    });
  }
}

module.exports = { parseNewAdvancedConversations, extractSessionTodos };
