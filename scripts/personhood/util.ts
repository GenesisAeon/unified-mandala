import { KEYWORDS } from "./kw";
import { RX } from "./regexes";

export type ConvItem = {
  when?: string | number;
  author?: string | null;
  channel?: string | null;
  text?: string | null;
  message?: string | null;
  content?: string | null;
  [k: string]: any;
};

export function extractText(item: ConvItem): string {
  return item.text ?? item.message ?? item.content ?? "";
}

export function findKeywords(t: string): string[] {
  const hits: string[] = [];
  const lower = t.toLowerCase();
  for (const k of KEYWORDS) {
    if (lower.includes(k.toLowerCase())) hits.push(k);
  }
  for (const [name, rx] of Object.entries(RX)) {
    if (rx.test(t)) hits.push(name);
  }
  return Array.from(new Set(hits));
}
