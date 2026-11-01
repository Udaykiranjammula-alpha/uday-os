if (typeof window === 'undefined') {
  (globalThis as any).window = globalThis;
}

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { liveActivity } from '../services/liveActivity';

describe('LiveActivityCoordinator Service', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    liveActivity.resetAll();
  });

  afterEach(() => {
    liveActivity.resetAll();
    vi.useRealTimers();
  });

  describe('Timer & Stopwatch Precision Engine', () => {
    it('starts timer countdown and decrements remainingMs on 50ms ticks', () => {
      liveActivity.startTimer(10); // 10 seconds = 10,000ms
      const initial = liveActivity.getClock();
      expect(initial.isActive).toBe(true);
      expect(initial.type).toBe('timer');
      expect(initial.remainingMs).toBe(10000);
      expect(initial.formattedTime).toBe('00:10');

      // Advance by 1000ms
      vi.advanceTimersByTime(1000);
      const after1s = liveActivity.getClock();
      expect(after1s.remainingMs).toBeLessThanOrEqual(9050);
      expect(after1s.formattedTime).toBe('00:09');

      // Advance to completion
      vi.advanceTimersByTime(9500);
      const finished = liveActivity.getClock();
      expect(finished.isActive).toBe(false);
      expect(finished.remainingMs).toBe(0);
    });

    it('pauses and resumes timer without losing remaining time', () => {
      liveActivity.startTimer(60); // 60s
      vi.advanceTimersByTime(10000); // 10s passed -> 50s left
      const beforePause = liveActivity.getClock().remainingMs;

      liveActivity.pauseTimer();
      expect(liveActivity.getClock().isPaused).toBe(true);

      // Advance while paused -> remainingMs should not change
      vi.advanceTimersByTime(5000);
      expect(liveActivity.getClock().remainingMs).toBe(beforePause);

      liveActivity.resumeTimer();
      expect(liveActivity.getClock().isPaused).toBe(false);

      vi.advanceTimersByTime(5000);
      expect(liveActivity.getClock().remainingMs).toBeLessThan(beforePause);
    });

    it('adds +1 minute (60,000ms) to active timer', () => {
      liveActivity.startTimer(30);
      const initialMs = liveActivity.getClock().remainingMs;
      liveActivity.addMinute();
      expect(liveActivity.getClock().remainingMs).toBe(initialMs + 60000);
      expect(liveActivity.getClock().totalDurationMs).toBe(30000 + 60000);
      expect(liveActivity.getClock().formattedTime).toBe('01:30');
    });

    it('starts stopwatch and records centisecond timestamps and laps', () => {
      liveActivity.startStopwatch();
      expect(liveActivity.getClock().isActive).toBe(true);
      expect(liveActivity.getClock().type).toBe('stopwatch');

      vi.advanceTimersByTime(1250);
      const current = liveActivity.getClock();
      expect(current.remainingMs).toBeGreaterThanOrEqual(1200);
      expect(current.formattedTime).toMatch(/^00:01\.\d{2}$/);

      const lapTime = liveActivity.recordLap();
      expect(liveActivity.getClock().laps.length).toBe(1);
      expect(liveActivity.getClock().laps[0]).toBe(lapTime);

      liveActivity.resetStopwatch();
      expect(liveActivity.getClock().isActive).toBe(false);
      expect(liveActivity.getClock().remainingMs).toBe(0);
      expect(liveActivity.getClock().laps).toEqual([]);
    });
  });

  describe('Audio Live Activity', () => {
    it('updates audio playback state, track info, and progress', () => {
      liveActivity.setAudio({
        isPlaying: true,
        trackTitle: 'Midnight Walk',
        artist: 'Uday OS',
        progress: 25,
        currentTime: 50,
      });

      const audio = liveActivity.getAudio();
      expect(audio.isPlaying).toBe(true);
      expect(audio.trackTitle).toBe('Midnight Walk');
      expect(audio.artist).toBe('Uday OS');
      expect(audio.progress).toBe(25);
      expect(audio.currentTime).toBe(50);
    });

    it('cycles through AirPlay output routes', () => {
      const initialRoute = liveActivity.getAudio().airPlayRoute;
      const nextRoute = liveActivity.toggleAirPlay();
      expect(nextRoute).not.toBe(initialRoute);
      expect(['AirPods Pro', 'iPhone Speakers', 'MacBook Pro']).toContain(nextRoute);
    });

    it('adjusts volume and handles mute toggle', () => {
      liveActivity.setVolume(0.5);
      expect(liveActivity.getAudio().volume).toBe(0.5);
      expect(liveActivity.getAudio().isMuted).toBe(false);

      liveActivity.toggleMute();
      expect(liveActivity.getAudio().isMuted).toBe(true);

      liveActivity.toggleMute();
      expect(liveActivity.getAudio().isMuted).toBe(false);
      expect(liveActivity.getAudio().volume).toBe(0.5);
    });
  });

  describe('Algorithm & Compiler Telemetry', () => {
    it('manages algorithm lifecycle from execution to completion', () => {
      liveActivity.startAlgorithm('Two Sum', 'O(N)');
      let algo = liveActivity.getAlgorithm();
      expect(algo.isRunning).toBe(true);
      expect(algo.algorithmName).toBe('Two Sum');
      expect(algo.timeComplexity).toBe('O(N)');
      expect(algo.passStatus).toBe('running');

      liveActivity.completeAlgorithm(42, true, ['Assertion 1 passed', 'Assertion 2 passed']);
      algo = liveActivity.getAlgorithm();
      expect(algo.isRunning).toBe(false);
      expect(algo.runtimeUs).toBe(42);
      expect(algo.passStatus).toBe('passed');
      expect(algo.stdoutLines.length).toBe(2);

      liveActivity.clearAlgorithm();
      algo = liveActivity.getAlgorithm();
      expect(algo.isRunning).toBe(false);
      expect(algo.algorithmName).toBe('');
      expect(algo.passStatus).toBe('idle');
    });
  });

  describe('Picture-in-Picture Multitasking State', () => {
    it('opens, clamps coordinates to bezel bounds, and closes PiP', () => {
      liveActivity.openPiP({ title: 'Lab Demo' });
      let pip = liveActivity.getPiP();
      expect(pip.isOpen).toBe(true);
      expect(pip.isPlaying).toBe(true);
      expect(pip.title).toBe('Lab Demo');

      // Attempt out-of-bounds drag (negative X and extreme Y)
      liveActivity.updatePiPPosition(-50, 9999);
      pip = liveActivity.getPiP();
      expect(pip.position.x).toBeGreaterThanOrEqual(pip.bezelBounds.minX);
      expect(pip.position.y).toBeLessThanOrEqual(pip.bezelBounds.maxY);

      liveActivity.togglePiPMinimize();
      expect(liveActivity.getPiP().isMinimized).toBe(true);

      liveActivity.closePiP();
      expect(liveActivity.getPiP().isOpen).toBe(false);
      expect(liveActivity.getPiP().isPlaying).toBe(false);
    });
  });

  describe('Subscription and Notification Lifecycle', () => {
    it('notifies subscribers on state updates and unsubscribes cleanly', () => {
      let callCount = 0;
      const unsubscribe = liveActivity.subscribe(() => {
        callCount++;
      });

      liveActivity.setAudio({ isPlaying: true });
      liveActivity.startTimer(10);
      liveActivity.startAlgorithm('LRU Cache');

      expect(callCount).toBeGreaterThanOrEqual(3);

      const countBeforeUnsub = callCount;
      unsubscribe();
      liveActivity.resetAll();
      expect(callCount).toBe(countBeforeUnsub);
    });
  });
});
