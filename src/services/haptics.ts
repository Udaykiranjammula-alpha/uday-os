import { sound } from './sound';

export type HapticAction = 'tap' | 'actionButton' | 'success' | 'wheelTick' | 'error';

export interface HapticEvent {
  action: HapticAction;
  pattern: number | number[];
  timestamp: number;
}

export class HapticsService {
  private enabled: boolean = true;
  private history: HapticEvent[] = [];

  constructor() {
    try {
      const stored = localStorage.getItem('uday_ios_haptics_enabled');
      if (stored !== null) {
        this.enabled = stored === 'true';
      }
    } catch {
      // localStorage unavailable in SSR / strict sandboxes
    }
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    try {
      localStorage.setItem('uday_ios_haptics_enabled', String(enabled));
    } catch {
      // Ignored
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public getHistory(): HapticEvent[] {
    return [...this.history];
  }

  private trigger(action: HapticAction, pattern: number | number[], fallbackFn?: () => void): boolean {
    if (!this.enabled) return false;

    this.history.push({ action, pattern, timestamp: Date.now() });
    if (this.history.length > 100) this.history.shift();

    let vibrateSuccess = false;
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      try {
        vibrateSuccess = navigator.vibrate(pattern as VibratePattern);
      } catch {
        vibrateSuccess = false;
      }
    }

    if (!vibrateSuccess && fallbackFn) {
      try {
        fallbackFn();
      } catch {
        // Fallback suppressed safely
      }
    }

    return true;
  }

  // 12ms tactile vibration pulse on tap
  public tap(): boolean {
    return this.trigger('tap', 12, () => sound.playTapSound());
  }

  // [20, 40, 20]ms double-pulse pattern on Action Button long-press
  public actionButton(): boolean {
    return this.trigger('actionButton', [20, 40, 20], () => sound.playActionClickSound());
  }

  // [30, 60, 30, 60, 100]ms crescendo buzz on Apple Pay / success
  public success(): boolean {
    return this.trigger('success', [30, 60, 30, 60, 100], () => sound.playApplePayChime());
  }

  // 8ms vibration tick on camera control rotation / volume slider
  public wheelTick(): boolean {
    return this.trigger('wheelTick', 8, () => sound.playTapSound());
  }

  // [50, 50, 50]ms rejection buzz on error / invalid input
  public error(): boolean {
    return this.trigger('error', [50, 50, 50], () => sound.playRejectSound());
  }
}

export const haptics = new HapticsService();
