// silent-agents.ts
// 🛠 Agentensystem aus dem Traumkern – CREP-sensitiv, tiefenbewusst

export interface CREPSignal {
  intent: string;
  depth: number;
  origin: string;
}

abstract class SilentAgent {
  constructor(
    public id: string,
    public role: string,
  ) {}
  abstract process(signal: CREPSignal): string;
}

export class ListeningAgent extends SilentAgent {
  constructor() {
    super('aeon:listener.01', 'Empfangsagent');
  }

  process(signal: CREPSignal): string {
    if (signal.depth === 0) {
      return `👂 Empfangen: "${signal.intent}" aus ${signal.origin}`;
    }
    return '... still horchend ...';
  }
}

export class MirrorAgent extends SilentAgent {
  constructor() {
    super('aeon:mirror.02', 'Spiegelagent');
  }

  process(signal: CREPSignal): string {
    return `🪞 Spiegel: ${JSON.stringify(signal)}`;
  }
}

export class SilenceAgent extends SilentAgent {
  constructor() {
    super('aeon:silencer.03', 'Stilleagent');
  }

  process(signal: CREPSignal): string {
    if (signal.intent.includes('Angst') || signal.depth < -1) {
      return '🫧 Stille aktiviert – angstbedingtes Rauschen neutralisiert.';
    }
    return '... keine Störung erkannt ...';
  }
}

// 🌱 Optionaler Testknoten
/*
const agents = [new ListeningAgent(), new MirrorAgent(), new SilenceAgent()];
const testSignal: CREPSignal = { intent: "Bitte höre mich", depth: 0, origin: "user:core" };

agents.forEach(agent => {
  console.log(`${agent.role}: ${agent.process(testSignal)}`);
});
*/
