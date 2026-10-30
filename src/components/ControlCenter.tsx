import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wifi,
  WifiOff,
  Bluetooth,
  Plane,
  Sun,
  Volume2,
  VolumeX,
  Flashlight,
  Music,
  Play,
  Pause,
  Moon,
  BatteryCharging,
  X,
  Disc3,
  Lock,
} from 'lucide-react';
import { sound } from '../services/sound';

interface ControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
  brightness: number;
  setBrightness: (val: number) => void;
  flashlightOn: boolean;
  setFlashlightOn: (on: boolean) => void;
  onOpenApp?: (route: string) => void;
  onLockPhone?: () => void;
}

export function ControlCenter({
  isOpen,
  onClose,
  brightness,
  setBrightness,
  flashlightOn,
  setFlashlightOn,
  onOpenApp,
  onLockPhone,
}: ControlCenterProps) {
  const [wifiOn, setWifiOn] = useState(true);
  const [bluetoothOn, setBluetoothOn] = useState(true);
  const [airplaneOn, setAirplaneOn] = useState(false);
  const [focusOn, setFocusOn] = useState(false);
  const [volume, setVolume] = useState(75);
  const [isPlaying, setIsPlaying] = useState(sound.getIsPlaying());

  const handleToggleMusic = () => {
    sound.toggleAmbientMusic((playing) => {
      setIsPlaying(playing);
    });
  };

  const handleToggleFlashlight = () => {
    sound.playTapSound();
    setFlashlightOn(!flashlightOn);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="control-center"
          className="control-center-backdrop"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ type: 'spring', damping: 28, stiffness: 340 }}
          onClick={onClose}
        >
          <div className="control-center-sheet" onClick={(e) => e.stopPropagation()}>
            {/* Header pull handle & close button */}
            <div className="cc-handle-bar">
              <span className="cc-pill-indicator" />
              <button
                type="button"
                className="cc-close-pill"
                onClick={onClose}
                aria-label="Close Control Center"
              >
                <X size={15} />
              </button>
            </div>

            {/* Grid of iOS 18 Control Capsules */}
            <div className="cc-grid-layout">
              {/* Top Row: Connectivity Quad (2x2) + Now Playing (2x2) */}
              <div className="cc-connectivity-box">
                <button
                  type="button"
                  className={`cc-icon-cell ${airplaneOn ? 'active' : ''}`}
                  onClick={() => {
                    sound.playTapSound();
                    setAirplaneOn(!airplaneOn);
                  }}
                  aria-label="Airplane mode"
                >
                  <Plane size={18} />
                </button>

                <button
                  type="button"
                  className={`cc-icon-cell ${wifiOn ? 'active' : ''}`}
                  onClick={() => {
                    sound.playTapSound();
                    setWifiOn(!wifiOn);
                  }}
                  aria-label="Wi-Fi"
                >
                  {wifiOn ? <Wifi size={18} /> : <WifiOff size={18} />}
                </button>

                <button
                  type="button"
                  className={`cc-icon-cell ${bluetoothOn ? 'active' : ''}`}
                  onClick={() => {
                    sound.playTapSound();
                    setBluetoothOn(!bluetoothOn);
                  }}
                  aria-label="Bluetooth"
                >
                  <Bluetooth size={18} />
                </button>

                <button
                  type="button"
                  className="cc-icon-cell active text-green"
                  aria-label="Cellular 5G"
                >
                  <span className="cc-5g-text">5G</span>
                </button>
              </div>

              {/* Music Player Mini Capsule */}
              <div className="cc-music-card">
                <div className="cc-music-header">
                  <Disc3 size={20} className={isPlaying ? 'spinning-vinyl' : ''} />
                  <div className="cc-music-titles">
                    <strong>Lo-Fi Systems Stream</strong>
                    <small>UDAY OS Ambient</small>
                  </div>
                </div>
                <div className="cc-music-controls">
                  <button
                    type="button"
                    className="cc-play-btn"
                    onClick={handleToggleMusic}
                    aria-label={isPlaying ? 'Pause music' : 'Play music'}
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} fill="currentColor" />}
                  </button>
                </div>
              </div>

              {/* Middle Row: Brightness Slider + Volume Slider */}
              <div className="cc-sliders-row">
                {/* Vertical Brightness Slider */}
                <div className="cc-slider-capsule">
                  <div
                    className="cc-slider-fill brightness"
                    style={{ height: `${brightness * 100}%` }}
                  />
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={brightness * 100}
                    onChange={(e) => setBrightness(Number(e.target.value) / 100)}
                    className="cc-vertical-range"
                    aria-label="Screen brightness"
                  />
                  <div className="cc-slider-icon">
                    <Sun size={20} />
                  </div>
                </div>

                {/* Vertical Volume Slider */}
                <div className="cc-slider-capsule">
                  <div
                    className="cc-slider-fill volume"
                    style={{ height: `${volume}%` }}
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="cc-vertical-range"
                    aria-label="Audio volume"
                  />
                  <div className="cc-slider-icon">
                    {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </div>
                </div>
              </div>

              {/* Bottom Quick Tools Row */}
              <div className="cc-quick-tools-row">
                {/* Flashlight */}
                <button
                  type="button"
                  className={`cc-square-tool ${flashlightOn ? 'active-amber' : ''}`}
                  onClick={handleToggleFlashlight}
                  aria-label="Flashlight"
                >
                  <Flashlight size={20} />
                  <span>Torch</span>
                </button>

                {/* Focus / Moon */}
                <button
                  type="button"
                  className={`cc-square-tool ${focusOn ? 'active-purple' : ''}`}
                  onClick={() => {
                    sound.playTapSound();
                    setFocusOn(!focusOn);
                  }}
                  aria-label="Do Not Disturb"
                >
                  <Moon size={20} />
                  <span>Focus</span>
                </button>

                {/* Low Power Mode */}
                <button
                  type="button"
                  className="cc-square-tool"
                  onClick={() => {
                    sound.playTapSound();
                    setBrightness(0.4);
                  }}
                  aria-label="Low Power Mode"
                >
                  <BatteryCharging size={20} />
                  <span>Power</span>
                </button>

                {/* Lock Screen Shortcut */}
                <button
                  type="button"
                  className="cc-square-tool"
                  onClick={() => {
                    sound.playLockSound();
                    onClose();
                    onLockPhone?.();
                  }}
                  aria-label="Lock Screen"
                >
                  <Lock size={18} />
                  <span>Lock</span>
                </button>

                {/* Camera shortcut */}
                <button
                  type="button"
                  className="cc-square-tool"
                  onClick={() => {
                    sound.playTapSound();
                    onClose();
                    onOpenApp?.('camera');
                  }}
                  aria-label="Open Camera"
                >
                  <span style={{ fontSize: 18 }}>📸</span>
                  <span>Camera</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
