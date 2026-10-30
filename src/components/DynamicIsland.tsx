import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Battery,
  Music,
  Play,
  Pause,
  Wifi,
  Bell,
  X,
  Disc3,
  Flashlight,
  Rotate3d,
  ExternalLink,
} from 'lucide-react';
import { sound } from '../services/sound';

interface DynamicIslandProps {
  notification?: string | null;
  onClearNotification?: () => void;
  flashlightOn?: boolean;
  onToggleFlashlight?: () => void;
  onFlipToBack?: () => void;
  onNavigate?: (route: string) => void;
}

export function DynamicIsland({
  notification,
  onClearNotification,
  flashlightOn = false,
  onToggleFlashlight,
  onFlipToBack,
  onNavigate,
}: DynamicIslandProps) {
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

  const hasActivity = notification || isPlaying || flashlightOn;

  return (
    <div className="dynamic-island-container">
      <motion.div
        layout
        className={`dynamic-island ${expanded ? 'expanded' : ''} ${
          notification ? 'has-notification' : ''
        } ${isPlaying && !expanded ? 'island-active-music' : ''} ${
          flashlightOn && !expanded ? 'island-active-torch' : ''
        }`}
        onClick={() => {
          sound.playTapSound();
          setExpanded(!expanded);
        }}
        role="button"
        tabIndex={0}
        aria-label="Dynamic Island. Click to toggle live activity."
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setExpanded(!expanded);
          }
        }}
        transition={{ type: 'spring', stiffness: 420, damping: 30 }}
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
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="island-expanded-content"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Status Row */}
              <div className="island-header">
                <span className="island-badge">
                  <Music size={11} /> Apple Systems · Live Activity
                </span>
                <span className="battery-badge">
                  <Battery size={12} /> 98%
                </span>
              </div>

              {/* Torch Tile if flashlight is active */}
              {flashlightOn && (
                <div className="island-torch-banner">
                  <div className="torch-banner-left">
                    <span className="torch-emoji">🔦</span>
                    <div>
                      <strong>Rear Flashlight ON</strong>
                      <small>3D Back Torch Emitting Light</small>
                    </div>
                  </div>
                  <div className="torch-banner-actions">
                    {onFlipToBack && (
                      <button
                        type="button"
                        className="island-mini-action-btn"
                        onClick={() => {
                          sound.playTapSound();
                          onFlipToBack();
                          setExpanded(false);
                        }}
                        title="Flip to 3D back"
                      >
                        <Rotate3d size={12} />
                        <span>View Back</span>
                      </button>
                    )}
                    {onToggleFlashlight && (
                      <button
                        type="button"
                        className="island-mini-action-btn toggle-off"
                        onClick={() => {
                          sound.playTapSound();
                          onToggleFlashlight();
                        }}
                      >
                        Turn Off
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Lo-Fi Music Player Row */}
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

              {/* Island Footer */}
              <div className="island-footer">
                <span className="connectivity-pill">
                  <Wifi size={10} /> Fast 5G Connected
                </span>
                {onNavigate && (
                  <button
                    type="button"
                    className="island-app-shortcut-btn"
                    onClick={() => {
                      sound.playTapSound();
                      setExpanded(false);
                      onNavigate('music');
                    }}
                  >
                    <ExternalLink size={10} className="mr-1 inline" />
                    Open Music
                  </button>
                )}
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
          ) : flashlightOn ? (
            <motion.div
              key="compact-torch"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="island-compact-torch"
            >
              <span className="island-mini-torch-icon">🔦</span>
              <span className="island-torch-dot" />
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
