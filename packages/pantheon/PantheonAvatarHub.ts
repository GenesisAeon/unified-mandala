export interface Avatar {
  id: string;
  name: string;
}

export class PantheonAvatarHub {
  private avatars: Avatar[] = [];

  register(a: Avatar) {
    this.avatars.push(a);
  }

  list(): Avatar[] {
    return this.avatars;
  }
}
