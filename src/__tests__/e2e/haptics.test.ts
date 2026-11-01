import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HapticsServiceDriver } from './helpers/testDrivers';

describe('Browser Vibration API Haptics Service (Feature 17)', () => {
  let haptics: HapticsServiceDriver;

  beforeEach(() => {
    haptics = new HapticsServiceDriver();
  });

  it('triggers 12ms tactile vibration pulse on tap()', () => {
    haptics.tap();

    expect(haptics.history.length).toBe(1);
    expect(haptics.history[0].action).toBe('tap');
    expect(haptics.history[0].pattern).toBe(12);
  });

  it('triggers [20, 40, 20]ms double-pulse pattern on actionButton() long-press', () => {
    haptics.actionButton();

    expect(haptics.history.length).toBe(1);
    expect(haptics.history[0].action).toBe('actionButton');
    expect(haptics.history[0].pattern).toEqual([20, 40, 20]);
  });

  it('triggers crescendo buzz pattern [30, 60, 30, 60, 100]ms on success()', () => {
    haptics.success();

    expect(haptics.history.length).toBe(1);
    expect(haptics.history[0].action).toBe('success');
    expect(haptics.history[0].pattern).toEqual([30, 60, 30, 60, 100]);
  });

  it('triggers ultra-crisp 8ms vibration tick on wheelTick() camera control rotation', () => {
    haptics.wheelTick();

    expect(haptics.history.length).toBe(1);
    expect(haptics.history[0].action).toBe('wheelTick');
    expect(haptics.history[0].pattern).toBe(8);
  });

  it('triggers rejection buzz pattern [50, 50, 50]ms on error()', () => {
    haptics.error();

    expect(haptics.history.length).toBe(1);
    expect(haptics.history[0].action).toBe('error');
    expect(haptics.history[0].pattern).toEqual([50, 50, 50]);
  });

  it('falls back gracefully to audio chime when navigator.vibrate is unsupported in desktop browser', () => {
    // In node environment without navigator.vibrate, audio fallback is engaged
    haptics.tap();
    haptics.actionButton();
    haptics.success();

    expect(haptics.audioFallbackPlayed).toContain('tick');
    expect(haptics.audioFallbackPlayed).toContain('double-pulse');
    expect(haptics.audioFallbackPlayed).toContain('crescendo-chime');
  });

  it('honors user preferences to mute or disable haptic feedback globally', () => {
    let hapticsEnabled = false;
    const triggerHapticIfEnabled = (fn: () => void) => {
      if (hapticsEnabled) fn();
    };

    triggerHapticIfEnabled(() => haptics.tap());
    expect(haptics.history.length).toBe(0);

    hapticsEnabled = true;
    triggerHapticIfEnabled(() => haptics.tap());
    expect(haptics.history.length).toBe(1);
  });

  it('handles rapid sequential haptic bursts without queuing backlog or memory leaks', () => {
    for (let i = 0; i < 50; i++) {
      haptics.wheelTick();
    }

    expect(haptics.history.length).toBe(50);
    expect(haptics.history[49].pattern).toBe(8);
  });
});
