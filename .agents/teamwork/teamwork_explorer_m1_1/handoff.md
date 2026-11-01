# Comprehensive Implementation Blueprint: Live Activity Coordinator & Dynamic Island Compact Mode

**Author:** Explorer M1_1 (`teamwork_explorer_m1_1`)  
**Target:** Orchestrator (`1ae9bb65-98e9-49e2-889d-e047ba75afaf`), Implementer M1_1 (`teamwork_implementer`)  
**Date:** 2026-11-01  
**Milestone:** M1_1 (Flagship Pillar 1: Dynamic Island Live Activities & Background Coordination)

---

## 1. Observation

### 1.1 Existing System State & Tooling Baseline
- **OS & Workspace:** Windows 11; `c:\Users\ASUS\Documents\antigravity\busy-faraday`.
- **Compiler Baseline:**
  - Command: `npx tsc --noEmit` -> Exited 0 (Clean, 0 errors).
  - Command: `npm test -- --run` -> Exited 0 (`✓ src/__tests__/portfolio.test.ts (7 tests passed)`).
- **Core Dependencies (`package.json`):**
  - `react`: `^18.3.1`, `react-dom`: `^18.3.1` (supports `useSyncExternalStore` natively).
  - `framer-motion`: `^11.11.17`.
  - `lucide-react`: `^0.468.0`.

### 1.2 Inspection of `src/services/`
- Directory listing shows 4 existing files: `github.ts`, `sound.ts`, `speech.ts`, `torch.ts`.
- **`src/services/liveActivity.ts` does NOT exist.** Background execution state currently has no central coordinator.
- **`src/services/sound.ts`:**
  - Lines 52-54: `public getAnalyser(): AnalyserNode | null` provides access to the Web Audio `AnalyserNode`.
  - Lines 56-58: `public getCurrentTrack()` returns the currently active music track.
  - Lines 589-600: `public toggleAmbientMusic(onStateChange?: (playing: boolean) => void): boolean` toggles playback.
  - Lines 602-604: `public getIsPlaying(): boolean` returns ambient playback boolean.
  - Lines 420-441: `public playTimerAlert()` plays authentic Cupertino timer bell chime (A6 -> A5 harmonic).
  - Lines 658-661: `this.analyser = this.ctx.createAnalyser(); this.analyser.fftSize = 64; this.analyser.smoothingTimeConstant = 0.8;`.

### 1.3 Inspection of `src/apps/ClockApp.tsx`
- Lines 46-56: Stopwatch and countdown timer state are maintained as local React state within `ClockApp`:
  ```typescript
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [timerDuration, setTimerDuration] = useState(300);
  const [timerRemaining, setTimerRemaining] = useState(300);
  const [timerRunning, setTimerRunning] = useState(false);
  ```
- Lines 76-79 & 122-125: Intervals are bound to component lifecycle (`useEffect`).
- **Defect:** Navigating away from `clock` unmounts `ClockApp`, immediately terminating the timer/stopwatch interval and losing progress. `DynamicIsland` receives no state updates from `ClockApp`.

### 1.4 Inspection of `src/components/DynamicIsland.tsx`
- Lines 37-39: Maintains disconnected internal state:
  ```typescript
  const [expanded, setExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackProgress, setTrackProgress] = useState(18);
  ```
- Lines 250-264: Compact music pill displays a static `Disc3` icon and 3 CSS-animated pseudo bars (`.compact-mini-eq`). It does not use `sound.getAnalyser()`, does not draw a canvas, and does not respond to audio frequencies.
- Lines 265-275: Compact torch pill displays `🔦` emoji and yellow dot.
- Lines 276-287: Default compact pill displays static camera lens and sensor dot.
- **Defect:** No circular SVG countdown ring; no millisecond timer ticker; no pulsating cyan A18 Pro silicon chip indicator for algorithm/benchmark execution; no dual-activity layout.

