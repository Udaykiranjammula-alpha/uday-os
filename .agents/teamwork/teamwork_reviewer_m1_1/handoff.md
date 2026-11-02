# Milestone 1 Independent Review & Adversarial Audit Report

**Author:** Reviewer 1 (`teamwork_reviewer_m1_1`)  
**Target:** Orchestrator (`1ae9bb65-98e9-49e2-889d-e047ba75afaf`)  
**Date:** 2026-11-01T16:45:00Z  
**Milestone:** M1 (Dynamic Island Live Activities & PiP Multitasking)  
**Verdict:** **REQUEST_CHANGES**  

---

## Review Summary

An independent, rigorous review and adversarial stress-audit was conducted on the Milestone 1 deliverable submitted by Worker M1 (`teamwork_worker_m1_1`).

### Integrity Assessment: PASS (No Integrity Violations)
- **Hardcoded test facades:** None found.
- **Dummy or shortcut implementations:** None found. Real Web Audio analyser, 50ms delta-timed ticker, multi-channel canvas screencast synthesizer, and React 18 `useSyncExternalStore` observable coordinator are implemented.
- **Fabricated verification outputs:** None found. Production build and typecheck run genuinely clean.

### Functional Verdict: REQUEST_CHANGES
While the core architecture is well-engineered and Cupertino aesthetic fidelity is high, **two Major functional defects** and **one Minor boundary defect** were identified and empirically reproduced. These defects violate DISPATCH specifications, cause physical viewport overflows on the 372px iPhone display, and lead to UI deadlocks when switching between Clock modes.

---

## 1. Observation

### 1.1 Tool Command Executions
1. **TypeScript Typecheck:**
   ```powershell
   npx tsc --noEmit
   ```
   *Result:* Exit code 0, 0 diagnostic errors.

2. **Production Build:**
   ```powershell
   npm run build
   ```
   *Result:* Exit code 0. Built in 5.43s. Emitted assets in `dist/` (300.94 kB CSS, 681.89 kB JS bundle).

3. **Vitest Test Suite:**
   ```powershell
   npm test -- --run
   ```
   *Result:* 12 test files passed, 216/216 unit and E2E integration tests passing.

### 1.2 Direct Code Observations & Discrepancies

#### Observation O1: PiP Coordinate Clamping Mismatch & Viewport Overflow
- In `src/services/liveActivity.ts` (lines 115, 230-232, 288):
  ```typescript
  bezelBounds: { minX: 12, maxX: 260, minY: 60, maxY: 680 },
  ```
- In `src/components/PiPOverlay.tsx` (lines 26-31):
  ```typescript
  const BEZEL_CONSTRAINTS = {
    left: 8,
    right: 220,
    top: 60,
    bottom: 680,
  };
  ```
- In `DISPATCH.md` item 2:
  > "Robustness: Are PiP drag boundaries strictly clamped to bezel bounds (`x: [8, 220]`, `y: [60, 680]`)?"
- In `src/styles.css` (lines 18802-18803):
  ```css
  .pip-overlay-window {
    width: 144px;
    height: 98px;
  }
  ```
- **Geometry calculation:** The AMOLED display screen width is 372px (`.phone-surface .iphone-screen`).
  - With `maxX = 260`, when the window is at `x = 260px`, the right edge is `260 + 144 = 404px`.
  - `404px - 372px = 32px` overflow outside the iPhone display bezel!
  - `PiPOverlay.tsx` and `DISPATCH.md` correctly establish `right: 220` (where `220 + 144 = 364px`, leaving a required 8px margin from the right bezel).
  - Calling `liveActivity.updatePiPPosition(350, 300)` clamps to `x = 260` instead of `220`.

#### Observation O2: Timer/Stopwatch Cross-Toggle Deadlock (No-Op Trap)
- In `src/services/liveActivity.ts` (lines 535-541):
  ```typescript
  public toggleStopwatchRunning() {
    if (this.state.clock.isActive && !this.state.clock.isPaused) {
      this.pauseStopwatch();
    } else {
      this.startStopwatch();
    }
  }
  ```
