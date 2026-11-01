import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { IosErrorBoundary } from './components/IosErrorBoundary';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <IosErrorBoundary>
      <App />
    </IosErrorBoundary>
  </StrictMode>,
);
