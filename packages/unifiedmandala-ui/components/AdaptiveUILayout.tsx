import React from 'react';
import { useBreakpoint } from '../hooks/useBreakpoint';

export interface AdaptiveUILayoutProps {
  mobile: React.ReactNode;
  desktop: React.ReactNode;
  threshold?: number;
}

const AdaptiveUILayout: React.FC<AdaptiveUILayoutProps> = ({ mobile, desktop, threshold }) => {
  const isMobile = useBreakpoint(threshold);
  return <>{isMobile ? mobile : desktop}</>;
};

export default AdaptiveUILayout;
