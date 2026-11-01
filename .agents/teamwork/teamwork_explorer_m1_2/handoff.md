# Implementation Blueprint: Dynamic Island Morphing Expanded Capsule, CSS Layout & App Integration

**Author:** Explorer M1_2 (`teamwork_explorer_m1_2`)  
**Target:** Orchestrator (`1ae9bb65-98e9-49e2-889d-e047ba75afaf`) / Implementer  
**Milestone:** M1 (Dynamic Island Live Activities & PiP Multitasking)  
**Date:** 2026-11-01  

---

## 1. Observation

### 1.1 `src/components/DynamicIsland.tsx` Current State
- **File size & layout:** 293 lines.
- **State management (Lines 37–39):**
  ```typescript
  const [expanded, setExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackProgress, setTrackProgress] = useState(18);
  ```
  - `isPlaying` and `trackProgress` are purely local component state, completely isolated from `sound.ts`, `MusicApp.tsx`, and background execution.
- **Expanded Capsule JSX (Lines 108–249):**
  - Header (Lines 118–125) renders `<div className="island-header">` with battery and music badges.
  - Music Player Row (Lines 188–206) renders `<div className="music-player-row">` with `<Disc3>`, hardcoded text `"Lo-Fi Systems Stream"`, play/pause toggle, and a dummy progress bar.
  - Scrubber & CSS Equalizer (Lines 209–220): Uses static percentage width and CSS animated bars (`.equalizer-bars .bar`), with no connection to Web Audio frequency data.
  - Footer (Lines 223–248) has a `"Done"` button (`className="collapse-btn"`).
- **Missing Features:**
  1. *Audio Controls:* Lacks real volume slider/dial, lacks AirPlay device pill (`AirPods Pro` / `iPhone Speakers`), lacks real-time canvas waveform visualizer connected to `sound.getAnalyser()`.
  2. *Timer Controls:* Zero timer or stopwatch controls present. When a countdown or stopwatch is running in `ClockApp.tsx`, Dynamic Island has no UI for big digital readout, live circular progress ring, `Pause`, `+1 min`, or `Stop`.
  3. *Compiler Live Activity Preview:* Zero representation of algorithm or code execution stdout. No compiler status badge, no live terminal log preview with green checkmarks.
  4. *Multi-Activity Switching:* No mechanism to switch between active audio, timer, and compiler activities when more than one task is running.

### 1.2 `src/styles.css` Current State & Missing Classes
- **AMOLED Display dimensions (Lines 1482–1487):**
  ```css
  .iphone-amoled-display {
    width: 100%;
    height: 100%;
    border-radius: 46px;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: #000000;
  }
  ```
  Screen width is approximately 372px within the titanium bezel.
- **Dynamic Island Container (Lines 1533–1550):**
  ```css
  .dynamic-island-container {
    position: absolute;
    top: 14px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 50;
  }
  .dynamic-island {
    width: 119px;
    height: 33px;
    border-radius: 20px;
    background: #000000;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.12), 0 8px 24px rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 12px;
  }
  ```
- **Class Defect Observed:**
  - `.dynamic-island.expanded`, `.island-expanded-content`, `.island-header`, `.island-badge`, and `.collapse-btn` have **ZERO CSS class definitions** in `src/styles.css`.
  - When `expanded` is toggled true, `.dynamic-island` remains styled with `width: 119px; height: 33px;`, causing the expanded DOM children to overflow and clip abruptly without proper glass styling or layout.

### 1.3 `src/apps/MusicApp.tsx` State & Audio Flow
- **File size:** 475 lines.
- **Audio Service (`src/services/sound.ts`):**
  - Manages `AudioContext`, `sound.tracks` (5 tracks: Lo-Fi, Cyberpunk, Deep Focus, Neural, Silicon Valley), `sound.getAnalyser()`, `sound.setVolume()`, and `sound.toggleAmbientMusic()`.
- **MusicApp Local State (Lines 39–52):**
  - `isPlaying`: initialized to `sound.getIsPlaying()`.
  - `trackIndex`: local `useState(0)`.
  - `volume`: local `useState(0.8)`.
  - Canvas visualizer (Lines 156–212): Animates 32 bars via `requestAnimationFrame` reading from `sound.getAnalyser()`.
- **Defect:** `MusicApp.tsx` does not broadcast track changes, progress, or play/pause state to a central coordinator. Dynamic Island is unaware of track selection and playback position.

