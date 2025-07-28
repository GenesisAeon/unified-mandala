export interface Avatar {
  id: string;
  position: [number, number, number];
}

export class VRMeetingRoom {
  private avatars: Avatar[] = [];

  join(avatar: Avatar) {
    this.avatars.push(avatar);
  }

  list(): Avatar[] {
    return this.avatars;
  }
}
