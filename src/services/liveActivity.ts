import { useSyncExternalStore } from 'react';
import { sound } from './sound';

export interface AudioLiveActivity {
  isPlaying: boolean;
  trackTitle: string;
  artist: string;
  albumArt?: string;
  waveformFrequencies?: number[];
  progress: number; // 0 - 100 percentage
  currentTime: number; // seconds
  elapsedSeconds: number; // seconds
  duration: number; // seconds
  durationSeconds: number; // seconds
  volume: number; // 0.0 - 1.0
  isMuted: boolean;
  category: string;
  airPlayRoute: 'AirPods Pro' | 'iPhone Speakers' | 'MacBook Pro';
  trackIndex: number;
}

export interface ClockLiveActivity {
  isActive: boolean;
  type: 'stopwatch' | 'timer';
  isPaused: boolean;
  isRunning: boolean;
  remainingMs: number;
  totalDurationMs: number;
  remainingSeconds: number;
  totalDurationSeconds: number;
  stopwatchMs: number;
  formattedTime: string; // e.g. "04:59" or "00:12.34"
  laps: number[];
}

export interface AlgorithmLiveActivity {
  isRunning: boolean;
  algorithmName: string;
  timeComplexity: string;
  runtimeUs?: number;
  passStatus?: 'idle' | 'running' | 'passed' | 'failed';
  stdoutPreview?: string;
  stdoutLines: string[];
  progressPercent?: number;
}

export interface PiPState {
  isOpen: boolean;
  title: string;
  videoSrc?: string;
  isPlaying: boolean;
  position: { x: number; y: number };
  bezelBounds: { minX: number; maxX: number; minY: number; maxY: number };
  isMinimized: boolean;
}

export interface LiveActivityState {
  activeTab: 'music' | 'timer' | 'compiler';
  audio: AudioLiveActivity;
  clock: ClockLiveActivity;
  algorithm: AlgorithmLiveActivity;
  pip: PiPState;
}

export type LiveActivityListener = (state: LiveActivityState) => void;

class LiveActivityService {
  private state: LiveActivityState = {
    activeTab: 'music',
    audio: {
      isPlaying: false,
      trackTitle: 'Lo-Fi Systems Stream',
      artist: 'Uday OS · Ambient Mode',
      albumArt: '/assets/music/lofi.jpg',
      waveformFrequencies: [0, 0, 0, 0],
      progress: 0,
      currentTime: 0,
      elapsedSeconds: 0,
      duration: 220,
      durationSeconds: 220,
      volume: 0.8,
      isMuted: false,
      category: 'Lofi Chill',
      airPlayRoute: 'AirPods Pro',
      trackIndex: 0,
    },
    clock: {
      isActive: false,
      type: 'timer',
      isPaused: false,
      isRunning: false,
      remainingMs: 0,
      totalDurationMs: 0,
      remainingSeconds: 0,
      totalDurationSeconds: 0,
      stopwatchMs: 0,
      formattedTime: '00:00',
      laps: [],
    },
    algorithm: {
      isRunning: false,
      algorithmName: '',
      timeComplexity: '',
      passStatus: 'idle',
      stdoutPreview: '',
      stdoutLines: [],
      progressPercent: 0,
    },
    pip: {
      isOpen: false,
      title: 'UDAY OS · Screencast',
      videoSrc: '',
      isPlaying: false,
      position: { x: 216, y: 76 },
      bezelBounds: { minX: 8, maxX: 220, minY: 60, maxY: 680 },
      isMinimized: false,
    },
  };

  private listeners = new Set<LiveActivityListener>();
  private clockTickerId: number | null = null;
  private audioTickerId: number | null = null;
  private lastClockTimestamp: number = 0;

  constructor() {
    this.syncFromSoundService();
  }

  // --- External Store Subscription Protocol ---
  public subscribe = (listener: LiveActivityListener): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  public getSnapshot = (): LiveActivityState => {
    return this.state;
  };

  public getState = (): LiveActivityState => {
    return this.state;
  };

  private notify() {
    // Clone state reference for useSyncExternalStore referential equality check
    this.state = {
      ...this.state,
      audio: { ...this.state.audio },
      clock: { ...this.state.clock, laps: [...this.state.clock.laps] },
      algorithm: { ...this.state.algorithm, stdoutLines: [...this.state.algorithm.stdoutLines] },
      pip: { ...this.state.pip, position: { ...this.state.pip.position } },
    };
    this.listeners.forEach((listener) => {
      try {
        listener(this.state);
      } catch (err) {
        console.error('Error in LiveActivity listener:', err);
      }
    });
  }

