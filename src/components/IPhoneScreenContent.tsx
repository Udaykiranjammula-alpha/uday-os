import React, { useState } from 'react';
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
import { SpotlightSearch } from './SpotlightSearch';
import type { Project } from '../types';

export interface IPhoneScreenContentProps {
  color: 'plum' | 'desert';
  setColor: (c: 'plum' | 'desert') => void;
  currentRoute: string;
  onNavigate: (route: string) => void;
  activeProject: Project | null;
  setActiveProject: (p: Project | null) => void;
  isDemoOpen: boolean;
  setIsDemoOpen: (open: boolean) => void;
  time?: Date;
  onOpenSearch: () => void;
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
}: IPhoneScreenContentProps) {
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [brightness, setBrightness] = useState(1.0);
  const [flashlightOn, setFlashlightOn] = useState(false);

  const isInApp = currentRoute !== 'home' || activeProject !== null || isDemoOpen;

  return (
    <div
      className={`iphone-screen iphone-amoled-display appearance-dark ${isInApp ? 'in-app' : `wallpaper-${color}`}`}
      style={{ filter: brightness < 1 ? `brightness(${brightness})` : undefined }}
    >
      {/* Fullscreen Flashlight Beam Effect */}
      {flashlightOn && (
        <div
          className="phone-flashlight-beam"
          onClick={() => setFlashlightOn(false)}
          title="Tap to turn off flashlight"
        >
          <div className="beam-glow" />
          <span className="beam-hint">Torch Active · Tap to Turn Off</span>
        </div>
      )}

      {/* Dynamic Island */}
      <DynamicIsland />

      {/* Status Bar (Right side taps trigger iOS 18 Control Center) */}
      <StatusBar time={time} onOpenControlCenter={() => setIsControlCenterOpen(true)} />

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
              <GitHubApp onBack={() => onNavigate('home')} />
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
              <AiAssistantApp onBack={() => onNavigate('home')} />
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
        onOpenApp={(app) => {
          setIsControlCenterOpen(false);
          onNavigate(app);
        }}
      />

      {/* iOS Home Indicator Bar */}
      <div
        className="ios-home-indicator-pill"
        onClick={() => {
          setActiveProject(null);
          setIsDemoOpen(false);
          onNavigate('home');
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setActiveProject(null);
            setIsDemoOpen(false);
            onNavigate('home');
          }
        }}
        aria-label="Return to iOS Home Screen"
      />
    </div>
  );
}
