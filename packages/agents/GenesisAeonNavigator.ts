import { GPTEventHub } from '../gpt-bridges/GPTEventHub';

export interface GenesisNavigatorOptions {
  phaseMapPath: string;
  logFile?: string;
}

export class GenesisAeonNavigator {
  private phaseMap: Record<string, string>;
  constructor(private options: GenesisNavigatorOptions) {
    this.phaseMap = this.loadPhaseMap(options.phaseMapPath);
  }

  private loadPhaseMap(file: string): Record<string, string> {
    try {
      const data = require('fs').readFileSync(file, 'utf-8');
      return JSON.parse(data) as Record<string, string>;
    } catch (err) {
      console.error('Failed to load phase map', err);
      return {};
    }
  }

  public start(): void {
    this.log('GenesisAeonNavigator start');
  }

  public updatePhaseMap(map: Record<string, string>): void {
    this.phaseMap = map;
  }

  public navigate(phase: string): void {
    const next = this.phaseMap[phase];
    if (next) {
      this.log(`Navigate to ${next}`);
      GPTEventHub.emit('genesis:navigate', { from: phase, to: next });
    } else {
      this.log(`Unknown phase: ${phase}`);
    }
  }

  private log(msg: string): void {
    if (this.options.logFile) {
      require('fs').appendFileSync(this.options.logFile, msg + '\n');
    } else {
      console.log(msg);
    }
  }
}
