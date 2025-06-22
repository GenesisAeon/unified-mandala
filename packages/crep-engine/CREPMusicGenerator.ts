import { aggregateCREP } from './aggregateCREP';
import { CREPEntry } from './types';

export class CREPMusicGenerator {
  play(entries: CREPEntry[]) {
    const { C } = aggregateCREP(entries);
    console.log(`🎵 Playing at BPM ${Math.round(C * 100)}`);
  }
}
