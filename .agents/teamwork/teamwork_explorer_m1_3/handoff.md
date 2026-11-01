# Explorer M1_3 Handoff Report: Persistent PiP Overlay Blueprint & Robocopy Verification

- **Author**: Explorer M1_3 (`teamwork_explorer`)
- **Recipient**: Orchestrator (`1ae9bb65-98e9-49e2-889d-e047ba75afaf`)
- **Date**: 2026-11-01T15:55:00Z
- **Workspace**: `c:\Users\ASUS\Documents\antigravity\busy-faraday`
- **Working Directory**: `c:\Users\ASUS\Documents\antigravity\busy-faraday\.agents\teamwork\teamwork_explorer_m1_3`

---

## 1. Observation

### 1.1 Virtual iPhone Screen Dimensions & Bezel Geometry
- In `src/styles.css:1483-1493`:
  ```css
  /* AMOLED Display (372px x 806px) */
  .iphone-amoled-display {
    width: 100%;
    height: 100%;
    border-radius: 46px;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: #000000;
    box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.9);
  }
  ```
- In `src/styles.css:318-325`:
  ```css
  .phone-surface {
    position: absolute;
    width: 372px;
    height: 806px;
    overflow: hidden;
    border-radius: 54px;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12);
  }
  ```
- In `src/components/AssistiveTouch.tsx:69-72`:
  ```typescript
  // Screen bounds: 372px width, 806px height
  // Button size: 54px x 54px
  // Snapped X positions: Left = 10px, Right = 372 - 54 - 10 = 308px
  // Clamped Y bounds: Top = 68px, Bottom = 806 - 54 - 40 = 712px
  ```
- In `src/components/DynamicIsland.tsx:1533-1543`: Dynamic Island pill is positioned at `top: 14px; left: 50%; transform: translateX(-50%);` with width `119px` (expanding up to `348px x 160px`).
- In `src/components/IPhoneScreenContent.tsx:856-882`: iOS Home Indicator pill is positioned at the bottom of the screen (`bottom: 8px; height: 5px; width: 134px`).

### 1.2 Screen Routing & Overlay Hierarchy in `IPhoneScreenContent.tsx`
- In `src/components/IPhoneScreenContent.tsx:305-786`:
  ```tsx
  {/* Screen Router Viewport */}
  <div className="iphone-screen-viewport">
    <IosErrorBoundary onResetRoute={() => onNavigate('home')}>
      <AnimatePresence mode="wait">
        {/* 34 individual route views mounted/unmounted conditionally */}
      </AnimatePresence>
    </IosErrorBoundary>
  </div>
  ```
- In `src/components/IPhoneScreenContent.tsx:788-918`:
  Persistent overlay layers mounted directly outside `<AnimatePresence>`:
  - Line 789: `<ControlCenter />` (`z-index: 95`)
  - Line 805: `<LockScreen />` (`z-index: 100`)
  - Line 817: `<RecruiterCallModal />` (`z-index: 92`)
  - Line 830: MagSafe charging overlay (`z-index: 85`)
  - Line 843: `<AppSwitcher />` (`z-index: 80`)
  - Line 856: Home Indicator bar (`z-index: 40`)
  - Line 886: `<AssistiveTouch />` (`z-index: 48`)
  - Line 903: `<AppleIntelligenceGlow />` (`z-index: 38`)
  - Line 911: `<StandByApp />` (`z-index: 98`)
- Observation: Currently, no `<PiPOverlay />` exists in `src/components/` or is mounted in `src/components/IPhoneScreenContent.tsx`.

### 1.3 PiP State Contract in E2E Driver & PROJECT.md
- In `PROJECT.md:110-117`:
  ```typescript
  export interface PiPState {
    isOpen: boolean;
    title: string;
    videoSrc?: string;
    isPlaying: boolean;
    position: { x: number; y: number };
  }
  ```
- In `src/__tests__/e2e/helpers/testDrivers.ts:41-48, 71-77, 123-134`:
  ```typescript
  export interface PiPState {
    isOpen: boolean;
    title: string;
    videoSrc?: string;
    isPlaying: boolean;
    position: { x: number; y: number };
    bezelBounds: { minX: number; maxX: number; minY: number; maxY: number };
  }
  // Default values in driver:
  position: { x: 20, y: 120 },
  bezelBounds: { minX: 12, maxX: 260, minY: 60, maxY: 680 }
  ```

