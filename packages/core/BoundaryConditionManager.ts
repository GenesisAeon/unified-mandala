import { EventEmitter } from 'events';

export interface NumericBoundary {
  name: string;
  min: number;
  max: number;
}

export class BoundaryConditionManager extends EventEmitter {
  private conditions: Set<string> = new Set();
  private numeric: Map<string, { min: number; max: number }> = new Map();

  constructor() {
    super();
  }

  addCondition(cond: string): void {
    this.conditions.add(cond);
    this.emit('update', { type: 'flag', cond });
  }

  has(cond: string): boolean {
    return this.conditions.has(cond);
  }

  /**
   * Register a numeric boundary.
   */
  addNumericBoundary(name: string, min: number, max: number): void {
    this.numeric.set(name, { min, max });
    this.emit('update', { type: 'numeric', name, min, max });
  }

  /**
   * Check if all provided flags exist.
   */
  checkAll(list: string[]): boolean {
    return list.every((c) => this.conditions.has(c));
  }

  /**
   * Validate a numeric value against a boundary.
   */
  checkValue(name: string, value: number): boolean {
    const b = this.numeric.get(name);
    if (!b) return false;
    return value >= b.min && value <= b.max;
  }
}
