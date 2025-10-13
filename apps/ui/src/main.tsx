import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './shell/App';
import './rum';

createRoot(document.getElementById('root')!).render(<App />);