### 1.4 `src/apps/ClockApp.tsx` State & Timer Flow
- **File size:** 474 lines.
- **Stopwatch State (Lines 46–49):**
  ```typescript
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);
  ```
- **Timer State (Lines 52–56):**
  ```typescript
  const [timerDuration, setTimerDuration] = useState(300);
  const [timerRemaining, setTimerRemaining] = useState(300);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerCompleted, setTimerCompleted] = useState(false);
  ```
- **Defect:**
  - Timer and stopwatch intervals (`setInterval`) exist solely inside `useEffect` in `ClockApp.tsx`.
  - When the user leaves `ClockApp` (e.g. navigates to `'home'`, `'xcode'`, `'music'`), `ClockApp` unmounts, the intervals are cleared, and all timer progress is destroyed.
  - Dynamic Island receives zero telemetry regarding active timers or stopwatch times.

---

## 2. Logic Chain

```
[Observation 1.2: AMOLED display width is 372px; dynamic-island is centered with left: 50%; transform: translateX(-50%)]
   ──> An expanded width of 348px leaves exactly (372 - 348)/2 = 12px horizontal margin on left and right edges.
   ──> With border-radius: 36px and top: 14px, the expanded capsule sits cleanly inside the bezel profile without clipping.

[Observation 1.2: Missing CSS classes (.dynamic-island.expanded, .island-expanded-content, .island-header, .collapse-btn)]
   ──> Expanding the island in the current build renders an unstyled container trapped within 119x33px dimensions.
   ──> Supplying high-specificity glassmorphic styles with backdrop-filter: blur(32px) and z-index: 100 ensures Cupertino visual fidelity.

[Observation 1.1: DynamicIsland has no Timer controls or Compiler preview in JSX]
   ──> Violates Pillar 1 requirement for "morphing expanded glass capsule with interactive playback/timer controls and live compiler stdout preview".
   ──> Introducing a multi-activity segmented tab switcher ('music' | 'timer' | 'compiler') allows Dynamic Island to host all 3 live activities seamlessly.

[Observation 1.3 & 1.4: MusicApp and ClockApp state is locally trapped in components that unmount on route change]
   ──> Background activities cannot persist across app transitions.
   ──> Moving the background clock ticker and audio state sync into `liveActivity.ts` (observable singleton) allows:
       1) Timers to continue ticking down in the background while browsing other apps.
       2) Dynamic Island to display real-time countdown progress and receive interactive controls (Pause, +1 min, Stop).
       3) Dynamic Island to control track scrubbing, volume, and AirPlay target bidirectionally with MusicApp.
```

---

## 3. Caveats
1. **Audio Autoplay Policies:** Browser Web Audio policies require user interaction before `AudioContext` begins outputting audio. `sound.ts` already attaches once-listeners on `pointerdown` and `keydown`, but initial playback in Dynamic Island must be triggered via explicit click.
2. **Canvas Performance:** The expanded waveform visualizer canvas runs via `requestAnimationFrame`. When the island is collapsed, the animation frame loop MUST be cancelled (`cancelAnimationFrame`) to conserve mobile battery and GPU resources.
3. **Timer Precision:** Using standard `setInterval` for 1000ms can drift slightly if backgrounded. `liveActivity.ts` should calculate `remainingSeconds` based on `targetEndTime = Date.now() + remainingMs` to remain drift-free.

---

## 4. Conclusion & Actionable Implementation Blueprint

### 4.1 Interface Contract with `src/services/liveActivity.ts`

`src/services/liveActivity.ts` serves as the centralized singleton state coordinator. The exact interfaces and methods required for M1_2 integration are:

```typescript
export interface AudioActivityState {
  isPlaying: boolean;
  trackIndex: number;
  trackTitle: string;
  artist: string;
  category: string;
  albumArt?: string;
  progress: number; // 0 - 100 percentage
  elapsedSeconds: number;
  durationSeconds: number;
  volume: number; // 0.0 - 1.0
  isMuted: boolean;
  airPlayRoute: 'AirPods Pro' | 'iPhone Speakers' | 'MacBook Pro';
}

export interface ClockActivityState {
  isActive: boolean; // active timer or stopwatch
  type: 'timer' | 'stopwatch';
  isRunning: boolean;
  remainingSeconds: number;
  totalDurationSeconds: number;
  stopwatchMs: number;
  formattedTime: string;
}

export interface CompilerActivityState {
  isRunning: boolean;
  algorithmName: string;
  timeComplexity: string;
  runtimeUs?: number;
  stdoutLines: string[];
  passStatus: 'idle' | 'running' | 'passed' | 'failed';
}

export interface LiveActivityState {
  activeTab: 'music' | 'timer' | 'compiler';
  music: AudioActivityState;
  clock: ClockActivityState;
  compiler: CompilerActivityState;
}
```

