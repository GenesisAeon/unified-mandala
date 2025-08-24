import { randomUUID } from 'crypto';

export interface ReviewItem {
  id: string;
  payload: unknown;
}

/**
 * Simple in-memory queue for review items. This acts as a placeholder
 * for a JetStream backed implementation. Each item is assigned an id
 * if not provided and consumers can pull and decide on items.
 */
export class ReviewerQueue {
  private queue: ReviewItem[] = [];

  enqueue(item: Omit<ReviewItem, 'id'> & { id?: string }): string {
    const id = item.id ?? randomUUID();
    this.queue.push({ id, payload: item.payload });
    return id;
  }

  /**
   * Returns the next item in the queue without removing it.
   */
  peek(): ReviewItem | undefined {
    return this.queue[0];
  }

  /**
   * Removes the next item from the queue and returns it.
   */
  shift(): ReviewItem | undefined {
    return this.queue.shift();
  }

  /**
   * Decide on the next item by providing a callback that returns true
   * when the item is accepted. Items that are rejected are discarded.
   */
  decide(decision: (item: ReviewItem) => boolean): ReviewItem | undefined {
    const item = this.peek();
    if (!item) return undefined;
    this.shift();
    if (decision(item)) {
      return item;
    }
    return undefined;
  }
}
