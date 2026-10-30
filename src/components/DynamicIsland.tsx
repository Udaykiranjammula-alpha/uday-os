import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Battery, Music, Play, Pause, Wifi, Bell, X, Disc3 } from 'lucide-react';
import { sound } from '../services/sound';

interface DynamicIslandProps {
  notification?: string | null;
  onClearNotification?: () => void;
}

export function DynamicIsland({ notification, onClearNotification }: DynamicIslandProps) {
  const [expanded, setExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackProgress, setTrackProgress] = useState(18);

  useEffect(() => {
    let timer: number;
    if (isPlaying) {
      timer = window.setInterval(() => {
        setTrackProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleTogglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sound.toggleAmbientMusic((playing) => {
      setIsPlaying(playing);
    });
  };

  return (
    <div className="dynamic-island-container">
      <motion.div
        layout
        className={`dynamic-island ${expanded ? 'expanded' : ''} ${notification ? 'has-notification' : ''} ${isPlaying && !expanded ? 'island-active-music' : ''}`}
        onClick={() => setExpanded(!expanded)}
        role="button"
        tabIndex={0}
        aria-label="Dynamic Island. Click to toggle system widget."
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setExpanded(!expanded);
          }
        }}
        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
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
                  <Music size={11} /> Apple Music · Ambient Focus
                </span>
                <span className="battery-badge">
                  <Battery size={12} /> 98%
                </span>
              </div>
              <div className="music-player-row">
                <div className="island-track-cover">
                  <Disc3 size={24} className={isPlaying ? 'spinning-vinyl' : ''} />
                </div>
                <div className="track-info">
                  <strong>Lo-Fi Systems Stream</strong>
                  <small>UDAY OS · Ambient Mode</small>
                </div>
                <div className="player-controls">
                  <button
                    type="button"
                    className="player-btn"
                    onClick={handleTogglePlay}
                    aria-label={isPlaying ? 'Pause music' : 'Play music'}
                  >
                    {isPlaying ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
                  </button>
                </div>
              </div>

              {/* Progress Bar Scrubber */}
              <div className="island-scrubber-bar">
                <div className="island-scrubber-fill" style={{ width: `${trackProgress}%` }} />
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
                  Done
                </button>
              </div>
            </motion.div>
          ) : isPlaying ? (
            <motion.div
              key="compact-music"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="island-compact-music"
            >
              <Disc3 size={13} className="compact-spinning-disc text-cyan" />
              <div className="compact-mini-eq">
                <span className="ceq-bar eq1" />
                <span className="ceq-bar eq2" />
                <span className="ceq-bar eq3" />
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