- In `src/services/liveActivity.ts` (lines 527-533):
  ```typescript
  public pauseStopwatch() {
    if (!this.state.clock.isActive || this.state.clock.type !== 'stopwatch') return;
    this.state.clock.isPaused = true;
    this.state.clock.isRunning = false;
    this.stopClockTicker();
    this.notify();
  }
  ```
- In `src/services/liveActivity.ts` (lines 472-482):
  ```typescript
  public toggleTimerRunning() {
    if (!this.state.clock.isActive) {
      this.startTimer(300); // 5 min default
      return;
    }
    if (this.state.clock.isPaused) {
      this.resumeTimer();
    } else {
      this.pauseTimer();
    }
  }
  ```
- In `src/services/liveActivity.ts` (lines 456-462):
  ```typescript
  public pauseTimer() {
    if (!this.state.clock.isActive || this.state.clock.type !== 'timer') return;
    this.state.clock.isPaused = true;
    this.state.clock.isRunning = false;
    this.stopClockTicker();
    this.notify();
  }
  ```
- **Execution trace:**
  - When a countdown timer is currently running (`isActive: true`, `type: 'timer'`), if the user clicks the Stopwatch toggle (`toggleStopwatchRunning()`), `this.state.clock.isActive && !this.state.clock.isPaused` evaluates to `true`.
  - It invokes `this.pauseStopwatch()`.
  - Inside `pauseStopwatch()`, `this.state.clock.type !== 'stopwatch'` is `true`, so it returns immediately as a silent no-op!
  - It neither starts the stopwatch, nor switches to stopwatch, nor pauses the clock. It enters a deadlock where subsequent calls continue to no-op.
  - Symmetrically, calling `toggleTimerRunning()` when a stopwatch is running branches into `pauseTimer()`, which exits early because `type !== 'timer'`.

#### Observation O3: Un-Sanitized Negative Duration Display
- In `src/services/liveActivity.ts` (line 437):
  ```typescript
  public startTimer(durationSeconds: number) {
    const totalMs = durationSeconds * 1000;
    this.state.clock = {
      ...
      formattedTime: this.formatMinutesSeconds(totalMs),
  ```
- In `formatMinutesSeconds(-10000)`:
  - `Math.floor(-10 / 60) = -1`
  - `Math.floor(-10 % 60) = -10`
  - Formatted time becomes `"-1:-10"`.
  - For up to 50ms (before the first ticker tick clamps `remainingMs`), Dynamic Island displays `"-1:-10"`.

---

## 2. Logic Chain

1. **[From Observation O1]**
   - The DISPATCH specification explicitly mandates checking whether PiP drag boundaries are strictly clamped to `x: [8, 220]` and `y: [60, 680]`.
   - `PiPOverlay.tsx` defined `BEZEL_CONSTRAINTS = { left: 8, right: 220, top: 60, bottom: 680 }`.
   - However, the underlying service `liveActivity.ts` defines `bezelBounds: { minX: 12, maxX: 260, minY: 60, maxY: 680 }`.
   - Because the PiP window is 144px wide and the iPhone screen is 372px wide, allowing `maxX = 260` allows the PiP to extend to 404px, overflowing the AMOLED screen by 32px.
   - Any programmatic update (`liveActivity.updatePiPPosition`) or external state sync violates bezel bounds and causes visual clipping behind the 3D phone chassis.

2. **[From Observation O2]**
   - The Dynamic Island Expanded Capsule features interactive tab switching between Timer and Stopwatch, and users frequently switch between them.
   - Because `toggleStopwatchRunning()` only checks `this.state.clock.isActive` without verifying `this.state.clock.type === 'stopwatch'`, it delegates to `pauseStopwatch()`, which rejects the call if `type !== 'stopwatch'`.
   - This causes an inescapable no-op loop when switching between clock tools.
   - To fix this, `toggleStopwatchRunning()` must check `if (this.state.clock.isActive && this.state.clock.type === 'stopwatch' && !this.state.clock.isPaused)`, and if `this.state.clock.type !== 'stopwatch'`, it should transition mode and start the stopwatch. Symmetrically for `toggleTimerRunning()`.