  // --- Direct Getter / Setter Contracts ---
  public getAudio(): AudioLiveActivity {
    return { ...this.state.audio };
  }

  public setAudio(partial: Partial<AudioLiveActivity>) {
    this.state.audio = {
      ...this.state.audio,
      ...partial,
      currentTime: partial.currentTime ?? partial.elapsedSeconds ?? this.state.audio.currentTime,
      elapsedSeconds: partial.elapsedSeconds ?? partial.currentTime ?? this.state.audio.elapsedSeconds,
      duration: partial.duration ?? partial.durationSeconds ?? this.state.audio.duration,
      durationSeconds: partial.durationSeconds ?? partial.duration ?? this.state.audio.durationSeconds,
    };
    if (partial.isPlaying !== undefined) {
      if (partial.isPlaying) {
        this.startAudioTicker();
      } else {
        this.stopAudioTicker();
      }
    }
    this.notify();
  }

  public getClock(): ClockLiveActivity {
    return { ...this.state.clock, laps: [...this.state.clock.laps] };
  }

  public setClock(partial: Partial<ClockLiveActivity>) {
    this.state.clock = {
      ...this.state.clock,
      ...partial,
    };
    if (partial.isActive !== undefined) {
      this.state.clock.isRunning = partial.isActive && !this.state.clock.isPaused;
    }
    this.notify();
  }

  public getAlgorithm(): AlgorithmLiveActivity {
    return { ...this.state.algorithm, stdoutLines: [...this.state.algorithm.stdoutLines] };
  }

  public setAlgorithm(partial: Partial<AlgorithmLiveActivity>) {
    const stdoutLines = partial.stdoutLines
      ? partial.stdoutLines
      : partial.stdoutPreview
      ? [partial.stdoutPreview]
      : this.state.algorithm.stdoutLines;

    this.state.algorithm = {
      ...this.state.algorithm,
      ...partial,
      stdoutLines,
      stdoutPreview: partial.stdoutPreview ?? (stdoutLines.length > 0 ? stdoutLines[stdoutLines.length - 1] : ''),
    };
    this.notify();
  }

  public getPiP(): PiPState {
    return { ...this.state.pip, position: { ...this.state.pip.position } };
  }

  public setPiP(partial: Partial<PiPState>) {
    const updated = { ...this.state.pip, ...partial };
    if (partial.position) {
      const bounds = updated.bezelBounds;
      const rawX = Number.isFinite(partial.position.x) ? partial.position.x : bounds.minX;
      const rawY = Number.isFinite(partial.position.y) ? partial.position.y : bounds.minY;
      updated.position = {
        x: Math.min(Math.max(rawX, bounds.minX), bounds.maxX),
        y: Math.min(Math.max(rawY, bounds.minY), bounds.maxY),
      };
    }
    this.state.pip = updated;
    this.notify();
  }

  public resetAll() {
    this.stopClockTicker();
    this.stopAudioTicker();
    this.state = {
      activeTab: 'music',
      audio: {
        isPlaying: false,
        trackTitle: '',
        artist: '',
        albumArt: undefined,
        waveformFrequencies: [0, 0, 0, 0],
        progress: 0,
        currentTime: 0,
        elapsedSeconds: 0,
        duration: 220,
        durationSeconds: 220,
        volume: 0.8,
        isMuted: false,
        category: 'Lofi Chill',
        airPlayRoute: 'AirPods Pro',
        trackIndex: 0,
      },
      clock: {
        isActive: false,
        type: 'stopwatch',
        isPaused: false,
        isRunning: false,
        remainingMs: 0,
        totalDurationMs: 0,
        remainingSeconds: 0,
        totalDurationSeconds: 0,
        stopwatchMs: 0,
        formattedTime: '00:00.00',
        laps: [],
      },
      algorithm: {
        isRunning: false,
        algorithmName: '',
        timeComplexity: '',
        passStatus: 'idle',
        stdoutPreview: '',
        stdoutLines: [],
        progressPercent: 0,
      },
      pip: {
        isOpen: false,
        title: '',
        videoSrc: '',
        isPlaying: false,
        position: { x: 20, y: 120 },
        bezelBounds: { minX: 8, maxX: 220, minY: 60, maxY: 680 },
        isMinimized: false,
      },
    };
    this.notify();
  }

  // --- Active Tab Navigation ---
  public setActiveTab(tab: 'music' | 'timer' | 'compiler') {
    this.state.activeTab = tab;
    this.notify();
  }

