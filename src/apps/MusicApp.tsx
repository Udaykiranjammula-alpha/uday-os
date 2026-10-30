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
} from 'lucide-react';
import { sound } from '../services/sound';

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
  'Ready to build the future of software engineering.',
];

export function MusicApp({ onBack }: MusicAppProps) {
  const [isPlaying, setIsPlaying] = useState(sound.getIsPlaying());
  const [trackIndex, setTrackIndex] = useState(0);
  const [progress, setProgress] = useState(35); // in percent
  const [activeLyricIndex, setActiveLyricIndex] = useState(0);
  const [showLyrics, setShowLyrics] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const tracks = sound.tracks;
  const currentTrack = tracks[trackIndex] || tracks[0];

  const handleTogglePlay = () => {
    const nextPlaying = sound.toggleAmbientMusic((p) => {
      setIsPlaying(p);
    });
    setIsPlaying(nextPlaying);
  };

  const handleNextTrack = () => {
    sound.playTapSound();
    const next = (trackIndex + 1) % tracks.length;
    setTrackIndex(next);
    sound.setTrack(next);
  };

  const handlePrevTrack = () => {
    sound.playTapSound();
    const prev = (trackIndex - 1 + tracks.length) % tracks.length;
    setTrackIndex(prev);
    sound.setTrack(prev);
  };

  // Progress and lyric ticker
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
      setActiveLyricIndex((prev) => (prev + 1) % LYRICS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [isPlaying]);

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

        const barCount = 28;
        const barWidth = (canvas.width / barCount) - 2;

        for (let i = 0; i < barCount; i++) {
          const val = dataArray[i * 2] || 0;
          const barHeight = Math.max(4, (val / 255) * canvas.height * 0.9);
          const x = i * (barWidth + 2);
          const y = canvas.height - barHeight;

          // Gradient bar
          const grad = ctx.createLinearGradient(0, y, 0, canvas.height);
          grad.addColorStop(0, '#f43f5e');
          grad.addColorStop(0.5, '#ec4899');
          grad.addColorStop(1, '#8b5cf6');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, [3, 3, 0, 0]);
          ctx.fill();
        }
      } else {
        // Subtle resting bars
        const barCount = 28;
        const barWidth = (canvas.width / barCount) - 2;
        for (let i = 0; i < barCount; i++) {
          const x = i * (barWidth + 2);
          const y = canvas.height - 4;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.fillRect(x, y, barWidth, 3);
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

        <button
          type="button"
          className={`music-lyrics-toggle-btn ${showLyrics ? 'active' : ''}`}
          onClick={() => setShowLyrics(!showLyrics)}
          title="Toggle Synced Lyrics"
        >
          <Sparkles size={16} />
        </button>
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

        {/* Track Metadata */}
        <div className="music-metadata-row">
          <div className="track-title-col">
            <h1 className="track-name">{currentTrack.title}</h1>
            <p className="track-artist">{currentTrack.artist} · {currentTrack.bpm}</p>
          </div>
          <div className="spatial-lossless-badge">LOSSLESS</div>
        </div>

        {/* Time-Synced Lyrics Ribbon */}
        {showLyrics && (
          <div className="music-synced-lyrics-box">
            <p className="active-lyric-line">{LYRICS[activeLyricIndex]}</p>
            <p className="next-lyric-line">{LYRICS[(activeLyricIndex + 1) % LYRICS.length]}</p>
          </div>
        )}

        {/* Progress Scrubber */}
        <div className="music-scrubber-group">
          <div
            className="music-progress-bar"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = ((e.clientX - rect.left) / rect.width) * 100;
              setProgress(Math.max(0, Math.min(100, pct)));
            }}
          >
            <div className="music-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="music-time-labels">
            <span>01:14</span>
            <span>03:40</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="music-controls-row">
          <button
            type="button"
            className="music-skip-btn"
            onClick={handlePrevTrack}
            aria-label="Previous Track"
          >
            <SkipBack size={26} fill="currentColor" />
          </button>

          <button
            type="button"
            className="music-play-pause-btn"
            onClick={handleTogglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" style={{ marginLeft: 3 }} />}
          </button>

          <button
            type="button"
            className="music-skip-btn"
            onClick={handleNextTrack}
            aria-label="Next Track"
          >
            <SkipForward size={26} fill="currentColor" />
          </button>
        </div>

        {/* Track Switcher Strip */}
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
              }}
            >
              <span>{idx + 1}. {t.title.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
