import { Component, ErrorInfo, ReactNode } from 'react';

export class PoetryErrorBoundary extends Component<{children: ReactNode}> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(_error: Error, _info: ErrorInfo) {}
  render() {
    if (this.state.hasError) return <div>ChronoPoem</div>;
    return this.props.children;
  }
}
