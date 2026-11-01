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
    { id: 'lofi', title: 'Lo-Fi Systems Stream', artist: 'Uday OS Ambient', bpm: '78 BPM', duration: 220, category: 'Lofi Chill' },
    { id: 'cyber', title: 'Cyberpunk Algorithmic Rush', artist: 'Uday OS Electronic', bpm: '124 BPM', duration: 195, category: 'Synthwave' },
    { id: 'focus', title: 'Deep Focus Pythonic Space', artist: 'Uday OS Minimal', bpm: '60 BPM', duration: 240, category: 'Deep Work' },
    { id: 'neural', title: 'Neural Architecture Ambient', artist: 'Uday OS Flow', bpm: '86 BPM', duration: 215, category: 'Flow State' },
    { id: 'night', title: 'Silicon Valley Midnight Walk', artist: 'Uday OS Chillhop', bpm: '72 BPM', duration: 205, category: 'Midnight Code' },
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

  // Authentic iOS iMessage Sent Sound (Ascending Whoosh / Swoosh)
  public playMessageSentSound() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Ascending swoosh tone
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(1480, now + 0.14);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);

      // Subtle bubble air puff at top
      const popOsc = this.ctx.createOscillator();
      const popGain = this.ctx.createGain();
      popOsc.type = 'triangle';
      popOsc.frequency.setValueAtTime(1200, now + 0.08);
      popOsc.frequency.exponentialRampToValueAtTime(600, now + 0.14);
      popGain.gain.setValueAtTime(0.12, now + 0.08);
      popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      popOsc.connect(popGain);
      popGain.connect(this.ctx.destination);
      popOsc.start(now + 0.08);
      popOsc.stop(now + 0.14);
    } catch {}
  }

  // Authentic iOS iMessage Received Sound ("Note" / Sweet Bell Chime)
  public playMessageReceivedSound() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Classic iOS "Note" bell tone (C6 -> G6 harmonic)
      const tone1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      tone1.type = 'sine';
      tone1.frequency.setValueAtTime(1046.5, now); // C6
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      tone1.connect(gain1);
      gain1.connect(this.ctx.destination);
      tone1.start(now);
      tone1.stop(now + 0.35);

      const tone2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      tone2.type = 'sine';
      tone2.frequency.setValueAtTime(1567.98, now + 0.09); // G6
      gain2.gain.setValueAtTime(0.24, now + 0.09);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      tone2.connect(gain2);
      gain2.connect(this.ctx.destination);
      tone2.start(now + 0.09);
      tone2.stop(now + 0.55);
    } catch {}
  }

  // iOS Tapback reaction pop sound
  public playTapbackSound() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(950, now);
      osc.frequency.exponentialRampToValueAtTime(1600, now + 0.04);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
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

  // Satellite S-Band Chirp & Lock-on Telemetry
  public playSatelliteBeaconSound() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.exponentialRampToValueAtTime(1975.53, now + 0.12); // B6
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch {}
  }

  // Apple Watch Find My Ping Chime
  public playWatchPingSound() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [0, 0.18, 0.36].forEach((delay) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2093, now + delay); // C7
        gain.gain.setValueAtTime(0.25, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.14);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + 0.15);
      });
    } catch {}
  }

  // Authentic iOS Timer Chime Alert (Crisp high radar bell alerts)
  public playTimerAlert() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [0, 0.2, 0.4, 0.6].forEach((delay) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1760, now + delay); // A6
        osc.frequency.exponentialRampToValueAtTime(880, now + delay + 0.18);
        gain.gain.setValueAtTime(0.26, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + 0.2);
      });
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

  // Soft call termination tone
  public playCallEndSound() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [493.88, 369.99]; // B4 -> F#4 descending
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.14);
        gain.gain.setValueAtTime(0.18, now + idx * 0.14);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.14 + 0.28);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.14);
        osc.stop(now + idx * 0.14 + 0.28);
      });
    } catch {}
  }

  // Thumbs-up firework sparkling reaction sound
  public playFireworkSound() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Rising spark
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.18);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);

      // Shimmering burst
      [0.18, 0.22, 0.26, 0.3].forEach((delay, i) => {
        if (!this.ctx) return;
        const spark = this.ctx.createOscillator();
        const sparkGain = this.ctx.createGain();
        spark.type = 'triangle';
        spark.frequency.setValueAtTime(1200 + i * 250, now + delay);
        sparkGain.gain.setValueAtTime(0.1, now + delay);
        sparkGain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.12);
        spark.connect(sparkGain);
        sparkGain.connect(this.ctx.destination);
        spark.start(now + delay);
        spark.stop(now + delay + 0.12);
      });
    } catch {}
  }

  // Celebratory confetti pop sound
  public playConfettiPopSound() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Pop transient
      const popOsc = this.ctx.createOscillator();
      const popGain = this.ctx.createGain();
      popOsc.type = 'triangle';
      popOsc.frequency.setValueAtTime(220, now);
      popOsc.frequency.exponentialRampToValueAtTime(880, now + 0.04);
      popGain.gain.setValueAtTime(0.25, now);
      popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      popOsc.connect(popGain);
      popGain.connect(this.ctx.destination);
      popOsc.start(now);
      popOsc.stop(now + 0.06);

      // Shimmering chime (Major chord flourish)
      [659.25, 830.61, 987.77, 1318.51].forEach((freq, idx) => {
        if (!this.ctx) return;
        const chime = this.ctx.createOscillator();
        const chimeGain = this.ctx.createGain();
        chime.type = 'sine';
        chime.frequency.setValueAtTime(freq, now + 0.06 + idx * 0.04);
        chimeGain.gain.setValueAtTime(0.12, now + 0.06 + idx * 0.04);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06 + idx * 0.04 + 0.4);
        chime.connect(chimeGain);
        chimeGain.connect(this.ctx.destination);
        chime.start(now + 0.06 + idx * 0.04);
        chime.stop(now + 0.06 + idx * 0.04 + 0.4);
      });
    } catch {}
  }

  // Warm Heart Reaction Bell
  public playHeartReactionSound() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [880, 1108.73, 1318.51, 1661.22].forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);
        gain.gain.setValueAtTime(0.12, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.35);
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

  private filterNode: BiquadFilterNode | null = null;
  private pannerNode: StereoPannerNode | null = null;
  public ancMode: 'anc' | 'off' | 'transparency' = 'off';

  public setNoiseCancellationMode(mode: 'anc' | 'off' | 'transparency') {
    this.ancMode = mode;
    this.initCtx();
    if (!this.ctx || !this.filterNode) return;
    const now = this.ctx.currentTime;
    try {
      if (mode === 'anc') {
        this.filterNode.type = 'lowpass';
        this.filterNode.frequency.setTargetAtTime(900, now, 0.1);
      } else if (mode === 'transparency') {
        this.filterNode.type = 'highshelf';
        this.filterNode.frequency.setTargetAtTime(2800, now, 0.1);
        this.filterNode.gain.setTargetAtTime(3.5, now, 0.1);
      } else {
        this.filterNode.type = 'allpass';
      }
    } catch {}
  }

  public setSpatialHeadPan(panRatio: number) {
    this.initCtx();
    if (!this.ctx || !this.pannerNode) return;
    try {
      const clamped = Math.max(-1, Math.min(1, panRatio));
      this.pannerNode.pan.setTargetAtTime(clamped, this.ctx.currentTime, 0.05);
    } catch {}
  }

  public startAmbientMusic() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      this.isAmbientPlaying = true;

      // Master ambient gain
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

      // Filter node for ANC & Transparency
      this.filterNode = this.ctx.createBiquadFilter();
      this.setNoiseCancellationMode(this.ancMode);

      // Stereo Panner node for Head-Tracking Spatial Audio
      if (typeof this.ctx.createStereoPanner === 'function') {
        this.pannerNode = this.ctx.createStereoPanner();
      }

      // Web Audio Analyser Node for Real Frequency Visualizer
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;

      if (this.pannerNode) {
        this.ambientGain.connect(this.filterNode);
        this.filterNode.connect(this.pannerNode);
        this.pannerNode.connect(this.analyser);
      } else {
        this.ambientGain.connect(this.filterNode);
        this.filterNode.connect(this.analyser);
      }
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
        // Track 3: Neural Architecture Ambient (Abmaj7 -> Ebmaj7 -> Fm9 -> Dbmaj7)
        [
          [207.65, 261.63, 311.13, 392.0],
          [155.56, 196.0, 233.08, 311.13],
          [174.61, 220.0, 261.63, 349.23],
          [138.59, 174.61, 207.65, 261.63],
        ],
        // Track 4: Silicon Valley Midnight Walk (Bbm9 -> Gbmaj7 -> Ebm7 -> F7#9)
        [
          [233.08, 277.18, 349.23, 415.3],
          [185.0, 233.08, 277.18, 369.99],
          [155.56, 185.0, 233.08, 277.18],
          [174.61, 220.0, 261.63, 329.63],
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

          osc.type = this.currentTrackIndex === 1 ? 'sawtooth' : this.currentTrackIndex === 3 ? 'triangle' : 'sine';
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
