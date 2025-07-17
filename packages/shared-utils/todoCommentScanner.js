"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanTodoComments = scanTodoComments;
function scanTodoComments(text) {
    var regex = /TODO[:\s](.*)/g;
    var matches = [];
    var m;
    while ((m = regex.exec(text)) !== null) {
        matches.push(m[1].trim());
    }
    return matches;
}
