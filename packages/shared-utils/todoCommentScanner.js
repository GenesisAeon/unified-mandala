'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.scanTodoCommentsInDir = exports.scanTodoComments = void 0;
var fs_1 = require('fs');
var path_1 = require('path');
var glob_1 = require('glob');
function scanTodoComments(text) {
  var regex = /TODO[:\s](.*)/g;
  var matches = [];
  var m;
  while ((m = regex.exec(text)) !== null) {
    matches.push(m[1].trim());
  }
  return matches;
}
exports.scanTodoComments = scanTodoComments;
function scanTodoCommentsInDir(dir) {
  var patterns = ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'];
  var files = (0, glob_1.sync)('{'.concat(patterns.join(','), '}'), {
    cwd: dir,
    ignore: ['node_modules/**', '**/node_modules/**', '**/dist/**'],
  });
  var todos = [];
  for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
    var file = files_1[_i];
    var fullPath = (0, path_1.join)(dir, file);
    var lines = (0, fs_1.readFileSync)(fullPath, 'utf8').split(/\r?\n/);
    lines.forEach(function (line, idx) {
      var m = line.match(/^\s*(?:\/\/|#)\s*TODO[:\s](.*)/);
      if (m) {
        todos.push({ file: fullPath, line: idx + 1, text: m[1].trim() });
      }
    });
  }
  return todos;
}
exports.scanTodoCommentsInDir = scanTodoCommentsInDir;
