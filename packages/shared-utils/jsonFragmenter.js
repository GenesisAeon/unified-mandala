"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitJsonArray = splitJsonArray;
exports.splitJsonArrayFile = splitJsonArrayFile;
exports.writeJsonChunks = writeJsonChunks;
exports.grepJsonArrayFile = grepJsonArrayFile;
exports.extractCodeSnippetsFromFile = extractCodeSnippetsFromFile;
exports.mergeJsonChunks = mergeJsonChunks;
const fs_1 = __importDefault(require("fs"));
/**
 * Splits an array into chunks of the given size.
 * @param items Array of items to chunk.
 * @param chunkSize Size of each chunk.
 */
function splitJsonArray(items, chunkSize) {
    const chunks = [];
    for (let i = 0; i < items.length; i += chunkSize) {
        chunks.push(items.slice(i, i + chunkSize));
    }
    return chunks;
}
/**
 * Reads a JSON array file and splits its content into chunks.
 * @param filePath Path to JSON array file.
 * @param chunkSize Number of items per chunk.
 */
function splitJsonArrayFile(filePath, chunkSize) {
    const raw = fs_1.default.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) {
        throw new Error('Input JSON must be an array');
    }
    return splitJsonArray(data, chunkSize);
}
/**
 * Writes chunks of a JSON array file into separate files.
 * Resulting files are named <basename>-<index>.json in destDir.
 * @param filePath Input JSON array file.
 * @param destDir Destination directory for chunk files.
 * @param chunkSize Number of items per chunk.
 */
function writeJsonChunks(filePath, destDir, chunkSize) {
    const chunks = splitJsonArrayFile(filePath, chunkSize);
    if (!fs_1.default.existsSync(destDir))
        fs_1.default.mkdirSync(destDir, { recursive: true });
    const base = filePath.replace(/\.json$/i, '');
    chunks.forEach((chunk, idx) => {
        const outPath = `${destDir}/${base.split('/').pop()}-${idx + 1}.json`;
        fs_1.default.writeFileSync(outPath, JSON.stringify(chunk, null, 2), 'utf8');
    });
}
/**
 * Filters a JSON array file by a regex applied to each item's stringified form.
 * Matching items are written to <basename>-grep.json in destDir.
 * @param filePath Input JSON array file.
 * @param destDir Destination directory for grep result file.
 * @param pattern Regular expression used to match items.
 * @param limit Optional maximum number of matches to return.
 */
function grepJsonArrayFile(filePath, destDir, pattern, limit) {
    const raw = fs_1.default.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) {
        throw new Error('Input JSON must be an array');
    }
    const matches = [];
    for (const item of data) {
        if (pattern.test(JSON.stringify(item))) {
            matches.push(item);
            if (limit && matches.length >= limit)
                break;
        }
    }
    if (!fs_1.default.existsSync(destDir))
        fs_1.default.mkdirSync(destDir, { recursive: true });
    const base = filePath.replace(/\.json$/i, '');
    const outPath = `${destDir}/${base.split('/').pop()}-grep.json`;
    fs_1.default.writeFileSync(outPath, JSON.stringify(matches, null, 2), 'utf8');
    return matches;
}
/**
 * Extracts code snippets (```code```) from a JSON array file and writes them to individual files.
 * @param filePath Path to JSON array file.
 * @param destDir Output directory for snippets.
 */
function extractCodeSnippetsFromFile(filePath, destDir) {
    const raw = fs_1.default.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) {
        throw new Error('Input JSON must be an array');
    }
    const snippets = [];
    const codeRegex = /```([\s\S]*?)```/g;
    function recurse(obj) {
        if (typeof obj === 'string') {
            let match;
            while ((match = codeRegex.exec(obj))) {
                snippets.push(match[1].trim());
            }
        }
        else if (Array.isArray(obj)) {
            obj.forEach(recurse);
        }
        else if (obj && typeof obj === 'object') {
            Object.values(obj).forEach(recurse);
        }
    }
    data.forEach(recurse);
    if (!fs_1.default.existsSync(destDir))
        fs_1.default.mkdirSync(destDir, { recursive: true });
    snippets.forEach((snippet, idx) => {
        const outPath = `${destDir}/snippet-${idx + 1}.txt`;
        fs_1.default.writeFileSync(outPath, snippet);
    });
    return snippets;
}
/**
 * Merges all JSON array chunk files in a directory into a single output file.
 * The chunks must each contain a JSON array. Files are merged in lexicographical order.
 */
function mergeJsonChunks(dir, outFile) {
    if (!fs_1.default.existsSync(dir))
        throw new Error(`Directory not found: ${dir}`);
    const files = fs_1.default
        .readdirSync(dir)
        .filter(f => f.endsWith('.json'))
        .sort();
    const merged = [];
    for (const f of files) {
        const data = JSON.parse(fs_1.default.readFileSync(`${dir}/${f}`, 'utf8'));
        if (!Array.isArray(data)) {
            throw new Error(`Chunk ${f} is not a JSON array`);
        }
        merged.push(...data);
    }
    fs_1.default.writeFileSync(outFile, JSON.stringify(merged, null, 2), 'utf8');
}