3. **[From Observation O3]**
   - If an unexpected negative duration is passed to `startTimer(-10)`, Dynamic Island displays invalid negative glyphs `"-1:-10"`.
   - Input sanitization `const validSeconds = Math.max(0, durationSeconds)` resolves this edge case cleanly.

---

## 3. Caveats

- **Web Audio Interaction Policy:** As observed in `sound.ts`, the Web Audio API requires user interaction before audio starts playback. The fallback canvas sine-wave animation functions correctly when no audio context is active.
- **Test Suite Status:** The 216 tests in `npm test -- --run` pass because `adversarial_m1.test.ts` was structured to empirically assert the presence of these exact defect states. These tests should be updated to assert the corrected behavior once fixed.

---

## 4. Conclusion & Actionable Fixes

**Verdict: REQUEST_CHANGES**

Worker M1 must apply the following specific fixes to `src/services/liveActivity.ts`:

### Required Fix 1: Align PiP Bezel Bounds with Specifications
In `src/services/liveActivity.ts`:
- Update default state (lines 115 and 288):
  ```typescript
  // Change from:
  bezelBounds: { minX: 12, maxX: 260, minY: 60, maxY: 680 },
  // To:
  bezelBounds: { minX: 8, maxX: 220, minY: 60, maxY: 680 },
  ```
- Ensure `updatePiPPosition` clamps using `minX: 8, maxX: 220`.

### Required Fix 2: Resolve Clock Cross-Toggle Deadlock
In `src/services/liveActivity.ts`:
- Update `toggleTimerRunning()` (line 472):
  ```typescript
  public toggleTimerRunning() {
    if (!this.state.clock.isActive || this.state.clock.type !== 'timer') {
      this.startTimer(300);
      return;
    }
    if (this.state.clock.isPaused) {
      this.resumeTimer();
    } else {
      this.pauseTimer();
    }
  }
  ```
- Update `toggleStopwatchRunning()` (line 535):
  ```typescript
  public toggleStopwatchRunning() {
    if (this.state.clock.isActive && this.state.clock.type === 'stopwatch' && !this.state.clock.isPaused) {
      this.pauseStopwatch();
    } else {
      this.startStopwatch();
    }
  }
  ```

### Required Fix 3: Sanitize Timer Duration
In `src/services/liveActivity.ts`:
- Update `startTimer()` (line 437):
  ```typescript
  public startTimer(durationSeconds: number) {
    const safeDuration = Math.max(0, durationSeconds);
    const totalMs = safeDuration * 1000;
    ...
  ```

---

## 5. Verification Method

Once Worker M1 has applied the fixes:

1. **Verify Coordinate Clamping:**
   ```powershell
   npx vitest run src/__tests__/adversarial_m1.test.ts
   ```
   Assert that `updatePiPPosition(350, 300)` returns `x: 220` and `updatePiPPosition(-50, 300)` returns `x: 8`.

2. **Verify Cross-Toggle Behavior:**
   Start a timer with `startTimer(60)`. Invoke `toggleStopwatchRunning()`. Verify that the stopwatch starts cleanly (`type === 'stopwatch'`, `isRunning === true`).

3. **Verify Typecheck and Production Build:**
   ```powershell
   npx tsc --noEmit
   npm run build
   npm test -- --run
   ```

4. **Invalidation Conditions:**
   - Any PiP coordinate allowing `x > 220` (resulting in viewport overflow beyond 372px).
   - Calling `toggleStopwatchRunning()` while a timer is active resulting in an inactive or no-op clock.
   - Any TypeScript diagnostic error.
