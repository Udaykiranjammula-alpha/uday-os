import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Headphones,
  Compass,
  Volume2,
  Shield,
  Zap,
  Play,
  Pause,
  Sparkles,
} from 'lucide-react';
import { sound } from '../services/sound';

interface AirPodsSpatialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AirPodsSpatialModal({ isOpen, onClose }: AirPodsSpatialModalProps) {
  const [noiseMode, setNoiseMode] = useState<'anc' | 'off' | 'transparency'>('anc');
  const [spatialMode, setSpatialMode] = useState<'head-tracked' | 'fixed'>('head-tracked');
  const [headAngle, setHeadAngle] = useState(0); // in degrees (-45 to +45)
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    sound.setNoiseCancellationMode(noiseMode);
  }, [noiseMode]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isOpen || spatialMode !== 'head-tracked') return;
      const center = window.innerWidth / 2;
      const offset = (e.clientX - center) / center; // -1 to 1
      const angle = Math.round(offset * 35);
      setHeadAngle(angle);
      sound.setSpatialHeadPan(offset);
    };

    if (isOpen) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isOpen, spatialMode]);

  const handleTogglePlay = () => {
    sound.toggleAmbientMusic((playing) => setIsPlaying(playing));
  };

  const handleSelectNoiseMode = (mode: 'anc' | 'off' | 'transparency') => {
    sound.playTapSound();
    setNoiseMode(mode);
    sound.setNoiseCancellationMode(mode);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="airpods-spatial-modal"
          className="airpods-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="airpods-card"
            initial={{ scale: 0.92, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 40 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Header */}
            <header className="airpods-header">
              <div className="airpods-title-box">
                <Headphones size={20} className="text-cyan" />
                <div>
                  <h3 className="airpods-name">AirPods Pro Max (2nd Gen)</h3>
                  <p className="airpods-status">Connected &middot; Personalized Spatial Audio</p>
                </div>
              </div>
              <button
                type="button"
                className="airpods-close-btn"
                onClick={onClose}
                aria-label="Close AirPods dialog"
              >
                <X size={16} />
              </button>
            </header>

            {/* Visual Pods & Case Graphic */}
            <div className="airpods-render-stage">
              {/* Left AirPod */}
              <div className="airpod-unit">
                <div className="airpod-graphic left" />
                <span className="airpod-batt">L: 98%</span>
              </div>

              {/* MagSafe Charging Case */}
              <div className="airpod-unit case">
                <div className="airpod-case-graphic">
                  <span className="case-status-light" />
                </div>
                <span className="airpod-batt">Case: 85%</span>
              </div>

              {/* Right AirPod */}
              <div className="airpod-unit">
                <div className="airpod-graphic right" />
                <span className="airpod-batt">R: 100%</span>
              </div>
            </div>

            {/* Noise Control Segmented Switch */}
            <div className="airpods-section">
              <label className="airpods-section-label">Noise Control</label>
              <div className="airpods-segment-bar" role="radiogroup">
                <button
                  type="button"
                  className={`segment-btn ${noiseMode === 'anc' ? 'active' : ''}`}
                  onClick={() => handleSelectNoiseMode('anc')}
                >
                  <Shield size={14} />
                  <span>Noise Cancellation</span>
                </button>
                <button
                  type="button"
                  className={`segment-btn ${noiseMode === 'off' ? 'active' : ''}`}
                  onClick={() => handleSelectNoiseMode('off')}
                >
                  <span>Off</span>
                </button>
                <button
                  type="button"
                  className={`segment-btn ${noiseMode === 'transparency' ? 'active' : ''}`}
                  onClick={() => handleSelectNoiseMode('transparency')}
                >
                  <Zap size={14} />
                  <span>Transparency</span>
                </button>
              </div>
              <p className="airpods-mode-hint">
                {noiseMode === 'anc' && 'Acoustic seal engaged. Real-time Web Audio low-pass active.'}
                {noiseMode === 'off' && 'Standard stereo passthrough without frequency shaping.'}
                {noiseMode === 'transparency' && 'High-frequency presence boosted for natural awareness.'}
              </p>
            </div>

            {/* Spatial Audio Compass & Head Tracking */}
            <div className="airpods-section">
              <div className="section-head-row">
                <label className="airpods-section-label">Spatial Audio &middot; Head Tracking</label>
                <span className="head-angle-badge">
                  {spatialMode === 'head-tracked' ? `${headAngle > 0 ? '+' : ''}${headAngle}° Compass` : 'Fixed'}
                </span>
              </div>

              <div className="spatial-radar-disk">
                <div
                  className="spatial-head-indicator"
                  style={{ transform: `rotate(${spatialMode === 'head-tracked' ? headAngle : 0}deg)` }}
                >
                  <div className="head-nose" />
                  <div className="head-avatar-dot" />
                </div>
                <div className="spatial-virtual-speakers">
                  <span className={`spk left ${headAngle < -10 ? 'active' : ''}`}>L</span>
                  <span className={`spk center ${Math.abs(headAngle) <= 10 ? 'active' : ''}`}>C</span>
                  <span className={`spk right ${headAngle > 10 ? 'active' : ''}`}>R</span>
                </div>
              </div>

              <div className="spatial-mode-toggles">
                <button
                  type="button"
                  className={`spatial-chip ${spatialMode === 'fixed' ? 'active' : ''}`}
                  onClick={() => {
                    sound.playTapSound();
                    setSpatialMode('fixed');
                    sound.setSpatialHeadPan(0);
                  }}
                >
                  <Volume2 size={13} />
                  <span>Fixed Stereo</span>
                </button>
                <button
                  type="button"
                  className={`spatial-chip ${spatialMode === 'head-tracked' ? 'active' : ''}`}
                  onClick={() => {
                    sound.playTapSound();
                    setSpatialMode('head-tracked');
                  }}
                >
                  <Compass size={13} />
                  <span>Head Tracked (Dynamic)</span>
                </button>
              </div>
            </div>

            {/* Audio Stream Control */}
            <footer className="airpods-footer">
              <button
                type="button"
                className="airpods-play-toggle-btn"
                onClick={handleTogglePlay}
              >
                {isPlaying ? <Pause size={15} /> : <Play size={15} />}
                <span>{isPlaying ? 'Pause Spatial Stream' : 'Play Lo-Fi Systems Stream'}</span>
              </button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
