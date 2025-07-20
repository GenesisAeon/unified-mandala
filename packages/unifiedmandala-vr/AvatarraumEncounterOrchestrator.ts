export class AvatarraumEncounterOrchestrator {
  private participants: string[] = [];

  join(id: string) {
    this.participants.push(id);
  }

  count() {
    return this.participants.length;
  }
}