  // --- Audio Control Engine ---
  private syncFromSoundService() {
    const track = sound.getCurrentTrack();
    this.state.audio = {
      ...this.state.audio,
      isPlaying: sound.getIsPlaying(),
      trackTitle: track?.title || 'Lo-Fi Systems Stream',
      artist: track?.artist || 'Uday OS · Ambient Mode',
      duration: track?.duration || 220,
      durationSeconds: track?.duration || 220,
      category: track?.category || 'Lofi Chill',
    };
  }

  public toggleAudioPlay(): boolean {
    const nextPlaying = sound.toggleAmbientMusic((p) => {
      this.state.audio.isPlaying = p;
      if (p) this.startAudioTicker();
      else this.stopAudioTicker();
      this.notify();
    });
    this.state.audio.isPlaying = nextPlaying;
    if (nextPlaying) {
      this.startAudioTicker();
    } else {
      this.stopAudioTicker();
    }
    this.notify();
    return nextPlaying;
  }

  public togglePlay(): boolean {
    return this.toggleAudioPlay();
  }

  public setTrack(index: number) {
    sound.setTrack(index);
    const track = sound.getCurrentTrack();
    this.state.audio = {
      ...this.state.audio,
      trackIndex: index,
      trackTitle: track.title,
      artist: track.artist,
      duration: track.duration,
      durationSeconds: track.duration,
      category: track.category,
      currentTime: 0,
      elapsedSeconds: 0,
      progress: 0,
    };
    this.notify();
  }

  public nextTrack() {
    const nextIndex = (this.state.audio.trackIndex + 1) % sound.tracks.length;
    this.setTrack(nextIndex);
  }

  public prevTrack() {
    const prevIndex = (this.state.audio.trackIndex - 1 + sound.tracks.length) % sound.tracks.length;
    this.setTrack(prevIndex);
  }

  public setVolume(vol: number) {
    const clamped = Math.max(0, Math.min(1, vol));
    this.state.audio.volume = clamped;
    this.state.audio.isMuted = clamped === 0;
    sound.setVolume(clamped);
    this.notify();
  }

  public toggleMute() {
    if (this.state.audio.isMuted) {
      this.state.audio.isMuted = false;
      sound.setVolume(this.state.audio.volume || 0.8);
    } else {
      this.state.audio.isMuted = true;
      sound.setVolume(0);
    }
    this.notify();
  }

  public toggleAirPlay(): string {
    const routes: Array<'AirPods Pro' | 'iPhone Speakers' | 'MacBook Pro'> = [
      'AirPods Pro',
      'iPhone Speakers',
      'MacBook Pro',
    ];
    const currentIndex = routes.indexOf(this.state.audio.airPlayRoute);
    const nextRoute = routes[(currentIndex + 1) % routes.length];
    this.state.audio.airPlayRoute = nextRoute;
    this.notify();
    return nextRoute;
  }

  public seekProgress(percent: number) {
    const clamped = Math.max(0, Math.min(100, percent));
    const newSeconds = Math.round((clamped / 100) * this.state.audio.duration);
    this.state.audio.progress = clamped;
    this.state.audio.currentTime = newSeconds;
    this.state.audio.elapsedSeconds = newSeconds;
    this.notify();
  }

  public updateAudioProgress(progress: number, currentTime: number) {
    this.state.audio.progress = progress;
    this.state.audio.currentTime = currentTime;
    this.state.audio.elapsedSeconds = currentTime;
    this.notify();
  }

  private startAudioTicker() {
    if (this.audioTickerId !== null) return;
    this.audioTickerId = setInterval(() => {
      if (!this.state.audio.isPlaying) {
        this.stopAudioTicker();
        return;
      }
      const dur = this.state.audio.duration || 220;
      const nextTime = (this.state.audio.currentTime + 1) % dur;
      const progress = Math.min(100, (nextTime / dur) * 100);
      this.state.audio.currentTime = nextTime;
      this.state.audio.elapsedSeconds = nextTime;
      this.state.audio.progress = progress;
      this.notify();
    }, 1000) as unknown as number;
  }

  private stopAudioTicker() {
    if (this.audioTickerId !== null) {
      clearInterval(this.audioTickerId);
      this.audioTickerId = null;
    }
  }

  // --- Clock & Timer Precision Engine (50ms Interval) ---
  public startTimer(durationSeconds: number) {
    const safeDuration = Math.max(0, durationSeconds);
    const totalMs = safeDuration * 1000;
    this.state.clock = {
      isActive: true,
      type: 'timer',
      isPaused: false,
      isRunning: true,
      totalDurationMs: totalMs,
      remainingMs: totalMs,
      totalDurationSeconds: safeDuration,
      remainingSeconds: safeDuration,
      stopwatchMs: 0,
      formattedTime: this.formatMinutesSeconds(totalMs),
      laps: [],
    };
    this.startClockTicker();
    this.notify();
  }

