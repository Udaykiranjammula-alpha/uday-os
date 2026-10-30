import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  RotateCw,
  Trophy,
  Sparkles,
  Play,
  Volume2,
  VolumeX,
  Award,
  Zap,
} from 'lucide-react';

interface ArcadeAppProps {
  onBack: () => void;
  onNavigate?: (route: string) => void;
}

interface Collectible {
  x: number;
  y: number;
  type: 'python' | 'ts' | 'cpp';
  points: number;
  icon: string;
  color: string;
  collected: boolean;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}

export function ArcadeApp({ onBack, onNavigate }: ArcadeAppProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('dev_dash_high_score') || '0', 10);
  });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [unlockedOffer, setUnlockedOffer] = useState(false);

  // Audio Context for 8-bit retro sound effects
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioCtx = () => {
    if (!audioCtxRef.current && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current?.state === 'suspended') {
      void audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playBeep = (freq: number, type: OscillatorType, duration: number) => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  };

  const playJumpSound = () => playBeep(420, 'sine', 0.15);
  const playCoinSound = () => {
    playBeep(880, 'square', 0.1);
    setTimeout(() => playBeep(1320, 'square', 0.15), 60);
  };
  const playGameOverSound = () => {
    playBeep(280, 'sawtooth', 0.2);
    setTimeout(() => playBeep(160, 'sawtooth', 0.35), 180);
  };

  // Game state refs
  const stateRef = useRef({
    playerY: 200,
    velocity: 0,
    gravity: 0.55,
    jumpPower: -8.8,
    isJumping: false,
    groundY: 260,
    obstacles: [] as Obstacle[],
    collectibles: [] as Collectible[],
    speed: 3.2,
    frameCount: 0,
    score: 0,
    running: false,
  });

  const jump = () => {
    if (!stateRef.current.running) return;
    stateRef.current.velocity = stateRef.current.jumpPower;
    playJumpSound();
  };

  const startGame = () => {
    stateRef.current = {
      playerY: 220,
      velocity: 0,
      gravity: 0.55,
      jumpPower: -8.8,
      isJumping: false,
      groundY: 260,
      obstacles: [
        { x: 400, y: 235, width: 26, height: 25, label: 'Bug' },
        { x: 650, y: 225, width: 32, height: 35, label: 'Loop' },
      ],
      collectibles: [
        { x: 300, y: 190, type: 'python', points: 15, icon: '🐍', color: '#38bdf8', collected: false },
        { x: 500, y: 170, type: 'ts', points: 25, icon: '🔷', color: '#60a5fa', collected: false },
        { x: 750, y: 180, type: 'cpp', points: 50, icon: '⚡', color: '#f43f5e', collected: false },
      ],
      speed: 3.5,
      frameCount: 0,
      score: 0,
      running: true,
    };
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
    setUnlockedOffer(false);
  };

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const state = stateRef.current;

      // Clear Canvas
      ctx.fillStyle = '#0b0f19';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Cyber Grid Background Lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1;
      for (let x = (state.frameCount * -1) % 40; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Neon Floor Line
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, state.groundY);
      ctx.lineTo(canvas.width, state.groundY);
      ctx.stroke();

      // Floor Glow
      ctx.fillStyle = 'rgba(6, 182, 212, 0.06)';
      ctx.fillRect(0, state.groundY, canvas.width, canvas.height - state.groundY);

      if (state.running) {
        state.frameCount++;

        // Update Player Physics
        state.velocity += state.gravity;
        state.playerY += state.velocity;

        // Ground constraint
        if (state.playerY >= state.groundY - 24) {
          state.playerY = state.groundY - 24;
          state.velocity = 0;
        }

        // Spawn & Update Obstacles
        if (state.frameCount % 110 === 0) {
          const heights = [22, 32, 28];
          const chosenH = heights[Math.floor(Math.random() * heights.length)];
          const labels = ['Bug', 'Loop', 'Crash', 'Leak'];
          state.obstacles.push({
            x: canvas.width + 30,
            y: state.groundY - chosenH,
            width: 24,
            height: chosenH,
            label: labels[Math.floor(Math.random() * labels.length)],
          });
        }

        // Spawn & Update Collectibles
        if (state.frameCount % 90 === 0) {
          const types: Array<{ type: 'python' | 'ts' | 'cpp'; points: number; icon: string; color: string }> = [
            { type: 'python', points: 15, icon: '🐍', color: '#38bdf8' },
            { type: 'ts', points: 25, icon: '🔷', color: '#60a5fa' },
            { type: 'cpp', points: 50, icon: '⚡', color: '#f43f5e' },
          ];
          const t = types[Math.floor(Math.random() * types.length)];
          state.collectibles.push({
            x: canvas.width + 20,
            y: state.groundY - 50 - Math.random() * 50,
            type: t.type,
            points: t.points,
            icon: t.icon,
            color: t.color,
            collected: false,
          });
        }

        // Move Obstacles
        for (let i = state.obstacles.length - 1; i >= 0; i--) {
          const obs = state.obstacles[i];
          obs.x -= state.speed;

          // Collision Detection with Player
          const playerX = 50;
          const playerW = 20;
          const playerH = 24;

          if (
            playerX < obs.x + obs.width &&
            playerX + playerW > obs.x &&
            state.playerY < obs.y + obs.height &&
            state.playerY + playerH > obs.y
          ) {
            // Collision!
            state.running = false;
            setIsGameOver(true);
            setIsPlaying(false);
            playGameOverSound();
            break;
          }

          if (obs.x < -40) {
            state.obstacles.splice(i, 1);
            state.score += 5;
            setScore(state.score);
          }
        }

        // Move Collectibles
        for (let i = state.collectibles.length - 1; i >= 0; i--) {
          const col = state.collectibles[i];
          col.x -= state.speed;

          const playerX = 50;
          if (
            !col.collected &&
            Math.abs(col.x - playerX) < 22 &&
            Math.abs(col.y - state.playerY) < 28
          ) {
            col.collected = true;
            state.score += col.points;
            setScore(state.score);
            playCoinSound();

            if (state.score >= 250 && !unlockedOffer) {
              setUnlockedOffer(true);
            }
          }

          if (col.x < -30) {
            state.collectibles.splice(i, 1);
          }
        }

        // Update High Score
        if (state.score > highScore) {
          setHighScore(state.score);
          localStorage.setItem('dev_dash_high_score', state.score.toString());
        }

        // Gradual speedup
        if (state.frameCount % 400 === 0 && state.speed < 6.5) {
          state.speed += 0.3;
        }
      }

      // Draw Collectibles
      for (const col of state.collectibles) {
        if (!col.collected) {
          ctx.font = '16px sans-serif';
          ctx.fillText(col.icon, col.x - 8, col.y + 6);
        }
      }

      // Draw Obstacles (Red Neon Glitch Blocks)
      for (const obs of state.obstacles) {
        ctx.fillStyle = '#ef4444';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 8;
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#ffffff';
        ctx.font = '8px monospace';
        ctx.fillText(obs.label, obs.x + 2, obs.y + 12);
      }

      // Draw Player (Cyber Runner Avatar)
      const pX = 50;
      const pY = state.playerY;

      // Glow Aura
      ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.beginPath();
      ctx.arc(pX + 10, pY + 12, 16, 0, Math.PI * 2);
      ctx.fill();

      // Cyber Body
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(pX, pY, 18, 24);

      // Visor
      ctx.fillStyle = '#facc15';
      ctx.fillRect(pX + 8, pY + 4, 10, 5);

      // Jetpack Thruster
      if (state.velocity < 0) {
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.moveTo(pX - 4, pY + 14);
        ctx.lineTo(pX - 10, pY + 18);
        ctx.lineTo(pX - 4, pY + 22);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [highScore, unlockedOffer, soundEnabled]);

  return (
    <div className="arcade-app-page">
      {/* Top Header matching Apple Arcade */}
      <header className="arcade-header">
        <button
          type="button"
          className="mail-nav-back-pill"
          onClick={onBack}
          aria-label="Back to Home"
        >
          <ChevronLeft size={18} />
          <span>Home</span>
        </button>

        <div className="arcade-title-badge">
          <span className="arcade-joystick-icon">🕹️</span>
          <span>Apple Arcade</span>
        </div>

        <button
          type="button"
          className="arcade-sound-pill"
          onClick={() => setSoundEnabled(!soundEnabled)}
          aria-label="Toggle Sound"
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
      </header>

      {/* Hero Banner */}
      <div className="arcade-hero-ribbon">
        <div className="game-meta-group">
          <h1 className="game-title">Dev Dash: Byte Runner</h1>
          <p className="game-sub">Dodge bugs · Collect Python &amp; TypeScript · Unlock Recruiter Offer</p>
        </div>

        <div className="arcade-score-row">
          <div className="score-pill current">
            <small>SCORE</small>
            <strong>{score}</strong>
          </div>
          <div className="score-pill high">
            <Trophy size={13} className="text-amber" />
            <small>HIGH</small>
            <strong>{highScore}</strong>
          </div>
        </div>
      </div>

      {/* Unlocked Offer Banner */}
      {unlockedOffer && (
        <div className="arcade-achievement-banner">
          <Award size={18} className="text-amber" />
          <div className="achieve-text">
            <strong>🏆 Senior Software Engineer Offer Unlocked!</strong>
            <p>Score 250+ reached. Uday Kiran Jammula is interview-ready!</p>
          </div>
        </div>
      )}

      {/* Canvas Area */}
      <div
        className="arcade-canvas-wrap"
        onClick={jump}
        onTouchStart={(e) => {
          e.preventDefault();
          jump();
        }}
        role="button"
        tabIndex={0}
      >
        <canvas
          ref={canvasRef}
          width={330}
          height={300}
          className="arcade-game-canvas"
        />

        {!isPlaying && !isGameOver && (
          <div className="arcade-start-overlay">
            <button
              type="button"
              className="arcade-start-btn"
              onClick={startGame}
            >
              <Play size={18} fill="currentColor" />
              <span>TAP TO START</span>
            </button>
            <span className="arcade-tap-hint">Tap anywhere on screen to jump</span>
          </div>
        )}

        {isGameOver && (
          <div className="arcade-gameover-overlay">
            <h3>GAME OVER</h3>
            <p>Caught in a syntax error!</p>
            <div className="final-score-badge">Final Score: {score}</div>
            <button
              type="button"
              className="arcade-restart-btn"
              onClick={startGame}
            >
              <RotateCw size={16} />
              <span>PLAY AGAIN</span>
            </button>
          </div>
        )}
      </div>

      {/* How to Play & Portfolio Showcase */}
      <div className="arcade-footer-card">
        <div className="arcade-spec-line">
          <span>🎮 Jump: <strong>Tap Screen</strong></span>
          <span>🐍 Python: <strong>+15 pts</strong></span>
          <span>⚡ C++: <strong>+50 pts</strong></span>
        </div>

        {score >= 250 && (
          <button
            type="button"
            className="arcade-offer-cta"
            onClick={() => onNavigate?.('resume')}
          >
            <Zap size={14} />
            <span>View Uday&apos;s Verified Resume</span>
          </button>
        )}
      </div>
    </div>
  );
}
