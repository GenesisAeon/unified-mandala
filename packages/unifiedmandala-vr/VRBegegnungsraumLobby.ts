export interface HandshakeOptions {
  breathSync?: boolean;
}

export class VRBegegnungsraumLobby {
  private participants: string[] = [];

  enter(id: string) {
    this.participants.push(id);
  }

  getParticipants() {
    return this.participants;
  }

  initiateHandshake(layer: string, options?: HandshakeOptions): string {
    const base = `handshake:${layer}`;
    return options?.breathSync ? `${base}:breath-sync` : base;
  }
}
