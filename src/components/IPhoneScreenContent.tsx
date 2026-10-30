import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DynamicIsland } from './DynamicIsland';
import { StatusBar } from './StatusBar';
import { IosHomeScreen } from './IosHomeScreen';
import { ControlCenter } from './ControlCenter';
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
import { RecruiterCallModal } from './RecruiterCallModal';
import { AppSwitcher } from './AppSwitcher';
import { LockScreen } from './LockScreen';
import { SpotlightSearch } from './SpotlightSearch';
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
}: IPhoneScreenContentProps) {
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [isAppSwitcherOpen, setIsAppSwitcherOpen] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [showMagSafe, setShowMagSafe] = useState(false);
  const [brightness, setBrightness] = useState(1.0);
  const [isLocked, setIsLocked] = useState(false);

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
    // Exclude form controls and specialized slider capsules
    if (target?.closest('input, textarea, select, .camera-screen, .cc-slider-capsule, .brightness-slider-container, .volume-slider-container')) {
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

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

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
    if (Math.abs(dy) > 4) {
      state.hasMoved = true;
    }
    if (state.hasMoved) {
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

  return (
    <div
      className={`iphone-screen iphone-amoled-display appearance-dark ${isInApp ? 'in-app' : `wallpaper-${color}`}`}
      style={{ filter: brightness < 1 ? `brightness(${brightness})` : undefined }}
      onPointerDown={onScreenPointerDown}
      onPointerMove={onScreenPointerMove}
      onPointerUp={onScreenPointerUp}
      onPointerCancel={onScreenPointerUp}
      onClickCapture={onScreenClickCapture}
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

      {/* Dynamic Island */}
      <DynamicIsland />

      {/* Status Bar (Right side taps trigger iOS 18 Control Center, battery triggers MagSafe) */}
      <StatusBar
        time={time}
        onOpenControlCenter={() => setIsControlCenterOpen(true)}
        onTriggerMagSafe={triggerMagSafe}
      />

      {/* Screen Router Viewport */}
      <div className="iphone-screen-viewport">
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
              />
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
              <IosContactApp onBack={() => onNavigate('home')} />
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
              <MessagesApp onBack={() => onNavigate('home')} />
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
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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
    </div>
  );
}