### 1.5 Inspection of `src/styles.css`
- Lines 1533-1550: Defines `.dynamic-island-container` and `.dynamic-island` with fixed width `119px` and height `33px`.
- Lines 5765-5791: Defines `.island-compact-music`, `.compact-spinning-disc`, `.compact-mini-eq`.
- Lines 11299-11323: Defines `.island-active-torch`, `.island-compact-torch`, `.island-torch-dot`.
- Missing: Keyframes and classes for A18 Pro chip pulse (`pulseA18Pro`), circular countdown ring (`island-ring-svg`), and canvas waveform canvas styling.

---

## 2. Logic Chain

1. **[Observation 1.2 & 1.3]** `ClockApp.tsx` clears intervals upon unmount, and `liveActivity.ts` does not yet exist.
   - *Inference:* A centralized, persistent background coordinator is required to manage timers, stopwatch elapsed milliseconds, audio playback, compiler telemetry, and floating PiP overlay across route switches.
   - *Solution:* Create `src/services/liveActivity.ts` as an event-driven singleton service with precision time-tracking and an external store subscription pattern (`useSyncExternalStore`).

2. **[Observation 1.2]** `sound.ts` initializes an `AnalyserNode` (`fftSize = 64`) connected to the ambient music gain node.
   - *Inference:* The compact Island audio visualizer can directly query `sound.getAnalyser()` frequency data (`Uint8Array`) using `requestAnimationFrame`.
   - *Solution:* Render a 4-bar canvas with linear interpolation/smoothing at 60fps in `DynamicIsland.tsx`.

3. **[Observation 1.4]** Dynamic Island Compact Mode only supports basic CSS bars or torch.
   - *Inference:* To satisfy Pillar 1 of the specification, the collapsed pill must dynamically morph its width (119px up to 220px) and display:
     - 4-bar canvas audio visualizer + spinning mini-disc when music is playing.
     - SVG circular countdown ring with calculated `strokeDashoffset` + monospace millisecond tick when timer or stopwatch is running.
     - Pulsating cyan A18 Pro silicon chip badge when algorithm/compiler execution is in progress.
     - Dual-activity presentation when both timer and music are simultaneously active.

---

## 3. Caveats

- **Audio Autoplay Policies:** Web Audio `AudioContext` may start suspended until the first user interaction. The 4-bar canvas rendering loop must provide a graceful fallback animation when the audio context is warming up or silent.
- **Performance Budget:** Running a `requestAnimationFrame` loop on canvas inside a phone container must not trigger React re-renders. All canvas drawing must occur directly on the `<canvas>` 2D context via `useRef`, completely bypassing React reconciliation.
- **Bezel Constraints:** The phone viewport is 380px wide. The dynamic island morphing width must never exceed 348px when expanded, and compact mode widths must range smoothly between 119px (idle) and 220px (dual activity).

---

## 4. Conclusion & Actionable Implementation Blueprint

### 4.1 Specification for `src/services/liveActivity.ts`

#### 4.1.1 Full TypeScript Interfaces
```typescript
// src/services/liveActivity.ts

export interface AudioLiveActivity {
  isPlaying: boolean;
  trackTitle: string;
  artist: string;
  albumArt?: string;
  progress: number; // 0 to 100 percentage
  currentTime: number; // seconds
  duration: number; // seconds
}

export interface ClockLiveActivity {
  isActive: boolean;
  type: 'stopwatch' | 'timer';
  isPaused: boolean;
  remainingMs: number;
  totalDurationMs: number;
  formattedTime: string; // e.g. "04:59" or "01:23.45"
  subMs?: string; // centiseconds e.g. "45"
  laps: number[];
}

export interface AlgorithmLiveActivity {
  isRunning: boolean;
  algorithmName: string;
  timeComplexity: string;
  runtimeUs?: number;
  passStatus?: 'idle' | 'running' | 'passed' | 'failed';
  stdoutPreview?: string[];
  progressPercent?: number;
}

export interface PiPState {
  isOpen: boolean;
  title: string;
  videoSrc?: string;
  isPlaying: boolean;
  position: { x: number; y: number };
  isMinimized: boolean;
}

export interface LiveActivityState {
  audio: AudioLiveActivity;
  clock: ClockLiveActivity;
  algorithm: AlgorithmLiveActivity;
  pip: PiPState;
}

export type LiveActivityListener = (state: LiveActivityState) => void;
```

