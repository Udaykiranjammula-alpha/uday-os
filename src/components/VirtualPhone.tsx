import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Screen, BootPhase, AppId, Project, ThemeMode, WallpaperStyle } from '../types';
import { appMeta } from '../data/appMeta';
import { DynamicIsland } from './DynamicIsland';
import { StatusBar } from './StatusBar';
import { BootScreen } from './BootScreen';
import { LockScreen } from './LockScreen';
import { HomeScreen } from './HomeScreen';
import { AppHeader } from './AppHeader';

// Internal Apps
import { AboutApp } from '../apps/AboutApp';
import { ProjectsApp } from '../apps/ProjectsApp';
import { ProjectDetailApp } from '../apps/ProjectDetailApp';
import { DemoPreviewApp } from '../apps/DemoPreviewApp';
import { GitHubApp } from '../apps/GitHubApp';
import { LinkedInApp } from '../apps/LinkedInApp';
import { InstagramApp } from '../apps/InstagramApp';
import { SkillsApp } from '../apps/SkillsApp';
import { ResumeApp } from '../apps/ResumeApp';
import { ContactApp } from '../apps/ContactApp';
import { EducationApp } from '../apps/EducationApp';
import { AchievementsApp } from '../apps/AchievementsApp';
import { NotesApp } from '../apps/NotesApp';
import { TerminalApp } from '../apps/TerminalApp';
import { SettingsApp } from '../apps/SettingsApp';

interface VirtualPhoneProps {
  phase: BootPhase;
  setPhase: (p: BootPhase) => void;
  screen: Screen;
  history: Screen[];
  navigate: (s: Screen) => void;
  goBack: () => void;
  goHome: () => void;
  time: Date;
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  wallpaper: WallpaperStyle;
  setWallpaper: (w: WallpaperStyle) => void;
  reducedMotion: boolean;
  setReducedMotion: (r: boolean) => void;
  brightness: number;
  soundEnabled: boolean;
  setSoundEnabled: (s: boolean) => void;
  onReset: () => void;
  onSearchOpen: () => void;
  onControlCenterOpen: () => void;
  notification: string | null;
  onClearNotification: () => void;
}

export function VirtualPhone({
  phase,
  setPhase,
  screen,
  history,
  navigate,
  goBack,
  goHome,
  time,
  theme,
  setTheme,
  wallpaper,
  setWallpaper,
  reducedMotion,
  setReducedMotion,
  brightness,
  soundEnabled,
  setSoundEnabled,
  onReset,
  onSearchOpen,
  onControlCenterOpen,
  notification,
  onClearNotification,
}: VirtualPhoneProps) {
  const openApp = (app: AppId) => navigate({ kind: 'app', app });
  const openProject = (project: Project) => navigate({ kind: 'project', project });
  const openDemo = (project: Project) => navigate({ kind: 'demo', project });

  const screenKey =
    screen.kind === 'project' || screen.kind === 'demo'
      ? `${screen.kind}-${screen.project.id}`
      : screen.kind === 'app'
      ? `app-${screen.app}`
      : 'home';

  return (
    <div className="virtual-phone-container">
      {/* Outer Titanium Frame */}
      <div className="phone-hardware-rim">
        {/* Subtle Hardware Buttons */}
        <div className="hardware-btn volume-up" aria-hidden="true" />
        <div className="hardware-btn volume-down" aria-hidden="true" />
        <div className="hardware-btn power-btn" aria-hidden="true" />

        {/* Screen Bezel */}
        <div
          className="phone-screen-viewport"
          style={{ filter: `brightness(${brightness}%)` }}
        >
          {/* Dynamic Island Bar */}
          <DynamicIsland
            notification={notification}
            onClearNotification={onClearNotification}
          />

          {/* Status Bar */}
          <StatusBar time={time} />

          {/* Phase 1: Boot Animation */}
          {phase === 'boot' && (
            <BootScreen
              onComplete={() => setPhase('locked')}
              reducedMotion={reducedMotion}
            />
          )}

          {/* Phase 2: Lock Screen */}
          {phase === 'locked' && (
            <LockScreen
              time={time}
              onUnlock={() => {
                sessionStorage.setItem('uday-os-visited', 'true');
                setPhase('ready');
              }}
              reducedMotion={reducedMotion}
            />
          )}

          {/* Phase 3: Unlocked Phone Operating System */}
          {phase === 'ready' && (
            <AnimatePresence mode="wait">
              <motion.div
                key={screenKey}
                className="screen-transition-wrap"
                initial={reducedMotion ? false : { opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0, x: -20 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                {/* Home Screen */}
                {screen.kind === 'home' && (
                  <HomeScreen
                    onOpen={openApp}
                    onSearch={onSearchOpen}
                    onControlCenter={onControlCenterOpen}
                    time={time}
                  />
                )}

                {/* Project Details Screen */}
                {screen.kind === 'project' && (
                  <>
                    <AppHeader
                      title="Project Details"
                      onBack={goBack}
                      onHome={goHome}
                    />
                    <ProjectDetailApp
                      project={screen.project}
                      onBack={goBack}
                      onOpenDemo={() => openDemo(screen.project)}
                    />
                  </>
                )}

                {/* Live Demo Preview Screen */}
                {screen.kind === 'demo' && (
                  <>
                    <AppHeader
                      title="Demo Preview"
                      onBack={goBack}
                      onHome={goHome}
                    />
                    <DemoPreviewApp project={screen.project} onBack={goBack} />
                  </>
                )}

                {/* Internal Application Views */}
                {screen.kind === 'app' && (
                  <>
                    <AppHeader
                      title={appMeta[screen.app].label}
                      onBack={history.length > 0 ? goBack : undefined}
                      onHome={goHome}
                    />

                    {screen.app === 'about' && <AboutApp onOpenApp={openApp} />}
                    {screen.app === 'projects' && (
                      <ProjectsApp onOpenProject={openProject} />
                    )}
                    {screen.app === 'github' && <GitHubApp />}
                    {screen.app === 'linkedin' && <LinkedInApp />}
                    {screen.app === 'instagram' && <InstagramApp />}
                    {screen.app === 'skills' && <SkillsApp />}
                    {screen.app === 'resume' && <ResumeApp />}
                    {screen.app === 'contact' && <ContactApp />}
                    {screen.app === 'education' && <EducationApp />}
                    {screen.app === 'achievements' && <AchievementsApp />}
                    {screen.app === 'notes' && <NotesApp />}
                    {screen.app === 'terminal' && (
                      <TerminalApp onSetTheme={setTheme} />
                    )}
                    {screen.app === 'settings' && (
                      <SettingsApp
                        theme={theme}
                        setTheme={setTheme}
                        wallpaper={wallpaper}
                        setWallpaper={setWallpaper}
                        reducedMotion={reducedMotion}
                        setReducedMotion={setReducedMotion}
                        soundEnabled={soundEnabled}
                        setSoundEnabled={setSoundEnabled}
                        onReset={onReset}
                      />
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Home Gesture Bar / Indicator */}
          <div
            className="phone-home-indicator"
            onClick={goHome}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                goHome();
              }
            }}
            aria-label="Return to UDAY OS Home Screen"
          />
        </div>
      </div>
    </div>
  );
}
