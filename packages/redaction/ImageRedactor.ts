import Jimp from 'jimp';

export interface RedactionRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Overlay black rectangles over the provided regions of a PNG image.
 * @param input Buffer of the PNG image.
 * @param regions Array of regions to redact.
 * @returns Buffer of the redacted PNG image.
 */
export async function redactImage(
  input: Buffer,
  regions: RedactionRegion[]
): Promise<Buffer> {
  const image = await Jimp.read(input);

  for (const { x, y, width, height } of regions) {
    const overlay = new Jimp(width, height, 0x000000ff);
    image.composite(overlay, x, y);
  }

  return await image.getBufferAsync(Jimp.MIME_PNG);
}
