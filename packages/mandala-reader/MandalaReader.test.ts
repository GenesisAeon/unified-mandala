import { describe, it, expect } from 'vitest';
import { MandalaReader } from './MandalaReader';

const svg = `<svg><circle cx="50" cy="50" r="10" fill="red" /></svg>`;

describe('MandalaReader', () => {
  it('parses basic svg elements', () => {
    const reader = new MandalaReader();
    const elements = reader.parseSvg(svg);
    expect(elements.length).toBe(1);
    expect(elements[0]).toEqual({
      type: 'circle',
      attributes: { cx: '50', cy: '50', r: '10', fill: 'red' }
    });
  });
});
