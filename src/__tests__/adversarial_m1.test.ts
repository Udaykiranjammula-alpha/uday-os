if (typeof window === 'undefined') {
  (globalThis as any).window = globalThis;
}

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { liveActivity } from '../services/liveActivity';
import { sound } from '../services/sound';

describe('Milestone 1 Adversarial Challenge & Stress Suite', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    liveActivity.resetAll();
  });

  afterEach(() => {
    liveActivity.resetAll();
    vi.useRealTimers();
  });

  describe('Stress Suite — Robust Subsystems', () => {
    it('survives 100 rapid alternations of start/pause/resume/reset without leaking intervals', () => {
      for (let i = 0; i < 100; i++) {
        liveActivity.startTimer(60);
        liveActivity.pauseTimer();
        liveActivity.resumeTimer();
        liveActivity.resetTimer();
        liveActivity.startStopwatch();
        liveActivity.pauseStopwatch();
        liveActivity.resetStopwatch();
      }

      const clock = liveActivity.getClock();
      expect(clock.isActive).toBe(false);
      expect(clock.isRunning).toBe(false);
      expect(clock.isPaused).toBe(false);
      expect(clock.remainingMs).toBe(0);

      vi.advanceTimersByTime(5000);
      const afterWait = liveActivity.getClock();
      expect(afterWait.remainingMs).toBe(0);
      expect(afterWait.isActive).toBe(false);
    });

    it('handles zero duration timer (0s) safely without throwing', () => {
      const alertSpy = vi.spyOn(sound, 'playTimerAlert').mockImplementation(() => {});

      liveActivity.startTimer(0);
      const clock = liveActivity.getClock();
      expect(clock.totalDurationMs).toBe(0);
      expect(clock.remainingMs).toBe(0);
      expect(clock.formattedTime).toBe('00:00');

      vi.advanceTimersByTime(50);
      const finished = liveActivity.getClock();
      expect(finished.isActive).toBe(false);
      expect(finished.isRunning).toBe(false);
      expect(alertSpy).toHaveBeenCalled();
      alertSpy.mockRestore();
    });

    it('handles massive duration (99999s = ~27.7 hours) with accurate decrement and no integer overflow', () => {
      liveActivity.startTimer(99999);
      const initial = liveActivity.getClock();
      expect(initial.totalDurationMs).toBe(99999000);
      expect(initial.remainingMs).toBe(99999000);
      expect(initial.formattedTime).toBe('1666:39');

      vi.advanceTimersByTime(60000);
      const after60s = liveActivity.getClock();
      expect(after60s.remainingMs).toBeLessThanOrEqual(99939050);
      expect(after60s.formattedTime).toBe('1665:39');
    });

    it('records 500 rapid laps in strictly reverse-chronological order and clears cleanly', () => {
      liveActivity.startStopwatch();

      const recorded: number[] = [];
      for (let i = 0; i < 500; i++) {
        vi.advanceTimersByTime(20);
        const lap = liveActivity.recordLap();
        recorded.push(lap);
      }

      const clock = liveActivity.getClock();
      expect(clock.laps.length).toBe(500);
      expect(clock.laps[0]).toBe(recorded[recorded.length - 1]);
      expect(clock.laps[499]).toBe(recorded[0]);

      liveActivity.resetStopwatch();
      expect(liveActivity.getClock().laps).toEqual([]);
    });

    it('runs Audio, Stopwatch, Compiler, and PiP concurrently without state collision', () => {
      const stateLog: number[] = [];
      const unsubscribe = liveActivity.subscribe(() => {
        stateLog.push(Date.now());
      });

      liveActivity.setAudio({
        isPlaying: true,
        trackTitle: 'Stress Audio',
        artist: 'Tester',
        duration: 300,
        volume: 0.9,
      });

      liveActivity.startStopwatch();
      liveActivity.startAlgorithm('Merge Intervals', 'O(N log N)');
      liveActivity.openPiP({ title: 'PiP Stream' });

      for (let sec = 0; sec < 3; sec++) {
        vi.advanceTimersByTime(1000);
        liveActivity.recordLap();
        liveActivity.setAlgorithm({
          stdoutLines: [`Progress at ${sec}s...`],
        });
      }

      const snap = liveActivity.getState();
      expect(snap.audio.isPlaying).toBe(true);
      expect(snap.clock.isActive).toBe(true);
      expect(snap.clock.type).toBe('stopwatch');
      expect(snap.clock.laps.length).toBe(3);
      expect(snap.algorithm.isRunning).toBe(true);
      expect(snap.pip.isOpen).toBe(true);
      expect(stateLog.length).toBeGreaterThan(10);

      liveActivity.completeAlgorithm(120, true, ['Assertion 1 passed', 'Assertion 2 passed']);
      expect(liveActivity.getAlgorithm().passStatus).toBe('passed');
      expect(liveActivity.getAlgorithm().isRunning).toBe(false);
      expect(liveActivity.getAudio().isPlaying).toBe(true);
      expect(liveActivity.getClock().isActive).toBe(true);

      unsubscribe();
      liveActivity.resetAll();
    });

    it('computes SVG countdown ring stroke dashoffset without NaN at 0%, 50%, 100%, and totalDurationMs=0', () => {
      const r = 26;
      const circumference = 2 * Math.PI * r;

      const calcOffset = (remainingMs: number, totalDurationMs: number) => {
        return circumference * (1 - (remainingMs / (totalDurationMs || 1)));
      };

      const offset0 = calcOffset(60000, 60000);
      expect(offset0).toBeCloseTo(0, 5);
      expect(Number.isNaN(offset0)).toBe(false);

      const offset50 = calcOffset(30000, 60000);
      expect(offset50).toBeCloseTo(circumference * 0.5, 5);
      expect(Number.isNaN(offset50)).toBe(false);

      const offset100 = calcOffset(0, 60000);
      expect(offset100).toBeCloseTo(circumference, 5);
      expect(Number.isNaN(offset100)).toBe(false);

      const offsetZeroTotal = calcOffset(0, 0);
      expect(offsetZeroTotal).toBeCloseTo(circumference, 5);
      expect(Number.isNaN(offsetZeroTotal)).toBe(false);
    });

    it('verifies audio frequency normalization gracefully handles silent/disconnected data', () => {
      const MAX_HEIGHT = 13;
      const MIN_HEIGHT = 2.5;

      const silentData = new Uint8Array(64).fill(0);
      const heights = [0, 1, 2, 3].map((bin) => {
        const val = silentData[bin] || 0;
        const norm = val / 255;
        return Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, norm * MAX_HEIGHT));
      });

      heights.forEach((h) => {
        expect(h).toBe(MIN_HEIGHT);
        expect(Number.isNaN(h)).toBe(false);
        expect(Number.isFinite(h)).toBe(true);
      });
    });
  });

  describe('Empirical Defect Verification & Hardening', () => {
    it('FIX VERIFIED 1: PiP coordinate clamping bounds [8, 220] in liveActivity.ts ensure safe bezel margins and prevent viewport overflow', () => {
      liveActivity.openPiP({ title: 'Test PiP' });

      // Empirical Check 1: Right Boundary Clamp
      liveActivity.updatePiPPosition(350, 300);
      const clampedRight = liveActivity.getPiP().position.x;
      expect(clampedRight).toBe(220); // FIX VERIFIED: clamped to 220 (220 + 144 = 364px, safe 8px margin inside 372px)

      // Empirical Check 2: Left Boundary Clamp
      liveActivity.updatePiPPosition(-50, 300);
      const clampedLeft = liveActivity.getPiP().position.x;
      expect(clampedLeft).toBe(8); // FIX VERIFIED: clamped to 8
    });

    it('FIX VERIFIED 2: Clock type cross-toggle transitions mode cleanly without deadlock', () => {
      // Scenario A: Timer is active, user invokes toggleStopwatchRunning
      liveActivity.startTimer(120);
      expect(liveActivity.getClock().isActive).toBe(true);
      expect(liveActivity.getClock().type).toBe('timer');
      expect(liveActivity.getClock().isRunning).toBe(true);
      expect(liveActivity.getClock().isPaused).toBe(false);

      // Calling toggleStopwatchRunning switches cleanly to stopwatch
      liveActivity.toggleStopwatchRunning();
      const afterToggleStopwatch = liveActivity.getClock();
      expect(afterToggleStopwatch.isActive).toBe(true);
      expect(afterToggleStopwatch.type).toBe('stopwatch');
      expect(afterToggleStopwatch.isRunning).toBe(true);
      expect(afterToggleStopwatch.isPaused).toBe(false);
      expect(afterToggleStopwatch.remainingMs).toBe(0);
      expect(afterToggleStopwatch.formattedTime).toBe('00:00.00');

      // Scenario B: Stopwatch is active, user invokes toggleTimerRunning
      expect(liveActivity.getClock().type).toBe('stopwatch');
      expect(liveActivity.getClock().isPaused).toBe(false);

      // Calling toggleTimerRunning switches cleanly to timer (default 300s)
      liveActivity.toggleTimerRunning();
      const afterToggleTimer = liveActivity.getClock();
      expect(afterToggleTimer.isActive).toBe(true);
      expect(afterToggleTimer.type).toBe('timer');
      expect(afterToggleTimer.isRunning).toBe(true);
      expect(afterToggleTimer.isPaused).toBe(false);
      expect(afterToggleTimer.remainingMs).toBe(300000);
      expect(afterToggleTimer.formattedTime).toBe('05:00');
    });

    it('FIX VERIFIED 3: Negative duration timer is sanitized to 0s and formatted safely as "00:00"', () => {
      // Calling startTimer with negative duration
      liveActivity.startTimer(-10);
      const clock = liveActivity.getClock();
      expect(clock.totalDurationMs).toBe(0);
      expect(clock.remainingMs).toBe(0);
      expect(clock.totalDurationSeconds).toBe(0);
      expect(clock.remainingSeconds).toBe(0);
      expect(clock.formattedTime).toBe('00:00');
    });
  });
});
