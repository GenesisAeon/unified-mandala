export class VRResonanceAvatar {
  private level = 0;
  update(level: number) {
    this.level = level;
  }
  getLevel() {
    return this.level;
  }
}
