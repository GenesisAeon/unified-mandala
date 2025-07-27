export interface AvatarOptions {
  color?: string;
  scale?: number;
}

export interface AvatarConfig extends AvatarOptions {
  id: string;
}

export class VRAvatarCustomization {
  customize(id: string, opts: AvatarOptions): AvatarConfig {
    return { id, ...opts };
  }
}
