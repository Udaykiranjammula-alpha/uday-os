import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Sliders,
  Sun,
  Aperture,
  Sparkles,
  X,
  Maximize2,
  Check,
  RotateCcw,
} from 'lucide-react';
import { sound } from '../services/sound';

interface CameraControlHUDProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFullCamera?: () => void;
}

type ZoomLevel = '0.5x' | '1x' | '2x' | '5x';
type PhotoStyle = 'Standard' | 'Amber' | 'Vibrant' | 'Noir';

export function CameraControlHUD({
  isOpen,
  onClose,
  onOpenFullCamera,
}: CameraControlHUDProps) {
  const [activeTab, setActiveTab] = useState<'zoom' | 'style' | 'aperture'>('zoom');
  const [zoom, setZoom] = useState<ZoomLevel>('1x');
  const [style, setStyle] = useState<PhotoStyle>('Standard');
  const [aperture, setAperture] = useState<'f/1.4' | 'f/2.8' | 'f/4.0' | 'f/8.0'>('f/2.8');
  const [isFocusLocked, setIsFocusLocked] = useState(false);
  const [isShutterFlashing, setIsShutterFlashing] = useState(false);
  const [capturedPhotosCount, setCapturedPhotosCount] = useState(1);

  const zoomOptions: ZoomLevel[] = ['0.5x', '1x', '2x', '5x'];
  const styleOptions: PhotoStyle[] = ['Standard', 'Amber', 'Vibrant', 'Noir'];
  const apertureOptions: ('f/1.4' | 'f/2.8' | 'f/4.0' | 'f/8.0')[] = [
    'f/1.4',
    'f/2.8',
    'f/4.0',
    'f/8.0',
  ];

  const handleLightPress = () => {
    sound.playTapSound();
    setIsFocusLocked(true);
    setTimeout(() => setIsFocusLocked(false), 2000);
  };

  const handleFullShutter = () => {
    sound.playShutterSound();
    setIsShutterFlashing(true);
    setCapturedPhotosCount((prev) => prev + 1);
    setTimeout(() => setIsShutterFlashing(false), 250);
  };

  if (!isOpen) return null;

  return (
    <aside
      className="camera-control-hud-container"
      aria-label="iPhone 16 Pro Capacitive Camera Control"
    >
      {/* Screen flash on photo capture */}
      {isShutterFlashing && <div className="camera-flash-burst-overlay" />}

      <motion.div
        className="camera-control-arc-panel"
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 60, opacity: 0 }}
        transition={{ type: 'spring', damping: 26, stiffness: 350 }}
      >
        {/* Header with dismiss & Full App button */}
        <div className="camera-control-header">
          <div className="control-brand">
            <Camera size={13} className="text-amber-400" />
            <span>Camera Control</span>
          </div>
          <div className="control-header-btns">
            {onOpenFullCamera && (
              <button
                type="button"
                className="control-icon-btn"
                onClick={() => {
                  sound.playTapSound();
                  onOpenFullCamera();
                  onClose();
                }}
                title="Open 48MP Full Camera App"
              >
                <Maximize2 size={12} />
              </button>
            )}
            <button
              type="button"
              className="control-icon-btn"
              onClick={onClose}
              title="Close Camera Control"
              aria-label="Close"
            >
              <X size={12} />
            </button>
          </div>
        </div>

        {/* Mode Selector Tabs (Zoom, Style, Aperture) */}
        <div className="camera-control-mode-tabs">
          <button
            type="button"
            className={`mode-tab ${activeTab === 'zoom' ? 'active' : ''}`}
            onClick={() => {
              sound.playTapSound();
              setActiveTab('zoom');
            }}
          >
            Zoom
          </button>
          <button
            type="button"
            className={`mode-tab ${activeTab === 'style' ? 'active' : ''}`}
            onClick={() => {
              sound.playTapSound();
              setActiveTab('style');
            }}
          >
            Styles
          </button>
          <button
            type="button"
            className={`mode-tab ${activeTab === 'aperture' ? 'active' : ''}`}
            onClick={() => {
              sound.playTapSound();
              setActiveTab('aperture');
            }}
          >
            Depth
          </button>
        </div>

        {/* Dynamic Tactile Dial based on active tab */}
        <div className="camera-control-dial-area">
          {activeTab === 'zoom' && (
            <div className="dial-zoom-selector">
              <span className="dial-indicator-caption">48MP FUSION LENS</span>
              <div className="zoom-chips-row">
                {zoomOptions.map((z) => (
                  <button
                    key={z}
                    type="button"
                    className={`zoom-chip ${zoom === z ? 'selected' : ''}`}
                    onClick={() => {
                      sound.playActionClickSound();
                      setZoom(z);
                    }}
                  >
                    {z}
                  </button>
                ))}
              </div>
              <div className="lens-spec-label">
                {zoom === '0.5x' && '13mm Ultra-Wide · Macro Focus'}
                {zoom === '1x' && '24mm Fusion Main · 48MP RawMAX'}
                {zoom === '2x' && '48mm Optical Quality · 2x Telephoto'}
                {zoom === '5x' && '120mm 5x Tetraprism Periscope'}
              </div>
            </div>
          )}

          {activeTab === 'style' && (
            <div className="dial-style-selector">
              <span className="dial-indicator-caption">PHOTOGRAPHIC STYLE</span>
              <div className="style-chips-row">
                {styleOptions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`style-chip ${style === s ? 'selected' : ''}`}
                    onClick={() => {
                      sound.playActionClickSound();
                      setStyle(s);
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="style-preview-swatch">
                <div className={`swatch-circle style-${style.toLowerCase()}`} />
                <span>{style} Tone Map</span>
              </div>
            </div>
          )}

          {activeTab === 'aperture' && (
            <div className="dial-aperture-selector">
              <span className="dial-indicator-caption">BOKEH DEPTH OF FIELD</span>
              <div className="aperture-chips-row">
                {apertureOptions.map((a) => (
                  <button
                    key={a}
                    type="button"
                    className={`aperture-chip ${aperture === a ? 'selected' : ''}`}
                    onClick={() => {
                      sound.playActionClickSound();
                      setAperture(a);
                    }}
                  >
                    {a}
                  </button>
                ))}
              </div>
              <div className="lens-spec-label">
                {aperture === 'f/1.4' ? 'Cinematic Portrait Blur' : 'Sharp Edge-to-Edge Field'}
              </div>
            </div>
          )}
        </div>

        {/* Capacitive Two-Stage Shutter Button */}
        <div className="capacitive-shutter-zone">
          <div className="shutter-instructions">
            <span>Light Press: Lock Focus</span>
            <span>Full Click: Snap Shot</span>
          </div>

          <div className="shutter-buttons-row">
            <button
              type="button"
              className={`light-press-btn ${isFocusLocked ? 'focused' : ''}`}
              onClick={handleLightPress}
              title="Light Press: AE/AF Lock"
            >
              <Aperture size={14} />
              <span>{isFocusLocked ? 'AE/AF Locked' : 'Light Press (Focus)'}</span>
            </button>

            <button
              type="button"
              className="full-shutter-btn"
              onClick={handleFullShutter}
              title="Full Click: Snap Photo"
            >
              <div className="inner-shutter-core" />
            </button>
          </div>

          <div className="captured-counter">
            <span>{capturedPhotosCount} Photos Saved to Camera Roll</span>
          </div>
        </div>
      </motion.div>
    </aside>
  );
}
