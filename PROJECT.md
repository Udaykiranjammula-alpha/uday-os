# Project: UDAY OS (Virtual iPhone 16 Pro Web OS Portfolio)

## Architecture
UDAY OS is an authentic Cupertino Apple design language virtual operating system showcasing Uday Kiran Jammula's engineering portfolio. It features real-time compilation, hardware physics, Dynamic Island multitasking, macOS Sequoia continuity, systems engineering telemetry, and comprehensive E2E verification.

### System Subsystems & Data Flow
1. **Shell & Hardware Emulation Layer**:
   - `Phone3DCanvas.tsx` / `VirtualPhone.tsx`: WebGL 3D chassis with PBR materials, titanium finishes, and bezel constraints.
   - `haptics.ts`: Unified tactile vibration pulses (`navigator.vibrate`) with Web Audio chime fallbacks.
   - Spatial Gyroscope / Kinetic Tracker: DeviceMotionEvent gyro telemetry with kinetic mouse velocity decay.
   - Parallax Depth Segmentation: 3-plane spatial parallax (Background, Midground Subject, Foreground UI).
2. **OS Subsystems & Coordinators**:
   - `liveActivity.ts`: Central coordinator managing audio playback, stopwatch/timer, compiler telemetry, and floating PiP overlay.
   - `DynamicIsland.tsx`: Compact and expanded glass capsule with interactive controls, SVG countdown rings, canvas waveform visualizer, and CPU gauge.
   - `spotlightIndex.ts` & `mathEvaluator.ts`: Universal search index across all apps, LeetCode, projects, skills, achievements, inline math, and action shortcuts.
3. **Flagship Application Layer**:
   - `XcodeApp.tsx` & `CodeEditor.tsx` & `codeRunner.ts`: SF Mono editor, sandboxed Python/JS execution engine, 5 core algorithms, interactive microsecond test runner.
   - `FitnessApp.tsx`: 3D metallic Activity Rings with overlap shadow caps, kinetic energy gauge, 360-degree interactive medals.
   - `EmbeddedLabApp.tsx`: Dual-core FreeRTOS task scheduler, 60fps canvas oscilloscope for SCK/MOSI/checksum, packet noise injection & CRC re-transmission.
   - `GenmojiApp.tsx` & `MessagesApp.tsx`: Concept mixing studio, canvas particle diffusion shimmer, 512x512 PNG export, iMessage sticker bubbles.
   - `MacMirrorView.tsx`: macOS Sequoia desktop window chrome (>1200px), live mirrored phone interaction, universal clipboard banners, drag-and-drop continuity.

---

## Feature Inventory
Every feature identified during the Survey phase is mapped to an authoritative milestone. No feature is left unassigned.

| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Central Live Activity Coordinator | Unified background state for audio, timers, compiler, and PiP across route changes | M1 | Survey 1, Master Plan |
| 2 | Dynamic Island Real-Time Waveform | Canvas-based 4-bar audio frequency visualizer connected to Web Audio analyser + album art | M1 | Survey 1, Master Plan |
| 3 | Dynamic Island Stopwatch & Countdown Ring | SVG circular countdown ring with live millisecond timer tick synchronized with ClockApp | M1 | Survey 1, Master Plan |
| 4 | Dynamic Island CPU Gauge | Pulsating cyan A18 Pro chip live activity displaying algorithm execution status | M1 | Survey 1, Master Plan |
| 5 | Dynamic Island Morphing Expanded Capsule | Interactive glass capsule with audio volume/AirPlay, timer controls (+1 min, pause, stop), and compiler stdout log preview | M1 | Survey 1, Master Plan |
| 6 | Persistent Picture-in-Picture (PiP) Window | Floating draggable video/screencast overlay constrained within phone bezel across app transitions | M1 | Survey 1, Master Plan |
| 7 | SF Mono Cupertino Code Editor | In-phone code editor with SF Mono, line numbers, syntax tokenization, active line highlight, and bracket matching | M2 | Survey 2, Master Plan |
| 8 | Sandboxed Python/JS Execution Engine | In-browser secure algorithm runner capturing stdout, execution time (μs), and memory estimates | M2 | Survey 2, Master Plan |
| 9 | Flagship Algorithm Suites | Implementations for Two Sum (O(N) Hash Map vs O(N^2)), Valid Parentheses, LRU Cache, Binary Search, Merge Intervals | M2 | Survey 2, Master Plan |
| 10 | Interactive Test Runner & Telemetry | Custom input fields, execution duration in μs, memory metrics, and visual green checkmark assertions | M2 | Survey 2, Master Plan |
| 11 | Xcode Cloud In-Phone IDE App | Dedicated `XcodeApp.tsx` integrating editor, algorithm selector, test runner, and Island live activity | M2 | Survey 2, Master Plan |
| 12 | 3D Metallic Activity Rings | Three concentric metallic gradient rings (Move, Exercise, Stand) with overlap drop-shadow end caps | M3 | Survey 2, Master Plan |
| 13 | Mobile Gyroscope Telemetry | Real-time `DeviceMotionEvent` tilt and shake detection charging kinetic motion gauge | M3 | Survey 2, Master Plan |
| 14 | Desktop Kinetic Inertial Mouse Fallback | Mouse movement velocity tracking simulating kinetic charge with leaky-bucket decay | M3 | Survey 2, Master Plan |
| 15 | 360° Interactive Metallic Medals | Draggable 3D medals (LeetCode Master Medal, KL University Distinction Shield, ESP32 Telemetry Trophy) with specular glare | M3 | Survey 2, Master Plan |
| 16 | Multi-Plane Spatial Wallpaper Parallax | 3-plane depth segmentation (Background, Midground Subject, Foreground UI) responsive to gyro & mouse | M3 | Survey 2, Master Plan |
| 17 | Browser Vibration API Haptics Service | Unified `haptics.ts`: 12ms tap tick, [20,40,20]ms Action Button double-pulse, Apple Pay chime buzz with audio fallback | M3 | Survey 2, Master Plan |
| 18 | Universal Deep Search Index | Deep index covering all 39+ apps, 184 LeetCode questions, projects, technical skills, resume achievements, contacts | M4 | Survey 1, Master Plan |
| 19 | Natural Language Math Calculator | Inline expression evaluator for calculations (e.g. `128 * 64`, `sqrt(256)`, `2^16`, `15% of 80`) with 1-click copy | M4 | Survey 1, Master Plan |
| 20 | Tech Unit & Currency Converter | Instant conversion cards for storage (`16 gb in mb`), latency (`100 ms in fps`), salary (`salary 150k`), currency (`100 usd in inr`) | M4 | Survey 1, Master Plan |
| 21 | Direct App Action Shortcuts | Instant trigger shortcuts in search (`take photo`, `hire`/`email`, chassis finish changes `orange`/`dark`, torch, music) | M4 | Survey 1, Master Plan |
| 22 | Dual-Core FreeRTOS Task Scheduler Lab | Telemetry visualization for Core 0 (I/O, Wi-Fi) and Core 1 (INT8 TFLite Micro inference) CPU utilization & FreeRTOS queues | M5 | Survey 3, Master Plan |
| 23 | 60fps Canvas Oscilloscope & Logic Analyzer | Real-time CRT canvas oscilloscope plotting synchronized SPI bus clock (`SCK`), data out (`MOSI`), and packet checksum | M5 | Survey 3, Master Plan |
| 24 | Interactive Packet Noise Injection & CRC Retransmit | Inject noise button corrupting bits, causing CRC error detection, visual alert, and automatic FreeRTOS re-transmission | M5 | Survey 3, Master Plan |
| 25 | macOS Sequoia iPhone Mirroring Window | Desktop window chrome for >1200px viewports with traffic light buttons mirroring phone display and clicks in real time | M6 | Survey 3, Master Plan |
| 26 | Universal Clipboard Continuity | Clipboard panel with quick-copy snippets and Apple banner notifications ("Pasted from MacBook Pro") on phone | M6 | Survey 3, Master Plan |
| 27 | Drag-and-Drop Continuity | HTML5 drag-and-drop transferring files between Mac window drawer and virtual iPhone with AirDrop animation | M6 | Survey 3, Master Plan |
| 28 | Image Playground AI Concept Mixing | Multi-concept mixing studio combining developer archetypes, tech badges, visual styles, and emoji expressions | M6 | Survey 3, Master Plan |
| 29 | Canvas Diffusion Shimmer Animation | 60fps canvas particle diffusion engine with Apple Intelligence iridescent chromatic glow | M6 | Survey 3, Master Plan |
| 30 | Custom Genmoji Sticker Synthesizer & PNG Export | High-DPI off-screen canvas rendering sticker squircle and exporting 512x512 PNG file | M6 | Survey 3, Master Plan |
| 31 | 1-Click Send in iMessage | Seamless transfer of synthesized Genmoji sticker into `MessagesApp.tsx` chat stream | M6 | Survey 3, Master Plan |
| 32 | Opaque-Box E2E Test Suite (Tiers 1-4) | Comprehensive requirement-driven test suite derived from ORIGINAL_REQUEST.md covering all 31 features | M7 | Dual Track |
| 33 | Adversarial Coverage Hardening (Tier 5) | White-box stress testing and boundary exploitation loop ensuring zero integrity gaps | M7 | Final Milestone |
| 34 | Robocopy Mirror & Git Deployment Pipeline | Continuous synchronization to `F:\app\udayport` and verified commits pushed to GitHub main branch for Vercel deployment | M1-M7 | Survey 3, R3 |