### 4.2 Blueprint for `src/components/DynamicIsland.tsx`

#### Component Structure:
```tsx
export function DynamicIsland({
  notification,
  onClearNotification,
  flashlightOn = false,
  onToggleFlashlight,
  onFlipToBack,
  onNavigate,
  onOpenLiveActivities,
}: DynamicIslandProps) {
  const [expanded, setExpanded] = useState(false);
  const [activityState, setActivityState] = useState<LiveActivityState>(() => liveActivity.getState());
  const [activeTab, setActiveTab] = useState<'music' | 'timer' | 'compiler'>('music');
  const waveformCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Subscribe to Live Activity singleton
  useEffect(() => {
    const unsubscribe = liveActivity.subscribe((newState) => {
      setActivityState(newState);
      // Auto-switch tab if timer or compiler starts running
      if (newState.clock.isRunning && !newState.music.isPlaying) {
        setActiveTab('timer');
      } else if (newState.compiler.isRunning) {
        setActiveTab('compiler');
      }
    });
    return unsubscribe;
  }, []);

  // 60fps Real-Time Waveform Visualizer in Expanded Capsule
  useEffect(() => {
    if (!expanded || activeTab !== 'music') return;
    let animId: number;
    const canvas = waveformCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const analyser = sound.getAnalyser();

      if (analyser && activityState.music.isPlaying) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        const barCount = 20;
        const barWidth = canvas.width / barCount - 2;

        for (let i = 0; i < barCount; i++) {
          const val = dataArray[i * 2] || 0;
          const barHeight = Math.max(4, (val / 255) * canvas.height * 0.95);
          const x = i * (barWidth + 2);
          const y = canvas.height - barHeight;

          // Apple Music Neon Gradient
          const grad = ctx.createLinearGradient(0, y, 0, canvas.height);
          grad.addColorStop(0, '#f43f5e');
          grad.addColorStop(0.5, '#ec4899');
          grad.addColorStop(1, '#38bdf8');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, [2.5, 2.5, 0, 0]);
          ctx.fill();
        }
      } else {
        // Resting baseline
        const barCount = 20;
        const barWidth = canvas.width / barCount - 2;
        for (let i = 0; i < barCount; i++) {
          const x = i * (barWidth + 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.beginPath();
          ctx.roundRect(x, canvas.height - 3, barWidth, 3, [1.5, 1.5, 0, 0]);
          ctx.fill();
        }
      }
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [expanded, activeTab, activityState.music.isPlaying]);
```

