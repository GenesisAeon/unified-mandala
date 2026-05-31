import React from 'react';
import SigillinIndexPanel from './panels/SigillinIndexPanel';
import Era5CrepPanel from './panels/Era5CrepPanel';
import Q4DashboardPanel from './panels/Q4DashboardPanel';

export default function App() {
  const path = typeof window !== 'undefined' ? window.location.pathname : '/';
  if (path === '/sigils') return <SigillinIndexPanel />;
  if (path === '/q4') return <Q4DashboardPanel />;
  return <Era5CrepPanel />;
}
