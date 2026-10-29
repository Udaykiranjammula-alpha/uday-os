import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Battery, Music, Play, Pause, Wifi, Bell, X } from 'lucide-react';

interface DynamicIslandProps {
  notification?: string | null;
  onClearNotification?: () => void;
}

export function DynamicIsland({ notification, onClearNotification }: DynamicIslandProps) {
  const [expanded, setExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="dynamic-island-container">
      <motion.div
        layout
        className={`dynamic-island ${expanded ? 'expanded' : ''} ${notification ? 'has-notification' : ''}`}
        onClick={() => setExpanded(!expanded)}
        role="button"
        tabIndex={0}
        aria-label="Dynamic Island. Click to toggle system widget."
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setExpanded(!expanded);
          }
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        <AnimatePresence mode="wait">
          {notification && !expanded ? (
            <motion.div
              key="notification"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="island-compact-notice"
            >
              <Bell size={12} className="island-bell" />
              <span className="notice-text">{notification}</span>
              {onClearNotification && (
                <button
                  type="button"
                  className="clear-notice-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearNotification();
                  }}
                  aria-label="Dismiss alert"
                >
                  <X size={10} />
                </button>
              )}
            </motion.div>
          ) : expanded ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="island-expanded-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="island-header">
                <span className="island-badge">
                  <Music size={11} /> Ambient Focus
                </span>
                <span className="battery-badge">
                  <Battery size={12} /> 98%
                </span>
              </div>
              <div className="music-player-row">
                <div className="track-info">
                  <strong>Systems & Lo-Fi Beats</strong>
                  <small>UDAY OS Ambient Mode</small>
                </div>
                <div className="player-controls">
                  <button
                    type="button"
                    className="player-btn"
                    onClick={() => setIsPlaying(!isPlaying)}
                    aria-label={isPlaying ? 'Pause music' : 'Play music'}
                  >
                    {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                  </button>
                </div>
              </div>
              {isPlaying && (
                <div className="equalizer-bars" aria-hidden="true">
                  <span className="bar b1" />
                  <span className="bar b2" />
                  <span className="bar b3" />
                  <span className="bar b4" />
                </div>
              )}
              <div className="island-footer">
                <span className="connectivity-pill">
                  <Wifi size={10} /> Fast 5G Connected
                </span>
                <button
                  type="button"
                  className="collapse-btn"
                  onClick={() => setExpanded(false)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="island-default"
            >
              <span className="camera-lens" />
              <span className="sensor-dot" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