#### Expanded Capsule Rendering Blueprint:
```tsx
{expanded ? (
  <motion.div
    key="expanded"
    initial={{ opacity: 0, scale: 0.94 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.94 }}
    className="island-expanded-content"
    onClick={(e) => e.stopPropagation()}
  >
    {/* Header Status Row */}
    <div className="island-header">
      <div className="island-activity-tabs">
        <button
          type="button"
          className={`island-tab-btn ${activeTab === 'music' ? 'active' : ''}`}
          onClick={() => { sound.playTapSound(); setActiveTab('music'); }}
        >
          <Music size={11} />
          <span>Audio</span>
        </button>
        <button
          type="button"
          className={`island-tab-btn ${activeTab === 'timer' ? 'active' : ''}`}
          onClick={() => { sound.playTapSound(); setActiveTab('timer'); }}
        >
          <Timer size={11} />
          <span>Timer</span>
          {activityState.clock.isActive && (
            <span className="tab-pill-badge">{activityState.clock.formattedTime}</span>
          )}
        </button>
        <button
          type="button"
          className={`island-tab-btn ${activeTab === 'compiler' ? 'active' : ''}`}
          onClick={() => { sound.playTapSound(); setActiveTab('compiler'); }}
        >
          <Cpu size={11} />
          <span>Compiler</span>
          {activityState.compiler.isRunning && <span className="tab-pill-dot" />}
        </button>
      </div>

      <div className="island-header-right">
        <span className="battery-badge">
          <Battery size={12} /> 98%
        </span>
        <button
          type="button"
          className="collapse-btn"
          onClick={() => setExpanded(false)}
          aria-label="Collapse Dynamic Island"
        >
          Done
        </button>
      </div>
    </div>

    {/* Torch Banner if Active */}
    {flashlightOn && ( ... existing flashlight banner retained ... )}

    {/* Tab 1: Audio Controls */}
    {activeTab === 'music' && (
      <div className="island-audio-card">
        <div className="island-audio-top">
          <div className="island-track-cover">
            <Disc3 size={32} className={activityState.music.isPlaying ? 'spinning-vinyl' : ''} />
          </div>
          <div className="island-track-info">
            <strong>{activityState.music.trackTitle}</strong>
            <small>{activityState.music.artist} · {activityState.music.category}</small>
          </div>
          <button
            type="button"
            className="island-airplay-pill"
            onClick={() => liveActivity.toggleAirPlay()}
            title="Toggle AirPlay Output"
          >
            <Airplay size={11} />
            <span>{activityState.music.airPlayRoute}</span>
          </button>
        </div>

        {/* Real-Time Waveform Visualizer */}
        <canvas
          ref={waveformCanvasRef}
          width={316}
          height={26}
          className="island-waveform-canvas"
        />

        {/* Interactive Scrubber */}
        <div
          className="island-scrubber-bar"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPercent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
            liveActivity.seekProgress(clickPercent);
          }}
        >
          <div className="island-scrubber-fill" style={{ width: `${activityState.music.progress}%` }} />
        </div>
        <div className="island-time-labels">
          <span>{formatTime(activityState.music.elapsedSeconds)}</span>
          <span>-{formatTime(activityState.music.durationSeconds - activityState.music.elapsedSeconds)}</span>
        </div>

        {/* Playback Controls & Volume Dial */}
        <div className="island-audio-controls-row">
          <div className="island-playback-buttons">
            <button
              type="button"
              className="island-ctrl-btn"
              onClick={() => liveActivity.prevTrack()}
              aria-label="Previous Track"
            >
              <SkipBack size={15} />
            </button>
            <button
              type="button"
              className="island-ctrl-btn island-play-primary"
              onClick={() => liveActivity.toggleAudioPlay()}
              aria-label={activityState.music.isPlaying ? 'Pause' : 'Play'}
            >
              {activityState.music.isPlaying ? <Pause size={16} /> : <Play size={16} fill="currentColor" />}
            </button>
            <button
              type="button"
              className="island-ctrl-btn"
              onClick={() => liveActivity.nextTrack()}
              aria-label="Next Track"
            >
              <SkipForward size={15} />
            </button>
          </div>

          <div className="island-volume-container">
            <button
              type="button"
              className="island-ctrl-btn"
              onClick={() => liveActivity.toggleMute()}
              aria-label="Toggle Mute"
            >
              {activityState.music.isMuted || activityState.music.volume === 0 ? (
                <VolumeX size={13} />
              ) : (
                <Volume2 size={13} />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={activityState.music.isMuted ? 0 : activityState.music.volume}
              onChange={(e) => liveActivity.setVolume(Number(e.target.value))}
              className="island-volume-slider"
              aria-label="Audio Volume"
            />
          </div>
        </div>
      </div>
    )}

    {/* Tab 2: Interactive Timer Controls */}
    {activeTab === 'timer' && (
      <div className="island-timer-card">
        <div className="island-timer-top">
          {/* Live Circular SVG Progress Ring */}
          <div className="island-timer-svg-container">
            <svg width="64" height="64" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="26"
                fill="none"
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="4"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                fill="none"
                stroke="#ff9f0a"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 26}
                strokeDashoffset={
                  2 * Math.PI * 26 *
                  (1 - (activityState.clock.remainingSeconds / (activityState.clock.totalDurationSeconds || 300)))
                }
                transform="rotate(-90 32 32)"
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            </svg>
            <div className="island-timer-svg-center">
              <Hourglass size={18} />
            </div>
          </div>

          {/* Big Digital Readout */}
          <div className="island-timer-readout-col">
            <div className="island-timer-digits">
              {activityState.clock.formattedTime || '05:00'}
            </div>
            <div className="island-timer-sublabel">
              {activityState.clock.type === 'timer' ? 'Timer' : 'Stopwatch'} ·{' '}
              {activityState.clock.isRunning ? 'Counting Down' : 'Paused'}
            </div>
          </div>
        </div>

        {/* Interactive Actions: Pause/Resume, +1 Min, Stop */}
        <div className="island-timer-actions-row">
          <button
            type="button"
            className={`island-timer-btn ${activityState.clock.isRunning ? 'pause' : 'resume'}`}
            onClick={() => liveActivity.toggleTimerRunning()}
          >
            {activityState.clock.isRunning ? <Pause size={13} /> : <Play size={13} />}
            <span>{activityState.clock.isRunning ? 'Pause' : 'Resume'}</span>
          </button>
          <button
            type="button"
            className="island-timer-btn add-min"
            onClick={() => liveActivity.addMinuteToTimer()}
          >
            <Plus size={13} />
            <span>+1 min</span>
          </button>
          <button
            type="button"
            className="island-timer-btn stop"
            onClick={() => liveActivity.resetTimer()}
          >
            <Square size={12} fill="currentColor" />
            <span>Stop</span>
          </button>
        </div>
      </div>
    )}

    {/* Tab 3: Live Compiler stdout Preview Terminal */}
    {activeTab === 'compiler' && (
      <div className="island-compiler-card">
        <div className="island-compiler-header">
          <div className="mac-traffic-lights">
            <span className="mac-dot red" />
            <span className="mac-dot yellow" />
            <span className="mac-dot green" />
          </div>
          <span className="island-badge">
            <Cpu size={11} className="text-cyan" /> A18 Pro · JIT Sandbox
          </span>
          {activityState.compiler.passStatus === 'passed' && (
            <span className="compiler-pass-pill">
              <CheckCircle2 size={11} /> {activityState.compiler.runtimeUs || 4}μs
            </span>
          )}
        </div>

        <div className="island-terminal-stdout">
          {activityState.compiler.stdoutLines.length > 0 ? (
            activityState.compiler.stdoutLines.slice(-4).map((line, idx) => (
              <div key={idx} className="terminal-stdout-line">
                <Check size={10} className="terminal-check" />
                <span>{line}</span>
              </div>
            ))
          ) : (
            <div className="terminal-stdout-line empty">
              <span className="text-zinc">Xcode Cloud waiting for execution trigger...</span>
            </div>
          )}
        </div>

        <div className="island-compiler-footer">
          <button
            type="button"
            className="island-open-ide-btn"
            onClick={() => {
              setExpanded(false);
              onNavigate?.('xcode');
            }}
          >
            <ExternalLink size={10} />
            <span>Open Xcode Cloud Playground</span>
          </button>
        </div>
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
            onNavigate(activeTab === 'music' ? 'music' : activeTab === 'timer' ? 'clock' : 'xcode');
          }}
        >
          <ExternalLink size={10} className="mr-1 inline" />
          Open {activeTab === 'music' ? 'Music' : activeTab === 'timer' ? 'Clock' : 'Xcode'}
        </button>
      )}
    </div>
  </motion.div>
) : ( ... compact mode ... )}
```

