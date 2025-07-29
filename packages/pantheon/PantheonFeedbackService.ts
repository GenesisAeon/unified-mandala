export class PantheonFeedbackService {
  collectFeedback(msg: string): string {
    return `feedback:${msg}`;
  }

  gatherFeedback(agents: string[]): string[] {
    return agents.map(a => this.collectFeedback(a));
  }

  coordinateRound(
    agents: string[],
    responder: (msg: string) => string
  ): string[] {
    return this.gatherFeedback(agents).map(responder);
  }
}