  public pauseTimer() {
    if (!this.state.clock.isActive || this.state.clock.type !== 'timer') return;
    this.state.clock.isPaused = true;
    this.state.clock.isRunning = false;
    this.stopClockTicker();
    this.notify();
  }

  public resumeTimer() {
    if (!this.state.clock.isActive || this.state.clock.type !== 'timer') return;
    this.state.clock.isPaused = false;
    this.state.clock.isRunning = true;
    this.startClockTicker();
    this.notify();
  }

  public toggleTimerRunning() {
    if (!this.state.clock.isActive || this.state.clock.type !== 'timer') {
      this.startTimer(300); // 5 min default
      return;
    }
    if (this.state.clock.isPaused) {
      this.resumeTimer();
    } else {
      this.pauseTimer();
    }
  }

  public resetTimer() {
    this.stopClockTicker();
    this.state.clock.isActive = false;
    this.state.clock.isPaused = false;
    this.state.clock.isRunning = false;
    this.state.clock.remainingMs = 0;
    this.state.clock.remainingSeconds = 0;
    this.state.clock.formattedTime = '00:00';
    this.notify();
  }

  public addMinute() {
    if (!this.state.clock.isActive || this.state.clock.type !== 'timer') return;
    this.state.clock.remainingMs += 60000;
    this.state.clock.totalDurationMs += 60000;
    this.state.clock.remainingSeconds = Math.ceil(this.state.clock.remainingMs / 1000);
    this.state.clock.totalDurationSeconds = Math.ceil(this.state.clock.totalDurationMs / 1000);
    this.state.clock.formattedTime = this.formatMinutesSeconds(this.state.clock.remainingMs);
    this.notify();
  }

  public addMinuteToTimer() {
    this.addMinute();
  }

  public startStopwatch() {
    const isStopwatch = this.state.clock.type === 'stopwatch';
    const initialMs = isStopwatch ? this.state.clock.remainingMs : 0;
    const initialLaps = isStopwatch ? (this.state.clock.laps || []) : [];
    this.state.clock = {
      isActive: true,
      type: 'stopwatch',
      isPaused: false,
      isRunning: true,
      remainingMs: initialMs,
      totalDurationMs: 0,
      remainingSeconds: 0,
      totalDurationSeconds: 0,
      stopwatchMs: initialMs,
      formattedTime: this.formatStopwatchTime(initialMs),
      laps: initialLaps,
    };
    this.startClockTicker();
    this.notify();
  }

  public pauseStopwatch() {
    if (!this.state.clock.isActive || this.state.clock.type !== 'stopwatch') return;
    this.state.clock.isPaused = true;
    this.state.clock.isRunning = false;
    this.stopClockTicker();
    this.notify();
  }

  public resumeStopwatch() {
    if (!this.state.clock.isActive || this.state.clock.type !== 'stopwatch') return;
    this.state.clock.isPaused = false;
    this.state.clock.isRunning = true;
    this.startClockTicker();
    this.notify();
  }

  public toggleStopwatchRunning() {
    if (!this.state.clock.isActive || this.state.clock.type !== 'stopwatch') {
      this.startStopwatch();
      return;
    }
    if (this.state.clock.isPaused) {
      this.resumeStopwatch();
    } else {
      this.pauseStopwatch();
    }
  }

  public resetStopwatch() {
    this.stopClockTicker();
    this.state.clock.isActive = false;
    this.state.clock.isPaused = false;
    this.state.clock.isRunning = false;
    this.state.clock.remainingMs = 0;
    this.state.clock.stopwatchMs = 0;
    this.state.clock.formattedTime = '00:00.00';
    this.state.clock.laps = [];
    this.notify();
  }

  public recordLap(): number {
    const currentMs = this.state.clock.remainingMs;
    this.state.clock.laps = [currentMs, ...this.state.clock.laps];
    this.notify();
    return currentMs;
  }

  private startClockTicker() {
    this.stopClockTicker();
    this.lastClockTimestamp = Date.now();
    this.clockTickerId = setInterval(() => {
      const now = Date.now();
      const delta = now - this.lastClockTimestamp;
      this.lastClockTimestamp = now;

      if (this.state.clock.type === 'timer') {
        const remaining = Math.max(0, this.state.clock.remainingMs - delta);
        this.state.clock.remainingMs = remaining;
        this.state.clock.remainingSeconds = Math.ceil(remaining / 1000);
        this.state.clock.formattedTime = this.formatMinutesSeconds(remaining);

        if (remaining <= 0) {
          this.stopClockTicker();
          this.state.clock.isActive = false;
          this.state.clock.isRunning = false;
          sound.playTimerAlert();
        }
      } else if (this.state.clock.type === 'stopwatch') {
        const elapsed = this.state.clock.remainingMs + delta;
        this.state.clock.remainingMs = elapsed;
        this.state.clock.stopwatchMs = elapsed;
        this.state.clock.formattedTime = this.formatStopwatchTime(elapsed);
      }
      this.notify();
    }, 50) as unknown as number; // 50ms tick interval
  }

