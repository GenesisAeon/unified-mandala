export class VRMultiAvatar {
  private avatars: string[] = [];

  addAvatar(id: string) {
    this.avatars.push(id);
  }

  listAvatars() {
    return [...this.avatars];
  }
}