---

### 4.3 Complete CSS Rules for `src/styles.css`

Place the following declarations in `src/styles.css` directly following line 1550 (after `.dynamic-island`):

```css
/* ==========================================================================
   Dynamic Island 2.0 — Morphing Expanded Capsule & Live Activity Styles
   ========================================================================== */

.dynamic-island {
  width: 119px;
  height: 33px;
  border-radius: 20px;
  background: #000000;
  box-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.15), 0 8px 24px rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  user-select: none;
  cursor: pointer;
  transition: box-shadow 0.2s ease;
  overflow: hidden;
}

/* Expanded Glass Capsule — strictly constrained within 372px screen bounds */
.dynamic-island.expanded {
  width: 348px;
  min-height: 168px;
  height: auto;
  border-radius: 36px;
  padding: 13px 16px 14px;
  background: rgba(12, 12, 14, 0.94);
  backdrop-filter: blur(32px) saturate(190%);
  -webkit-backdrop-filter: blur(32px) saturate(190%);
  border: 0.5px solid rgba(255, 255, 255, 0.16);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  cursor: default;
  z-index: 100;
}

.island-expanded-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

/* Header & Multi-Activity Tabs */
.island-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-bottom: 2px;
}

.island-header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.island-activity-tabs {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.08);
  padding: 2.5px;
  border-radius: 20px;
}

.island-tab-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 10.5px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: all 0.18s ease;
}

.island-tab-btn.active {
  background: rgba(255, 255, 255, 0.22);
  color: #ffffff;
}

.tab-pill-badge {
  background: rgba(255, 159, 10, 0.3);
  color: #ff9f0a;
  padding: 1px 5px;
  border-radius: 8px;
  font-size: 9px;
  font-variant-numeric: tabular-nums;
}

.tab-pill-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #38bdf8;
  box-shadow: 0 0 6px #38bdf8;
  animation: pulseDot 1s infinite alternate;
}

.island-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.78);
  letter-spacing: -0.01em;
}

.battery-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  color: #30d158;
}

.collapse-btn {
  background: rgba(255, 255, 255, 0.16);
  border: none;
  color: #ffffff;
  padding: 3px 9px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;
}

.collapse-btn:hover {
  background: rgba(255, 255, 255, 0.28);
}

/* Audio Card */
.island-audio-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.island-audio-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.island-track-cover {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: radial-gradient(circle, #2d3748 0%, #1a202c 100%);
  display: grid;
  place-items: center;
  color: #38bdf8;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  flex-shrink: 0;
}

.spinning-vinyl {
  animation: spinVinyl 3s linear infinite;
}

.island-track-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.island-track-info strong {
  font-size: 12.5px;
  font-weight: 600;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.island-track-info small {
  font-size: 10.5px;
  color: rgba(255, 255, 255, 0.6);
}

.island-airplay-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.12);
  border: 0.5px solid rgba(255, 255, 255, 0.18);
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 500;
  color: #38bdf8;
  cursor: pointer;
  transition: background 0.15s ease;
}

.island-airplay-pill:hover {
  background: rgba(56, 189, 248, 0.2);
}

.island-waveform-canvas {
  width: 100%;
  height: 26px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.35);
}

.island-scrubber-bar {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.16);
  border-radius: 2px;
  position: relative;
  cursor: pointer;
}

.island-scrubber-fill {
  height: 100%;
  background: #38bdf8;
  border-radius: 2px;
  transition: width 0.1s linear;
}

.island-time-labels {
  display: flex;
  justify-content: space-between;
  font-size: 9.5px;
  color: rgba(255, 255, 255, 0.5);
  font-variant-numeric: tabular-nums;
  margin-top: -4px;
}

.island-audio-controls-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-top: 2px;
}

.island-playback-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
}

.island-ctrl-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  display: grid;
  place-items: center;
  padding: 4px;
  border-radius: 50%;
  transition: transform 0.1s ease, color 0.15s ease;
}

.island-ctrl-btn:hover {
  color: #ffffff;
  transform: scale(1.08);
}

.island-play-primary {
  width: 32px;
  height: 32px;
  background: #ffffff;
  color: #000000;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.25);
}

.island-volume-container {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  max-width: 110px;
}

.island-volume-slider {
  -webkit-appearance: none;
  width: 100%;
  height: 3.5px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.2);
  outline: none;
}

.island-volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ffffff;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
}

/* Timer Card */
.island-timer-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 2px 0;
}

.island-timer-top {
  display: flex;
  align-items: center;
  gap: 16px;
}

.island-timer-svg-container {
  position: relative;
  width: 64px;
  height: 64px;
  flex-shrink: 0;
}

.island-timer-svg-center {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: #ff9f0a;
}

.island-timer-readout-col {
  display: flex;
  flex-direction: column;
}

.island-timer-digits {
  font-size: 32px;
  font-weight: 700;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  font-variant-numeric: tabular-nums;
  color: #ffffff;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.island-timer-sublabel {
  font-size: 11px;
  color: #ff9f0a;
  font-weight: 500;
}

.island-timer-actions-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.island-timer-btn {
  flex: 1;
  border: none;
  padding: 7px 10px;
  border-radius: 16px;
  font-size: 11px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.island-timer-btn.pause {
  background: rgba(255, 159, 10, 0.22);
  color: #ff9f0a;
}

.island-timer-btn.resume {
  background: rgba(48, 209, 88, 0.22);
  color: #30d158;
}

.island-timer-btn.add-min {
  background: rgba(255, 255, 255, 0.14);
  color: #ffffff;
}

.island-timer-btn.stop {
  background: rgba(255, 69, 58, 0.22);
  color: #ff453a;
}

/* Compiler Terminal Card */
.island-compiler-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #090a0f;
  border: 0.5px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  padding: 10px 12px;
}

.island-compiler-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mac-traffic-lights {
  display: flex;
  gap: 4.5px;
}

.mac-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}
.mac-dot.red { background: #ff5f56; }
.mac-dot.yellow { background: #ffbd2e; }
.mac-dot.green { background: #27c93f; }

.compiler-pass-pill {
  background: rgba(48, 209, 88, 0.2);
  color: #30d158;
  font-size: 9.5px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 3px;
}

.island-terminal-stdout {
  font-family: 'SF Mono', ui-monospace, Menlo, Consolas, monospace;
  font-size: 10px;
  line-height: 1.45;
  color: #cbd5e1;
  display: flex;
  flex-direction: column;
  gap: 3px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  padding: 6px 8px;
}

.terminal-stdout-line {
  display: flex;
  align-items: flex-start;
  gap: 5px;
}

.terminal-check {
  color: #30d158;
  flex-shrink: 0;
  margin-top: 2px;
}

.island-open-ide-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #38bdf8;
  font-size: 10px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  align-self: flex-start;
}
```