#### 4.1.2 Complete Singleton Implementation Architecture
```typescript
import { sound } from './sound';

class LiveActivityService {
  private state: LiveActivityState = {
    audio: {
      isPlaying: false,
      trackTitle: 'Lo-Fi Systems Stream',
      artist: 'Uday OS · Ambient Mode',
      progress: 0,
      currentTime: 0,
      duration: 220,
    },
    clock: {
      isActive: false,
      type: 'timer',
      isPaused: false,
      remainingMs: 0,
      totalDurationMs: 0,
      formattedTime: '00:00',
      laps: [],
    },
    algorithm: {
      isRunning: false,
      algorithmName: '',
      timeComplexity: '',
      passStatus: 'idle',
      stdoutPreview: [],
    },
    pip: {
      isOpen: false,
      title: 'UDAY OS Engineering Lab',
      videoSrc: '',
      isPlaying: false,
      position: { x: 16, y: 100 },
      isMinimized: false,
    },
  };

  private listeners = new Set<LiveActivityListener>();
  private clockTickerId: number | null = null;
  private lastClockTimestamp: number = 0;
  private audioTickerId: number | null = null;

  constructor() {
    this.syncWithSoundService();
  }

  // --- External Store Subscription Protocol ---
  public subscribe = (listener: LiveActivityListener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  public getSnapshot = (): LiveActivityState => {
    return this.state;
  };

  private notify() {
    // Clone state snapshot to ensure React useSyncExternalStore detects referential changes
    this.state = {
      audio: { ...this.state.audio },
      clock: { ...this.state.clock },
      algorithm: { ...this.state.algorithm },
      pip: { ...this.state.pip },
    };
    this.listeners.forEach((listener) => listener(this.state));
  }

  // --- Audio Coordination ---
  private syncWithSoundService() {
    const track = sound.getCurrentTrack();
    this.state.audio = {
      isPlaying: sound.getIsPlaying(),
      trackTitle: track?.title || 'Lo-Fi Systems Stream',
      artist: track?.artist || 'Uday OS · Ambient Mode',
      progress: 0,
      currentTime: 0,
      duration: track?.duration || 220,
    };
  }

  public togglePlay(): boolean {
    const nextPlaying = sound.toggleAmbientMusic((p) => {
      this.state.audio.isPlaying = p;
      const track = sound.getCurrentTrack();
      this.state.audio.trackTitle = track?.title || 'Lo-Fi Systems Stream';
      this.state.audio.artist = track?.artist || 'Uday OS · Ambient Mode';
      this.state.audio.duration = track?.duration || 220;
      this.notify();
    });
    this.state.audio.isPlaying = nextPlaying;
    this.notify();
    return nextPlaying;
  }

  public updateAudioProgress(progress: number, currentTime: number) {
    this.state.audio.progress = progress;
    this.state.audio.currentTime = currentTime;
    this.notify();
  }

  // --- Clock & Timer Precision Engine ---
  public startTimer(durationSeconds: number) {
    const totalMs = durationSeconds * 1000;
    this.state.clock = {
      isActive: true,
      type: 'timer',
      isPaused: false,
      totalDurationMs: totalMs,
      remainingMs: totalMs,
      formattedTime: this.formatMinutesSeconds(totalMs),
      laps: [],
    };
    this.startClockTicker();
    this.notify();
  }

  public pauseTimer() {
    if (!this.state.clock.isActive || this.state.clock.type !== 'timer') return;
    this.state.clock.isPaused = true;
    this.stopClockTicker();
    this.notify();
  }

  public resumeTimer() {
    if (!this.state.clock.isActive || this.state.clock.type !== 'timer') return;
    this.state.clock.isPaused = false;
    this.startClockTicker();
    this.notify();
  }

  public resetTimer() {
    this.stopClockTicker();
    this.state.clock.isActive = false;
    this.state.clock.isPaused = false;
    this.state.clock.remainingMs = 0;
    this.state.clock.formattedTime = '00:00';
    this.notify();
  }

  public addMinute() {
    if (!this.state.clock.isActive || this.state.clock.type !== 'timer') return;
    this.state.clock.remainingMs += 60000;
    this.state.clock.totalDurationMs += 60000;
    this.state.clock.formattedTime = this.formatMinutesSeconds(this.state.clock.remainingMs);
    this.notify();
  }

  public startStopwatch() {
    this.state.clock = {
      isActive: true,
      type: 'stopwatch',
      isPaused: false,
      remainingMs: this.state.clock.type === 'stopwatch' ? this.state.clock.remainingMs : 0,
      totalDurationMs: 0,
      formattedTime: '00:00.00',
      laps: this.state.clock.laps || [],
    };
    this.startClockTicker();
    this.notify();
  }

  public pauseStopwatch() {
    if (!this.state.clock.isActive || this.state.clock.type !== 'stopwatch') return;
    this.state.clock.isPaused = true;
    this.stopClockTicker();
    this.notify();
  }

  public resetStopwatch() {
    this.stopClockTicker();
    this.state.clock.isActive = false;
    this.state.clock.isPaused = false;
    this.state.clock.remainingMs = 0;
    this.state.clock.formattedTime = '00:00.00';
    this.state.clock.laps = [];
    this.notify();
  }

  public recordLap(): number {
    const currentMs = this.state.clock.remainingMs;
    this.state.clock.laps = [currentMs, ...this.state.clock.laps];
    this.notify();
    return currentMs;
  }

  private startClockTicker() {
    this.stopClockTicker();
    this.lastClockTimestamp = performance.now();
    this.clockTickerId = window.setInterval(() => {
      const now = performance.now();
      const delta = now - this.lastClockTimestamp;
      this.lastClockTimestamp = now;

      if (this.state.clock.type === 'timer') {
        const remaining = Math.max(0, this.state.clock.remainingMs - delta);
        this.state.clock.remainingMs = remaining;
        this.state.clock.formattedTime = this.formatMinutesSeconds(remaining);

        if (remaining <= 0) {
          this.stopClockTicker();
          this.state.clock.isActive = false;
          sound.playTimerAlert();
        }
      } else if (this.state.clock.type === 'stopwatch') {
        const elapsed = this.state.clock.remainingMs + delta;
        this.state.clock.remainingMs = elapsed;
        this.state.clock.formattedTime = this.formatStopwatchTime(elapsed);
      }
      this.notify();
    }, 50); // 50ms tick interval for crisp centisecond & countdown reactivity
  }

  private stopClockTicker() {
    if (this.clockTickerId !== null) {
      clearInterval(this.clockTickerId);
      this.clockTickerId = null;
    }
  }

  private formatMinutesSeconds(ms: number): string {
    const totalSecs = Math.ceil(ms / 1000);
    const m = Math.floor(totalSecs / 60).toString().padStart(2, '0');
    const s = Math.floor(totalSecs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  private formatStopwatchTime(ms: number): string {
    const m = Math.floor(ms / 60000).toString().padStart(2, '0');
    const s = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
    const cs = Math.floor((ms % 1000) / 10).toString().padStart(2, '0');
    return `${m}:${s}.${cs}`;
  }

  // --- Algorithm Telemetry Coordination ---
  public startAlgorithm(name: string, complexity: string) {
    this.state.algorithm = {
      isRunning: true,
      algorithmName: name,
      timeComplexity: complexity,
      passStatus: 'running',
      stdoutPreview: [],
    };
    this.notify();
  }

  public completeAlgorithm(runtimeUs: number, passed: boolean, stdout?: string[]) {
    this.state.algorithm.isRunning = false;
    this.state.algorithm.runtimeUs = runtimeUs;
    this.state.algorithm.passStatus = passed ? 'passed' : 'failed';
    this.state.algorithm.stdoutPreview = stdout || [];
    this.notify();
  }

  public clearAlgorithm() {
    this.state.algorithm = {
      isRunning: false,
      algorithmName: '',
      timeComplexity: '',
      passStatus: 'idle',
      stdoutPreview: [],
    };
    this.notify();
  }

  // --- Picture-in-Picture State ---
  public openPiP(config?: { title?: string; videoSrc?: string }) {
    this.state.pip.isOpen = true;
    this.state.pip.isPlaying = true;
    if (config?.title) this.state.pip.title = config.title;
    if (config?.videoSrc) this.state.pip.videoSrc = config.videoSrc;
    this.notify();
  }

  public closePiP() {
    this.state.pip.isOpen = false;
    this.state.pip.isPlaying = false;
    this.notify();
  }

  public setPiPPlaying(playing: boolean) {
    this.state.pip.isPlaying = playing;
    this.notify();
  }

  public updatePiPPosition(x: number, y: number) {
    // Clamped within virtual phone viewport bounds: width 380, height 820
    const clampedX = Math.max(8, Math.min(200, x));
    const clampedY = Math.max(60, Math.min(650, y));
    this.state.pip.position = { x: clampedX, y: clampedY };
    this.notify();
  }

  public togglePiPMinimize() {
    this.state.pip.isMinimized = !this.state.pip.isMinimized;
    this.notify();
  }
}

export const liveActivity = new LiveActivityService();
```

