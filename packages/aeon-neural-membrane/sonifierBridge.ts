import { memoryToTone } from '../nukleon-sonifier';

/** Wandelt einen Aktivierungswert in einen Symbolton um. */
export function sonify(value: number): string {
  return memoryToTone(value);
}
