export class FeedbackAgent {
  constructor(private hook: (path: string) => void) {}

  onFileCreated(path: string) {
    this.hook(path);
  }
}