---

### 4.4 App Integration Implementation Blueprint

#### 1. Integration with `src/apps/MusicApp.tsx`
Add subscription on mount and bind controls directly to `liveActivity`:
```typescript
// Inside MusicApp.tsx:
useEffect(() => {
  const unsubscribe = liveActivity.subscribe((state) => {
    setIsPlaying(state.music.isPlaying);
    setTrackIndex(state.music.trackIndex);
    setProgress(state.music.progress);
    setElapsedSeconds(state.music.elapsedSeconds);
    setVolume(state.music.volume);
    setIsMuted(state.music.isMuted);
  });
  return unsubscribe;
}, []);

const handleTogglePlay = () => {
  liveActivity.toggleAudioPlay();
};

const handleNextTrack = () => {
  sound.playTapSound();
  liveActivity.nextTrack();
};

const handlePrevTrack = () => {
  sound.playTapSound();
  liveActivity.prevTrack();
};

const handleVolumeChange = (newVol: number) => {
  liveActivity.setVolume(newVol);
};
```

#### 2. Integration with `src/apps/ClockApp.tsx`
Substitute local unmounting interval with `liveActivity.clock` subscription:
```typescript
// Inside ClockApp.tsx:
const [clockState, setClockState] = useState(() => liveActivity.getState().clock);

useEffect(() => {
  const unsubscribe = liveActivity.subscribe((state) => {
    setClockState(state.clock);
  });
  return unsubscribe;
}, []);

// When user taps preset or start/pause timer:
const handleSelectPreset = (seconds: number) => {
  sound.playTapSound();
  liveActivity.startTimer(seconds);
};

const handleStartPauseTimer = () => {
  sound.playTapSound();
  liveActivity.toggleTimerRunning();
};

const handleResetTimer = () => {
  sound.playTapSound();
  liveActivity.resetTimer();
};
```

