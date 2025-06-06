import fs from 'fs';
import { splitText, splitFile } from './textFragmenter';

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
});