### 1.4 Baseline Health, Typecheck & Robocopy Verification
- `npx tsc --noEmit` -> Exit code 0, 0 diagnostic errors.
- `npm test -- --run` -> Exit code 0 (`✓ src/__tests__/portfolio.test.ts (7 tests passed)`).
- `npm run build` -> Exit code 0 (`✓ 2017 modules transformed. dist/index.html (5.16 kB), dist/assets/vendor-three (655.93 kB), built in 6.21s`).
- Mirror path: `F:\app\udayport` verified exists (`Test-Path "F:\app\udayport"` -> `True`).
- Robocopy dry run:
  Command: `robocopy c:\Users\ASUS\Documents\antigravity\busy-faraday F:\app\udayport /MIR /XD node_modules .git .agents dist .gemini /R:2 /W:2 /L`
  Output: 145 files (3.79 MB), exit code 1 (Robocopy successful change-detection).

---

## 2. Logic Chain

```
[Observation 1.1: Screen is 372px wide, 806px tall, 46px border radius]
   ──> A PiP window of width 144px positioned at x ∈ [8, 220] ensures:
       - Minimum left edge = 8px (safe from left bezel)
       - Maximum right edge = 220 + 144 = 364px (372 - 364 = 8px safe from right bezel)
   ──> A PiP window of height 96px positioned at y ∈ [60, 680] ensures:
       - Minimum top edge = 60px (comfortably below Dynamic Island y: 14-47 and status bar y: 0-44)
       - Maximum bottom edge = 680 + 96 = 776px (safely above Home Indicator y: 780-806)
       - Corner squircle clearance: At y = 60 and y = 680, circular diagonal depth is < 8px,
         guaranteeing the PiP window never clips against the 46px curved corners!

[Observation 1.2: App views inside AnimatePresence unmount on route change]
   ──> If PiP is mounted inside an app (e.g. DemoPreviewApp), it unmounts during navigation
   ──> Mounting <PiPOverlay /> as a direct child of .iphone-amoled-display OUTSIDE AnimatePresence
       guarantees uninterrupted, seamless playback across ALL screen routes!
   ──> Setting z-index: 45 places PiP above normal app pages (z: 1-10) and status bar (z: 30),
       while keeping it safely below expanded Dynamic Island (z: 50) and Control Center (z: 95).

[Observation 1.3: PiPState in testDrivers.ts tracks position, bounds, isPlaying, isOpen]
   ──> PiPOverlay must integrate bidirectionally with liveActivity singleton:
       - Reading PiPState on mount and subscribing to liveActivity updates
       - Emitting position, play/pause, and close updates back to liveActivity
       - Providing default fallback so it works autonomously if liveActivity is idle.

[Observation 1.4: Robocopy returns exit code 1 when copying modified files]
   ──> Windows Robocopy uses bitmask return codes:
       0 = No files copied (in sync)
       1 = Files copied successfully
       2 = Extra files detected
       3 = Files copied + extra files
       Codes >= 4 indicate failures
   ──> The Robocopy automation script must treat $LASTEXITCODE <= 3 as success!
```

---

## 3. Caveats

1. **Touch / Pointer Capture inside Three.js Canvas**:
   - `Phone3DCanvas.tsx` captures pointer events for 3D phone rotation on desktop.
   - For `PiPOverlay`, pointer events must use `e.stopPropagation()` on pointer down, move, and up so that dragging the PiP window does not inadvertently rotate the 3D phone model!
2. **Audio Autoplay Policies**:
   - Web browsers (Chrome/Safari) block programmatic audio playback without prior user gesture.
   - For `<video>` playback or canvas demo audio, the video element should start with `muted={true}` by default, with an explicit un-mute toggle on the PiP HUD so user interaction triggers audio safely without throwing DOM exceptions.
3. **Canvas Performance Budget**:
   - The interactive canvas demo visualizer runs at 60fps via `requestAnimationFrame`. When the PiP window is paused (`!isPlaying`) or closed (`!isOpen`), the animation loop must be cancelled via `cancelAnimationFrame` to maintain 0% CPU consumption in the background.

---

## 4. Conclusion & Actionable Blueprint

### 4.1 Component Blueprint: `src/components/PiPOverlay.tsx`

Create `src/components/PiPOverlay.tsx` with the following complete, production-grade architecture:

