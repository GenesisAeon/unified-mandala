export interface AvatarOptions {
  texture?: string;
  color?: string;
}

export class VRAvatarCustomization {
  customize(id: string, options: AvatarOptions = {}): string {
    const texture = options.texture ?? 'default';
    const color = options.color ?? 'white';
    return `${id}:${texture}:${color}`;
  }
}
