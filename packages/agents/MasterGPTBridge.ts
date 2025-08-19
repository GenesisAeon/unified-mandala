export interface GPTTeam {
  name: string;
  members: string[];
}

/**
 * MasterGPTBridge orchestrates communication between registered GPT teams.
 * It can register teams and broadcast messages to all teams.
 */
export class MasterGPTBridge {
  private teams: Record<string, GPTTeam> = {};

  registerTeam(team: GPTTeam): void {
    this.teams[team.name] = team;
  }

  getTeam(name: string): GPTTeam | undefined {
    return this.teams[name];
  }

  listTeams(): string[] {
    return Object.keys(this.teams);
  }

  broadcast(message: string): string[] {
    return this.listTeams().map((team) => `[${team}] ${message}`);
  }
}
