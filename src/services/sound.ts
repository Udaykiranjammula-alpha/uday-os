// Audio & Sound Engine for UDAY OS using Web Audio API

class SoundService {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private isAmbientPlaying = false;
  private ambientInterval: number | null = null;
  public enabled = true;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
  }

  // Camera shutter snap
  public playShutterSound() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.08);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Audio not supported or blocked
    }
  }

  // Soft iOS tap click
  public playTapSound() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.03);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.03);
    } catch {
      // Audio not supported or blocked
    }
  }

  // Authentic Apple Face ID Unlock Latch Click
  public playUnlockSound() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Click 1 (subtle latch release)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(1200, now);
      osc1.frequency.exponentialRampToValueAtTime(600, now + 0.02);
      gain1.gain.setValueAtTime(0.18, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.02);

      // Click 2 (warm lower confirmation click 30ms later)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(800, now + 0.035);
      osc2.frequency.exponentialRampToValueAtTime(350, now + 0.06);
      gain2.gain.setValueAtTime(0.22, now + 0.035);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.035);
      osc2.stop(now + 0.06);
    } catch {
      // Audio blocked
    }
  }

  // Mechanical Lock Sound
  public playLockSound() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.04);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Audio blocked
    }
  }

  // Action Button Haptic Sound
  public playActionClickSound() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.05);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Audio blocked
    }
  }

  // Ambient Lo-Fi Synthesizer (generates peaceful melodic chords)
  public toggleAmbientMusic(onStateChange?: (playing: boolean) => void): boolean {
    this.initCtx();
    if (this.isAmbientPlaying) {
      this.stopAmbientMusic();
      onStateChange?.(false);
      return false;
    } else {
      this.startAmbientMusic();
      onStateChange?.(true);
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isAmbientPlaying;
  }

  public startAmbientMusic() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      this.isAmbientPlaying = true;

      // Master ambient gain
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      this.ambientGain.connect(this.ctx.destination);

      // Lo-fi chord progressions: Cmaj7 -> Am7 -> Fmaj7 -> G7
      const chords = [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [220.00, 261.63, 329.63, 392.00], // Am7
        [174.61, 220.00, 261.63, 329.63], // Fmaj7
        [196.00, 246.94, 293.66, 392.00], // G7
      ];

      let chordIdx = 0;

      const playChord = () => {
        if (!this.isAmbientPlaying || !this.ctx || !this.ambientGain) return;
        const now = this.ctx.currentTime;
        const currentChord = chords[chordIdx % chords.length];
        chordIdx++;

        currentChord.forEach((freq) => {
          if (!this.ctx || !this.ambientGain) return;
          const osc = this.ctx.createOscillator();
          const noteGain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          // Soft attack and slow release for ambient warmth
          noteGain.gain.setValueAtTime(0.001, now);
          noteGain.gain.linearRampToValueAtTime(0.06, now + 0.6);
          noteGain.gain.exponentialRampToValueAtTime(0.001, now + 3.2);

          osc.connect(noteGain);
          noteGain.connect(this.ambientGain);

          osc.start(now);
          osc.stop(now + 3.3);
        });
      };

      playChord();
      this.ambientInterval = window.setInterval(playChord, 3400);
    } catch {
      this.isAmbientPlaying = false;
    }
  }

  public setVolume(ratio: number) {
    if (this.ambientGain && this.ctx) {
      try {
        const val = Math.max(0, Math.min(1, ratio)) * 0.2;
        this.ambientGain.gain.setValueAtTime(val, this.ctx.currentTime);
      } catch {
        // Ignored
      }
    }
  }

  public stopAmbientMusic() {
    this.isAmbientPlaying = false;
    if (this.ambientInterval !== null) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
    if (this.ambientGain && this.ctx) {
      try {
        this.ambientGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
      } catch {
        // Ignored
      }
    }
  }
}

export const sound = new SoundService();
