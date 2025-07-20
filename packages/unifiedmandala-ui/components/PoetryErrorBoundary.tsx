import { Component, ErrorInfo, ReactNode } from 'react';
import fs from 'fs';
import path from 'path';
import PoetryModeContext from '../contexts/PoetryModeContext';

const poem = fs.readFileSync(path.resolve(__dirname, '../../../CHRONOPOEM.md'), 'utf8');

export class PoetryErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  static contextType = PoetryModeContext;
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {}

  render() {
    if (this.state.hasError) {
      const { enabled } = this.context as { enabled: boolean };
      return enabled ? <pre>{poem}</pre> : <div>Error</div>;
    }
    return this.props.children;
  }
}
