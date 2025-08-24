import { randomUUID } from 'crypto';

interface Teamboard {
  id: string;
  name: string;
  teams: string[];
}

/**
 * TeamboardManager manages boards for specialized GPT teams and
 * allows attaching team names to persistent boards.
 */
export default class TeamboardManager {
  private boards: Map<string, Teamboard> = new Map();

  /**
   * Create a new teamboard with the given name.
   * @returns The generated board id.
   */
  createBoard(name: string): string {
    const id = randomUUID();
    this.boards.set(id, { id, name, teams: [] });
    return id;
  }

  /**
   * Add a team name to an existing board.
   * Throws if the board does not exist.
   */
  addTeam(boardId: string, teamName: string): void {
    const board = this.boards.get(boardId);
    if (!board) {
      throw new Error(`Board ${boardId} not found`);
    }
    board.teams.push(teamName);
  }

  /**
   * List all teams attached to a board.
   * Throws if the board does not exist.
   */
  listTeams(boardId: string): string[] {
    const board = this.boards.get(boardId);
    if (!board) {
      throw new Error(`Board ${boardId} not found`);
    }
    return [...board.teams];
  }

  /**
   * Retrieve a board with metadata.
   */
  getBoard(boardId: string): Teamboard | undefined {
    return this.boards.get(boardId);
  }
}
