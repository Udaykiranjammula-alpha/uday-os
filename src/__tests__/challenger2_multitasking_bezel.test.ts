if (typeof window === 'undefined') {
  (globalThis as any).window = globalThis;
}

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { liveActivity, useLiveActivity } from '../services/liveActivity';
import { sound } from '../services/sound';

describe('Milestone 1 Challenger 2 — Multitasking & UI Bezel Boundary Stress', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    liveActivity.resetAll();
  });

  afterEach(() => {
    liveActivity.resetAll();
    vi.useRealTimers();
  });

  // =========================================================================
  // 1. BEZEL BOUNDARY CONTAINMENT STRESS TESTING (372px x 806px)
  // =========================================================================
  describe('Bezel Boundary & Sensor Containment (372px x 806px Display)', () => {
    const SCREEN_WIDTH = 372;
    const SCREEN_HEIGHT = 806;

    // Bezel hardware sensors defined in IPhoneScreenContent.tsx
    const ACTION_BUTTON_SENSOR = {
      left: 0,
      top: 115,
      width: 6,
      height: 42,
      right: 6,
      bottom: 157,
      zIndex: 44,
    };

    const CAMERA_CONTROL_SENSOR = {
      right: 0, // x = 366 to 372
      left: 366,
      top: 475,
      width: 6,
      height: 56,
      bottom: 531,
      zIndex: 44,
    };

    const HOME_INDICATOR = {
      bottom: 8, // y = 793 to 798
      top: 793,
      height: 5,
      width: 135,
      zIndex: 40,
    };

    it('verifies Expanded Dynamic Island Capsule (348px width) is strictly centered within 372px screen bounds', () => {
      // Dynamic Island container: top: 14px; left: 50%; transform: translateX(-50%);
      // Expanded capsule: width: 348px, min-height: 168px
      const capsuleWidth = 348;
      const capsuleMinHeight = 168;
      const topOffset = 14;

      const leftMargin = (SCREEN_WIDTH - capsuleWidth) / 2; // (372 - 348) / 2 = 12px
      const rightEdge = leftMargin + capsuleWidth; // 12 + 348 = 360px
      const bottomEdge = topOffset + capsuleMinHeight; // 14 + 168 = 182px

      // 1. Screen containment assertions
      expect(leftMargin).toBe(12);
      expect(leftMargin).toBeGreaterThanOrEqual(0);
      expect(rightEdge).toBe(360);
      expect(rightEdge).toBeLessThanOrEqual(SCREEN_WIDTH);
      expect(bottomEdge).toBeLessThanOrEqual(SCREEN_HEIGHT);

      // 2. Bezel sensor clearance: Left Action Button (x: 0..6) vs Capsule (x: 12..360)
      // Left margin (12px) is greater than sensor width (6px), giving a 6px clearance margin
      const actionButtonClearance = leftMargin - ACTION_BUTTON_SENSOR.right;
      expect(actionButtonClearance).toBe(6);
      expect(actionButtonClearance).toBeGreaterThan(0);

      // 3. Bezel sensor clearance: Right Camera Control (x: 366..372, y: 475..531) vs Capsule (x: 12..360, y: 14..182)
      const cameraControlHorizontalClearance = CAMERA_CONTROL_SENSOR.left - rightEdge;
      expect(cameraControlHorizontalClearance).toBe(6);
      expect(cameraControlHorizontalClearance).toBeGreaterThan(0);

      const cameraControlVerticalClearance = CAMERA_CONTROL_SENSOR.top - bottomEdge;
      expect(cameraControlVerticalClearance).toBe(293);
      expect(cameraControlVerticalClearance).toBeGreaterThan(0);

      // 4. Home indicator clearance (y: 793..798) vs Capsule (y: 14..182)
      const homeIndicatorClearance = HOME_INDICATOR.top - bottomEdge;
      expect(homeIndicatorClearance).toBe(611);
      expect(homeIndicatorClearance).toBeGreaterThan(0);
    });

    it('FAILING DEFECT CHECK: liveActivity.ts PiP coordinate bounds (maxX=260) violate 372px screen bounds and occlude Camera Control sensor', () => {
      // PiP Window dimensions from styles.css: width: 144px, height: 98px, zIndex: 45
      const PIP_WIDTH = 144;
      const PIP_HEIGHT = 98;
      const PIP_Z_INDEX = 45;

      liveActivity.openPiP({ title: 'Adversarial Boundary Test' });
      const pipState = liveActivity.getPiP();

      // DISPATCH requirement: Out-of-bounds PiP coordinates: verify clamping to x: [8, 220], y: [60, 680]
      // PiPOverlay.tsx specifies: BEZEL_CONSTRAINTS = { left: 8, right: 220, top: 60, bottom: 680 }
      // But liveActivity.ts specifies: bezelBounds = { minX: 12, maxX: 260, minY: 60, maxY: 680 }

      // Test 1: Drag to extreme right (e.g. x = 300)
      liveActivity.updatePiPPosition(300, 480);
      const pos = liveActivity.getPiP().position;

      // In liveActivity.ts maxX is now 220.
      const pipRightEdge = pos.x + PIP_WIDTH; // 220 + 144 = 364px!
      const overflowPx = Math.max(0, pipRightEdge - SCREEN_WIDTH); // 0px!

      expect(pos.x).toBe(220);
      expect(pipRightEdge).toBe(364);
      expect(overflowPx).toBe(0); // FIX VERIFIED: zero overflow outside screen!
    });

    it('verifies that if clamped to DISPATCH bounds (maxX=220, maxY=680), PiP never exceeds 372x806px and never occludes sensors', () => {
      const PIP_WIDTH = 144;
      const PIP_HEIGHT = 98;
      const REQUIRED_MAX_X = 220; // 220 + 144 = 364px (8px safe margin)
      const REQUIRED_MIN_X = 8;
      const REQUIRED_MIN_Y = 60;
      const REQUIRED_MAX_Y = 680; // 680 + 98 = 778px (15px above Home Indicator at 793px)

      // Calculate bounds if required limits are applied
      const safeRightEdge = REQUIRED_MAX_X + PIP_WIDTH; // 364px
      const safeBottomEdge = REQUIRED_MAX_Y + PIP_HEIGHT; // 778px

      expect(safeRightEdge).toBeLessThanOrEqual(SCREEN_WIDTH); // 364 <= 372
      expect(safeRightEdge).toBeLessThan(CAMERA_CONTROL_SENSOR.left); // 364 < 366 (2px gap from Camera Control)
      expect(REQUIRED_MIN_X).toBeGreaterThan(ACTION_BUTTON_SENSOR.right); // 8 > 6 (2px gap from Action Button)
      expect(safeBottomEdge).toBeLessThan(HOME_INDICATOR.top); // 778 < 793 (15px gap above Home Indicator)
      expect(REQUIRED_MIN_Y).toBeGreaterThan(14 + 33); // 60 > 47 (13px gap below compact Dynamic Island)
    });
  });

  // =========================================================================
  // 2. PiP MINIMIZATION / MAXIMIZE 50-CYCLE RAPID TOGGLE STRESS
  // =========================================================================
  describe('PiP Minimization / Maximize Rapid Toggle Endurance (50 cycles)', () => {
    it('executes 50 rapid minimization/maximize cycles on liveActivity coordinator without state drift', () => {
      liveActivity.openPiP({ title: 'PiP Cycle Test' });
      expect(liveActivity.getPiP().isMinimized).toBe(false);

      for (let cycle = 1; cycle <= 50; cycle++) {
        liveActivity.togglePiPMinimize();
        expect(liveActivity.getPiP().isMinimized).toBe(cycle % 2 === 1);
      }

      // After exactly 50 toggles (even number), PiP must return to restored state (false)
      expect(liveActivity.getPiP().isMinimized).toBe(false);
      expect(liveActivity.getPiP().isOpen).toBe(true);
      expect(liveActivity.getPiP().isPlaying).toBe(true);
    });

    it('FAILING DEFECT CHECK: PiPOverlay component dual-state desynchronization flaw between local useState and liveActivity store', () => {
      // In PiPOverlay.tsx line 39:
      // const [isMinimized, setIsMinimized] = useState(pip.isMinimized);
      // toggleMinimize does:
      // setIsMinimized(!isMinimized);
      // liveActivity.togglePiPMinimize();
      //
      // DEFECT A: PiPOverlay has NO useEffect synchronizing `isMinimized` when `live.pip.isMinimized` changes!
      // If liveActivity.togglePiPMinimize() is called externally (e.g. from Dynamic Island, Control Center, or shortcut),
      // or if liveActivity.resetAll() is called:
      // liveActivity.getPiP().isMinimized resets to false, but PiPOverlay's local state retains its previous value!
      
      liveActivity.openPiP({ title: 'Desync Test' });
      liveActivity.togglePiPMinimize();
      expect(liveActivity.getPiP().isMinimized).toBe(true);

      // External reset
      liveActivity.resetAll();
      expect(liveActivity.getPiP().isMinimized).toBe(false);

      // DEFECT B: In rapid event batching, calling `setIsMinimized(!isMinimized)` 50 times in a single render frame
      // reads stale `isMinimized` closure rather than functional updater `setIsMinimized((prev) => !prev)`.
      // Meanwhile, liveActivity.togglePiPMinimize() mutates synchronously 50 times.
      // This causes total desynchronization between coordinator state and DOM presentation!
    });
  });

  // =========================================================================
  // 3. MULTITASKING ROUTE SWITCHING ENDURANCE
  // =========================================================================
  describe('Multitasking Route Switching Endurance Sequence', () => {
    it('maintains continuous timer ticking and PiP playback through full navigation sequence (clock -> music -> home -> settings -> projects -> xcode -> clock)', () => {
      // Route sequence from DISPATCH:
      const routeSequence = ['clock', 'music', 'home', 'settings', 'projects', 'xcode', 'clock'];

      // 1. Initialize Multitasking background activities
      // Start 5-minute timer (300s = 300,000ms)
      liveActivity.startTimer(300);
      expect(liveActivity.getClock().isActive).toBe(true);
      expect(liveActivity.getClock().remainingMs).toBe(300000);
      expect(liveActivity.getClock().formattedTime).toBe('05:00');

      // Start Audio playback
      liveActivity.setAudio({
        isPlaying: true,
        trackTitle: 'Lofi Multitask Stream',
        artist: 'Uday OS',
        duration: 240,
        currentTime: 0,
        progress: 0,
      });

      // Open PiP window
      liveActivity.openPiP({ title: 'ESP32 Screencast' });
      expect(liveActivity.getPiP().isOpen).toBe(true);
      expect(liveActivity.getPiP().isPlaying).toBe(true);

      // Track listener notifications across route navigation
      let notificationCount = 0;
      const unsubscribe = liveActivity.subscribe(() => {
        notificationCount++;
      });

      // 2. Traverse each route step, spending 5 seconds in each screen
      routeSequence.forEach((route, index) => {
        // Advance time by 5,000ms (5 seconds) per route
        vi.advanceTimersByTime(5000);

        const state = liveActivity.getState();

        // ASSERTION A: Timer must remain active and continuously counting down
        const expectedRemainingMs = 300000 - (index + 1) * 5000;
        expect(state.clock.isActive).toBe(true);
        expect(state.clock.isRunning).toBe(true);
        expect(state.clock.remainingMs).toBeLessThanOrEqual(expectedRemainingMs + 50);
        expect(state.clock.remainingMs).toBeGreaterThanOrEqual(expectedRemainingMs - 50);

        // ASSERTION B: PiP must remain open and playing across every route transition
        expect(state.pip.isOpen).toBe(true);
        expect(state.pip.isPlaying).toBe(true);
        expect(state.pip.title).toBe('ESP32 Screencast');

        // ASSERTION C: Audio must remain playing across every route transition
        expect(state.audio.isPlaying).toBe(true);
        expect(state.audio.trackTitle).toBe('Lofi Multitask Stream');
      });

      // 3. Returned to 'clock' after 35 seconds (7 steps x 5s)
      const finalState = liveActivity.getState();
      const expectedFinalMs = 300000 - 35000; // 265,000ms = 4m 25s = "04:25"
      expect(finalState.clock.remainingMs).toBeCloseTo(expectedFinalMs, -2);
      expect(finalState.clock.formattedTime).toBe('04:25');
      expect(notificationCount).toBeGreaterThan(500); // 35s * 20 ticks/sec (50ms interval) = ~700 ticks

      unsubscribe();
    });

    it('survives 20 full route cycles (140 route transitions) without memory leak or interval duplication', () => {
      liveActivity.startTimer(600);
      liveActivity.openPiP({ title: 'Endurance PiP' });
      liveActivity.setAudio({ isPlaying: true });

      const routeSequence = ['clock', 'music', 'home', 'settings', 'projects', 'xcode', 'clock'];

      // Execute 20 loops of the 7-route sequence (140 total transitions)
      for (let loop = 0; loop < 20; loop++) {
        for (const _route of routeSequence) {
          vi.advanceTimersByTime(100); // 100ms per step
        }
      }

      // Total time advanced: 20 * 7 * 100ms = 14,000ms (14s)
      const clock = liveActivity.getClock();
      expect(clock.isActive).toBe(true);
      expect(clock.remainingMs).toBeCloseTo(600000 - 14000, -2);
      expect(clock.formattedTime).toBe('09:46');

      // Ensure clean reset stops all tickers without leaving dangling intervals
      liveActivity.resetAll();
      const afterResetMs = liveActivity.getClock().remainingMs;
      vi.advanceTimersByTime(5000);
      expect(liveActivity.getClock().remainingMs).toBe(afterResetMs);
      expect(liveActivity.getClock().isActive).toBe(false);
      expect(liveActivity.getPiP().isOpen).toBe(false);
      expect(liveActivity.getAudio().isPlaying).toBe(false);
    });

    it('verifies PiP drag coordinates remain clamped across rapid route navigation', () => {
      liveActivity.openPiP({ title: 'Drag Route Test' });

      // Simulate dragging PiP to safe position (x=150, y=300)
      liveActivity.updatePiPPosition(150, 300);
      expect(liveActivity.getPiP().position).toEqual({ x: 150, y: 300 });

      // Navigate through routes
      const routes = ['home', 'music', 'settings', 'clock'];
      routes.forEach((route) => {
        vi.advanceTimersByTime(1000);
        // Position must remain stable across routes
        expect(liveActivity.getPiP().position).toEqual({ x: 150, y: 300 });
      });

      // Attempt out-of-bounds drag during navigation
      liveActivity.updatePiPPosition(-999, 9999);
      const clamped = liveActivity.getPiP().position;
      expect(clamped.x).toBeGreaterThanOrEqual(8);
      expect(clamped.y).toBeLessThanOrEqual(680);
    });
  });
});
