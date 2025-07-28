export class PantheonFeedbackService {
  collectFeedback(msg: string): string {
    return `feedback:${msg}`;
  }

  gatherFeedback(agents: string[]): string[] {
    return agents.map(a => this.collectFeedback(a));
  }
}
