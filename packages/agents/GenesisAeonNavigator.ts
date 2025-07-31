import { GPTEventHub } from '../gpt-bridges/GPTEventHub';
import { UnifiedLogger } from '../core/UnifiedLogger';

export interface GenesisNavigatorOptions {
  phaseMapPath: string;
  logFile?: string;
}

export class GenesisAeonNavigator {
  private phaseMap: Record<string, string>;
  private logger = new UnifiedLogger('GenesisAeonNavigator');
  constructor(private options: GenesisNavigatorOptions) {
    this.phaseMap = this.loadPhaseMap(options.phaseMapPath);
  }

  private loadPhaseMap(file: string): Record<string, string> {
    try {
      const data = require('fs').readFileSync(file, 'utf-8');
      return JSON.parse(data) as Record<string, string>;
    } catch (err) {
      this.logger.error('Failed to load phase map');
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
    }
    this.logger.info(msg);
  }
}
