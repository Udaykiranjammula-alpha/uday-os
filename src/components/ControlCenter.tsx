import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Moon,
  Sun,
  Zap,
  Palette,
  Volume2,
  VolumeX,
  SunMedium,
  Wifi,
  Bluetooth,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import type { ThemeMode, WallpaperStyle } from '../types';

interface ControlCenterProps {
  onClose: () => void;
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  wallpaper: WallpaperStyle;
  setWallpaper: (w: WallpaperStyle) => void;
  reducedMotion: boolean;
  setReducedMotion: (r: boolean) => void;
  brightness: number;
  setBrightness: (b: number) => void;
  soundEnabled: boolean;
  setSoundEnabled: (s: boolean) => void;
  onReset: () => void;
}

export function ControlCenter({
  onClose,
  theme,
  setTheme,
  wallpaper,
  setWallpaper,
  reducedMotion,
  setReducedMotion,
  brightness,
  setBrightness,
  soundEnabled,
  setSoundEnabled,
  onReset,
}: ControlCenterProps) {
  const [wifiActive, setWifiActive] = useState(true);
  const [bluetoothActive, setBluetoothActive] = useState(true);

  const cycleWallpaper = () => {
    if (wallpaper === 'graphite') setWallpaper('violet');
    else if (wallpaper === 'violet') setWallpaper('cyan');
    else setWallpaper('graphite');
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Control Center">
      <motion.div
        className="control-center-panel"
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="control-header">
          <div className="control-title-badge">
            <Sparkles size={14} />
            <span>CONTROL CENTER</span>
          </div>
          <button type="button" className="close-btn" onClick={onClose} aria-label="Close Control Center">
            <X size={16} />
          </button>
        </div>

        {/* 2x2 Network & Mode Toggles */}
        <div className="control-toggles-grid">
          <button
            type="button"
            className={`control-tile ${wifiActive ? 'active' : ''}`}
            onClick={() => setWifiActive(!wifiActive)}
            aria-label={`Wi-Fi: ${wifiActive ? 'Connected' : 'Disconnected'}`}
          >
            <Wifi size={18} />
            <div className="tile-text">
              <strong>Wi-Fi</strong>
              <span>{wifiActive ? 'Connected' : 'Off'}</span>
            </div>
          </button>

          <button
            type="button"
            className={`control-tile ${bluetoothActive ? 'active' : ''}`}
            onClick={() => setBluetoothActive(!bluetoothActive)}
            aria-label={`Bluetooth: ${bluetoothActive ? 'Active' : 'Off'}`}
          >
            <Bluetooth size={18} />
            <div className="tile-text">
              <strong>Bluetooth</strong>
              <span>{bluetoothActive ? 'Active' : 'Off'}</span>
            </div>
          </button>

          <button
            type="button"
            className="control-tile active"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={`Theme: currently ${theme}. Click to toggle.`}
          >
            {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
            <div className="tile-text">
              <strong>Theme</strong>
              <span className="capitalize">{theme}</span>
            </div>
          </button>

          <button
            type="button"
            className="control-tile"
            onClick={cycleWallpaper}
            aria-label={`Wallpaper: currently ${wallpaper}. Click to cycle.`}
          >
            <Palette size={18} />
            <div className="tile-text">
              <strong>Wallpaper</strong>
              <span className="capitalize">{wallpaper}</span>
            </div>
          </button>
        </div>

        {/* Sliders: Screen Brightness & Sound */}
        <div className="sliders-section">
          <div className="slider-card">
            <div className="slider-label-row">
              <span>
                <SunMedium size={14} /> Screen Brightness
              </span>
              <strong>{brightness}%</strong>
            </div>
            <input
              type="range"
              min="50"
              max="130"
              value={brightness}
              onChange={(e) => setBrightness(parseInt(e.target.value, 10))}
              aria-label="Screen brightness slider"
              className="custom-range"
            />
          </div>

          <div className="slider-card">
            <div className="slider-label-row">
              <span>
                {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />} Audio Effects
              </span>
              <strong>{soundEnabled ? 'Enabled' : 'Muted'}</strong>
            </div>
            <button
              type="button"
              className={`toggle-switch-btn ${soundEnabled ? 'on' : ''}`}
              onClick={() => setSoundEnabled(!soundEnabled)}
              aria-label={soundEnabled ? 'Disable audio effects' : 'Enable audio effects'}
            >
              <span>{soundEnabled ? 'Mute Audio' : 'Unmute Audio'}</span>
            </button>
          </div>
        </div>

        {/* Quick Utilities */}
        <div className="control-footer-actions">
          <button
            type="button"
            className={`pref-btn ${reducedMotion ? 'active' : ''}`}
            onClick={() => setReducedMotion(!reducedMotion)}
            aria-label={`Reduced Motion: ${reducedMotion ? 'On' : 'Off'}`}
          >
            <Zap size={14} />
            <span>Motion: {reducedMotion ? 'Reduced' : 'Fluid'}</span>
          </button>

          <button
            type="button"
            className="pref-btn reset-btn"
            onClick={onReset}
            aria-label="Reset demo state and cache"
          >
            <RotateCcw size={14} />
            <span>Reset Demo</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
