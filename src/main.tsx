import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { runInitialStorageCleanup } from './utils/storageClean';

// One-time safe reset of legacy demo state (e.g. Alex Vance, fake history, fake notifications)
runInitialStorageCleanup();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
