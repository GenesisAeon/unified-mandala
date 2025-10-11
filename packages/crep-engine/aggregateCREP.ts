import { CREPEntry } from './types';

export function aggregateCREP(entries: CREPEntry[]) {
  const sum = entries.reduce(
    (acc, e) => ({
      C: acc.C + e.C,
      R: acc.R + e.R,
      E: acc.E + e.E,
      P: acc.P + e.P,
    }),
    { C: 0, R: 0, E: 0, P: 0 },
  );
  const len = entries.length || 1;
  return {
    C: sum.C / len,
    R: sum.R / len,
    E: sum.E / len,
    P: sum.P / len,
  };
}
