# DISPATCH — Worker M1: Dynamic Island Live Activities & PiP Multitasking

## Mission
Implement Milestone 1 in full according to the blueprints from Explorer M1_1, M1_2, and M1_3:
1. Create `src/services/liveActivity.ts`:
   - Singleton coordinator for audio playback, clock/timer, compiler telemetry, and PiP overlay.
   - Use `useSyncExternalStore` subscription pattern.
   - Implement precision timer/stopwatch ticker (50ms interval).
2. Upgrade `src/components/DynamicIsland.tsx`:
   - Compact mode: 4-bar canvas audio visualizer with `sound.getAnalyser()` frequency bins, animated mini-disc, circular SVG countdown ring with live ms tick, pulsating cyan A18 Pro chip indicator.
   - Expanded capsule mode (`.dynamic-island.expanded`):
     - Floating glass capsule (`width: 348px; min-height: 168px; border-radius: 36px;`).
     - Multi-activity tabs: `Audio` (scrubber, volume dial, AirPlay pill, 20-bar canvas waveform), `Timer` (big digital readout, live circular progress ring, pause, +1 min, stop), `Compiler` (live terminal stdout preview with green checkmarks).
     - Responsive Done / Collapse button.
3. Create `src/components/PiPOverlay.tsx`:
   - Persistent draggable floating Picture-in-Picture window overlay using Framer Motion.
   - Strictly clamped within iPhone bezel bounds (`x: [8, 220]`, `y: [60, 680]`, `border-radius: 46px; overflow: hidden;`).
   - 60fps canvas demo screencast synthesizer, play/pause, seek scrubber, close, minimize controls.
4. Mount `PiPOverlay` in `src/components/IPhoneScreenContent.tsx` as a top-level persistent overlay that survives route transitions.
5. Integrate `src/apps/MusicApp.tsx` and `src/apps/ClockApp.tsx` with `liveActivity.ts` so playback and countdown timers persist across app navigation.
6. Add all required CSS rules to `src/styles.css`.
7. Verify build and tests:
   - `npx tsc --noEmit` (clean 0 errors)
   - `npm test -- --run`
   - `npm run build`
8. Synchronize modifications to `F:\app\udayport` using Robocopy:
   `robocopy c:\Users\ASUS\Documents\antigravity\busy-faraday F:\app\udayport /MIR /XD node_modules .git .agents dist .gemini /R:2 /W:2`

## Write Ownership
Worker M1 exclusively owns:
- `src/services/liveActivity.ts`
- `src/components/DynamicIsland.tsx`
- `src/components/PiPOverlay.tsx`
- `src/components/IPhoneScreenContent.tsx`
- `src/apps/MusicApp.tsx`
- `src/apps/ClockApp.tsx`
- `src/styles.css`

## Reference Blueprints
- ORIGINAL_REQUEST.md: c:\Users\ASUS\Documents\antigravity\busy-faraday\.agents\teamwork\ORIGINAL_REQUEST.md
- PROJECT.md: c:\Users\ASUS\Documents\antigravity\busy-faraday\PROJECT.md
- Explorer M1_1 Handoff: c:\Users\ASUS\Documents\antigravity\busy-faraday\.agents\teamwork\teamwork_explorer_m1_1\handoff.md
- Explorer M1_2 Handoff: c:\Users\ASUS\Documents\antigravity\busy-faraday\.agents\teamwork\teamwork_explorer_m1_2\handoff.md
- Explorer M1_3 Handoff: c:\Users\ASUS\Documents\antigravity\busy-faraday\.agents\teamwork\teamwork_explorer_m1_3\handoff.md

## MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Outputs
Write your handoff report to:
`c:\Users\ASUS\Documents\antigravity\busy-faraday\.agents\teamwork\teamwork_worker_m1_1\handoff.md`
