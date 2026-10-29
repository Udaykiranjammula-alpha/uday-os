import React from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import type { AppId } from '../types';
import { AppIcon } from './AppIcon';
import { profile } from '../data/profile';

interface HomeScreenProps {
  onOpen: (id: AppId) => void;
  onSearch: () => void;
  onControlCenter: () => void;
  time: Date;
}

const mainAppIds: AppId[] = [
  'about',
  'projects',
  'github',
  'linkedin',
  'instagram',
  'skills',
  'resume',
  'education',
  'achievements',
  'notes',
  'terminal',
  'settings',
];

const dockAppIds: AppId[] = ['projects', 'github', 'notes', 'contact'];

export function HomeScreen({ onOpen, onSearch, onControlCenter, time }: HomeScreenProps) {
  const formattedDay = time.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="home-screen-container">
      {/* Top Header Bar */}
      <div className="home-top-bar">
        <div className="system-pill">
          <span className="live-status-dot" aria-hidden="true" />
          <span className="system-pill-text">UDAY OS 2.0</span>
        </div>
        <button
          type="button"
          className="control-center-trigger-btn"
          onClick={onControlCenter}
          aria-label="Open Control Center"
        >
          <SlidersHorizontal size={14} />
          <span>Control</span>
        </button>
      </div>

      {/* Greeting Banner */}
      <motion.div
        className="home-hero"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <p className="home-date">{formattedDay}</p>
        <h2 className="home-headline">
          My world,
          <br />
          <em>one tap away.</em>
        </h2>
        <p className="home-subtext">
          {profile.role} · {profile.university}
        </p>
      </motion.div>

      {/* Spotlight Search Shortcut */}
      <button
        type="button"
        className="home-search-bar"
        onClick={onSearch}
        aria-label="Open Spotlight search (Shortcut: Command or Control plus K)"
      >
        <Search size={15} />
        <span className="search-placeholder">Search apps, projects, skills...</span>
        <kbd className="search-kbd">⌘ K</kbd>
      </button>

      {/* Primary Grid of Apps */}
      <div className="home-app-grid" role="grid" aria-label="Applications Grid">
        {mainAppIds.map((id) => (
          <AppIcon key={id} id={id} onOpen={onOpen} />
        ))}
      </div>

      {/* Bottom Floating Dock */}
      <div className="home-dock-wrapper">
        <div className="home-dock" role="toolbar" aria-label="Pinned Dock Applications">
          {dockAppIds.map((id) => (
            <AppIcon key={`dock-${id}`} id={id} onOpen={onOpen} isDock />
          ))}
        </div>
      </div>

      {/* Page Dots Indicator */}
      <div className="home-page-dots" aria-hidden="true">
        <span className="dot active" />
        <span className="dot" />
      </div>
    </div>
  );
}
