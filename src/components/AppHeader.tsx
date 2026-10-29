import React from 'react';
import { ArrowLeft, Grid2X2 } from 'lucide-react';

interface AppHeaderProps {
  title: string;
  onBack?: () => void;
  onHome: () => void;
  rightAction?: React.ReactNode;
}

export function AppHeader({ title, onBack, onHome, rightAction }: AppHeaderProps) {
  return (
    <header className="phone-app-header">
      <button
        type="button"
        className="header-nav-btn"
        onClick={onBack ?? onHome}
        aria-label={onBack ? 'Go back' : 'Return to home screen'}
      >
        {onBack ? <ArrowLeft size={16} /> : <Grid2X2 size={16} />}
      </button>

      <h1 className="header-title" title={title}>
        {title}
      </h1>

      <div className="header-right-zone">
        {rightAction || (
          <button
            type="button"
            className="header-home-btn"
            onClick={onHome}
            aria-label="Home screen"
          >
            <Grid2X2 size={16} />
          </button>
        )}
      </div>
    </header>
  );
}
