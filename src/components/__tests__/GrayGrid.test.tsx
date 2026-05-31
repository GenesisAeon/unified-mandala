// @vitest-environment jsdom
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import GrayGrid, { GRAY_ORDER, stateFromId } from '../GrayGrid/GrayGrid';
import { buildTesseractEdges } from '../HypercubeView/HypercubeView';

function hammingDistance(a: number, b: number): number {
  let d = a ^ b;
  let count = 0;
  while (d) {
    count += d & 1;
    d >>= 1;
  }
  return count;
}

describe('GRAY_ORDER — Hamming-Distanz-Invariante', () => {
  it('hat exakt 16 Zustände', () => {
    expect(GRAY_ORDER).toHaveLength(16);
  });

  it('enthält alle Zustände 0..15 genau einmal', () => {
    const sorted = [...GRAY_ORDER].sort((a, b) => a - b);
    expect(sorted).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
  });

  it('jede benachbarte Zelle hat Hamming-Distanz = 1', () => {
    for (let i = 0; i < GRAY_ORDER.length - 1; i++) {
      const hd = hammingDistance(GRAY_ORDER[i], GRAY_ORDER[i + 1]);
      expect(hd).toBe(1);
    }
  });
});

describe('stateFromId', () => {
  it('berechnet ID korrekt (8*C + 4*R + 2*E + P)', () => {
    expect(stateFromId(11)).toMatchObject({ C: 1, R: 0, E: 1, P: 1, id: 11, binary: '1011' });
    expect(stateFromId(0)).toMatchObject({ C: 0, R: 0, E: 0, P: 0, id: 0, binary: '0000' });
    expect(stateFromId(15)).toMatchObject({ C: 1, R: 1, E: 1, P: 1, id: 15, binary: '1111' });
  });
});

describe('GrayGrid Komponente', () => {
  it('rendert 16 Zellen', () => {
    render(<GrayGrid />);
    const cells = screen.getAllByRole('gridcell');
    expect(cells).toHaveLength(16);
  });

  it('markiert aktiven Zustand korrekt', () => {
    render(<GrayGrid currentStateId={5} />);
    const activeCell = screen.getByRole('gridcell', { name: /Q4 Zustand 5/ });
    expect(activeCell).toHaveAttribute('aria-pressed', 'true');
  });

  it('ruft onStateClick mit korrekter ID auf', () => {
    const onClick = jest.fn();
    render(<GrayGrid onStateClick={onClick} />);
    const cell = screen.getByRole('gridcell', { name: /Q4 Zustand 3/ });
    fireEvent.click(cell);
    expect(onClick).toHaveBeenCalledWith(3);
  });
});

describe('Tesserakt-Topologie', () => {
  it('hat exakt 32 Kanten', () => {
    const edges = buildTesseractEdges();
    expect(edges).toHaveLength(32);
  });

  it('alle Kanten haben Hamming-Distanz = 1', () => {
    const edges = buildTesseractEdges();
    for (const [a, b] of edges) {
      expect(hammingDistance(a, b)).toBe(1);
    }
  });

  it('kein Zustand ist mit sich selbst verbunden', () => {
    const edges = buildTesseractEdges();
    for (const [a, b] of edges) {
      expect(a).not.toBe(b);
    }
  });
});
