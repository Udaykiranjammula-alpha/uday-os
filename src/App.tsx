import React, { useState, useEffect, useCallback } from 'react';
import { Phone3DCanvas, type PhoneFinish } from './components/Phone3DCanvas';
import { IPhoneScreenContent } from './components/IPhoneScreenContent';
import { ActionButtonCarousel } from './components/ActionButtonCarousel';
import { PhoneTeardownModal } from './components/PhoneTeardownModal';
import { SpatialBreakoutView } from './components/SpatialBreakoutView';
import { NameDropModal } from './components/NameDropModal';
import { AirPodsSpatialModal } from './components/AirPodsSpatialModal';
import { SatelliteRadarModal } from './components/SatelliteRadarModal';
import { AppleWatchCompanion, type VisionOSEnvironment } from './components/AppleWatchCompanion';
import { WritingToolsHUD } from './components/WritingToolsHUD';
import { LiveActivitiesModal } from './components/LiveActivitiesModal';
import { CameraControlHUD } from './components/CameraControlHUD';
import { ApplePayRecruiterSheet } from './components/ApplePayRecruiterSheet';
import { KeynoteStudioHub } from './components/KeynoteStudioHub';
import {
  Rotate3d,
  Share2,
  QrCode,
  Copy,
  Check,
  X,
  Sparkles,
  Cpu,
  Eye,
  Radio,
  Sliders,
  Headphones,
  Satellite,
  Columns,
  Watch,
  Wand2,
  Zap,
  MapPin,
  Camera,
  CreditCard,
} from 'lucide-react';
import type { Project } from './types';
import { profile } from './data/profile';
import { sound } from './services/sound';
import { toggleHardwareTorch } from './services/torch';

