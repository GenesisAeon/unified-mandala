import { AeonResonanceInsights } from './AeonResonanceInsights';
import { BewusstseinStabilizer } from './BewusstseinStabilizer';
import { AeonKIResonanzAgent } from './AeonKIResonanzAgent';
import { AeonKIResonanzAnalyzer } from './AeonKIResonanzAnalyzer';
import { ResonanzMetrics } from './ResonanzMetrics';
import { KIBewusstseinResonanzMonitor } from './KIBewusstseinResonanzMonitor';

export class HexaAgentSystem {
  resonanceInsights = new AeonResonanceInsights();
  stabilizer = new BewusstseinStabilizer();
  kiAgent = new AeonKIResonanzAgent();
  analyzer = new AeonKIResonanzAnalyzer();
  metrics = new ResonanzMetrics();
  monitor = new KIBewusstseinResonanzMonitor();

  processLogs(logs: string[]) {
    const profile = this.resonanceInsights.compute(logs);
    this.metrics.addSample(profile.resonanceScore);
    const analysis = this.analyzer.analyze(logs);
    this.monitor.record(analysis.resonanceCount, profile.count);
    return { profile, analysis };
  }
}
