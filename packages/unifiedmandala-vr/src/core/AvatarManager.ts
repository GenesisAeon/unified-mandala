export interface Avatar {
  id: string;
  name: string;
  type: 'human' | 'ai';
}

export class AvatarManager {
  private avatars = new Map<string, Avatar>();

  addAvatar(avatar: Avatar): void {
    this.avatars.set(avatar.id, avatar);
  }

  removeAvatar(id: string): void {
    this.avatars.delete(id);
  }

  getAvatars(): Avatar[] {
    return Array.from(this.avatars.values());
  }
}
