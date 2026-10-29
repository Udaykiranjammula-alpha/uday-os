import React from 'react';
import {
  Moon,
  Sun,
  Palette,
  Zap,
  Volume2,
  VolumeX,
  RotateCcw,
  Info,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import type { ThemeMode, WallpaperStyle } from '../types';

interface SettingsAppProps {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  wallpaper: WallpaperStyle;
  setWallpaper: (w: WallpaperStyle) => void;
  reducedMotion: boolean;
  setReducedMotion: (r: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (s: boolean) => void;
  onReset: () => void;
}

export function SettingsApp({
  theme,
  setTheme,
  wallpaper,
  setWallpaper,
  reducedMotion,
  setReducedMotion,
  soundEnabled,
  setSoundEnabled,
  onReset,
}: SettingsAppProps) {
  return (
    <div className="phone-screen-content">
      {/* Intro Header */}
      <div className="section-intro-block">
        <span className="eyebrow-accent">SYSTEM PREFERENCES</span>
        <h2>Settings & Config</h2>
        <p className="muted-text">
          Customize hardware appearance, motion transitions, and session preferences.
        </p>
      </div>

      <div className="settings-groups-stack">
        {/* Appearance Group */}
        <section className="settings-section-card">
          <span className="settings-group-title">APPEARANCE</span>

          {/* Theme Row */}
          <div className="setting-interactive-row">
            <div className="setting-left">
              <div className="setting-icon-box text-cyan">
                {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
              </div>
              <div className="setting-text">
                <strong>Color Mode</strong>
                <small className="muted-text">Dark graphite vs clean light</small>
              </div>
            </div>

            <div className="segmented-toggle">
              <button
                type="button"
                className={`seg-btn ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => setTheme('dark')}
              >
                Dark
              </button>
              <button
                type="button"
                className={`seg-btn ${theme === 'light' ? 'active' : ''}`}
                onClick={() => setTheme('light')}
              >
                Light
              </button>
            </div>
          </div>

          {/* Wallpaper Row */}
          <div className="setting-interactive-row">
            <div className="setting-left">
              <div className="setting-icon-box text-violet">
                <Palette size={16} />
              </div>
              <div className="setting-text">
                <strong>Wallpaper Tone</strong>
                <small className="muted-text">Aesthetic gradient backing</small>
              </div>
            </div>

            <div className="segmented-toggle">
              {(['graphite', 'violet', 'cyan'] as WallpaperStyle[]).map((w) => (
                <button
                  type="button"
                  key={w}
                  className={`seg-btn ${wallpaper === w ? 'active' : ''}`}
                  onClick={() => setWallpaper(w)}
                >
                  {w.charAt(0).toUpperCase() + w.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Accessibility & Motion */}
        <section className="settings-section-card">
          <span className="settings-group-title">ACCESSIBILITY & MOTION</span>

          {/* Reduced Motion Toggle */}
          <div className="setting-interactive-row">
            <div className="setting-left">
              <div className="setting-icon-box text-amber">
                <Zap size={16} />
              </div>
              <div className="setting-text">
                <strong>Reduced Motion</strong>
                <small className="muted-text">Disables fluid spring translations</small>
              </div>
            </div>

            <button
              type="button"
              className={`toggle-pill-switch ${reducedMotion ? 'active' : ''}`}
              onClick={() => setReducedMotion(!reducedMotion)}
              aria-label={`Reduced Motion is ${reducedMotion ? 'Enabled' : 'Disabled'}`}
            >
              <span className="toggle-thumb" />
            </button>
          </div>

          {/* Sound Toggle */}
          <div className="setting-interactive-row">
            <div className="setting-left">
              <div className="setting-icon-box text-pink">
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </div>
              <div className="setting-text">
                <strong>Sound Effects</strong>
                <small className="muted-text">Tactile audio feedback</small>
              </div>
            </div>

            <button
              type="button"
              className={`toggle-pill-switch ${soundEnabled ? 'active' : ''}`}
              onClick={() => setSoundEnabled(!soundEnabled)}
              aria-label={`Sound effects are ${soundEnabled ? 'Enabled' : 'Disabled'}`}
            >
              <span className="toggle-thumb" />
            </button>
          </div>
        </section>

        {/* Maintenance & Reset */}
        <section className="settings-section-card">
          <span className="settings-group-title">MAINTENANCE</span>

          <button
            type="button"
            className="setting-action-row"
            onClick={onReset}
            aria-label="Reset demo state and purge cached data"
          >
            <div className="setting-left">
              <div className="setting-icon-box text-red">
                <RotateCcw size={16} />
              </div>
              <div className="setting-text">
                <strong>Reset Demo State</strong>
                <small className="muted-text">Clears cache, visits, and lock status</small>
              </div>
            </div>
            <ChevronRight size={16} className="text-muted" />
          </button>
        </section>

        {/* About UDAY OS */}
        <section className="settings-section-card">
          <div className="setting-interactive-row no-border">
            <div className="setting-left">
              <div className="setting-icon-box text-cyan">
                <Info size={16} />
              </div>
              <div className="setting-text">
                <strong>UDAY OS Version 2.0</strong>
                <small className="muted-text">React 18 · TypeScript · Vite · Framer Motion</small>
              </div>
            </div>
          </div>
          <p className="settings-footnote">
            Engineered by Uday Kiran Jammula as an interactive developer portfolio. All apps and navigation stay within the virtual phone viewport.
          </p>
        </section>
      </div>
    </div>
  );
}
