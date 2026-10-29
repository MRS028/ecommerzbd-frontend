import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// @ts-expect-error CSS is loaded by the bundler, not TypeScript.
import './index.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);