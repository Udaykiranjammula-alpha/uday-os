import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DynamicIsland } from './DynamicIsland';
import { PiPOverlay } from './PiPOverlay';
import { StatusBar } from './StatusBar';
import { IosHomeScreen } from './IosHomeScreen';
import { ControlCenter } from './ControlCenter';
import { AboutApp } from '../apps/AboutApp';
import { IosSettingsApp } from '../apps/IosSettingsApp';
import { IosExperienceApp } from '../apps/IosExperienceApp';
import { IosProjectsApp } from '../apps/IosProjectsApp';
import { IosContactApp } from '../apps/IosContactApp';
import { ProjectDetailApp } from '../apps/ProjectDetailApp';
import { DemoPreviewApp } from '../apps/DemoPreviewApp';
import { GitHubApp } from '../apps/GitHubApp';
import { LinkedInApp } from '../apps/LinkedInApp';
import { InstagramApp } from '../apps/InstagramApp';
import { PhotosApp } from '../apps/PhotosApp';
import { SkillsApp } from '../apps/SkillsApp';
import { ResumeApp } from '../apps/ResumeApp';
import { NotesApp } from '../apps/NotesApp';
import { TerminalApp } from '../apps/TerminalApp';
import { CameraApp } from '../apps/CameraApp';
import { AiAssistantApp } from '../apps/AiAssistantApp';
import { LeetCodeApp } from '../apps/LeetCodeApp';
import { MessagesApp } from '../apps/MessagesApp';
import { ArcadeApp } from '../apps/ArcadeApp';
import { ClockApp } from '../apps/ClockApp';
import { AppStoreApp } from '../apps/AppStoreApp';
import { MusicApp } from '../apps/MusicApp';
import { CalculatorApp } from '../apps/CalculatorApp';
import { WeatherApp } from '../apps/WeatherApp';
import { WalletApp } from '../apps/WalletApp';
import { FitnessApp } from '../apps/FitnessApp';
import { StandByApp } from '../apps/StandByApp';
import { FaceTimeApp } from '../apps/FaceTimeApp';
import { GenmojiApp } from '../apps/GenmojiApp';
import { BenchmarkApp } from '../apps/BenchmarkApp';
import { SpatialGalleryApp } from '../apps/SpatialGalleryApp';
import { SplitViewScreen } from './SplitViewScreen';
import { ContactPosterApp } from '../apps/ContactPosterApp';
import { MapsApp } from '../apps/MapsApp';
import { AppleIntelligenceGlow } from './AppleIntelligenceGlow';
import { RecruiterCallModal } from './RecruiterCallModal';
import { AppSwitcher } from './AppSwitcher';
import { AssistiveTouch } from './AssistiveTouch';
import { LockScreen } from './LockScreen';
import { SpotlightSearch } from './SpotlightSearch';
import { IosErrorBoundary } from './IosErrorBoundary';
import type { Project } from '../types';
import { projects } from '../data/projects';
import { sound } from '../services/sound';

export interface IPhoneScreenContentProps {
  color: 'plum' | 'desert' | 'natural' | 'black';
  setColor: (c: 'plum' | 'desert' | 'natural' | 'black') => void;
  currentRoute: string;
  onNavigate: (route: string) => void;
  activeProject: Project | null;
  setActiveProject: (p: Project | null) => void;
  isDemoOpen: boolean;
  setIsDemoOpen: (open: boolean) => void;
  time?: Date;
  onOpenSearch: () => void;
  flashlightOn?: boolean;
  setFlashlightOn?: (on: boolean) => void;
  onFlipToBack?: () => void;
  onOpenLiveActivities?: () => void;
  onOpenActionCarousel?: () => void;
  onOpenCameraControl?: () => void;
  onOpenNameDrop?: () => void;
  onOpenSpatialBreakout?: () => void;
}

