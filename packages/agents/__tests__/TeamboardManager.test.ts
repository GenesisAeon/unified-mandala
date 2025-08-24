import { describe, it, expect } from 'vitest';
import TeamboardManager from '../TeamboardManager';

describe('TeamboardManager', () => {
  it('creates boards and manages teams', () => {
    const manager = new TeamboardManager();
    const boardId = manager.createBoard('alpha');
    manager.addTeam(boardId, 'Team A');
    manager.addTeam(boardId, 'Team B');

    expect(manager.listTeams(boardId)).toEqual(['Team A', 'Team B']);

    const board = manager.getBoard(boardId);
    expect(board?.name).toBe('alpha');
  });

  it('throws when accessing unknown boards', () => {
    const manager = new TeamboardManager();
    expect(() => manager.addTeam('missing', 'X')).toThrow();
    expect(() => manager.listTeams('missing')).toThrow();
  });
});