---

## 5. Verification Method

### 5.1 Verification Commands
```bash
# 1. Typecheck the entire project
npx tsc --noEmit

# 2. Run existing and new test suites
npm test -- --run

# 3. Production Vite bundle build
npm run build
```

### 5.2 File Inspection Checklist
- `src/components/DynamicIsland.tsx`:
  - Verify `.dynamic-island.expanded` renders with `width: 348px; border-radius: 36px;`.
  - Verify interactive Audio controls (Play/Pause, track scrubber, volume dial, AirPlay pill, real-time waveform canvas).
  - Verify interactive Timer controls (big digital readout, circular SVG progress ring, Pause, +1 min, Stop).
  - Verify Compiler terminal preview with traffic lights and green pass checkmarks.
- `src/styles.css`:
  - Verify definitions for `.dynamic-island.expanded`, `.island-expanded-content`, `.island-header`, `.island-badge`, and `.collapse-btn`.
- `src/apps/MusicApp.tsx` & `src/apps/ClockApp.tsx`:
  - Verify bidirectional updates through `liveActivity.ts` coordinator.

### 5.3 Invalidation Conditions
- If `npx tsc --noEmit` fails on missing props or types.
- If the expanded island exceeds 350px width or causes horizontal scrolling/overflow on `.iphone-amoled-display`.
- If starting a timer in ClockApp and navigating to Home/GitHub fails to reflect active countdown in Dynamic Island.
- If adjusting volume or playing audio in Dynamic Island fails to update `sound.getIsPlaying()` or `MusicApp`.

---
*Report generated and self-verified by Explorer M1_2.*