  private stopClockTicker() {
    if (this.clockTickerId !== null) {
      clearInterval(this.clockTickerId);
      this.clockTickerId = null;
    }
  }

  public formatMinutesSeconds(ms: number): string {
    const safeMs = Math.max(0, ms);
    const totalSecs = Math.ceil(safeMs / 1000);
    const m = Math.floor(totalSecs / 60).toString().padStart(2, '0');
    const s = Math.floor(totalSecs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  public formatStopwatchTime(ms: number): string {
    const safeMs = Math.max(0, ms);
    const m = Math.floor(safeMs / 60000).toString().padStart(2, '0');
    const s = Math.floor((safeMs % 60000) / 1000).toString().padStart(2, '0');
    const cs = Math.floor((safeMs % 1000) / 10).toString().padStart(2, '0');
    return `${m}:${s}.${cs}`;
  }

  // --- Algorithm & Compiler Telemetry ---
  public startAlgorithm(name: string, complexity: string = 'O(N)') {
    this.state.algorithm = {
      isRunning: true,
      algorithmName: name,
      timeComplexity: complexity,
      passStatus: 'running',
      stdoutPreview: `Compiling ${name}...`,
      stdoutLines: [`[A18 Pro JIT] Initializing sandbox for ${name}...`],
      progressPercent: 20,
    };
    this.notify();
  }

  public completeAlgorithm(runtimeUs: number, passed: boolean, stdout?: string[] | string) {
    const lines = Array.isArray(stdout)
      ? stdout
      : typeof stdout === 'string'
      ? [stdout]
      : [`Executed in ${runtimeUs}μs`, passed ? '✓ 5/5 assertions passed' : '✗ Assertion failed'];

    this.state.algorithm.isRunning = false;
    this.state.algorithm.runtimeUs = runtimeUs;
    this.state.algorithm.passStatus = passed ? 'passed' : 'failed';
    this.state.algorithm.stdoutLines = lines;
    this.state.algorithm.stdoutPreview = lines[lines.length - 1];
    this.state.algorithm.progressPercent = 100;
    this.notify();
  }

  public clearAlgorithm() {
    this.state.algorithm = {
      isRunning: false,
      algorithmName: '',
      timeComplexity: '',
      passStatus: 'idle',
      stdoutPreview: '',
      stdoutLines: [],
      progressPercent: 0,
    };
    this.notify();
  }

  // --- Picture-in-Picture Multitasking ---
  public openPiP(config?: { title?: string; videoSrc?: string }) {
    this.state.pip.isOpen = true;
    this.state.pip.isPlaying = true;
    if (config?.title) this.state.pip.title = config.title;
    if (config?.videoSrc) this.state.pip.videoSrc = config.videoSrc;
    this.notify();
  }

  public closePiP() {
    this.state.pip.isOpen = false;
    this.state.pip.isPlaying = false;
    this.notify();
  }

  public setPiPPlaying(playing: boolean) {
    this.state.pip.isPlaying = playing;
    this.notify();
  }

  public togglePiPPlay() {
    this.state.pip.isPlaying = !this.state.pip.isPlaying;
    this.notify();
  }

  public updatePiPPosition(x: number, y: number) {
    const bounds = this.state.pip.bezelBounds;
    const rawX = Number.isFinite(x) ? x : bounds.minX;
    const rawY = Number.isFinite(y) ? y : bounds.minY;
    const clampedX = Math.min(Math.max(rawX, bounds.minX), bounds.maxX);
    const clampedY = Math.min(Math.max(rawY, bounds.minY), bounds.maxY);
    this.state.pip.position = { x: clampedX, y: clampedY };
    this.notify();
  }

  public togglePiPMinimize() {
    this.state.pip.isMinimized = !this.state.pip.isMinimized;
    this.notify();
  }
}

export const liveActivity = new LiveActivityService();

export function useLiveActivity(): LiveActivityState {
  return useSyncExternalStore(
    liveActivity.subscribe,
    liveActivity.getSnapshot,
    liveActivity.getSnapshot
  );
}