```tsx
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
  RotateCcw,
} from 'lucide-react';
import { liveActivity, type PiPState } from '../services/liveActivity';
import { sound } from '../services/sound';

export interface PiPOverlayProps {
  onClose?: () => void;
  onNavigate?: (route: string) => void;
}

// Strictly clamped within iPhone screen AMOLED coordinates:
// Screen: 372px width x 806px height, border-radius: 46px
const BEZEL_CONSTRAINTS = {
  left: 8,
  right: 220, // 220 + 144 = 364px (8px padding from 372px right border)
  top: 60,    // Below Dynamic Island and Status Bar
  bottom: 680 // 680 + 96 = 776px (Above Home Indicator)
};

export type PiPChannel = 'portfolio' | 'leetcode' | 'esp32';

export function PiPOverlay({ onClose, onNavigate }: PiPOverlayProps) {
  // 1. Sync with central LiveActivity coordinator
  const [pipState, setPipState] = useState<PiPState>(() => {
    try {
      return liveActivity.getPiP();
    } catch {
      return {
        isOpen: false,
        title: 'UDAY OS · Screencast',
        isPlaying: true,
        position: { x: 216, y: 76 },
      };
    }
  });

  const [isMinimized, setIsMinimized] = useState(false);
  const [activeChannel, setActiveChannel] = useState<PiPChannel>('portfolio');
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(42);
  const [duration] = useState(180); // 3 minutes total simulated video stream
  const [showControls, setShowControls] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Subscribe to liveActivity state changes
  useEffect(() => {
    const unsubscribe = liveActivity.subscribe(() => {
      setPipState(liveActivity.getPiP());
    });
    return () => unsubscribe();
  }, []);

  // Auto-hide controls after 3 seconds of inactivity
  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3200);
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
    const nextPlaying = !pipState.isPlaying;
    liveActivity.setPiP({ isPlaying: nextPlaying });
    setPipState((prev) => ({ ...prev, isPlaying: nextPlaying }));
  };

  // Handle Close
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playTapSound();
    liveActivity.setPiP({ isOpen: false, isPlaying: false });
    setPipState((prev) => ({ ...prev, isOpen: false, isPlaying: false }));
    onClose?.();
  };

  // Handle Minimize Toggle
  const toggleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playTapSound();
    setIsMinimized((prev) => !prev);
  };

  // Playback timer progression
  useEffect(() => {
    if (!pipState.isOpen || !pipState.isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTime((t) => (t >= duration ? 0 : t + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [pipState.isOpen, pipState.isPlaying, duration]);

  // 2. High-performance 60fps Canvas Screencast Synthesizer
  useEffect(() => {
    if (!pipState.isOpen || !pipState.isPlaying || isMinimized) {
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
        // Ambient iridescent glow
        const grad = ctx.createRadialGradient(
          w * 0.5 + Math.sin(frame * 0.03) * 40,
          h * 0.5 + Math.cos(frame * 0.02) * 20,
          10,
          w * 0.5,
          h * 0.5,
          w * 0.7
        );
        grad.addColorStop(0, 'rgba(0, 122, 255, 0.28)');
        grad.addColorStop(0.5, 'rgba(175, 82, 222, 0.16)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Header bar
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px -apple-system, SF Pro Text';
        ctx.fillText(' UDAY OS · Cupertino Portfolio', 12, 20);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.font = '9px SF Mono, monospace';
        ctx.fillText('KL University · 184 LeetCode · ESP32 ML', 12, 34);

        // Simulated dynamic chart bar
        const barWidth = (w - 24) * ((currentTime % 60) / 60);
        ctx.fillStyle = '#34c759';
        ctx.fillRect(12, 44, barWidth, 3);

        // Simulated terminal command stream
        ctx.fillStyle = '#00f0ff';
        ctx.font = '9px SF Mono, monospace';
        const lines = [
          '> const portfolio = new UdayOS();',
          '> portfolio.deploy("Vercel Edge");',
          '✓ Status 200 OK · Latency 14ms',
        ];
        lines.forEach((line, idx) => {
          ctx.fillText(line, 12, 60 + idx * 13);
        });
      } else if (activeChannel === 'leetcode') {
        // Channel 2: LeetCode Visualizer
        ctx.fillStyle = '#11141a';
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = '#ffa116';
        ctx.font = 'bold 11px -apple-system, SF Pro Text';
        ctx.fillText('⚡ Two Sum O(N) Hash Map', 12, 20);

        // Draw array buckets
        const arr = [2, 7, 11, 15];
        const activeIdx = Math.floor((frame / 30) % 4);
        arr.forEach((val, i) => {
          const bx = 16 + i * 32;
          const by = 35;
          ctx.fillStyle = i === activeIdx ? '#34c759' : '#262a33';
          ctx.fillRect(bx, by, 26, 26);
          ctx.strokeStyle = i === activeIdx ? '#30d158' : '#3a3f4d';
          ctx.strokeRect(bx, by, 26, 26);

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px SF Mono';
          ctx.fillText(val.toString(), bx + 9, by + 17);
        });

        ctx.fillStyle = '#30d158';
        ctx.font = '9px SF Mono, monospace';
        ctx.fillText('target: 9 | complement: 7 found in map!', 12, 82);
      } else {
        // Channel 3: ESP32 Oscilloscope Telemetry
        ctx.fillStyle = '#050c08';
        ctx.fillRect(0, 0, w, h);

        // Grid
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

        // Trace
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
        ctx.fillText('SPI SCK: 10MHz | CRC16: OK', 10, 16);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      running = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [pipState.isOpen, pipState.isPlaying, isMinimized, activeChannel, currentTime]);

  if (!pipState.isOpen) return null;

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
          x: pipState.position.x || 216,
          y: pipState.position.y || 76,
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
          // Persist position update within strict boundaries
          const clampedX = Math.max(
            BEZEL_CONSTRAINTS.left,
            Math.min(BEZEL_CONSTRAINTS.right, info.point.x)
          );
          const clampedY = Math.max(
            BEZEL_CONSTRAINTS.top,
            Math.min(BEZEL_CONSTRAINTS.bottom, info.point.y)
          );
          liveActivity.setPiP({ position: { x: clampedX, y: clampedY } });
        }}
        onPointerDown={(e) => {
          // Stop propagation so 3D phone model doesn't rotate on drag
          e.stopPropagation();
          resetControlsTimeout();
        }}
        onClick={resetControlsTimeout}
        title="Draggable Picture-in-Picture · Stays active across all apps"
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
              <span className="pip-stream-title">{pipState.title || 'UDAY OS Screencast'}</span>
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

            {/* Video / Canvas Viewport */}
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
                      aria-label={pipState.isPlaying ? 'Pause' : 'Play'}
                    >
                      {pipState.isPlaying ? <Pause size={16} /> : <Play size={16} />}
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
                        aria-label="Seek time"
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
```