---

## Milestones

| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Dynamic Island Live Activities & PiP Multitasking | `liveActivity.ts`, `DynamicIsland.tsx`, `PiPOverlay.tsx`, `styles.css`, integration with Music & Clock | None | **DONE** |
| M2 | Xcode Cloud In-Phone Compiler & LeetCode Playground | `CodeEditor.tsx`, `codeRunner.ts`, `XcodeApp.tsx`, `LeetCodeApp.tsx`, routes & icon integration | None | PLANNED |
| M3 | Apple HealthKit 3D Activity Rings, Gyroscope & Hardware Haptics | `haptics.ts`, `FitnessApp.tsx` (3D rings, gyro/mouse kinetic gauge, 360° medals), `SpatialParallax.tsx` | None | PLANNED |
| M4 | Spotlight Search 2.0 with Math, Conversions & Shortcuts | `spotlightIndex.ts`, `mathEvaluator.ts`, `SpotlightSearch.tsx`, action shortcuts | M1, M2 | PLANNED |
| M5 | ESP32 Dual-Core FreeRTOS & Oscilloscope Engineering Lab | `EmbeddedLabApp.tsx` (dual-core telemetry, 60fps canvas oscilloscope, noise injection & CRC retransmit) | None | PLANNED |
| M6 | macOS Sequoia Mirroring & iOS 18 Genmoji / Image Playground | `MacMirrorView.tsx` (mirroring, clipboard, drag-drop), `GenmojiApp.tsx` (mixing, diffusion, export, iMessage) | M1, M5 | PLANNED |
| M7 | Final Milestone: 100% E2E Test Suite & Adversarial Hardening | Tier 1-4 test execution from E2E Testing Track; Tier 5 white-box adversarial coverage hardening; deployment push | M1-M6, TEST_READY | PLANNED |

*Parallel Track: E2E Testing Track Orchestrator runs in parallel to design and implement the comprehensive test harness and test suite (`TEST_INFRA.md` -> `TEST_READY.md`).*

---

## Interface Contracts

### Live Activity Coordinator (`src/services/liveActivity.ts`)
```typescript
export interface AudioLiveActivity {
  isPlaying: boolean;
  trackTitle: string;
  artist: string;
  albumArt?: string;
}

export interface ClockLiveActivity {
  isActive: boolean;
  type: 'stopwatch' | 'timer';
  remainingMs: number;
  totalDurationMs: number;
  formattedTime: string;
}

export interface AlgorithmLiveActivity {
  isRunning: boolean;
  algorithmName: string;
  timeComplexity: string;
  runtimeUs?: number;
  passStatus?: 'running' | 'passed' | 'failed';
}

export interface PiPState {
  isOpen: boolean;
  title: string;
  videoSrc?: string;
  isPlaying: boolean;
  position: { x: number; y: number };
}
```

### Code Execution Engine (`src/services/codeRunner.ts`)
```typescript
export interface ExecutionResult {
  success: boolean;
  output: unknown;
  stdout: string[];
  executionTimeUs: number;
  memoryBytesEstimate?: number;
  error?: string;
}
```

### Unified Haptics & Feedback (`src/services/haptics.ts`)
```typescript
export interface IHapticsService {
  tap(): void;          // 12ms tick
  actionButton(): void; // [20, 40, 20]ms double-pulse
  success(): void;      // Crescendo buzz on Apple Pay / Ring completion
  wheelTick(): void;    // 8ms tick
  error(): void;        // [50, 50, 50]ms rejection buzz
}
```

---

## Code Layout
- `src/apps/`: Individual application screens (`XcodeApp.tsx`, `EmbeddedLabApp.tsx`, `GenmojiApp.tsx`, `FitnessApp.tsx`, `LeetCodeApp.tsx`, etc.).
- `src/components/`: Reusable phone hardware, chrome, and overlay components (`DynamicIsland.tsx`, `PiPOverlay.tsx`, `SpotlightSearch.tsx`, `MacMirrorView.tsx`, `CodeEditor.tsx`, `SpatialParallax.tsx`).
- `src/services/`: System-wide singleton coordinators and utilities (`liveActivity.ts`, `haptics.ts`, `codeRunner.ts`, `spotlightIndex.ts`, `mathEvaluator.ts`, `sound.ts`).
- `src/data/`: Data models and definitions (`projects.ts`, `skills.ts`, `achievements.ts`, `appMeta.ts`, `profile.ts`).
- `src/__tests__/`: Unit and E2E integration test suites.
- `styles.css`: Cupertino styling, animations, and responsive layouts.
