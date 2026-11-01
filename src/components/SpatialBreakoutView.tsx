import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Eye,
  Terminal,
  Globe,
  Disc3,
  Play,
  Pause,
  ExternalLink,
  Sparkles,
  Maximize2,
} from 'lucide-react';
import { sound } from '../services/sound';

interface SpatialBreakoutViewProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (route: string) => void;
}

export function SpatialBreakoutView({
  isOpen,
  onClose,
  onNavigate,
}: SpatialBreakoutViewProps) {
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isPinching, setIsPinching] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => {
      setIsPinching(true);
      sound.playTapSound();
    };

    const handleMouseUp = () => {
      setIsPinching(false);
    };

    if (isOpen) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isOpen]);

  const handleToggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.toggleAmbientMusic((p) => setIsPlayingMusic(p));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="spatial-breakout-overlay"
          className="visionos-spatial-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={onClose}
        >
          {/* VisionOS Ambient Blurred Space */}
          <div className="visionos-ambient-blur" />

          {/* VisionOS Floating Gaze Cursor */}
          <div
            className={`visionos-gaze-cursor ${isPinching ? 'pinching' : ''}`}
            style={{
              transform: `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0)`,
            }}
          >
            <div className="gaze-outer-ring" />
            <div className="gaze-center-dot" />
          </div>

          {/* Top Control Bar */}
          <div className="visionos-top-hud" onClick={(e) => e.stopPropagation()}>
            <div className="visionos-pill-badge">
              <Sparkles size={14} className="text-cyan-400" />
              <span>VisionOS Spatial Computing</span>
            </div>

            <button
              type="button"
              className="visionos-exit-btn"
              onClick={onClose}
              aria-label="Exit Spatial View"
            >
              <X size={16} />
              <span>Exit Spatial Mode</span>
            </button>
          </div>

          {/* Spatial 3D Orbiting Windows Container */}
          <div
            className="visionos-stage-3d"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 1. Left Window: Systems Terminal Window */}
            <motion.div
              className="visionos-glass-window window-left"
              initial={{ x: -120, opacity: 0, rotateY: 18 }}
              animate={{ x: 0, opacity: 1, rotateY: 14 }}
              exit={{ x: -120, opacity: 0, rotateY: 18 }}
              transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
            >
              <div className="glass-window-header">
                <Terminal size={14} className="text-emerald-400" />
                <span>Systems Terminal</span>
                <div className="window-dots">
                  <span className="dot red" />
                  <span className="dot yellow" />
                  <span className="dot green" />
                </div>
              </div>
              <div className="glass-terminal-body">
                <p className="code-line prompt">$ uday-os --status</p>
                <p className="code-line status">Architecture: TypeScript + WebGL 60fps</p>
                <p className="code-line log">[OK] 184 LeetCode solutions cached</p>
                <p className="code-line log">[OK] A18 Pro 3nm Silicon Engine online</p>
                <p className="code-line log">[OK] Zero memory leaks detected</p>
                <p className="code-line prompt">$</p>
              </div>
              <button
                type="button"
                className="window-footer-action"
                onClick={() => {
                  onClose();
                  onNavigate?.('terminal');
                }}
              >
                <span>Full Terminal</span>
                <ExternalLink size={12} />
              </button>
            </motion.div>

            {/* 2. Top Window: Apple Music Spatial Audio Player */}
            <motion.div
              className="visionos-glass-window window-top"
              initial={{ y: -80, opacity: 0, rotateX: -14 }}
              animate={{ y: 0, opacity: 1, rotateX: -8 }}
              exit={{ y: -80, opacity: 0, rotateX: -14 }}
              transition={{ delay: 0.15, duration: 0.5, ease: 'easeOut' }}
            >
              <div className="glass-window-header">
                <Disc3 size={15} className={`text-rose-500 ${isPlayingMusic ? 'animate-spin' : ''}`} />
                <span>Spatial Audio &middot; Lo-Fi Systems</span>
                <span className="spatial-tag">Dolby Atmos</span>
              </div>
              <div className="spatial-music-content">
                <div className="track-text">
                  <strong>Lo-Fi Systems Stream</strong>
                  <small>Uday OS Ambient Experience</small>
                </div>
                <button
                  type="button"
                  className="spatial-play-btn"
                  onClick={handleToggleMusic}
                >
                  {isPlayingMusic ? <Pause size={16} /> : <Play size={16} fill="currentColor" />}
                </button>
              </div>
            </motion.div>

            {/* 3. Right Window: 3D GitHub & Verified Experience */}
            <motion.div
              className="visionos-glass-window window-right"
              initial={{ x: 120, opacity: 0, rotateY: -18 }}
              animate={{ x: 0, opacity: 1, rotateY: -14 }}
              exit={{ x: 120, opacity: 0, rotateY: -18 }}
              transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
            >
              <div className="glass-window-header">
                <Globe size={14} className="text-cyan-400" />
                <span>GitHub Repository Node</span>
                <span className="spatial-tag">365d Active</span>
              </div>
              <div className="spatial-gh-stats">
                <div className="stat-item">
                  <span className="stat-label">Verified Repos</span>
                  <strong>50+</strong>
                </div>
                <div className="stat-item">
                  <span className="stat-label">LeetCode</span>
                  <strong>184+</strong>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Degree</span>
                  <strong>B.Tech CSE</strong>
                </div>
              </div>
              <button
                type="button"
                className="window-footer-action"
                onClick={() => {
                  onClose();
                  onNavigate?.('github');
                }}
              >
                <span>Inspect Repositories</span>
                <ExternalLink size={12} />
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
