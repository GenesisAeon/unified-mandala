import { EventEmitter } from 'events';
import { CREPEntry } from './types';

export interface CREPState {
  history: CREPEntry[];
}

export type CREPAction = { type: 'ADD'; entry: CREPEntry } | { type: 'RESET' };

export class CREPContext extends EventEmitter {
  private state: CREPState;

  constructor(initial: CREPState = { history: [] }) {
    super();
    this.state = initial;
  }

  dispatch(action: CREPAction) {
    switch (action.type) {
      case 'ADD':
        this.state.history.push(action.entry);
        this.emit('update', this.state);
        break;
      case 'RESET':
        this.state.history = [];
        this.emit('update', this.state);
        break;
      default:
        // ignore
        break;
    }
  }

  getState() {
    return this.state;
  }
}
