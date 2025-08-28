export interface Space {
  id: string;
  name: string;
  members: string[];
}

/**
 * In-memory manager for collaboration spaces.
 */
export class Spaces {
  private spaces = new Map<string, Space>();
  private counter = 0;

  /**
   * Creates a new space with a generated id.
   */
  createSpace(name: string): Space {
    const id = `${Date.now().toString(36)}-${this.counter++}`;
    const space: Space = { id, name, members: [] };
    this.spaces.set(id, space);
    return space;
  }

  /**
   * Adds a member to the given space.
   */
  addMember(spaceId: string, member: string): void {
    const space = this.spaces.get(spaceId);
    if (!space) throw new Error(`Space not found: ${spaceId}`);
    if (!space.members.includes(member)) space.members.push(member);
  }

  /**
   * Lists members of a space.
   */
  listMembers(spaceId: string): string[] {
    const space = this.spaces.get(spaceId);
    if (!space) throw new Error(`Space not found: ${spaceId}`);
    return [...space.members];
  }
}
