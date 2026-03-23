import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

console.log(
  "%c🚀 Welcome to Awais Codex!%c\nEmpowering your viral journey.",
  "color: #3b82f6; font-size: 20px; font-weight: bold; padding: 4px 0;",
  "color: #9ca3af; font-size: 14px;"
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
