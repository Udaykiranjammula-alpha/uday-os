import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  X,
  Minimize2,
  Maximize2,
  Volume2,
  VolumeX,
  Tv,
  Code2,
  Cpu,
} from 'lucide-react';
import { liveActivity, useLiveActivity, type PiPState } from '../services/liveActivity';
import { sound } from '../services/sound';

export interface PiPOverlayProps {
  onClose?: () => void;
  onNavigate?: (route: string) => void;
}

// Strictly clamped within iPhone AMOLED bezel bounds (372px x 806px display)
// Screen width 372px: 220 + 144 = 364px (8px safe margin from right border)
// Screen height 806px: 680 + 98 = 778px (above Home Indicator)
const BEZEL_CONSTRAINTS = {
  left: 8,
  right: 220,
  top: 60,
  bottom: 680,
};

export type PiPChannel = 'portfolio' | 'leetcode' | 'esp32';

export function PiPOverlay({ onClose, onNavigate }: PiPOverlayProps) {
  const live = useLiveActivity();
  const pip = live.pip;

  const [isMinimized, setIsMinimized] = useState(pip.isMinimized);
  const [activeChannel, setActiveChannel] = useState<PiPChannel>('portfolio');
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(42);
  const [duration] = useState(180); // 3 minutes simulated stream
  const [showControls, setShowControls] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  // Auto-hide controls after inactivity
  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3200) as unknown as number;
  }, []);

  useEffect(() => {
    resetControlsTimeout();
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [resetControlsTimeout]);

  // Handle Play/Pause
  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playTapSound();
    liveActivity.setPiP({ isPlaying: !pip.isPlaying });
  };

  // Handle Close
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playTapSound();
    liveActivity.closePiP();
    onClose?.();
  };

  // Handle Minimize
  const toggleMinimize = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sound.playTapSound();
    setIsMinimized(!isMinimized);
    liveActivity.togglePiPMinimize();
  };

  // Simulated video playback progression
  useEffect(() => {
    if (!pip.isOpen || !pip.isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTime((t) => (t >= duration ? 0 : t + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [pip.isOpen, pip.isPlaying, duration]);

  // 60fps Canvas Screencast Synthesizer
  useEffect(() => {
    if (!pip.isOpen || !pip.isPlaying || isMinimized) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    let running = true;

    const render = () => {
      if (!running) return;
      frame++;
      const w = canvas.width;
      const h = canvas.height;

      // Clear frame
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, w, h);

      if (activeChannel === 'portfolio') {
        // Channel 1: Portfolio Tour
        const grad = ctx.createRadialGradient(
          w * 0.5 + Math.sin(frame * 0.03) * 40,
          h * 0.5 + Math.cos(frame * 0.02) * 20,
          10,
          w * 0.5,
          h * 0.5,
          w * 0.7
        );
        grad.addColorStop(0, 'rgba(0, 122, 255, 0.32)');
        grad.addColorStop(0.5, 'rgba(175, 82, 222, 0.18)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Header
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
        ctx.fillText(' UDAY OS · Cupertino Portfolio', 12, 22);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.font = '9px SF Mono, monospace';
        ctx.fillText('KL University · 184 LeetCode · ESP32 ML', 12, 38);

        // Simulated progress bar
        const barWidth = (w - 24) * ((currentTime % 60) / 60);
        ctx.fillStyle = '#34c759';
        ctx.fillRect(12, 48, barWidth, 3);

        // Terminal command stream
        ctx.fillStyle = '#00f0ff';
        ctx.font = '9px SF Mono, monospace';
        const lines = [
          '> const os = new UdayOS();',
          '> os.deploy("Vercel Edge");',
          '✓ Status 200 OK · Latency 14ms',
        ];
        lines.forEach((line, idx) => {
          ctx.fillText(line, 12, 68 + idx * 14);
        });
      } else if (activeChannel === 'leetcode') {
        // Channel 2: LeetCode Visualizer
        ctx.fillStyle = '#11141a';
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = '#ffa116';
        ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
        ctx.fillText('⚡ Two Sum O(N) Hash Map', 12, 22);

        // Draw array buckets
        const arr = [2, 7, 11, 15];
        const activeIdx = Math.floor((frame / 30) % 4);
        arr.forEach((val, i) => {
          const bx = 16 + i * 32;
          const by = 38;
          ctx.fillStyle = i === activeIdx ? '#34c759' : '#262a33';
          ctx.fillRect(bx, by, 26, 26);
          ctx.strokeStyle = i === activeIdx ? '#30d158' : '#3a3f4d';
          ctx.strokeRect(bx, by, 26, 26);

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px SF Mono, monospace';
          ctx.fillText(val.toString(), bx + 9, by + 17);
        });

        ctx.fillStyle = '#30d158';
        ctx.font = '9px SF Mono, monospace';
        ctx.fillText('target: 9 | complement: 7 found in map!', 12, 86);
      } else {
        // Channel 3: ESP32 Oscilloscope Telemetry
        ctx.fillStyle = '#050c08';
        ctx.fillRect(0, 0, w, h);

        // Oscilloscope Grid
        ctx.strokeStyle = 'rgba(0, 255, 128, 0.12)';
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 20) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (let y = 0; y < h; y += 15) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }

        // Animated wave trace
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let x = 0; x < w; x++) {
          const wave =
            Math.sin((x + frame * 4) * 0.08) * 16 +
            Math.cos((x + frame * 2) * 0.03) * 6;
          const y = h * 0.5 + wave;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        ctx.fillStyle = '#00ff88';
        ctx.font = '9px SF Mono, monospace';
        ctx.fillText('SPI SCK: 10MHz | CRC16: OK', 10, 18);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      running = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [pip.isOpen, pip.isPlaying, isMinimized, activeChannel, currentTime]);

  if (!pip.isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        className={`pip-overlay-window ${isMinimized ? 'minimized' : ''}`}
        drag
        dragConstraints={BEZEL_CONSTRAINTS}
        dragElastic={0.06}
        dragMomentum={false}
        initial={{
          x: pip.position.x || 216,
          y: pip.position.y || 76,
          scale: 0.9,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        exit={{
          scale: 0.85,
          opacity: 0,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        onDragEnd={(_e, info) => {
          const clampedX = Math.max(
            BEZEL_CONSTRAINTS.left,
            Math.min(BEZEL_CONSTRAINTS.right, info.point.x)
          );
          const clampedY = Math.max(
            BEZEL_CONSTRAINTS.top,
            Math.min(BEZEL_CONSTRAINTS.bottom, info.point.y)
          );
          liveActivity.updatePiPPosition(clampedX, clampedY);
        }}
        onPointerDown={(e) => {
          // Prevent drag from rotating 3D phone model canvas
          e.stopPropagation();
          resetControlsTimeout();
        }}
        onClick={resetControlsTimeout}
        title="Draggable Picture-in-Picture · Persistent across app navigation"
      >
        {isMinimized ? (
          // Minimized Floating Pill
          <div
            className="pip-minimized-pill"
            onClick={toggleMinimize}
            title="Expand Picture-in-Picture"
          >
            <div className="pip-live-pulse-dot" />
            <Tv size={14} className="pip-mini-icon" />
            <button
              type="button"
              className="pip-mini-restore-btn"
              aria-label="Restore PiP"
            >
              <Maximize2 size={12} />
            </button>
          </div>
        ) : (
          // Standard Floating 16:9 Window
          <div className="pip-window-inner">
            {/* Header Drag Bar */}
            <div className="pip-window-header">
              <div className="pip-drag-handle-pill" />
              <span className="pip-stream-title">{pip.title || 'UDAY OS Screencast'}</span>
              <div className="pip-header-actions">
                <button
                  type="button"
                  className="pip-action-icon-btn"
                  onClick={toggleMinimize}
                  title="Minimize PiP"
                  aria-label="Minimize"
                >
                  <Minimize2 size={12} />
                </button>
                <button
                  type="button"
                  className="pip-action-icon-btn pip-close-btn"
                  onClick={handleClose}
                  title="Close PiP"
                  aria-label="Close"
                >
                  <X size={12} />
                </button>
              </div>
            </div>

            {/* Viewport / Synthesized Screencast Stream */}
            <div className="pip-viewport">
              <canvas
                ref={canvasRef}
                width={288}
                height={192}
                className="pip-canvas-stream"
              />

              {/* Floating Interactive Controls HUD */}
              <AnimatePresence>
                {showControls && (
                  <motion.div
                    className="pip-controls-hud"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {/* Channel Selector Pills */}
                    <div className="pip-channel-bar">
                      <button
                        type="button"
                        className={`pip-channel-pill ${activeChannel === 'portfolio' ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          sound.playTapSound();
                          setActiveChannel('portfolio');
                        }}
                      >
                        <Tv size={10} />
                        <span>OS</span>
                      </button>
                      <button
                        type="button"
                        className={`pip-channel-pill ${activeChannel === 'leetcode' ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          sound.playTapSound();
                          setActiveChannel('leetcode');
                        }}
                      >
                        <Code2 size={10} />
                        <span>Code</span>
                      </button>
                      <button
                        type="button"
                        className={`pip-channel-pill ${activeChannel === 'esp32' ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          sound.playTapSound();
                          setActiveChannel('esp32');
                        }}
                      >
                        <Cpu size={10} />
                        <span>ESP32</span>
                      </button>
                    </div>

                    {/* Center Play/Pause button */}
                    <button
                      type="button"
                      className="pip-center-play-btn"
                      onClick={togglePlay}
                      aria-label={pip.isPlaying ? 'Pause' : 'Play'}
                    >
                      {pip.isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </button>

                    {/* Bottom Scrubber & Time */}
                    <div className="pip-bottom-scrubber-row">
                      <span className="pip-time-readout">{formatTime(currentTime)}</span>
                      <input
                        type="range"
                        min={0}
                        max={duration}
                        value={currentTime}
                        onChange={(e) => {
                          e.stopPropagation();
                          setCurrentTime(Number(e.target.value));
                        }}
                        className="pip-seek-slider"
                        aria-label="Seek video"
                      />
                      <button
                        type="button"
                        className="pip-mute-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          sound.playTapSound();
                          setIsMuted(!isMuted);
                        }}
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted ? <VolumeX size={11} /> : <Volume2 size={11} />}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
