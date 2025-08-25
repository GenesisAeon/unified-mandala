import { describe, it, expect } from 'vitest';
import Jimp from 'jimp';
import { redactImage } from './ImageRedactor';

describe('redactImage', () => {
  it('overlays black boxes on specified regions', async () => {
    const img = new Jimp(10, 10, 0xffffffff);
    const buffer = await img.getBufferAsync(Jimp.MIME_PNG);

    const output = await redactImage(buffer, [{ x: 0, y: 0, width: 5, height: 5 }]);
    const result = await Jimp.read(output);

    const blackPixel = Jimp.intToRGBA(result.getPixelColor(2, 2));
    expect(blackPixel.r).toBe(0);
    expect(blackPixel.g).toBe(0);
    expect(blackPixel.b).toBe(0);

    const whitePixel = Jimp.intToRGBA(result.getPixelColor(7, 7));
    expect(whitePixel.r).toBe(255);
    expect(whitePixel.g).toBe(255);
    expect(whitePixel.b).toBe(255);
  });
});