#### 4.1.3 React Hook: `useLiveActivity`
```typescript
import { useSyncExternalStore } from 'react';
import { liveActivity, LiveActivityState } from './liveActivity';

export function useLiveActivity(): LiveActivityState {
  return useSyncExternalStore(
    liveActivity.subscribe,
    liveActivity.getSnapshot,
    liveActivity.getSnapshot
  );
}
```

---

### 4.2 Blueprint for `src/components/DynamicIsland.tsx` Compact Mode

#### 4.2.1 Component State & Morphing Geometry
The island morphs width via Framer Motion `layout` and predefined variant widths:
- **Idle (Default):** `width: 119px; height: 33px;`
- **Compact Torch:** `width: 125px; height: 33px;`
- **Compact Music:** `width: 165px; height: 33px;`
- **Compact Timer / Stopwatch:** `width: 175px; height: 33px;`
- **Compact Algorithm / A18 Pro:** `width: 195px; height: 33px;`
- **Dual Live Activity (Timer + Music):** `width: 220px; height: 33px;`
- **Expanded Capsule:** `width: 348px; min-height: 160px;`

```typescript
const islandVariants = {
  default: { width: 119, height: 33, borderRadius: 20 },
  'compact-torch': { width: 125, height: 33, borderRadius: 20 },
  'compact-music': { width: 165, height: 33, borderRadius: 20 },
  'compact-timer': { width: 175, height: 33, borderRadius: 20 },
  'compact-algorithm': { width: 195, height: 33, borderRadius: 20 },
  'compact-dual': { width: 220, height: 33, borderRadius: 20 },
  expanded: { width: 348, height: 'auto', minHeight: 160, borderRadius: 36 },
};

const springTransition = {
  type: 'spring',
  stiffness: 440,
  damping: 32,
  mass: 0.8,
};
```

