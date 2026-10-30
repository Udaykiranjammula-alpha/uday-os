import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';
import { sound } from '../services/sound';

export interface AppCard {
  id: string;
  title: string;
  icon: string;
  color: string;
  subtitle: string;
}

export const DEFAULT_APP_DECK: AppCard[] = [
  { id: 'calculator', title: 'Calculator', icon: '🧮', color: '#ff9f0a', subtitle: 'Math & Tech Converter' },
  { id: 'weather', title: 'Weather', icon: '🌦️', color: '#1c3d5a', subtitle: 'Vijayawada 31°C · Sunny' },
  { id: 'wallet', title: 'Wallet', icon: '💳', color: '#27272a', subtitle: 'Titanium Pass & Student ID' },
  { id: 'camera', title: 'Camera', icon: '📸', color: '#1c1c1e', subtitle: 'Live ProRAW Viewfinder' },
  { id: 'arcade', title: 'Arcade', icon: '🕹️', color: '#0b0f19', subtitle: 'Dev Dash: Byte Runner' },
  { id: 'music', title: 'Music', icon: '🎵', color: '#fa2d48', subtitle: 'Lo-Fi Systems Stream' },
  { id: 'github', title: 'GitHub', icon: '🐙', color: '#0d1117', subtitle: 'Udaykiranjammula-alpha' },
  { id: 'linkedin', title: 'LinkedIn', icon: '💼', color: '#0a66c2', subtitle: 'Turning Ideas Into Impact' },
  { id: 'leetcode', title: 'LeetCode', icon: '⚡', color: '#1a1a1a', subtitle: '184+ Solved · Top Algorithms' },
  { id: 'clock', title: 'Clock', icon: '⏱️', color: '#000000', subtitle: 'World Clock & Stopwatch' },
  { id: 'ai', title: 'Uday AI', icon: '🔮', color: '#090a0f', subtitle: 'Voice Intelligence Companion' },
  { id: 'terminal', title: 'Terminal', icon: '💻', color: '#0c0c0c', subtitle: 'ZSH · Systems Shell' },
  { id: 'photos', title: 'Photos', icon: '🖼️', color: '#18181b', subtitle: 'Camera Shots & Media' },
  { id: 'messages', title: 'Messages', icon: '💬', color: '#30d158', subtitle: 'Recruiter Chat' },
];

interface AppSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectApp: (appId: string) => void;
  currentApp?: string;
}

export function AppSwitcher({
  isOpen,
  onClose,
  onSelectApp,
  currentApp,
}: AppSwitcherProps) {
  const [deck, setDeck] = useState<AppCard[]>(DEFAULT_APP_DECK);

  const handleCloseCard = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playTapSound();
    setDeck((prev) => prev.filter((c) => c.id !== id));
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playTapSound();
    setDeck([]);
    setTimeout(() => {
      onSelectApp('home');
      onClose();
    }, 250);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="app-switcher-overlay"
          className="app-switcher-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Header Action Bar */}
          <div className="switcher-top-bar" onClick={(e) => e.stopPropagation()}>
            <span className="switcher-hint">Swipe up to close · Tap to switch</span>
            {deck.length > 0 && (
              <button
                type="button"
                className="switcher-clear-all"
                onClick={handleClearAll}
                title="Close all open applications"
              >
                <Trash2 size={13} />
                <span>Clear All</span>
              </button>
            )}
          </div>

          {/* Horizontal Scrolling 3D Cards Carousel */}
          <div
            className="switcher-cards-scroll"
            onClick={(e) => e.stopPropagation()}
          >
            {deck.map((app, index) => (
              <motion.div
                key={app.id}
                className={`switcher-card ${currentApp === app.id ? 'active-app' : ''}`}
                initial={{ opacity: 0, scale: 0.85, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, y: -180, scale: 0.75 }}
                transition={{ delay: index * 0.04, duration: 0.25 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  sound.playTapSound();
                  onSelectApp(app.id);
                  onClose();
                }}
              >
                {/* App Card Header Pill */}
                <div className="card-header-pill">
                  <div className="card-app-icon" style={{ background: app.color }}>
                    <span>{app.icon}</span>
                  </div>
                  <span className="card-app-name">{app.title}</span>
                  <button
                    type="button"
                    className="card-close-x"
                    onClick={(e) => handleCloseCard(app.id, e)}
                    aria-label={`Close ${app.title}`}
                    title="Close"
                  >
                    <X size={12} />
                  </button>
                </div>

                {/* Card Snapshot Body */}
                <div className="card-preview-body" style={{ background: app.color }}>
                  <div className="card-preview-glimmer" />
                  <div className="card-snapshot-content">
                    <span className="card-big-icon">{app.icon}</span>
                    <strong className="card-snapshot-title">{app.title}</strong>
                    <p className="card-snapshot-sub">{app.subtitle}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {deck.length === 0 && (
              <div className="switcher-empty-state">
                <p>No recent apps</p>
                <button
                  type="button"
                  className="switcher-home-btn"
                  onClick={() => {
                    onSelectApp('home');
                    onClose();
                  }}
                >
                  Return to Home Screen
                </button>
              </div>
            )}
          </div>

          {/* Bottom Home Indicator to Dismiss Switcher */}
          <div
            className="switcher-dismiss-handle"
            onClick={onClose}
            title="Tap to return"
          >
            <div className="ios-home-indicator-pill" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
