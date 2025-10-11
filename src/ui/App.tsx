import React from 'react';
import SigillinIndexPanel from './panels/SigillinIndexPanel';
import Era5CrepPanel from './panels/Era5CrepPanel';

export default function App() {
  const path = typeof window !== 'undefined' ? window.location.pathname : '/';
  if (path === '/sigils') return <SigillinIndexPanel />;
  return <Era5CrepPanel />;
}
