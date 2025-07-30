export interface MandalaElement {
  type: string;
  attributes: Record<string, string>;
}

export class MandalaReader {
  parseSvg(svg: string): MandalaElement[] {
    const regex = /<(circle|rect|path|polygon|line|ellipse)([^>]*)>/g;
    const elements: MandalaElement[] = [];
    let match: RegExpExecArray | null;
    while ((match = regex.exec(svg))) {
      const attrs: Record<string, string> = {};
      const attrRegex = /(\w+)="([^"]*)"/g;
      let attrMatch: RegExpExecArray | null;
      while ((attrMatch = attrRegex.exec(match[2]))) {
        attrs[attrMatch[1]] = attrMatch[2];
      }
      elements.push({ type: match[1], attributes: attrs });
    }
    return elements;
  }
}
