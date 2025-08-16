export type OrchestrationTask = () => void;

export class MasterGPTBridge {
  private captainPresent = true;

  setCaptainPresent(present: boolean) {
    this.captainPresent = present;
  }

  orchestrate(task: OrchestrationTask): boolean {
    if (!this.captainPresent) {
      task();
      return true;
    }
    return false;
  }
}
