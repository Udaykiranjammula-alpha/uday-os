import React, { useState, useEffect } from 'react';
import { Phone3DCanvas } from './components/Phone3DCanvas';
import { IPhoneScreenContent } from './components/IPhoneScreenContent';
import { Rotate3d } from 'lucide-react';
import type { Project } from './types';
import { profile } from './data/profile';

export default function App() {
  const [color, setColor] = useState<'plum' | 'desert'>('plum');
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'home';
  });
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  // Sync route with window.location.hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      setCurrentRoute(hash || 'home');
      setActiveProject(null);
      setIsDemoOpen(false);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route: string) => {
    window.location.hash = `#${route}`;
    setCurrentRoute(route);
    setActiveProject(null);
    setIsDemoOpen(false);
    if (isFlipped) setIsFlipped(false);
  };

  // Keyboard shortcut for Spotlight & Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        navigateTo(currentRoute === 'search' ? 'home' : 'search');
      } else if (e.key === 'Escape' && currentRoute === 'search') {
        navigateTo('home');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentRoute]);

  const finishKey = color === 'desert' ? 'cosmic-orange' : 'dark-cherry';
  const appearance = color === 'desert' ? 'dark' : 'light';

  return (
    <main className={`pocket-studio studio-${appearance}`}>
      {/* Top-Left Finish Picker (Exact prsd.dev swatches) */}
      <div className="finish-picker" role="radiogroup" aria-label="Phone colour">
        {/* Desert Titanium (Cosmic Orange) */}
        <button
          type="button"
          role="radio"
          aria-checked={color === 'desert'}
          aria-label="Desert Titanium Finish"
          title="Desert Titanium"
          onClick={() => {
            setColor('desert');
            if (isFlipped) setIsFlipped(false);
          }}
        >
          <i style={{ background: '#d76c2d' }} />
        </button>

        {/* Deep Plum (Dark Cherry) */}
        <button
          type="button"
          role="radio"
          aria-checked={color === 'plum'}
          aria-label="Deep Plum Dark Titanium Finish"
          title="Deep Plum Titanium"
          onClick={() => {
            setColor('plum');
            if (isFlipped) setIsFlipped(false);
          }}
        >
          <i style={{ background: '#3a1e27' }} />
        </button>
      </div>

      {/* Right: Studio Navigation (Exact prsd.dev layout and typography) */}
      <nav className="studio-nav" aria-label="Portfolio sections">
        <button
          type="button"
          className="studio-nav-name"
          onClick={() => navigateTo('home')}
          aria-label="Close the open app and return to the home screen"
          aria-current={currentRoute === 'home' && !activeProject ? 'page' : undefined}
        >
          {profile.name}
        </button>

        <ul>
          <li>
            <button
              type="button"
              onClick={() => navigateTo('projects')}
              aria-current={currentRoute === 'projects' || activeProject ? 'page' : undefined}
            >
              Projects
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => navigateTo('experience')}
              aria-current={currentRoute === 'experience' ? 'page' : undefined}
            >
              Experience
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => navigateTo('contact')}
              aria-current={currentRoute === 'contact' ? 'page' : undefined}
            >
              Contact
            </button>
          </li>
        </ul>

        {/* Unobtrusive 3D Flip Phone Dock (placed on right so it never overlaps the phone) */}
        <div className="studio-flip-dock">
          <button
            type="button"
            className={`studio-flip-pill ${isFlipped ? 'flipped' : ''}`}
            onClick={() => setIsFlipped(!isFlipped)}
            aria-label={isFlipped ? 'Flip to front screen' : 'Flip to 3D titanium back'}
            title="Flip 3D iPhone (or drag 360°)"
          >
            <Rotate3d size={14} />
            <span>{isFlipped ? 'View Screen' : 'View Back (360°)'}</span>
          </button>
        </div>
      </nav>

      {/* Center: The Interactive Virtual iPhone */}
      <div
        className="phone-world"
        aria-label={`Interactive ${color === 'desert' ? 'Cosmic Orange' : 'Dark Cherry'} iPhone 17 Pro Max portfolio`}
      >
        <Phone3DCanvas
          finish={finishKey}
          isFlipped={isFlipped}
          onFlipChange={(flipped) => setIsFlipped(flipped)}
        >
          <IPhoneScreenContent
            color={color}
            setColor={setColor}
            currentRoute={currentRoute}
            onNavigate={navigateTo}
            activeProject={activeProject}
            setActiveProject={setActiveProject}
            isDemoOpen={isDemoOpen}
            setIsDemoOpen={setIsDemoOpen}
            onOpenSearch={() => navigateTo('search')}
          />
        </Phone3DCanvas>
      </div>
    </main>
  );
}
