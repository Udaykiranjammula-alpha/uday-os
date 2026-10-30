import React, { useState, useEffect, useCallback } from 'react';
import { Phone3DCanvas, type PhoneFinish } from './components/Phone3DCanvas';
import { IPhoneScreenContent } from './components/IPhoneScreenContent';
import { Rotate3d, Share2, QrCode, Copy, Check, X, Sparkles } from 'lucide-react';
import type { Project } from './types';
import { profile } from './data/profile';
import { sound } from './services/sound';
import { toggleHardwareTorch } from './services/torch';

export default function App() {
  const [color, setColor] = useState<'plum' | 'desert' | 'natural' | 'black'>('plum');
  const [studioLighting, setStudioLighting] = useState<'keynote' | 'cyberpunk' | 'golden'>('keynote');
  const [isFlipped, setIsFlipped] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'home';
  });
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [flashlightOn, setFlashlightOn] = useState(false);

  const handleToggleFlashlight = useCallback((on: boolean) => {
    setFlashlightOn(on);
    void toggleHardwareTorch(on);
  }, []);

  const handleFlipChange = useCallback((flipped: boolean) => {
    setIsFlipped(flipped);
  }, []);

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

  const finishKey: PhoneFinish =
    color === 'desert'
      ? 'cosmic-orange'
      : color === 'natural'
      ? 'natural-titanium'
      : color === 'black'
      ? 'black-titanium'
      : 'dark-cherry';

  const handleCopyLink = () => {
    sound.playTapSound();
    const liveUrl = 'https://uday-os-five.vercel.app/';
    if (navigator.clipboard) {
      void navigator.clipboard.writeText(liveUrl);
    }
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2400);
  };

  return (
    <main className={`pocket-studio studio-light lighting-${studioLighting}`}>
      {/* Top Left: Finish Swatches & Lighting Presets */}
      <div className="finish-picker-group">
        <div className="finish-picker" role="radiogroup" aria-label="Titanium Finishes">
          {/* Desert Titanium */}
          <button
            type="button"
            role="radio"
            aria-checked={color === 'desert'}
            aria-label="Desert Titanium Finish"
            title="Desert Titanium"
            onClick={() => {
              sound.playTapSound();
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
              sound.playTapSound();
              setColor('plum');
              if (isFlipped) setIsFlipped(false);
            }}
          >
            <i style={{ background: '#3a1e27' }} />
          </button>

          {/* Natural Titanium */}
          <button
            type="button"
            role="radio"
            aria-checked={color === 'natural'}
            aria-label="Natural Brushed Titanium Finish"
            title="Natural Titanium"
            onClick={() => {
              sound.playTapSound();
              setColor('natural');
              if (isFlipped) setIsFlipped(false);
            }}
          >
            <i style={{ background: '#9b9893' }} />
          </button>

          {/* Space Black Titanium */}
          <button
            type="button"
            role="radio"
            aria-checked={color === 'black'}
            aria-label="Space Black Stealth Titanium Finish"
            title="Space Black Titanium"
            onClick={() => {
              sound.playTapSound();
              setColor('black');
              if (isFlipped) setIsFlipped(false);
            }}
          >
            <i style={{ background: '#1c1c1e' }} />
          </button>
        </div>

        {/* 3D Studio Lighting Mode Selector */}
        <div className="studio-lighting-strip" title="Studio Lighting Preset">
          <button
            type="button"
            className={`lighting-pill ${studioLighting === 'keynote' ? 'active' : ''}`}
            onClick={() => setStudioLighting('keynote')}
            title="Apple Keynote Studio Lighting"
          >
            Keynote
          </button>
          <button
            type="button"
            className={`lighting-pill ${studioLighting === 'cyberpunk' ? 'active' : ''}`}
            onClick={() => setStudioLighting('cyberpunk')}
            title="Cyberpunk Neon Rim-Lighting"
          >
            Cyberpunk
          </button>
          <button
            type="button"
            className={`lighting-pill ${studioLighting === 'golden' ? 'active' : ''}`}
            onClick={() => setStudioLighting('golden')}
            title="Sunset Golden Hour Lighting"
          >
            Golden
          </button>
        </div>
      </div>

      {/* Right: Studio Navigation */}
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

        {/* Studio Dock: Flip Phone & Share QR */}
        <div className="studio-flip-dock">
          <button
            type="button"
            className={`studio-flip-pill ${isFlipped ? 'flipped' : ''}`}
            onClick={() => {
              sound.playTapSound();
              setIsFlipped(!isFlipped);
            }}
            aria-label={isFlipped ? 'Flip to front screen' : 'Flip to 3D titanium back'}
            title="Flip 3D iPhone (or drag 360°)"
          >
            <Rotate3d size={14} />
            <span>{isFlipped ? 'View Screen' : 'View Back (360°)'}</span>
          </button>

          <button
            type="button"
            className="studio-flip-pill share-btn"
            onClick={() => {
              sound.playTapSound();
              setIsShareOpen(true);
            }}
            title="Share portfolio & scan QR for phone"
            aria-label="Open Share Modal"
          >
            <Share2 size={13} />
            <span>Share & QR</span>
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
          onFlipChange={handleFlipChange}
          flashlightOn={flashlightOn}
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
            flashlightOn={flashlightOn}
            setFlashlightOn={handleToggleFlashlight}
            onFlipToBack={() => setIsFlipped(true)}
          />
        </Phone3DCanvas>
      </div>

      {/* Share & Mobile QR Code Modal */}
      {isShareOpen && (
        <div className="studio-modal-backdrop" onClick={() => setIsShareOpen(false)}>
          <div className="studio-share-card" onClick={(e) => e.stopPropagation()}>
            <header className="share-card-header">
              <div className="share-header-left">
                <QrCode size={20} className="text-cyan" />
                <h3>Open UDAY OS on your Mobile</h3>
              </div>
              <button
                type="button"
                className="share-close-btn"
                onClick={() => setIsShareOpen(false)}
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </header>

            <div className="share-qr-body">
              <div className="share-qr-frame">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https%3A%2F%2Fuday-os-five.vercel.app%2F"
                  alt="Scannable QR code for UDAY OS"
                  className="share-qr-image"
                  width={180}
                  height={180}
                />
              </div>
              <p className="share-qr-caption">
                Scan with your iPhone or Android camera to experience UDAY OS as a native mobile web app!
              </p>
            </div>

            <footer className="share-card-footer">
              <button
                type="button"
                className="copy-link-btn"
                onClick={handleCopyLink}
              >
                {copiedUrl ? <Check size={14} className="text-green" /> : <Copy size={14} />}
                <span>{copiedUrl ? 'Copied to Clipboard!' : 'Copy Live Portfolio Link'}</span>
              </button>
            </footer>
          </div>
        </div>
      )}
    </main>
  );
}