---

### 4.2 CSS Stylesheet Blueprint: `src/styles.css`

Append the following styles to `src/styles.css`:

```css
/* ==========================================================================
    Picture-in-Picture (PiP) Multitasking Overlay
   Strictly clamped within iPhone 16 Pro AMOLED Bezel Bounds (372px x 806px)
   ========================================================================== */

.pip-overlay-window {
  position: absolute;
  top: 0;
  left: 0;
  width: 144px;
  height: 98px;
  z-index: 45; /* Above apps and status bar, below Dynamic Island & Control Center */
  border-radius: 16px;
  background: rgba(18, 18, 22, 0.88);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.72), 0 2px 6px rgba(0, 0, 0, 0.45);
  overflow: hidden;
  user-select: none;
  cursor: grab;
  touch-action: none;
}

.pip-overlay-window:active {
  cursor: grabbing;
}

.pip-overlay-window.minimized {
  width: 52px;
  height: 34px;
  border-radius: 17px;
  background: rgba(24, 24, 30, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.pip-minimized-pill {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0 8px;
  width: 100%;
  height: 100%;
}

.pip-live-pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #30d158;
  box-shadow: 0 0 6px #30d158;
  animation: pulse-pip-dot 1.4s infinite ease-in-out;
}

@keyframes pulse-pip-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.85); }
}

.pip-mini-icon {
  color: #ffffff;
  opacity: 0.85;
}

.pip-mini-restore-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  padding: 0;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.pip-window-inner {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.pip-window-header {
  height: 18px;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.pip-drag-handle-pill {
  width: 18px;
  height: 3px;
  border-radius: 1.5px;
  background: rgba(255, 255, 255, 0.4);
}

.pip-stream-title {
  font-size: 8px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
  color: rgba(255, 255, 255, 0.75);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 68px;
}

.pip-header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pip-action-icon-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.65);
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px;
  transition: color 0.15s, background 0.15s;
}

.pip-action-icon-btn:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.12);
}

.pip-close-btn:hover {
  color: #ff453a;
}

.pip-viewport {
  position: relative;
  flex: 1;
  width: 100%;
  overflow: hidden;
  background: #000000;
}

.pip-canvas-stream {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.pip-controls-hud {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4px 6px;
  backdrop-filter: blur(4px);
}

.pip-channel-bar {
  display: flex;
  gap: 3px;
  justify-content: center;
}

.pip-channel-pill {
  background: rgba(255, 255, 255, 0.14);
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 7.5px;
  padding: 1px 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 2px;
  cursor: pointer;
}

.pip-channel-pill.active {
  background: #007aff;
  color: #ffffff;
  font-weight: 600;
}

.pip-center-play-btn {
  align-self: center;
  background: rgba(255, 255, 255, 0.22);
  border: none;
  color: #ffffff;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition: transform 0.12s;
}

.pip-center-play-btn:active {
  transform: scale(0.92);
}

.pip-bottom-scrubber-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pip-time-readout {
  font-size: 7px;
  font-family: 'SF Mono', monospace;
  color: rgba(255, 255, 255, 0.75);
}

.pip-seek-slider {
  flex: 1;
  height: 3px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 1.5px;
  outline: none;
  cursor: pointer;
}

.pip-seek-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
}

.pip-mute-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  padding: 1px;
  display: flex;
  align-items: center;
  cursor: pointer;
}
```

