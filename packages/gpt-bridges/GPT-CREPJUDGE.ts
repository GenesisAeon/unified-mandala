export type CREP = { C: number; R: number; E: number; P: number };

export const CREPJUDGE = {
  analyze(crep: CREP) {
    console.log('CREPJUDGE evaluation:', crep);
  }
};
