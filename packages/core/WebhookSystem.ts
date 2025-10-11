import { EventEmitter } from 'events';

/**
 * WebhookSystem dispatches internal events and notifies external endpoints via HTTP.
 */
export class WebhookSystem extends EventEmitter {
  private hooks: Record<string, string[]> = {};

  /**
   * Register a webhook URL for a specific event.
   */
  register(event: string, url: string) {
    if (!this.hooks[event]) {
      this.hooks[event] = [];
    }
    this.hooks[event].push(url);
  }

  /**
   * Trigger an event and POST the payload to all registered webhook URLs.
   */
  async trigger(event: string, payload: any) {
    this.emit(event, payload);
    const targets = this.hooks[event] || [];
    await Promise.all(
      targets.map((url) =>
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).catch(() => undefined),
      ),
    );
  }
}
