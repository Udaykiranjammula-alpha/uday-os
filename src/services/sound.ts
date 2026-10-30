// Audio & Sound Engine for UDAY OS using Web Audio API

class SoundService {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private isAmbientPlaying = false;
  private ambientInterval: number | null = null;
  private currentTrackIndex = 0;
  public enabled = true;

  public tracks = [
    { id: 'lofi', title: 'Lo-Fi Systems Stream', artist: 'Uday OS Ambient', bpm: '78 BPM' },
    { id: 'cyber', title: 'Cyberpunk Algorithmic Rush', artist: 'Uday OS Electronic', bpm: '124 BPM' },
    { id: 'focus', title: 'Deep Focus Pythonic Space', artist: 'Uday OS Minimal', bpm: '60 BPM' },
  ];

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public getCurrentTrack() {
    return this.tracks[this.currentTrackIndex] || this.tracks[0];
  }

  public setTrack(index: number) {
    this.currentTrackIndex = Math.max(0, Math.min(this.tracks.length - 1, index));
    if (this.isAmbientPlaying) {
      this.stopAmbientMusic();
      this.startAmbientMusic();
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
    } catch {}
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
    } catch {}
  }

  // Camera action click
  public playActionClickSound() {
    this.playTapSound();
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
      osc2.frequency.setValueAtTime(650, now + 0.03);
      osc2.frequency.exponentialRampToValueAtTime(250, now + 0.06);
      gain2.gain.setValueAtTime(0.14, now + 0.03);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.03);
      osc2.stop(now + 0.06);
    } catch {}
  }

  // Mechanical Side-Lock Power Click
  public playLockSound() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.05);

      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }

  // Apple MagSafe Snap & Charging Sound
  public playMagSafeSound() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Magnetic snap transient
      const snapOsc = this.ctx.createOscillator();
      const snapGain = this.ctx.createGain();
      snapOsc.type = 'triangle';
      snapOsc.frequency.setValueAtTime(480, now);
      snapOsc.frequency.exponentialRampToValueAtTime(120, now + 0.04);
      snapGain.gain.setValueAtTime(0.3, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      snapOsc.connect(snapGain);
      snapGain.connect(this.ctx.destination);
      snapOsc.start(now);
      snapOsc.stop(now + 0.04);

      // Sweet Apple MagSafe Two-Tone chime (C6 -> G6)
      const chime1 = this.ctx.createOscillator();
      const chimeGain1 = this.ctx.createGain();
      chime1.type = 'sine';
      chime1.frequency.setValueAtTime(1046.5, now + 0.08); // C6
      chimeGain1.gain.setValueAtTime(0.18, now + 0.08);
      chimeGain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      chime1.connect(chimeGain1);
      chimeGain1.connect(this.ctx.destination);
      chime1.start(now + 0.08);
      chime1.stop(now + 0.45);

      const chime2 = this.ctx.createOscillator();
      const chimeGain2 = this.ctx.createGain();
      chime2.type = 'sine';
      chime2.frequency.setValueAtTime(1567.98, now + 0.22); // G6
      chimeGain2.gain.setValueAtTime(0.22, now + 0.22);
      chimeGain2.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
      chime2.connect(chimeGain2);
      chimeGain2.connect(this.ctx.destination);
      chime2.start(now + 0.22);
      chime2.stop(now + 0.85);
    } catch {}
  }

  // Authentic Apple Pay Transaction & NFC Ding
  public playApplePayChime() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Haptic tick
      const tickOsc = this.ctx.createOscillator();
      const tickGain = this.ctx.createGain();
      tickOsc.type = 'triangle';
      tickOsc.frequency.setValueAtTime(520, now);
      tickOsc.frequency.exponentialRampToValueAtTime(160, now + 0.03);
      tickGain.gain.setValueAtTime(0.25, now);
      tickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      tickOsc.connect(tickGain);
      tickGain.connect(this.ctx.destination);
      tickOsc.start(now);
      tickOsc.stop(now + 0.03);

      // Rising harmonic bell (E6 -> A6)
      const tone1 = this.ctx.createOscillator();
      const toneGain1 = this.ctx.createGain();
      tone1.type = 'sine';
      tone1.frequency.setValueAtTime(1318.5, now + 0.05); // E6
      toneGain1.gain.setValueAtTime(0.2, now + 0.05);
      toneGain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      tone1.connect(toneGain1);
      toneGain1.connect(this.ctx.destination);
      tone1.start(now + 0.05);
      tone1.stop(now + 0.45);

      const tone2 = this.ctx.createOscillator();
      const toneGain2 = this.ctx.createGain();
      tone2.type = 'sine';
      tone2.frequency.setValueAtTime(1760.0, now + 0.16); // A6
      toneGain2.gain.setValueAtTime(0.26, now + 0.16);
      toneGain2.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      tone2.connect(toneGain2);
      toneGain2.connect(this.ctx.destination);
      tone2.start(now + 0.16);
      tone2.stop(now + 0.8);
    } catch {}
  }

  // Incoming Recruiter Phone Call Ringtone (Classic iOS Marimba motif)
  public playCallChime() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [659.25, 783.99, 987.77, 1318.51]; // E5, G5, B5, E6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        gain.gain.setValueAtTime(0.15, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.35);
      });
    } catch {}
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

      // Web Audio Analyser Node for Real Frequency Visualizer
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;

      this.ambientGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      // Chords based on selected track
      const chordSets = [
        // Track 0: Lo-Fi Systems Stream (Cmaj7 -> Am7 -> Fmaj7 -> G7)
        [
          [261.63, 329.63, 392.0, 493.88],
          [220.0, 261.63, 329.63, 392.0],
          [174.61, 220.0, 261.63, 329.63],
          [196.0, 246.94, 293.66, 392.0],
        ],
        // Track 1: Cyberpunk Synthwave (Dm -> Bb -> F -> C)
        [
          [293.66, 349.23, 440.0, 587.33],
          [233.08, 293.66, 349.23, 466.16],
          [174.61, 220.0, 261.63, 349.23],
          [261.63, 329.63, 392.0, 523.25],
        ],
        // Track 2: Deep Focus Pythonic Space (E minor pentatonic meditative)
        [
          [164.81, 196.0, 246.94, 329.63],
          [146.83, 196.0, 220.0, 293.66],
          [130.81, 164.81, 196.0, 261.63],
          [146.83, 174.61, 220.0, 293.66],
        ],
      ];

      const chords = chordSets[this.currentTrackIndex] || chordSets[0];
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

          osc.type = this.currentTrackIndex === 1 ? 'sawtooth' : 'sine';
          osc.frequency.setValueAtTime(freq, now);

          // Soft attack and slow release for ambient warmth
          noteGain.gain.setValueAtTime(0.001, now);
          noteGain.gain.linearRampToValueAtTime(0.05, now + 0.6);
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
      } catch {}
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
      } catch {}
    }
  }
}

export const sound = new SoundService();