#### 4.2.2 Real-Time 4-Bar Canvas Audio Visualizer
The visualizer connects directly to `sound.getAnalyser()`. To eliminate jitter between musical chords, an exponential moving average (EMA) smoothing factor is applied:

```typescript
// 4-Bar Canvas Waveform Ticker
const compactCanvasRef = useRef<HTMLCanvasElement | null>(null);

useEffect(() => {
  if (!live.audio.isPlaying) return;
  const canvas = compactCanvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let animId: number;
  const BAR_COUNT = 4;
  const BAR_WIDTH = 2.8;
  const BAR_GAP = 2.0;
  const MAX_HEIGHT = 13;
  const MIN_HEIGHT = 2.5;

  const smoothed = [MIN_HEIGHT, MIN_HEIGHT, MIN_HEIGHT, MIN_HEIGHT];
  // Sample spread across low, mid, and high-frequency bins (fftSize = 64 -> 32 bins)
  const sampleIndices = [2, 5, 8, 13];

  const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const analyser = sound.getAnalyser();

    if (analyser) {
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      for (let i = 0; i < BAR_COUNT; i++) {
        const bin = sampleIndices[i];
        const val = dataArray[bin] || 0;
        const norm = val / 255;
        const target = Math.max(MIN_HEIGHT, norm * MAX_HEIGHT);
        // Exponential smoothing: 70% previous, 30% new
        smoothed[i] = smoothed[i] * 0.7 + target * 0.3;

        const x = i * (BAR_WIDTH + BAR_GAP) + 1;
        const h = Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, smoothed[i]));
        const y = canvas.height - h;

        // Apple Music neon gradient (Cyan -> Indigo)
        const grad = ctx.createLinearGradient(0, y, 0, canvas.height);
        grad.addColorStop(0, '#38bdf8');
        grad.addColorStop(1, '#818cf8');

        ctx.fillStyle = grad;
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(x, y, BAR_WIDTH, h, 1.2);
        } else {
          ctx.rect(x, y, BAR_WIDTH, h);
        }
        ctx.fill();
      }
    } else {
      // Graceful fallback waveform if audio context is initializing
      const t = performance.now() * 0.004;
      for (let i = 0; i < BAR_COUNT; i++) {
        const wave = Math.sin(t + i * 1.1) * 0.5 + 0.5;
        const h = Math.max(MIN_HEIGHT, wave * MAX_HEIGHT * 0.85);
        const x = i * (BAR_WIDTH + BAR_GAP) + 1;
        const y = canvas.height - h;
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(x, y, BAR_WIDTH, h, 1.2);
        } else {
          ctx.rect(x, y, BAR_WIDTH, h);
        }
        ctx.fill();
      }
    }

    animId = requestAnimationFrame(render);
  };

  animId = requestAnimationFrame(render);
  return () => cancelAnimationFrame(animId);
}, [live.audio.isPlaying]);
```

