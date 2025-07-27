export interface AvatarOptions {
  color?: string;
  accessory?: string;
}

export class VRAvatarCustomization {
  private options: AvatarOptions = {};

  setOptions(opts: AvatarOptions) {
    this.options = { ...this.options, ...opts };
  }

  getOptions(): AvatarOptions {
    return this.options;
  }
}
