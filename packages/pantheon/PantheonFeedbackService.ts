export class PantheonFeedbackService {
  collectFeedback(msg: string): string {
    return `feedback:${msg}`;
  }
}