#### 4.2.3 Circular SVG Countdown Ring with Live ms Tick
Calculates exact stroke perimeter offset based on `live.clock.remainingMs / live.clock.totalDurationMs`:

```tsx
{/* SVG Circular Ring Geometry: Radius 7.5px, Circumference = 2 * PI * 7.5 = 47.12388px */}
{(() => {
  const total = live.clock.totalDurationMs || 1;
  const rem = live.clock.remainingMs;
  const progressRatio = live.clock.type === 'timer' 
    ? Math.max(0, Math.min(1, rem / total))
    : 1; // stopwatch fills ring
  const strokeOffset = 47.124 * (1 - progressRatio);
  const ringColor = live.clock.type === 'timer' ? '#ff9f0a' : '#30d158';

  return (
    <div className="island-compact-clock-badge">
      <svg
        className="island-ring-svg"
        width="18"
        height="18"
        viewBox="0 0 18 18"
      >
        <circle
          cx="9"
          cy="9"
          r="7.5"
          fill="none"
          stroke="rgba(255, 255, 255, 0.18)"
          strokeWidth="2.2"
        />
        <circle
          cx="9"
          cy="9"
          r="7.5"
          fill="none"
          stroke={ringColor}
          strokeWidth="2.2"
          strokeDasharray="47.124"
          strokeDashoffset={strokeOffset}
          strokeLinecap="round"
          transform="rotate(-90 9 9)"
          style={{ transition: 'stroke-dashoffset 0.05s linear' }}
        />
      </svg>
      <span className="island-compact-clock-text font-mono" style={{ color: ringColor }}>
        {live.clock.formattedTime}
      </span>
    </div>
  );
})()}
```

#### 4.2.4 Pulsating Cyan A18 Pro Chip Indicator
```tsx
<div className="island-compact-chip-badge">
  <div className="chip-icon-wrapper">
    <Cpu size={13} className="a18-chip-icon text-cyan" />
    <span className="chip-pulse-halo" />
  </div>
  <div className="a18-chip-meta font-mono">
    {live.algorithm.isRunning ? (
      <span className="a18-telemetry-running">
        {live.algorithm.algorithmName || 'A18 Pro'}
        <span className="a18-pulse-dot" />
      </span>
    ) : (
      <span className="a18-telemetry-passed">
        <CheckCircle2 size={11} className="inline mr-1 text-emerald-400" />
        {live.algorithm.runtimeUs ? `${live.algorithm.runtimeUs}μs` : 'Passed'}
      </span>
    )}
  </div>
</div>
```