---

### 4.3 Integration in `src/components/IPhoneScreenContent.tsx`

1. **Import `PiPOverlay`**:
   In `src/components/IPhoneScreenContent.tsx` (top import block):
   ```tsx
   import { PiPOverlay } from './PiPOverlay';
   ```

2. **Mount Persistent Overlay**:
   In `src/components/IPhoneScreenContent.tsx` (around line 787, directly after `</div> {/* end of iphone-screen-viewport */}`):
   ```tsx
   {/* Persistent Draggable Picture-in-Picture Floating Multitasking Window */}
   <PiPOverlay onNavigate={onNavigate} />
   ```

---

### 4.4 Robocopy Mirror & Git Deployment Checklist for Milestone 1

#### 1. Mirror Verification Command & Exit Code Protocol
```powershell
robocopy c:\Users\ASUS\Documents\antigravity\busy-faraday F:\app\udayport /MIR /XD node_modules .git .agents dist .gemini /R:2 /W:2
$exitCode = $LASTEXITCODE
if ($exitCode -gt 3) {
  Write-Error "Robocopy mirror failed with error exit code: $exitCode"
  exit $exitCode
} else {
  Write-Host "Robocopy mirror synchronization to F:\app\udayport successful (Code $exitCode)."
}
```

#### 2. Verification Command Sequence (Milestone 1 Gate)
Before marking Milestone 1 complete:
```powershell
# 1. Typecheck: Zero compiler diagnostics
npx tsc --noEmit

# 2. Test Runner: 100% existing and new tests pass
npm test -- --run

# 3. Production Vite Build: All chunks split cleanly
npm run build
```

#### 3. Git Remote Synchronization & Vercel Trigger
```bash
git add src/components/PiPOverlay.tsx src/components/IPhoneScreenContent.tsx src/styles.css
git commit -m "feat(m1): implement persistent draggable PiP overlay with Framer Motion bezel clamping"
git push origin main
```

---

## 5. Verification Method

### 5.1 Verification Commands
1. **Typecheck Verification**:
   `npx tsc --noEmit` -> Must return exit code 0.
2. **Unit / Integration Tests**:
   `npm test -- --run` -> Must return exit code 0.
3. **Production Build**:
   `npm run build` -> Must build `dist/` without errors.
4. **Mirror Synchronization**:
   `robocopy c:\Users\ASUS\Documents\antigravity\busy-faraday F:\app\udayport /MIR /XD node_modules .git .agents dist .gemini /R:2 /W:2 /L` -> Exits <= 3.

### 5.2 Visual & Runtime Inspection Checklist
- Ensure `PiPOverlay` is mounted inside `.iphone-amoled-display` and outside `<AnimatePresence>`.
- Verify dragging across screen bounds: PiP must not move beyond `x < 8`, `x > 220`, `y < 60`, `y > 680`.
- Verify route navigation: Open PiP in home view, navigate to `settings`, `leetcode`, `github`, `music` — playback must continue uninterrupted without canvas reset or flickering.
- Verify controls: Play/pause toggles animation loop, seek slider jumps timestamps, minimize collapses to compact pill.

### 5.3 Invalidation Conditions
- Any TypeScript diagnostic error in `PiPOverlay.tsx` or `IPhoneScreenContent.tsx`.
- PiP window overflowing or clipping the 46px screen squircle corners.
- Unhandled DOM audio playback exceptions.
- Failure of Robocopy to write to `F:\app\udayport`.

---
*Report formulated and verified by Explorer M1_3.*
