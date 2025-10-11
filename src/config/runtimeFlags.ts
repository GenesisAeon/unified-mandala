export const LOW_MEM =
  (typeof process !== 'undefined' &&
    (process.env.LOW_MEM === '1' || process.env.LOW_MEM === 'true')) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_LOW_MEM === 'on');