#### 4.2.5 Dual-Activity Layout (Timer + Audio Simultaneous)
When both clock and music are active, compact mode displays split telemetry:
- Left: SVG circular countdown ring + time.
- Right: Mini 4-bar canvas audio visualizer.
```tsx
<div className="island-compact-dual-row">
  <div className="dual-left-clock">
    {/* SVG ring + time digits */}
  </div>
  <div className="dual-right-audio">
    <canvas ref={compactCanvasRef} width={20} height={14} className="compact-canvas-waveform" />
  </div>
</div>
```

---

### 4.3 Required CSS Additions for `src/styles.css`

```css
/* --- Dynamic Island 2.0 Compact Mode Styles --- */
.compact-canvas-waveform {
  display: block;
  image-rendering: pixelated;
}

.island-compact-clock-badge {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 0 4px;
}

.island-ring-svg {
  flex-shrink: 0;
}

.island-compact-clock-text {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.island-compact-chip-badge {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 0 6px;
}

.chip-icon-wrapper {
  position: relative;
  display: grid;
  place-items: center;
}

.a18-chip-icon {
  color: #22d3ee;
  filter: drop-shadow(0 0 4px rgba(34, 211, 238, 0.8));
}

.chip-pulse-halo {
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  border: 1px solid rgba(34, 211, 238, 0.6);
  animation: pulseA18Pro 1.4s ease-out infinite;
}

@keyframes pulseA18Pro {
  0% {
    transform: scale(0.85);
    opacity: 1;
  }
  100% {
    transform: scale(1.6);
    opacity: 0;
  }
}

.a18-chip-meta {
  font-size: 10px;
  white-space: nowrap;
}

.a18-telemetry-running {
  color: #22d3ee;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.a18-pulse-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #22d3ee;
  box-shadow: 0 0 6px #22d3ee;
  animation: pulseDot 0.8s infinite alternate;
}

.a18-telemetry-passed {
  color: #34d399;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.island-compact-dual-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 4px;
}

.spinning-mini-disc {
  animation: spinVinyl 2.4s linear infinite;
}

@keyframes spinVinyl {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

---

## 5. Verification Method

### 5.1 Verification Commands
The implementing agent must run the following validation suite:
```bash
# 1. TypeScript compilation check
npx tsc --noEmit

# 2. Existing and newly created Vitest unit tests
npm test -- --run

# 3. Full production build test
npm run build
```

### 5.2 Verification Checklist for Implementer
1. **Unit Test File:** Create `src/__tests__/liveActivity.test.ts` verifying:
   - `liveActivity.startTimer(10)` starts countdown and decrements `remainingMs`.
   - `liveActivity.pauseTimer()` pauses ticker without resetting `remainingMs`.
   - `liveActivity.addMinute()` extends duration by 60,000ms.
   - `liveActivity.startStopwatch()` increments elapsed ms with centisecond formatting.
   - `liveActivity.startAlgorithm('Two Sum', 'O(N)')` updates algorithm state.
   - `liveActivity.openPiP()` and `liveActivity.updatePiPPosition(x, y)` clamp within `[8, 200]` and `[60, 650]`.
   - `liveActivity.subscribe()` triggers listener upon each state transition.
2. **Dynamic Island Rendering Check:**
   - Mount `<DynamicIsland />` with `live.audio.isPlaying = true` -> verifies 4-bar canvas and rotating mini-disc render.
   - Mount with `live.clock.isActive = true` -> verifies SVG circular ring and live digital clock render.
   - Mount with `live.algorithm.isRunning = true` -> verifies pulsating cyan A18 Pro chip renders.
   - Verify zero unhandled exceptions or canvas context errors in test environment.

### 5.3 Invalidation Conditions
- If `npx tsc --noEmit` fails with any interface mismatches.
- If unmounting `ClockApp.tsx` stops the timer in `liveActivity.ts`.
- If the canvas audio visualizer triggers React state updates in its animation loop (must use `useRef` directly).
- If the dynamic island width exceeds phone screen bounds (>348px).
