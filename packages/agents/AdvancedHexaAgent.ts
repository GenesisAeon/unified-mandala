import { HexaAgentSystem } from './HexaAgentSystem';
import { ResearchAgent } from './ResearchAgent';
import { SilenceWatcher } from './silenceWatcher';

export class AdvancedHexaAgent extends HexaAgentSystem {
  research = new ResearchAgent();
  silence = new SilenceWatcher();

  async process(logs: string[], query: string) {
    const base = this.processLogs(logs);
    const research = await this.research.fetch(query);
    const silenceAlert = this.silence.shouldAnalyze();
    return { ...base, research, silenceAlert };
  }
}
