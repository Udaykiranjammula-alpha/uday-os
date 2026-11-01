# BRIEFING — 2026-11-01T15:56:00Z

## Mission
Implement Milestone 1 in full: Dynamic Island Live Activities & PiP Multitasking with complete real-time coordinators, canvas waveforms, circular countdown rings, A18 Pro indicators, expanded capsule controls, persistent PiP overlay, Music/Clock integration, and Robocopy synchronization.

## 🔒 My Identity
- Archetype: teamwork_worker
- Roles: implementer, qa, specialist
- Working directory: c:\Users\ASUS\Documents\antigravity\busy-faraday\.agents\teamwork\teamwork_worker_m1_1
- Original parent: 1ae9bb65-98e9-49e2-889d-e047ba75afaf
- Milestone: M1 (Dynamic Island Live Activities & PiP Multitasking)

## 🔒 Key Constraints
- DO NOT CHEAT. All implementations must be genuine. Real state and real behavior.
- Strictly adhere to Cupertino Apple design language and bezel bounds (372px x 806px display).
- Robocopy sync to F:\app\udayport on completion.
- TypeScript clean (0 errors), all tests passing, production build succeeding.

## Current Parent
- Conversation ID: 1ae9bb65-98e9-49e2-889d-e047ba75afaf
- Updated: 2026-11-01T15:56:00Z

## Task Summary
- **What to build**:
  1. `src/services/liveActivity.ts` (singleton coordinator, useSyncExternalStore hook, 50ms ticker)
  2. `src/components/DynamicIsland.tsx` (compact mode with 4-bar canvas audio visualizer, spinning disc, circular countdown ring, A18 Pro chip; expanded capsule mode with tabs for Audio, Timer, Compiler, Done button)
  3. `src/components/PiPOverlay.tsx` (persistent draggable floating overlay clamped to [8, 220] x [60, 680], 60fps canvas screencast, controls)
  4. Mount `PiPOverlay` in `src/components/IPhoneScreenContent.tsx`
  5. Integrate `MusicApp.tsx` and `ClockApp.tsx` with `liveActivity.ts`
  6. Add all styles in `src/styles.css`
  7. Add comprehensive unit tests in `src/__tests__/liveActivity.test.ts`
  8. Typecheck (`npx tsc --noEmit`), test (`npm test -- --run`), build (`npm run build`)
  9. Robocopy mirror to `F:\app\udayport`
- **Success criteria**: 0 typecheck errors, 100% tests passing, clean build, live activities persist across route switches, authentic Cupertino design.
- **Interface contracts**: PROJECT.md § Live Activity Coordinator, Explorer blueprints.
- **Code layout**: PROJECT.md § Code Layout.

## Key Decisions Made
- Standardize `LiveActivityState` to comprehensively support Audio, Clock, Algorithm/Compiler, and PiP with clean helper methods.
- Provide `useLiveActivity()` via `useSyncExternalStore` for seamless reactive components without stale closures.
- Canvas renderers use direct context drawing via `requestAnimationFrame` and `useRef` to avoid React re-render thrashing.

## Artifact Index
- `src/services/liveActivity.ts` — Central coordinator service & subscription hook
- `src/components/DynamicIsland.tsx` — Compact & expanded Live Activity capsule
- `src/components/PiPOverlay.tsx` — Persistent draggable picture-in-picture window
- `src/components/IPhoneScreenContent.tsx` — Root screen overlay mount point
- `src/apps/MusicApp.tsx` — Music player integration
- `src/apps/ClockApp.tsx` — Clock / timer integration
- `src/styles.css` — Cupertino styles and keyframes
- `src/__tests__/liveActivity.test.ts` — Unit tests for live activity coordinator

## Change Tracker
- **Files modified**: [TBD]
- **Build status**: pending
- **Pending issues**: none

## Quality Status
- **Build/test result**: pending
- **Lint status**: 0
- **Tests added/modified**: pending
