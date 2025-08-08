import { Agent, Task } from '../core/interfaces';

/**
 * ReviewAgent samples conversation fragments for manual validation.
 * It logs the first available message content from the provided conversation
 * structure so that humans can review extracted fragments easily.
 */
export class ReviewAgent implements Agent {
  id = 'ReviewAgent';
  layer = 'analysis';

  handle(task: Task): void {
    const conv = (task as any).conversation;
    if (!conv || typeof conv !== 'object' || !conv.mapping) {
      console.log('📝 ReviewAgent → no conversation provided');
      return;
    }
    const nodes = Object.values(conv.mapping).filter(
      (n: any) => n && n.message && n.message.content
    );
    const fragment = nodes[0] as any;
    if (fragment) {
      console.log(`📝 ReviewAgent → review fragment: ${fragment.message.content}`);
    } else {
      console.log('📝 ReviewAgent → no fragments found');
    }
  }
}
