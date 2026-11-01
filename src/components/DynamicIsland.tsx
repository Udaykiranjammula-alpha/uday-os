import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Battery,
  Music,
  Play,
  Pause,
  Wifi,
  Bell,
  X,
  Disc3,
  Flashlight,
  Rotate3d,
  ExternalLink,
  Timer,
  Cpu,
  Hourglass,
  Plus,
  Square,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Airplay,
  CheckCircle2,
  Check,
} from 'lucide-react';
import { sound } from '../services/sound';
import { liveActivity, useLiveActivity } from '../services/liveActivity';

interface DynamicIslandProps {
  notification?: string | null;
  onClearNotification?: () => void;
  flashlightOn?: boolean;
  onToggleFlashlight?: () => void;
  onFlipToBack?: () => void;
  onNavigate?: (route: string) => void;
  onOpenLiveActivities?: () => void;
}

export function DynamicIsland({
  notification,
  onClearNotification,
  flashlightOn = false,
  onToggleFlashlight,
  onFlipToBack,
  onNavigate,
  onOpenLiveActivities,
}: DynamicIslandProps) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'music' | 'timer' | 'compiler'>('music');
  const live = useLiveActivity();

  const compactCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const expandedCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Auto-switch tab if timer or compiler triggers execution
  useEffect(() => {
    if (live.algorithm.isRunning) {
      setActiveTab('compiler');
    } else if (live.clock.isActive && !live.audio.isPlaying) {
      setActiveTab('timer');
    }
  }, [live.algorithm.isRunning, live.clock.isActive, live.audio.isPlaying]);

  // 4-Bar Canvas Audio Waveform for Compact Mode
  useEffect(() => {
    if (expanded || !live.audio.isPlaying) return;
    const canvas = compactCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const BAR_COUNT = 4;
    const BAR_WIDTH = 2.8;
    const BAR_GAP = 2.0;
    const MAX_HEIGHT = 13;
    const MIN_HEIGHT = 2.5;

    const smoothed = [MIN_HEIGHT, MIN_HEIGHT, MIN_HEIGHT, MIN_HEIGHT];
    const sampleIndices = [2, 5, 8, 13];

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const analyser = sound.getAnalyser();

      if (analyser) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        for (let i = 0; i < BAR_COUNT; i++) {
          const bin = sampleIndices[i];
          const val = dataArray[bin] || 0;
          const norm = val / 255;
          const target = Math.max(MIN_HEIGHT, norm * MAX_HEIGHT);
          smoothed[i] = smoothed[i] * 0.7 + target * 0.3;

          const x = i * (BAR_WIDTH + BAR_GAP) + 1;
          const h = Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, smoothed[i]));
          const y = canvas.height - h;

          const grad = ctx.createLinearGradient(0, y, 0, canvas.height);
          grad.addColorStop(0, '#38bdf8');
          grad.addColorStop(1, '#818cf8');

          ctx.fillStyle = grad;
          ctx.beginPath();
          if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(x, y, BAR_WIDTH, h, 1.2);
          } else {
            ctx.rect(x, y, BAR_WIDTH, h);
          }
          ctx.fill();
        }
      } else {
        const t = Date.now() * 0.005;
        for (let i = 0; i < BAR_COUNT; i++) {
          const wave = Math.sin(t + i * 1.1) * 0.5 + 0.5;
          const h = Math.max(MIN_HEIGHT, wave * MAX_HEIGHT * 0.85);
          const x = i * (BAR_WIDTH + BAR_GAP) + 1;
          const y = canvas.height - h;
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(x, y, BAR_WIDTH, h, 1.2);
          } else {
            ctx.rect(x, y, BAR_WIDTH, h);
          }
          ctx.fill();
        }
      }
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [expanded, live.audio.isPlaying]);

  // 20-Bar Waveform Visualizer for Expanded Audio Tab
  useEffect(() => {
    if (!expanded || activeTab !== 'music') return;
    const canvas = expandedCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const BAR_COUNT = 20;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const analyser = sound.getAnalyser();
      const barWidth = (canvas.width - (BAR_COUNT - 1) * 2) / BAR_COUNT;

      if (analyser && live.audio.isPlaying) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        for (let i = 0; i < BAR_COUNT; i++) {
          const val = dataArray[i * 2] || 0;
          const barHeight = Math.max(3, (val / 255) * canvas.height * 0.95);
          const x = i * (barWidth + 2);
          const y = canvas.height - barHeight;

          const grad = ctx.createLinearGradient(0, y, 0, canvas.height);
          grad.addColorStop(0, '#f43f5e');
          grad.addColorStop(0.5, '#ec4899');
          grad.addColorStop(1, '#38bdf8');

          ctx.fillStyle = grad;
          ctx.beginPath();
          if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(x, y, barWidth, barHeight, [2, 2, 0, 0]);
          } else {
            ctx.rect(x, y, barWidth, barHeight);
          }
          ctx.fill();
        }
      } else {
        for (let i = 0; i < BAR_COUNT; i++) {
          const x = i * (barWidth + 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
          ctx.beginPath();
          if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(x, canvas.height - 3, barWidth, 3, [1, 1, 0, 0]);
          } else {
            ctx.rect(x, canvas.height - 3, barWidth, 3);
          }
          ctx.fill();
        }
      }
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [expanded, activeTab, live.audio.isPlaying]);

  const formatSeconds = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isDual = live.clock.isActive && live.audio.isPlaying;

  // Determine compact variant class
  let compactClass = 'island-default';
  if (notification) compactClass = 'has-notification';
  else if (isDual) compactClass = 'island-active-dual';
  else if (live.algorithm.isRunning || live.algorithm.passStatus === 'passed') compactClass = 'island-active-algo';
  else if (live.clock.isActive) compactClass = 'island-active-clock';
  else if (live.audio.isPlaying) compactClass = 'island-active-music';
  else if (flashlightOn) compactClass = 'island-active-torch';

  return (
    <div className="dynamic-island-container">
      <motion.div
        layout
        className={`dynamic-island ${expanded ? 'expanded' : ''} ${compactClass}`}
        onClick={() => {
          sound.playTapSound();
          setExpanded(!expanded);
        }}
        role="button"
        tabIndex={0}
        aria-label="Dynamic Island. Click to toggle live activity."
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setExpanded(!expanded);
          }
        }}
        transition={{ type: 'spring', stiffness: 420, damping: 30 }}
      >
        <AnimatePresence mode="wait">
          {notification && !expanded ? (
            <motion.div
              key="notification"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="island-compact-notice"
            >
              <Bell size={12} className="island-bell" />
              <span className="notice-text">{notification}</span>
              {onClearNotification && (
                <button
                  type="button"
                  className="clear-notice-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearNotification();
                  }}
                  aria-label="Dismiss alert"
                >
                  <X size={10} />
                </button>
              )}
            </motion.div>
          ) : expanded ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className="island-expanded-content"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Status Row with Segmented Activity Tabs */}
              <div className="island-header">
                <div className="island-activity-tabs">
                  <button
                    type="button"
                    className={`island-tab-btn ${activeTab === 'music' ? 'active' : ''}`}
                    onClick={() => {
                      sound.playTapSound();
                      setActiveTab('music');
                    }}
                  >
                    <Music size={11} />
                    <span>Audio</span>
                    {live.audio.isPlaying && <span className="tab-pill-dot" />}
                  </button>

                  <button
                    type="button"
                    className={`island-tab-btn ${activeTab === 'timer' ? 'active' : ''}`}
                    onClick={() => {
                      sound.playTapSound();
                      setActiveTab('timer');
                    }}
                  >
                    <Timer size={11} />
                    <span>Timer</span>
                    {live.clock.isActive && (
                      <span className="tab-pill-badge">{live.clock.formattedTime}</span>
                    )}
                  </button>

                  <button
                    type="button"
                    className={`island-tab-btn ${activeTab === 'compiler' ? 'active' : ''}`}
                    onClick={() => {
                      sound.playTapSound();
                      setActiveTab('compiler');
                    }}
                  >
                    <Cpu size={11} />
                    <span>Compiler</span>
                    {live.algorithm.isRunning && <span className="tab-pill-dot cyan" />}
                  </button>
                </div>

                <div className="island-header-right">
                  <span className="battery-badge">
                    <Battery size={12} /> 98%
                  </span>
                  <button
                    type="button"
                    className="collapse-btn"
                    onClick={() => setExpanded(false)}
                    aria-label="Collapse Dynamic Island"
                  >
                    Done
                  </button>
                </div>
              </div>

              {/* Direct Live Activities Hub Pill */}
              {onOpenLiveActivities && (
                <button
                  type="button"
                  className="island-live-activity-hub-btn"
                  onClick={() => {
                    sound.playTapSound();
                    setExpanded(false);
                    onOpenLiveActivities();
                  }}
                  title="Open Live Activities Hub"
                >
                  <span className="island-hub-glow-dot" />
                  <span className="island-hub-text">Live Activities Hub · Flight, Sports, Delivery, SpaceX</span>
                  <ExternalLink size={10} className="island-hub-ext" />
                </button>
              )}

              {/* Torch Banner if flashlight is active */}
              {flashlightOn && (
                <div className="island-torch-banner">
                  <div className="torch-banner-left">
                    <span className="torch-emoji">🔦</span>
                    <div>
                      <strong>Rear Flashlight ON</strong>
                      <small>3D Back Torch Emitting Light</small>
                    </div>
                  </div>
                  <div className="torch-banner-actions">
                    {onFlipToBack && (
                      <button
                        type="button"
                        className="island-mini-action-btn"
                        onClick={() => {
                          sound.playTapSound();
                          onFlipToBack();
                          setExpanded(false);
                        }}
                        title="Flip to 3D back"
                      >
                        <Rotate3d size={12} />
                        <span>View Back</span>
                      </button>
                    )}
                    {onToggleFlashlight && (
                      <button
                        type="button"
                        className="island-mini-action-btn toggle-off"
                        onClick={() => {
                          sound.playTapSound();
                          onToggleFlashlight();
                        }}
                      >
                        Turn Off
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 1: AUDIO CONTROLS */}
              {activeTab === 'music' && (
                <div className="island-audio-card">
                  <div className="island-audio-top">
                    <div className="island-track-cover">
                      <Disc3 size={32} className={live.audio.isPlaying ? 'spinning-vinyl' : ''} />
                    </div>
                    <div className="island-track-info">
                      <strong>{live.audio.trackTitle || 'Lo-Fi Systems Stream'}</strong>
                      <small>{live.audio.artist} · {live.audio.category}</small>
                    </div>
                    <button
                      type="button"
                      className="island-airplay-pill"
                      onClick={() => liveActivity.toggleAirPlay()}
                      title="Toggle AirPlay Output Route"
                    >
                      <Airplay size={11} />
                      <span>{live.audio.airPlayRoute}</span>
                    </button>
                  </div>

                  {/* 20-Bar Waveform Visualizer */}
                  <canvas
                    ref={expandedCanvasRef}
                    width={316}
                    height={26}
                    className="island-waveform-canvas"
                  />

                  {/* Interactive Scrubber */}
                  <div
                    className="island-scrubber-bar"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickPercent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
                      liveActivity.seekProgress(clickPercent);
                    }}
                  >
                    <div className="island-scrubber-fill" style={{ width: `${live.audio.progress}%` }} />
                  </div>
                  <div className="island-time-labels">
                    <span>{formatSeconds(live.audio.elapsedSeconds)}</span>
                    <span>-{formatSeconds(Math.max(0, live.audio.duration - live.audio.elapsedSeconds))}</span>
                  </div>

                  {/* Playback Controls & Volume Dial */}
                  <div className="island-audio-controls-row">
                    <div className="island-playback-buttons">
                      <button
                        type="button"
                        className="island-ctrl-btn"
                        onClick={() => liveActivity.prevTrack()}
                        aria-label="Previous Track"
                      >
                        <SkipBack size={15} />
                      </button>
                      <button
                        type="button"
                        className="island-ctrl-btn island-play-primary"
                        onClick={() => liveActivity.toggleAudioPlay()}
                        aria-label={live.audio.isPlaying ? 'Pause' : 'Play'}
                      >
                        {live.audio.isPlaying ? <Pause size={16} /> : <Play size={16} fill="currentColor" />}
                      </button>
                      <button
                        type="button"
                        className="island-ctrl-btn"
                        onClick={() => liveActivity.nextTrack()}
                        aria-label="Next Track"
                      >
                        <SkipForward size={15} />
                      </button>
                    </div>

                    <div className="island-volume-container">
                      <button
                        type="button"
                        className="island-ctrl-btn"
                        onClick={() => liveActivity.toggleMute()}
                        aria-label="Toggle Mute"
                      >
                        {live.audio.isMuted || live.audio.volume === 0 ? (
                          <VolumeX size={13} />
                        ) : (
                          <Volume2 size={13} />
                        )}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.02"
                        value={live.audio.isMuted ? 0 : live.audio.volume}
                        onChange={(e) => liveActivity.setVolume(Number(e.target.value))}
                        className="island-volume-slider"
                        aria-label="Audio Volume"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: TIMER & STOPWATCH CONTROLS */}
              {activeTab === 'timer' && (
                <div className="island-timer-card">
                  <div className="island-timer-top">
                    {/* Circular SVG Progress Ring */}
                    <div className="island-timer-svg-container">
                      <svg width="64" height="64" viewBox="0 0 64 64">
                        <circle
                          cx="32"
                          cy="32"
                          r="26"
                          fill="none"
                          stroke="rgba(255, 255, 255, 0.12)"
                          strokeWidth="4"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="26"
                          fill="none"
                          stroke={live.clock.type === 'timer' ? '#ff9f0a' : '#30d158'}
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeDasharray={2 * Math.PI * 26}
                          strokeDashoffset={
                            live.clock.type === 'timer'
                              ? 2 * Math.PI * 26 * (1 - (live.clock.remainingMs / (live.clock.totalDurationMs || 1)))
                              : 0
                          }
                          transform="rotate(-90 32 32)"
                          style={{ transition: 'stroke-dashoffset 0.05s linear' }}
                        />
                      </svg>
                      <div className="island-timer-svg-center">
                        <Hourglass size={18} />
                      </div>
                    </div>

                    {/* Big Digital Readout */}
                    <div className="island-timer-readout-col">
                      <div className="island-timer-digits">
                        {live.clock.formattedTime || '05:00'}
                      </div>
                      <div className="island-timer-sublabel">
                        {live.clock.type === 'timer' ? 'Timer' : 'Stopwatch'} ·{' '}
                        {live.clock.isActive && !live.clock.isPaused ? 'Counting Down' : 'Paused / Ready'}
                      </div>
                    </div>
                  </div>

                  {/* Actions: Pause/Resume, +1 Min, Stop */}
                  <div className="island-timer-actions-row">
                    <button
                      type="button"
                      className={`island-timer-btn ${
                        live.clock.isActive && !live.clock.isPaused ? 'pause' : 'resume'
                      }`}
                      onClick={() => {
                        sound.playTapSound();
                        if (live.clock.type === 'timer') {
                          liveActivity.toggleTimerRunning();
                        } else {
                          liveActivity.toggleStopwatchRunning();
                        }
                      }}
                    >
                      {live.clock.isActive && !live.clock.isPaused ? (
                        <>
                          <Pause size={13} />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play size={13} />
                          <span>Resume</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="island-timer-btn add-min"
                      onClick={() => {
                        sound.playTapSound();
                        liveActivity.addMinute();
                      }}
                    >
                      <Plus size={13} />
                      <span>+1 min</span>
                    </button>
                    <button
                      type="button"
                      className="island-timer-btn stop"
                      onClick={() => {
                        sound.playTapSound();
                        if (live.clock.type === 'timer') liveActivity.resetTimer();
                        else liveActivity.resetStopwatch();
                      }}
                    >
                      <Square size={12} fill="currentColor" />
                      <span>Stop</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: COMPILER STDOUT PREVIEW TERMINAL */}
              {activeTab === 'compiler' && (
                <div className="island-compiler-card">
                  <div className="island-compiler-header">
                    <div className="mac-traffic-lights">
                      <span className="mac-dot red" />
                      <span className="mac-dot yellow" />
                      <span className="mac-dot green" />
                    </div>
                    <span className="island-badge">
                      <Cpu size={11} className="text-cyan" /> A18 Pro · JIT Sandbox
                    </span>
                    {live.algorithm.passStatus === 'passed' && (
                      <span className="compiler-pass-pill">
                        <CheckCircle2 size={11} /> {live.algorithm.runtimeUs ? `${live.algorithm.runtimeUs}μs` : 'Passed'}
                      </span>
                    )}
                  </div>

                  <div className="island-terminal-stdout">
                    {live.algorithm.stdoutLines.length > 0 ? (
                      live.algorithm.stdoutLines.slice(-4).map((line, idx) => (
                        <div key={idx} className="terminal-stdout-line">
                          <Check size={10} className="terminal-check" />
                          <span>{line}</span>
                        </div>
                      ))
                    ) : (
                      <div className="terminal-stdout-line empty">
                        <span className="text-zinc">Xcode Cloud ready for algorithm execution...</span>
                      </div>
                    )}
                  </div>

                  <div className="island-compiler-footer">
                    <button
                      type="button"
                      className="island-open-ide-btn"
                      onClick={() => {
                        sound.playTapSound();
                        setExpanded(false);
                        onNavigate?.('xcode');
                      }}
                    >
                      <ExternalLink size={10} />
                      <span>Open Xcode Cloud Playground</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Island Footer */}
              <div className="island-footer">
                <span className="connectivity-pill">
                  <Wifi size={10} /> Fast 5G Connected
                </span>
                {onNavigate && (
                  <button
                    type="button"
                    className="island-app-shortcut-btn"
                    onClick={() => {
                      sound.playTapSound();
                      setExpanded(false);
                      onNavigate(activeTab === 'music' ? 'music' : activeTab === 'timer' ? 'clock' : 'xcode');
                    }}
                  >
                    <ExternalLink size={10} className="mr-1 inline" />
                    Open {activeTab === 'music' ? 'Music' : activeTab === 'timer' ? 'Clock' : 'Xcode'}
                  </button>
                )}
              </div>
            </motion.div>
          ) : isDual ? (
            /* DUAL LIVE ACTIVITY MODE (Clock + Music) */
            <motion.div
              key="compact-dual"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="island-compact-dual-row"
            >
              <div className="island-compact-clock-badge">
                <svg className="island-ring-svg" width="16" height="16" viewBox="0 0 16 16">
                  <circle cx="8" cy="8" r="6.5" fill="none" stroke="rgba(255, 255, 255, 0.18)" strokeWidth="2" />
                  <circle
                    cx="8"
                    cy="8"
                    r="6.5"
                    fill="none"
                    stroke="#ff9f0a"
                    strokeWidth="2"
                    strokeDasharray={2 * Math.PI * 6.5}
                    strokeDashoffset={
                      live.clock.type === 'timer'
                        ? 2 * Math.PI * 6.5 * (1 - (live.clock.remainingMs / (live.clock.totalDurationMs || 1)))
                        : 0
                    }
                    strokeLinecap="round"
                    transform="rotate(-90 8 8)"
                  />
                </svg>
                <span className="island-compact-clock-text text-amber font-mono">
                  {live.clock.formattedTime}
                </span>
              </div>

              <div className="dual-right-audio">
                <canvas ref={compactCanvasRef} width={20} height={14} className="compact-canvas-waveform" />
              </div>
            </motion.div>
          ) : live.algorithm.isRunning || live.algorithm.passStatus === 'passed' ? (
            /* COMPACT A18 PRO CHIP INDICATOR */
            <motion.div
              key="compact-algo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="island-compact-chip-badge"
            >
              <div className="chip-icon-wrapper">
                <Cpu size={13} className="a18-chip-icon text-cyan" />
                <span className="chip-pulse-halo" />
              </div>
              <div className="a18-chip-meta font-mono">
                {live.algorithm.isRunning ? (
                  <span className="a18-telemetry-running">
                    {live.algorithm.algorithmName || 'A18 Pro'}
                    <span className="a18-pulse-dot" />
                  </span>
                ) : (
                  <span className="a18-telemetry-passed">
                    <CheckCircle2 size={11} className="inline mr-1 text-emerald-400" />
                    {live.algorithm.runtimeUs ? `${live.algorithm.runtimeUs}μs` : 'Passed'}
                  </span>
                )}
              </div>
            </motion.div>
          ) : live.clock.isActive ? (
            /* COMPACT CLOCK (Timer or Stopwatch with circular SVG ring) */
            <motion.div
              key="compact-clock"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="island-compact-clock-badge"
            >
              <svg className="island-ring-svg" width="18" height="18" viewBox="0 0 18 18">
                <circle cx="9" cy="9" r="7.5" fill="none" stroke="rgba(255, 255, 255, 0.18)" strokeWidth="2.2" />
                <circle
                  cx="9"
                  cy="9"
                  r="7.5"
                  fill="none"
                  stroke={live.clock.type === 'timer' ? '#ff9f0a' : '#30d158'}
                  strokeWidth="2.2"
                  strokeDasharray={2 * Math.PI * 7.5}
                  strokeDashoffset={
                    live.clock.type === 'timer'
                      ? 2 * Math.PI * 7.5 * (1 - (live.clock.remainingMs / (live.clock.totalDurationMs || 1)))
                      : 0
                  }
                  strokeLinecap="round"
                  transform="rotate(-90 9 9)"
                  style={{ transition: 'stroke-dashoffset 0.05s linear' }}
                />
              </svg>
              <span
                className="island-compact-clock-text font-mono"
                style={{ color: live.clock.type === 'timer' ? '#ff9f0a' : '#30d158' }}
              >
                {live.clock.formattedTime}
              </span>
            </motion.div>
          ) : live.audio.isPlaying ? (
            /* COMPACT MUSIC (Spinning Disc & 4-Bar Canvas Waveform) */
            <motion.div
              key="compact-music"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="island-compact-music"
            >
              <Disc3 size={13} className="compact-spinning-disc spinning-mini-disc text-cyan" />
              <canvas ref={compactCanvasRef} width={20} height={14} className="compact-canvas-waveform" />
            </motion.div>
          ) : flashlightOn ? (
            /* COMPACT TORCH */
            <motion.div
              key="compact-torch"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="island-compact-torch"
            >
              <span className="island-mini-torch-icon">🔦</span>
              <span className="island-torch-dot" />
            </motion.div>
          ) : (
            /* DEFAULT CAMERA SENSOR */
            <motion.div
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="island-default"
            >
              <span className="camera-lens" />
              <span className="sensor-dot" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