export default function App() {
  const [color, setColor] = useState<'plum' | 'desert' | 'natural' | 'black'>('plum');
  const [studioLighting, setStudioLighting] = useState<'keynote' | 'cyberpunk' | 'golden'>('keynote');
  const [isFlipped, setIsFlipped] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isActionCarouselOpen, setIsActionCarouselOpen] = useState(false);
  const [isTeardownOpen, setIsTeardownOpen] = useState(false);
  const [isSpatialOpen, setIsSpatialOpen] = useState(false);
  const [isNameDropOpen, setIsNameDropOpen] = useState(false);
  const [isAirPodsOpen, setIsAirPodsOpen] = useState(false);
  const [isSatelliteOpen, setIsSatelliteOpen] = useState(false);
  const [isWatchOpen, setIsWatchOpen] = useState(true);
  const [isWritingToolsOpen, setIsWritingToolsOpen] = useState(false);
  const [isLiveActivitiesOpen, setIsLiveActivitiesOpen] = useState(false);
  const [isCameraControlOpen, setIsCameraControlOpen] = useState(false);
  const [isApplePayOpen, setIsApplePayOpen] = useState(false);
  const [isKeynoteHubOpen, setIsKeynoteHubOpen] = useState(false);
  const [visionOSEnv, setVisionOSEnv] = useState<VisionOSEnvironment>('steve-jobs');
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

  const handlePingPhoneFromWatch = useCallback(() => {
    sound.playWatchPingSound();
    setFlashlightOn(true);
    setTimeout(() => {
      setFlashlightOn(false);
      void toggleHardwareTorch(false);
    }, 1500);
    void toggleHardwareTorch(true);
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

  // Keyboard shortcut for Spotlight, Action Button, and Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput = target?.matches('input, textarea, select');

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        navigateTo(currentRoute === 'search' ? 'home' : 'search');
      } else if (!isInput && (e.key === 'a' || e.key === 'A') && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        sound.playActionClickSound();
        setIsActionCarouselOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        if (isActionCarouselOpen) setIsActionCarouselOpen(false);
        else if (isTeardownOpen) setIsTeardownOpen(false);
        else if (isSpatialOpen) setIsSpatialOpen(false);
        else if (isNameDropOpen) setIsNameDropOpen(false);
        else if (isAirPodsOpen) setIsAirPodsOpen(false);
        else if (isSatelliteOpen) setIsSatelliteOpen(false);
        else if (isWritingToolsOpen) setIsWritingToolsOpen(false);
        else if (isLiveActivitiesOpen) setIsLiveActivitiesOpen(false);
        else if (isCameraControlOpen) setIsCameraControlOpen(false);
        else if (isApplePayOpen) setIsApplePayOpen(false);
        else if (isKeynoteHubOpen) setIsKeynoteHubOpen(false);
        else if (isShareOpen) setIsShareOpen(false);
        else if (currentRoute === 'search') navigateTo('home');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    currentRoute,
    isActionCarouselOpen,
    isTeardownOpen,
    isSpatialOpen,
    isNameDropOpen,
    isAirPodsOpen,
    isSatelliteOpen,
    isWritingToolsOpen,
    isLiveActivitiesOpen,
    isCameraControlOpen,
    isApplePayOpen,
    isKeynoteHubOpen,
    isShareOpen,
  ]);

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
    <main className={`pocket-studio studio-light lighting-${studioLighting} env-${visionOSEnv}`}>
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

        {/* VisionOS Immersive Environments Switcher */}
        <div className="studio-env-strip" title="VisionOS Immersive Backdrop Environment">
          <button
            type="button"
            className={`env-selector-pill ${visionOSEnv === 'steve-jobs' ? 'active' : ''}`}
            onClick={() => {
              sound.playTapSound();
              setVisionOSEnv('steve-jobs');
            }}
            title="VisionOS: Steve Jobs Theater"
          >
             Theater
          </button>
          <button
            type="button"
            className={`env-selector-pill ${visionOSEnv === 'mount-hood' ? 'active' : ''}`}
            onClick={() => {
              sound.playTapSound();
              setVisionOSEnv('mount-hood');
            }}
            title="VisionOS: Mount Hood Twilight"
          >
            Mt. Hood
          </button>
          <button
            type="button"
            className={`env-selector-pill ${visionOSEnv === 'deep-space' ? 'active' : ''}`}
            onClick={() => {
              sound.playTapSound();
              setVisionOSEnv('deep-space');
            }}
            title="VisionOS: Deep Space Orbit"
          >
            Space
          </button>
          <button
            type="button"
            className={`env-selector-pill ${visionOSEnv === 'cyberpunk' ? 'active' : ''}`}
            onClick={() => {
              sound.playTapSound();
              setVisionOSEnv('cyberpunk');
            }}
            title="VisionOS: Cyberpunk Neon"
          >
            Neon
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

        {/* Studio Dock: Clean Apple Hardware & Keynote Actions */}
        <div className="studio-flip-dock">
          {/* 3D Hardware Flip Button */}
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

          {/* Keynote Studio Hub Trigger */}
          <button
            type="button"
            className="studio-flip-pill keynote-hub-trigger-btn"
            onClick={() => {
              sound.playActionClickSound();
              setIsKeynoteHubOpen(true);
            }}
            title="Open Apple Keynote Studio Showcase (Silicon, VisionOS, Radar, Audio)"
            aria-label="Keynote Studio Hub"
          >
            <Sparkles size={13} className="text-cyan animate-pulse" />
            <span> Keynote Studio (13)</span>
          </button>

          {/* Share & QR Code Pill */}
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

      {/* Center: The Interactive Virtual iPhone & Apple Watch Ultra Companion */}
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
            onOpenLiveActivities={() => setIsLiveActivitiesOpen(true)}
            onOpenActionCarousel={() => setIsActionCarouselOpen(true)}
            onOpenCameraControl={() => setIsCameraControlOpen(true)}
            onOpenNameDrop={() => setIsNameDropOpen(true)}
            onOpenSpatialBreakout={() => setIsSpatialOpen(true)}
          />
        </Phone3DCanvas>

        {/* Apple Watch Ultra 2 Titanium Studio Companion */}
        <AppleWatchCompanion
          isOpen={isWatchOpen}
          onClose={() => setIsWatchOpen(false)}
          onPingPhone={handlePingPhoneFromWatch}
          currentEnv={visionOSEnv}
          onSelectEnv={(env) => setVisionOSEnv(env)}
          onNavigatePhone={navigateTo}
          onTriggerSOS={() => setIsSatelliteOpen(true)}
        />
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

      {/* Action Button Circular Carousel Wheel */}
      <ActionButtonCarousel
        isOpen={isActionCarouselOpen}
        onClose={() => setIsActionCarouselOpen(false)}
        onToggleFlashlight={() => handleToggleFlashlight(!flashlightOn)}
        flashlightOn={flashlightOn}
        onNavigate={navigateTo}
        onOpenTeardown={() => setIsTeardownOpen(true)}
      />

      {/* Apple Keynote A18 Pro 3D Exploded Teardown Modal */}
      <PhoneTeardownModal
        isOpen={isTeardownOpen}
        onClose={() => setIsTeardownOpen(false)}
        onNavigate={navigateTo}
      />

      {/* VisionOS Spatial Breakout 3D Windows */}
      <SpatialBreakoutView
        isOpen={isSpatialOpen}
        onClose={() => setIsSpatialOpen(false)}
        onNavigate={navigateTo}
      />

      {/* Apple NameDrop & AirDrop Liquid Ethereal Wave */}
      <NameDropModal
        isOpen={isNameDropOpen}
        onClose={() => setIsNameDropOpen(false)}
        onNavigate={navigateTo}
      />

      {/* AirPods Pro Spatial Audio & Head Tracking Modal */}
      <AirPodsSpatialModal
        isOpen={isAirPodsOpen}
        onClose={() => setIsAirPodsOpen(false)}
      />

      {/* Apple Emergency SOS via Satellite Orbital Radar */}
      <SatelliteRadarModal
        isOpen={isSatelliteOpen}
        onClose={() => setIsSatelliteOpen(false)}
        onNavigate={navigateTo}
      />

      {/* Apple Intelligence Writing Tools & Code Refactor HUD */}
      <WritingToolsHUD
        isOpen={isWritingToolsOpen}
        onClose={() => setIsWritingToolsOpen(false)}
      />

      {/* Dynamic Island Live Activities Hub */}
      <LiveActivitiesModal
        isOpen={isLiveActivitiesOpen}
        onClose={() => setIsLiveActivitiesOpen(false)}
        onNavigate={navigateTo}
      />

      {/* iPhone 16 Pro Capacitive Camera Control HUD */}
      <CameraControlHUD
        isOpen={isCameraControlOpen}
        onClose={() => setIsCameraControlOpen(false)}
        onOpenFullCamera={() => navigateTo('camera')}
      />

      {/* Apple Pay · Express Recruiter One-Tap Hire Face ID Sheet */}
      <ApplePayRecruiterSheet
        isOpen={isApplePayOpen}
        onClose={() => setIsApplePayOpen(false)}
        onNavigate={navigateTo}
      />

      {/* Apple Keynote Studio Showcase Master Hub */}
      <KeynoteStudioHub
        isOpen={isKeynoteHubOpen}
        onClose={() => setIsKeynoteHubOpen(false)}
        onOpenTeardown={() => setIsTeardownOpen(true)}
        onOpenSpatial={() => setIsSpatialOpen(true)}
        onOpenNameDrop={() => setIsNameDropOpen(true)}
        onOpenAirPods={() => setIsAirPodsOpen(true)}
        onOpenSatellite={() => setIsSatelliteOpen(true)}
        onToggleSplitView={() => navigateTo(currentRoute === 'splitview' ? 'home' : 'splitview')}
        onToggleWatch={() => setIsWatchOpen((prev) => !prev)}
        onOpenWritingTools={() => setIsWritingToolsOpen(true)}
        onOpenLiveActivities={() => setIsLiveActivitiesOpen(true)}
        onOpenMaps={() => navigateTo(currentRoute === 'maps' ? 'home' : 'maps')}
        onOpenCameraControl={() => setIsCameraControlOpen(true)}
        onOpenApplePay={() => setIsApplePayOpen(true)}
        onOpenActionCarousel={() => setIsActionCarouselOpen(true)}
        onToggleFlip={() => setIsFlipped(!isFlipped)}
        isFlipped={isFlipped}
      />
    </main>
  );
}
