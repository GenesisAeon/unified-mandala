import fs from 'fs';
import { splitText, splitFile, splitTextByModel, MAX_TOKENS_BY_MODEL } from './textFragmenter';

describe('textFragmenter', () => {
  it('splits text into chunks', () => {
    const chunks = splitText('abcdefgh', 3);
    expect(chunks).toEqual(['abc', 'def', 'gh']);
  });

  it('splits file content', () => {
    const path = __dirname + '/tmp.txt';
    fs.writeFileSync(path, 'abcdef', 'utf8');
    const chunks = splitFile(path, 2);
    expect(chunks).toEqual(['ab', 'cd', 'ef']);
    fs.unlinkSync(path);
  });
  it('splits text by model token limits', () => {
    const text = 'abcdefghij';
    MAX_TOKENS_BY_MODEL['tiny'] = 2; // 8 characters
    const chunks = splitTextByModel(text, 'tiny');
    expect(chunks).toEqual(['abcdefgh', 'ij']);
    delete MAX_TOKENS_BY_MODEL['tiny'];
  });
  it('exposes gpt-5 token capacity', () => {
    expect(MAX_TOKENS_BY_MODEL['gpt-5']).toBe(200000);
  });
});
