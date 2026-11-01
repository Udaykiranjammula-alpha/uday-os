import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Disc3,
  Sparkles,
  ListMusic,
  Share2,
  Repeat,
  Shuffle,
  Headphones,
  Sliders,
  Radio,
} from 'lucide-react';
import { sound } from '../services/sound';
import { liveActivity } from '../services/liveActivity';

interface MusicAppProps {
  onBack: () => void;
  onNavigate?: (route: string) => void;
}

const LYRICS = [
  'Synthesizing systems through the midnight hours...',
  'Data structures aligned, algorithms taking flight.',
  'Turning ideas into impact — KL University to the world.',
  '184 LeetCode milestones, clean scalable architecture.',
  'ESP32 telemetry humming on the dual-core bus.',
  'Full-stack interfaces rendering at sixty frames.',
  'Three.js shaders glowing in high-performance WebGL.',
  'Ready to build the future of software engineering.',
];

export function MusicApp({ onBack }: MusicAppProps) {
  const initialAudio = liveActivity.getAudio();
  const [isPlaying, setIsPlaying] = useState(initialAudio.isPlaying);
  const [trackIndex, setTrackIndex] = useState(initialAudio.trackIndex);
  const [progress, setProgress] = useState(initialAudio.progress); // percentage 0 - 100
  const [elapsedSeconds, setElapsedSeconds] = useState(initialAudio.elapsedSeconds);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [volume, setVolume] = useState(initialAudio.volume);
  const [isMuted, setIsMuted] = useState(initialAudio.isMuted);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [activeLyricIndex, setActiveLyricIndex] = useState(0);
  const [showLyrics, setShowLyrics] = useState(true);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [spatialMode, setSpatialMode] = useState<'off' | 'anc' | 'transparency'>('anc');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Subscribe to liveActivity coordinator
  useEffect(() => {
    const unsubscribe = liveActivity.subscribe((state) => {
      setIsPlaying(state.audio.isPlaying);
      setTrackIndex(state.audio.trackIndex);
      if (!isScrubbing) {
        setProgress(state.audio.progress);
        setElapsedSeconds(state.audio.elapsedSeconds);
      }
      setVolume(state.audio.volume);
      setIsMuted(state.audio.isMuted);
    });
    return unsubscribe;
  }, [isScrubbing]);

  const tracks = sound.tracks;
  const currentTrack = tracks[trackIndex] || tracks[0];
  const trackDuration = currentTrack.duration || 220; // seconds

  const handleTogglePlay = () => {
    sound.playTapSound();
    liveActivity.toggleAudioPlay();
  };

  const handleNextTrack = () => {
    sound.playTapSound();
    if (isShuffle) {
      const next = Math.floor(Math.random() * tracks.length);
      liveActivity.setTrack(next);
    } else {
      liveActivity.nextTrack();
    }
  };

  const handlePrevTrack = () => {
    sound.playTapSound();
    liveActivity.prevTrack();
  };

  // Lyrics animation ticker
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveLyricIndex((prev) => (prev + 1) % LYRICS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Volume change handler
  const handleVolumeChange = (newVol: number) => {
    liveActivity.setVolume(newVol);
  };

  const toggleMute = () => {
    sound.playTapSound();
    liveActivity.toggleMute();
  };

  // Spatial Audio & ANC handler
  const handleSpatialCycle = () => {
    sound.playTapSound();
    const nextMode = spatialMode === 'off' ? 'anc' : spatialMode === 'anc' ? 'transparency' : 'off';
    setSpatialMode(nextMode);
    sound.setNoiseCancellationMode(nextMode);
  };

  // Time format helper (MM:SS)
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Real Web Audio Visualizer Bar Animation
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const analyser = sound.getAnalyser();

      if (analyser && isPlaying) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        const barCount = 32;
        const barWidth = canvas.width / barCount - 2;

        for (let i = 0; i < barCount; i++) {
          const val = dataArray[i * 2] || 0;
          // Dynamically scale and animate bars
          const barHeight = Math.max(5, (val / 255) * canvas.height * 0.95);
          const x = i * (barWidth + 2);
          const y = canvas.height - barHeight;

          // Apple Music neon gradient (Rose -> Magenta -> Indigo)
          const grad = ctx.createLinearGradient(0, y, 0, canvas.height);
          grad.addColorStop(0, '#f43f5e');
          grad.addColorStop(0.5, '#ec4899');
          grad.addColorStop(1, '#6366f1');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, [3, 3, 0, 0]);
          ctx.fill();
        }
      } else {
        // Subtle resting baseline bars
        const barCount = 32;
        const barWidth = canvas.width / barCount - 2;
        for (let i = 0; i < barCount; i++) {
          const x = i * (barWidth + 2);
          const y = canvas.height - 4;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, 3, [1.5, 1.5, 0, 0]);
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  return (
    <div className="ios-music-page">
      {/* Top Header */}
      <header className="music-header">
        <button
          type="button"
          className="mail-nav-back-pill"
          onClick={onBack}
          aria-label="Back to Home"
        >
          <ChevronLeft size={18} />
          <span>Home</span>
        </button>

        <div className="music-page-title">
          <Disc3 size={16} className={isPlaying ? 'spinning-vinyl' : ''} />
          <span>Apple Music</span>
        </div>

        <div className="music-top-actions">
          <button
            type="button"
            className={`music-lyrics-toggle-btn ${showPlaylist ? 'active' : ''}`}
            onClick={() => {
              sound.playTapSound();
              setShowPlaylist(!showPlaylist);
            }}
            title="Playlist Drawer"
          >
            <ListMusic size={16} />
          </button>
          <button
            type="button"
            className={`music-lyrics-toggle-btn ${showLyrics ? 'active' : ''}`}
            onClick={() => {
              sound.playTapSound();
              setShowLyrics(!showLyrics);
            }}
            title="Toggle Synced Lyrics"
          >
            <Sparkles size={16} />
          </button>
        </div>
      </header>

      {/* Main Player Screen */}
      <div className="music-player-body">
        {/* Album Artwork Hero */}
        <div className="music-artwork-wrap">
          <div className="music-album-glow" />
          <div className={`music-vinyl-disc ${isPlaying ? 'playing' : ''}`}>
            <div className="vinyl-center-label">
              <span>UDAY</span>
            </div>
          </div>
          <div className="music-artwork-cover">
            <img src="/uday_avatar.png" alt="Album Cover" />
            <div className="artwork-overlay-gradient" />
            <span className="artwork-kicker">SPATIAL AUDIO</span>
          </div>
        </div>

        {/* Real-time Frequency Spectrum Visualizer */}
        <div className="music-spectrum-container">
          <canvas
            ref={canvasRef}
            width={310}
            height={44}
            className="music-spectrum-canvas"
          />
        </div>

        {/* Track Metadata & Spatial Lossless Badge */}
        <div className="music-metadata-row">
          <div className="track-title-col">
            <h1 className="track-name">{currentTrack.title}</h1>
            <p className="track-artist">
              {currentTrack.artist} &middot; {currentTrack.bpm}
            </p>
          </div>
          <button
            type="button"
            className={`spatial-lossless-btn mode-${spatialMode}`}
            onClick={handleSpatialCycle}
            title={`Spatial Audio: ${spatialMode.toUpperCase()}`}
          >
            <Headphones size={11} />
            <span>{spatialMode === 'anc' ? 'DOLBY ATMOS' : spatialMode === 'transparency' ? 'SPATIAL' : 'STEREO'}</span>
          </button>
        </div>

        {/* Time-Synced Lyrics Ribbon */}
        {showLyrics && (
          <div className="music-synced-lyrics-box">
            <p className="active-lyric-line">{LYRICS[activeLyricIndex]}</p>
            <p className="next-lyric-line">{LYRICS[(activeLyricIndex + 1) % LYRICS.length]}</p>
          </div>
        )}

        {/* Interactive Scrub Bar */}
        <div className="music-scrubber-group">
          <div
            className="music-progress-bar"
            onPointerDown={(e) => {
              setIsScrubbing(true);
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
              setProgress(pct);
              setElapsedSeconds(Math.floor((pct / 100) * trackDuration));
            }}
            onPointerMove={(e) => {
              if (e.buttons === 1) {
                const rect = e.currentTarget.getBoundingClientRect();
                const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
                setProgress(pct);
                setElapsedSeconds(Math.floor((pct / 100) * trackDuration));
              }
            }}
            onPointerUp={(e) => {
              setIsScrubbing(false);
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
              liveActivity.seekProgress(pct);
            }}
          >
            <div className="music-progress-fill" style={{ width: `${progress}%` }}>
              <div className="music-scrub-knob" />
            </div>
          </div>
          <div className="music-time-labels">
            <span>{formatTime(elapsedSeconds)}</span>
            <span>-{formatTime(trackDuration - elapsedSeconds)}</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="music-controls-row">
          {/* Shuffle Toggle */}
          <button
            type="button"
            className={`music-extra-ctrl-btn ${isShuffle ? 'active' : ''}`}
            onClick={() => {
              sound.playTapSound();
              setIsShuffle(!isShuffle);
            }}
            aria-label="Shuffle"
            title="Shuffle"
          >
            <Shuffle size={18} />
          </button>

          {/* Previous Track */}
          <button
            type="button"
            className="music-skip-btn"
            onClick={handlePrevTrack}
            aria-label="Previous Track"
          >
            <SkipBack size={26} fill="currentColor" />
          </button>

          {/* Play / Pause Primary Action */}
          <button
            type="button"
            className="music-play-pause-btn"
            onClick={handleTogglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause size={32} fill="currentColor" />
            ) : (
              <Play size={32} fill="currentColor" style={{ marginLeft: 3 }} />
            )}
          </button>

          {/* Next Track */}
          <button
            type="button"
            className="music-skip-btn"
            onClick={handleNextTrack}
            aria-label="Next Track"
          >
            <SkipForward size={26} fill="currentColor" />
          </button>

          {/* Repeat Toggle */}
          <button
            type="button"
            className={`music-extra-ctrl-btn ${isRepeat ? 'active' : ''}`}
            onClick={() => {
              sound.playTapSound();
              setIsRepeat(!isRepeat);
            }}
            aria-label="Repeat"
            title="Repeat"
          >
            <Repeat size={18} />
          </button>
        </div>

        {/* Volume Slider Bar */}
        <div className="music-volume-row">
          <button
            type="button"
            className="music-volume-icon-btn"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <div
            className="music-volume-slider-track"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
              handleVolumeChange(ratio);
            }}
          >
            <div
              className="music-volume-slider-fill"
              style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
            />
          </div>
        </div>

        {/* Playlist Drawer (Toggleable or persistent strip) */}
        <div className={`music-playlist-section ${showPlaylist ? 'expanded' : ''}`}>
          <div className="music-playlist-header">
            <span>DEVELOPER FOCUS PLAYLIST</span>
            <small>{tracks.length} Tracks</small>
          </div>
          <div className="music-playlist-strip">
            {tracks.map((t, idx) => (
              <button
                key={t.id}
                type="button"
                className={`track-pill-item ${trackIndex === idx ? 'active' : ''}`}
                onClick={() => {
                  sound.playTapSound();
                  setTrackIndex(idx);
                  sound.setTrack(idx);
                  setProgress(0);
                  setElapsedSeconds(0);
                }}
              >
                <div className="track-pill-num">
                  {trackIndex === idx && isPlaying ? (
                    <span className="track-playing-eq-bars">
                      <i /><i /><i />
                    </span>
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>
                <div className="track-pill-info">
                  <strong className="track-pill-title">{t.title}</strong>
                  <span className="track-pill-bpm">{t.bpm} &middot; {t.category || 'Focus'}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