export function IPhoneScreenContent({
  color,
  setColor,
  currentRoute,
  onNavigate,
  activeProject,
  setActiveProject,
  isDemoOpen,
  setIsDemoOpen,
  time,
  onOpenSearch,
  flashlightOn = false,
  setFlashlightOn = () => {},
  onFlipToBack,
  onOpenLiveActivities,
  onOpenActionCarousel,
  onOpenCameraControl,
  onOpenNameDrop,
  onOpenSpatialBreakout,
}: IPhoneScreenContentProps) {
  const previousRouteRef = useRef<string>('home');
  useEffect(() => {
    if (currentRoute !== 'ai' && currentRoute !== 'assistant') {
      previousRouteRef.current = currentRoute;
    }
  }, [currentRoute]);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [isAppSwitcherOpen, setIsAppSwitcherOpen] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [showMagSafe, setShowMagSafe] = useState(false);
  const [brightness, setBrightness] = useState(1.0);
  const [isLocked, setIsLocked] = useState(false);
  const [isStandByOpen, setIsStandByOpen] = useState(false);
  const [isAssistiveTouchEnabled, setIsAssistiveTouchEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem('ios_assistive_touch_enabled');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const handleToggleAssistiveTouch = (enabled: boolean) => {
    setIsAssistiveTouchEnabled(enabled);
    try {
      localStorage.setItem('ios_assistive_touch_enabled', JSON.stringify(enabled));
    } catch {}
  };

  const triggerMagSafe = () => {
    sound.playMagSafeSound();
    setShowMagSafe(true);
    setTimeout(() => setShowMagSafe(false), 2400);
  };

  const isInApp = currentRoute !== 'home' || activeProject !== null || isDemoOpen;

  // Authentic mouse drag-to-scroll on desktop across all iPhone apps
  const dragScrollRef = useRef<{
    isDown: boolean;
    startY: number;
    startScrollTop: number;
    scrollTarget: HTMLElement | null;
    hasMoved: boolean;
  }>({
    isDown: false,
    startY: 0,
    startScrollTop: 0,
    scrollTarget: null,
    hasMoved: false,
  });

  // Global window pointerup/cancel to prevent drag locks when cursor exits the frame
  useEffect(() => {
    const handleGlobalPointerUp = () => {
      dragScrollRef.current.isDown = false;
      dragScrollRef.current.scrollTarget = null;
    };
    window.addEventListener('pointerup', handleGlobalPointerUp);
    window.addEventListener('pointercancel', handleGlobalPointerUp);
    return () => {
      window.removeEventListener('pointerup', handleGlobalPointerUp);
      window.removeEventListener('pointercancel', handleGlobalPointerUp);
    };
  }, []);

  const onScreenPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only handle mouse drag-scrolling; touch devices already have native touch scroll
    if (e.pointerType !== 'mouse' || e.button !== 0) return;

    const target = e.target as HTMLElement | null;
    // Exclude buttons, links, form controls, and interactive elements from screen drag-scroll
    if (
      target?.closest(
        'button, a, input, textarea, select, [role="button"], .ios-home-icon-btn, .widget-clickable, .camera-screen, .cc-slider-capsule, .brightness-slider-container, .volume-slider-container, .arcade-canvas-wrap, .arcade-app-page, .calc-grid, .camera-control-sensor-strip, .assistive-touch-float, .assistive-touch-menu, .assistive-touch-backdrop'
      )
    ) {
      return;
    }

    // Find nearest scrollable container
    let node: HTMLElement | null = target;
    let scrollEl: HTMLElement | null = null;
    while (node && !node.classList.contains('iphone-screen')) {
      const style = window.getComputedStyle(node);
      const overflowY = style.overflowY;
      if ((overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight > node.clientHeight + 4) {
        scrollEl = node;
        break;
      }
      node = node.parentElement;
    }

    if (!scrollEl) return;

    dragScrollRef.current = {
      isDown: true,
      startY: e.clientY,
      startScrollTop: scrollEl.scrollTop,
      scrollTarget: scrollEl,
      hasMoved: false,
    };
  };

  const onScreenPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const state = dragScrollRef.current;
    if (!state.isDown || !state.scrollTarget) return;

    const dy = e.clientY - state.startY;
    if (Math.abs(dy) > 5) {
      if (!state.hasMoved) {
        state.hasMoved = true;
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {}
      }
      state.scrollTarget.scrollTop = state.startScrollTop - dy;
    }
  };

  const onScreenPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {}
    dragScrollRef.current.isDown = false;
    dragScrollRef.current.scrollTarget = null;
  };

  const onScreenClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragScrollRef.current.hasMoved) {
      e.preventDefault();
      e.stopPropagation();
      dragScrollRef.current.hasMoved = false;
    }
  };

  // Mouse wheel listener ensuring scrolling works smoothly across all desktop browsers in 3D CSS
  const onScreenWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    let node = e.target as HTMLElement | null;
    while (node && !node.classList.contains('iphone-screen')) {
      const style = window.getComputedStyle(node);
      const overflowY = style.overflowY;
      if (
        (overflowY === 'auto' || overflowY === 'scroll') &&
        node.scrollHeight > node.clientHeight + 2
      ) {
        node.scrollTop += e.deltaY;
        break;
      }
      node = node.parentElement;
    }
  };

  return (
    <div
      className={`iphone-screen iphone-amoled-display appearance-dark ${isInApp ? 'in-app' : `wallpaper-${color}`}`}
      style={{ filter: brightness < 1 ? `brightness(${brightness})` : undefined }}
      onPointerDown={onScreenPointerDown}
      onPointerMove={onScreenPointerMove}
      onPointerUp={onScreenPointerUp}
      onPointerCancel={onScreenPointerUp}
      onClickCapture={onScreenClickCapture}
      onWheel={onScreenWheel}
    >
      {/* Real Flashlight Active Indicator with Quick Flip */}
      {flashlightOn && (
        <div
          className="phone-flashlight-status-pill"
          onClick={() => {
            sound.playTapSound();
            onFlipToBack?.();
          }}
          title="Back Camera Torch Active · Tap to View 3D Back"
        >
          <div className="torch-pulse-ring" />
          <span className="torch-beam-icon">🔦</span>
          <span className="torch-pill-text">Back Flashlight Active · View 3D Back</span>
          <button
            type="button"
            className="torch-off-x"
            onClick={(e) => {
              e.stopPropagation();
              setFlashlightOn(false);
            }}
            aria-label="Turn off flashlight"
            title="Turn off"
          >
            ✕
          </button>
        </div>
      )}

      {/* Dynamic Island 2.0 with Live Activity & Flashlight */}
      <DynamicIsland
        flashlightOn={flashlightOn}
        onToggleFlashlight={() => setFlashlightOn(!flashlightOn)}
        onFlipToBack={onFlipToBack}
        onNavigate={onNavigate}
        onOpenLiveActivities={onOpenLiveActivities}
      />

      {/* Status Bar (Right side taps trigger iOS 18 Control Center, battery triggers MagSafe) */}
      <StatusBar
        time={time}
        onOpenControlCenter={() => setIsControlCenterOpen(true)}
        onTriggerMagSafe={triggerMagSafe}
      />

      {/* Screen Router Viewport */}
      <div className="iphone-screen-viewport">
        <IosErrorBoundary onResetRoute={() => onNavigate('home')}>
          <AnimatePresence mode="wait">
          {isDemoOpen && activeProject ? (
            <motion.div
              key="demo-view"
              className="page-screen-anim"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <DemoPreviewApp
                project={activeProject}
                onBack={() => setIsDemoOpen(false)}
              />
            </motion.div>
          ) : activeProject ? (
            <motion.div
              key="project-detail"
              className="page-screen-anim"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <ProjectDetailApp
                project={activeProject}
                onBack={() => setActiveProject(null)}
                onOpenDemo={() => setIsDemoOpen(true)}
              />
            </motion.div>
          ) : currentRoute === 'settings' ? (
            <motion.div
              key="settings-view"
              className="page-screen-anim"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <IosSettingsApp
                onBack={() => onNavigate('home')}
                color={color}
                setColor={setColor}
                onOpenApp={(app) => onNavigate(app)}
                assistiveTouchEnabled={isAssistiveTouchEnabled}
                onToggleAssistiveTouch={handleToggleAssistiveTouch}
              />
            </motion.div>
          ) : currentRoute === 'about' ? (
            <motion.div
              key="about-view"
              className="page-screen-anim"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', background: '#000000', color: '#fff' }}>
                <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <button
                    type="button"
                    className="mail-nav-back-pill"
                    onClick={() => onNavigate('settings')}
                    aria-label="Back to Settings"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 999, padding: '4px 10px', color: '#38bdf8', fontSize: 13, cursor: 'pointer' }}
                  >
                    <span>‹ Settings</span>
                  </button>
                  <span style={{ fontSize: 15, fontWeight: 700 }}>About Uday</span>
                  <div style={{ width: 44 }} />
                </header>
                <div style={{ flex: 1, overflowY: 'auto', padding: 14 }}>
                  <AboutApp onOpenApp={(app) => onNavigate(app)} />
                </div>
              </div>
            </motion.div>
          ) : currentRoute === 'experience' ? (
            <motion.div
              key="experience-view"
              className="page-screen-anim"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <IosExperienceApp onBack={() => onNavigate('home')} />
            </motion.div>
          ) : currentRoute === 'projects' ? (
            <motion.div
              key="projects-view"
              className="page-screen-anim"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <IosProjectsApp
                onBack={() => onNavigate('home')}
                onOpenProject={(p) => setActiveProject(p)}
              />
            </motion.div>
          ) : currentRoute === 'contact' ? (
            <motion.div
              key="contact-view"
              className="page-screen-anim"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <IosContactApp
                onBack={() => onNavigate('home')}
                onOpenNameDrop={onOpenNameDrop}
              />
            </motion.div>
          ) : currentRoute === 'github' ? (
            <motion.div
              key="github-view"
              className="page-screen-anim"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <GitHubApp
                onBack={() => onNavigate('home')}
                onOpenProjectDetail={(id) => {
                  const found = projects.find((p) => p.id === id);
                  if (found) setActiveProject(found);
                }}
              />
            </motion.div>
          ) : currentRoute === 'linkedin' ? (
            <motion.div
              key="linkedin-view"
              className="page-screen-anim"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <LinkedInApp onBack={() => onNavigate('home')} />
            </motion.div>
          ) : currentRoute === 'photos' || currentRoute === 'gallery' ? (
            <motion.div
              key="photos-view"
              className="page-screen-anim"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <PhotosApp
                onBack={() => onNavigate('home')}
                onOpenCamera={() => onNavigate('camera')}
              />
            </motion.div>
          ) : currentRoute === 'camera' ? (
            <motion.div
              key="camera-view"
              className="page-screen-anim"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
            >
              <CameraApp
                onBack={() => onNavigate('home')}
                onOpenPhotos={() => onNavigate('photos')}
              />
            </motion.div>
          ) : currentRoute === 'ai' || currentRoute === 'assistant' ? (
            <motion.div
              key="ai-view"
              className="page-screen-anim"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
            >
              <AiAssistantApp
                onBack={() => onNavigate('home')}
                onNavigate={onNavigate}
                onToggleFlashlight={() => setFlashlightOn(!flashlightOn)}
                onToggleMusic={() => sound.toggleAmbientMusic()}
                currentRoute={previousRouteRef.current}
              />
            </motion.div>
          ) : currentRoute === 'arcade' ? (
            <motion.div
              key="arcade-view"
              className="page-screen-anim"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <ArcadeApp
                onBack={() => onNavigate('home')}
                onNavigate={onNavigate}
              />
            </motion.div>
          ) : currentRoute === 'clock' ? (
            <motion.div
              key="clock-view"
              className="page-screen-anim"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <ClockApp
                onBack={() => onNavigate('home')}
                onNavigate={onNavigate}
              />
            </motion.div>
          ) : currentRoute === 'appstore' ? (
            <motion.div
              key="appstore-view"
              className="page-screen-anim"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <AppStoreApp
                onBack={() => onNavigate('home')}
                onNavigate={onNavigate}
              />
            </motion.div>
          ) : currentRoute === 'music' ? (
            <motion.div
              key="music-view"
              className="page-screen-anim"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
            >
              <MusicApp
                onBack={() => onNavigate('home')}
                onNavigate={onNavigate}
              />
            </motion.div>
          ) : currentRoute === 'calculator' ? (
            <motion.div
              key="calculator-view"
              className="page-screen-anim"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
            >
              <CalculatorApp
                onBack={() => onNavigate('home')}
                onNavigate={onNavigate}
              />
            </motion.div>
          ) : currentRoute === 'weather' ? (
            <motion.div
              key="weather-view"
              className="page-screen-anim"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
            >
              <WeatherApp
                onBack={() => onNavigate('home')}
                onNavigate={onNavigate}
              />
            </motion.div>
          ) : currentRoute === 'wallet' ? (
            <motion.div
              key="wallet-view"
              className="page-screen-anim"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
            >
              <WalletApp
                onBack={() => onNavigate('home')}
                onNavigate={onNavigate}
              />
            </motion.div>
          ) : currentRoute === 'fitness' ? (
            <motion.div
              key="fitness-view"
              className="page-screen-anim"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
            >
              <FitnessApp
                onBack={() => onNavigate('home')}
                onNavigate={onNavigate}
              />
            </motion.div>
          ) : currentRoute === 'facetime' ? (
            <motion.div
              key="facetime-view"
              className="page-screen-anim"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
            >
              <FaceTimeApp
                onBack={() => onNavigate('home')}
                onNavigate={onNavigate}
              />
            </motion.div>
          ) : currentRoute === 'genmoji' ? (
            <motion.div
              key="genmoji-view"
              className="page-screen-anim"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
            >
              <GenmojiApp
                onBack={() => onNavigate('home')}
                onNavigate={onNavigate}
              />
            </motion.div>
          ) : currentRoute === 'benchmark' ? (
            <motion.div
              key="benchmark-view"
              className="page-screen-anim"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
            >
              <BenchmarkApp
                onBack={() => onNavigate('home')}
                onNavigate={onNavigate}
              />
            </motion.div>
          ) : currentRoute === 'spatial-gallery' ? (
            <motion.div
              key="spatial-gallery-view"
              className="page-screen-anim"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <SpatialGalleryApp
                onBack={() => onNavigate('home')}
                onNavigate={onNavigate}
                onSelectProject={(p) => setActiveProject(p)}
              />
            </motion.div>
          ) : currentRoute === 'splitview' ? (
            <motion.div
              key="splitview-view"
              className="page-screen-anim"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
            >
              <SplitViewScreen
                onClose={() => onNavigate('home')}
                onNavigate={onNavigate}
                activeProject={activeProject}
                setActiveProject={setActiveProject}
              />
            </motion.div>
          ) : currentRoute === 'poster' ? (
            <motion.div
              key="poster-view"
              className="page-screen-anim"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
            >
              <ContactPosterApp
                onBack={() => onNavigate('home')}
                onNavigate={onNavigate}
                onOpenNameDrop={onOpenNameDrop}
              />
            </motion.div>
          ) : currentRoute === 'maps' ? (
            <motion.div
              key="maps-view"
              className="page-screen-anim"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
            >
              <MapsApp
                onBack={() => onNavigate('home')}
                onNavigate={onNavigate}
              />
            </motion.div>
          ) : currentRoute === 'leetcode' ? (
            <motion.div
              key="leetcode-view"
              className="page-screen-anim"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <LeetCodeApp onBack={() => onNavigate('home')} />
            </motion.div>
          ) : currentRoute === 'messages' ? (
            <motion.div
              key="messages-view"
              className="page-screen-anim"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <MessagesApp onBack={() => onNavigate('home')} onNavigate={onNavigate} />
            </motion.div>
          ) : currentRoute === 'instagram' ? (
            <motion.div
              key="instagram-view"
              className="page-screen-anim"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <InstagramApp onBack={() => onNavigate('home')} />
            </motion.div>
          ) : currentRoute === 'skills' ? (
            <motion.div
              key="skills-view"
              className="page-screen-anim"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <SkillsApp onBack={() => onNavigate('home')} />
            </motion.div>
          ) : currentRoute === 'resume' ? (
            <motion.div
              key="resume-view"
              className="page-screen-anim"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <ResumeApp onBack={() => onNavigate('home')} />
            </motion.div>
          ) : currentRoute === 'notes' ? (
            <motion.div
              key="notes-view"
              className="page-screen-anim"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <NotesApp onBack={() => onNavigate('home')} />
            </motion.div>
          ) : currentRoute === 'terminal' ? (
            <motion.div
              key="terminal-view"
              className="page-screen-anim"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <TerminalApp onBack={() => onNavigate('home')} />
            </motion.div>
          ) : currentRoute === 'search' ? (
            <motion.div
              key="search-view"
              className="page-screen-anim"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
            >
              <SpotlightSearch
                onBack={() => onNavigate('home')}
                onNavigateApp={onNavigate}
                onNavigateProject={(p) => {
                  onNavigate('projects');
                  setActiveProject(p);
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="home-view"
              className="page-screen-anim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <IosHomeScreen
                onNavigate={onNavigate}
                onOpenSearch={onOpenSearch}
                onOpenStandBy={() => setIsStandByOpen(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
        </IosErrorBoundary>
      </div>

      {/* Persistent Draggable Picture-in-Picture Floating Multitasking Window */}
      <PiPOverlay onNavigate={onNavigate} />

      {/* iOS 18 Control Center Overlay */}
      <ControlCenter
        isOpen={isControlCenterOpen}
        onClose={() => setIsControlCenterOpen(false)}
        brightness={brightness}
        setBrightness={setBrightness}
        flashlightOn={flashlightOn}
        setFlashlightOn={setFlashlightOn}
        onLockPhone={() => setIsLocked(true)}
        onOpenApp={(app) => {
          setIsControlCenterOpen(false);
          onNavigate(app);
        }}
      />

      {/* iOS 18 Lock Screen Overlay */}
      {isLocked && (
        <LockScreen
          onUnlock={(target) => {
            setIsLocked(false);
            if (target && target !== 'home') onNavigate(target);
          }}
          flashlightOn={flashlightOn}
          onToggleFlashlight={() => setFlashlightOn(!flashlightOn)}
          color={color}
        />
      )}

      {/* Dynamic Island Recruiter Call Simulation Modal */}
      <RecruiterCallModal
        isOpen={isCallModalOpen || currentRoute === 'call'}
        onClose={() => {
          setIsCallModalOpen(false);
          if (currentRoute === 'call') onNavigate('home');
        }}
        onOpenContact={() => {
          setIsCallModalOpen(false);
          onNavigate('contact');
        }}
      />

      {/* Apple MagSafe Charging Circular Ring */}
      {showMagSafe && (
        <div className="magsafe-snap-overlay" onClick={() => setShowMagSafe(false)}>
          <div className="magsafe-charging-circle">
            <div className="magsafe-green-ring" />
            <div className="magsafe-center-info">
              <span className="magsafe-bolt-icon">⚡</span>
              <strong className="magsafe-percentage">100%</strong>
            </div>
          </div>
        </div>
      )}

      {/* iOS 18 Multitasking App Switcher Overlay */}
      <AppSwitcher
        isOpen={isAppSwitcherOpen}
        onClose={() => setIsAppSwitcherOpen(false)}
        onSelectApp={(appId) => {
          setActiveProject(null);
          setIsDemoOpen(false);
          onNavigate(appId);
        }}
        currentApp={currentRoute}
      />

      {/* iOS Home Indicator Bar with App Switcher gesture */}
      <div
        className="ios-home-indicator-pill"
        onClick={() => {
          setActiveProject(null);
          setIsDemoOpen(false);
          onNavigate('home');
        }}
        onDoubleClick={() => {
          sound.playTapSound();
          setIsAppSwitcherOpen(true);
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          sound.playTapSound();
          setIsAppSwitcherOpen(true);
        }}
        title="Tap: Home · Double-Click / Right-Click: App Switcher"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setActiveProject(null);
            setIsDemoOpen(false);
            onNavigate('home');
          }
        }}
        aria-label="Return to iOS Home Screen or Open App Switcher"
      />

      {/* iOS 18 AssistiveTouch Floating Controller & Overlay */}
      {isAssistiveTouchEnabled && !isLocked && !isStandByOpen && (
        <AssistiveTouch
          onNavigate={(route) => {
            setActiveProject(null);
            setIsDemoOpen(false);
            onNavigate(route);
          }}
          onOpenAppSwitcher={() => {
            sound.playTapSound();
            setIsAppSwitcherOpen(true);
          }}
          currentRoute={currentRoute}
          isEnabled={isAssistiveTouchEnabled}
          onToggleEnabled={handleToggleAssistiveTouch}
        />
      )}

      {/* Apple Intelligence Glowing Multicolor Edge Bezel Ribbon */}
      <AppleIntelligenceGlow
        isActive={currentRoute === 'ai' || currentRoute === 'assistant'}
        statusText="Apple Intelligence · Ready to assist"
        isListening={currentRoute === 'ai'}
      />

      {/* iOS 18 StandBy Mode Overlay */}
      {isStandByOpen && (
        <StandByApp
          onClose={() => setIsStandByOpen(false)}
          onNavigate={(route) => {
            setIsStandByOpen(false);
            onNavigate(route);
          }}
        />
      )}

      {/*  Left Rail: iPhone 16 Pro Action Button Bezel Sensor */}
      {onOpenActionCarousel && !isLocked && !isStandByOpen && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            sound.playActionClickSound();
            onOpenActionCarousel();
          }}
          className="ios-action-button-bezel"
          title=" Action Button (Click to configure)"
          aria-label="iPhone 16 Pro Action Button"
          style={{
            position: 'absolute',
            left: 0,
            top: '115px',
            width: '6px',
            height: '42px',
            borderRadius: '0 4px 4px 0',
            background: 'linear-gradient(180deg, #ff9f0a, #d97706)',
            boxShadow: '0 0 10px rgba(255, 159, 10, 0.75), inset 0 0 2px rgba(255, 255, 255, 0.5)',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            zIndex: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'width 0.15s ease, transform 0.1s ease',
          }}
          onPointerEnter={(e) => {
            (e.currentTarget as HTMLElement).style.width = '10px';
          }}
          onPointerLeave={(e) => {
            (e.currentTarget as HTMLElement).style.width = '6px';
          }}
        >
          <span
            style={{
              width: '2.5px',
              height: '14px',
              borderRadius: '2px',
              backgroundColor: '#ffffff',
              boxShadow: '0 0 4px #ffffff',
            }}
          />
        </button>
      )}

      {/*  Right Rail: iPhone 16 Pro Capacitive Camera Control Bezel Sensor */}
      {onOpenCameraControl && !isLocked && !isStandByOpen && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            sound.playShutterSound();
            onOpenCameraControl();
          }}
          className="ios-camera-control-bezel"
          title=" Camera Control (Click to open HUD)"
          aria-label="iPhone 16 Pro Capacitive Camera Control"
          style={{
            position: 'absolute',
            right: 0,
            top: '475px',
            width: '6px',
            height: '56px',
            borderRadius: '4px 0 0 4px',
            background: 'rgba(255, 255, 255, 0.35)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 8px rgba(0, 0, 0, 0.6), inset 0 0 3px rgba(255, 255, 255, 0.4)',
            border: 'none',
            padding: '6px 0',
            cursor: 'pointer',
            zIndex: 44,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'width 0.15s ease, transform 0.1s ease',
          }}
          onPointerEnter={(e) => {
            (e.currentTarget as HTMLElement).style.width = '10px';
          }}
          onPointerLeave={(e) => {
            (e.currentTarget as HTMLElement).style.width = '6px';
          }}
        >
          <span style={{ width: '3px', height: '1.5px', backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '1px' }} />
          <span style={{ width: '3px', height: '1.5px', backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '1px' }} />
          <span style={{ width: '3px', height: '1.5px', backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '1px' }} />
        </button>
      )}
    </div>
  );
}
