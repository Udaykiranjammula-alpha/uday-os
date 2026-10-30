import React, { useState, useEffect, useRef, useCallback } from 'react';
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

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
}

interface FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
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
  const [shake, setShake] = useState(false);

  // Audio Context for 8-bit retro sound effects
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current?.state === 'suspended') {
      void audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playBeep = useCallback((freq: number, type: OscillatorType, duration: number, gainVal = 0.12) => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  }, [getAudioCtx, soundEnabled]);

  const playJumpSound = useCallback(() => playBeep(440, 'sine', 0.12), [playBeep]);
  const playDoubleJumpSound = useCallback(() => {
    playBeep(660, 'triangle', 0.08);
    setTimeout(() => playBeep(880, 'sine', 0.12), 40);
  }, [playBeep]);
  const playCoinSound = useCallback(() => {
    playBeep(987, 'square', 0.08, 0.08);
    setTimeout(() => playBeep(1318, 'square', 0.14, 0.1), 60);
  }, [playBeep]);
  const playGameOverSound = useCallback(() => {
    playBeep(260, 'sawtooth', 0.18, 0.15);
    setTimeout(() => playBeep(140, 'sawtooth', 0.35, 0.15), 150);
  }, [playBeep]);
  const playMilestoneSound = useCallback(() => {
    const notes = [523, 659, 783, 1046];
    notes.forEach((n, i) => setTimeout(() => playBeep(n, 'triangle', 0.15), i * 70));
  }, [playBeep]);

  // Master game state
  const stateRef = useRef({
    playerY: 220,
    velocity: 0,
    gravity: 0.52,
    jumpPower: -8.5,
    jumpsLeft: 2,
    groundY: 255,
    obstacles: [] as Obstacle[],
    collectibles: [] as Collectible[],
    particles: [] as Particle[],
    floatingTexts: [] as FloatingText[],
    buildings: [] as Array<{ x: number; w: number; h: number; windows: Array<{ x: number; y: number }> }>,
    stars: [] as Array<{ x: number; y: number; s: number; alpha: number }>,
    speed: 3.4,
    frameCount: 0,
    score: 0,
    running: false,
    runnerLegAngle: 0,
  });

  // Jump handler (Supports Double Jump!)
  const jump = useCallback(() => {
    const s = stateRef.current;
    if (!s.running) return;

    if (s.jumpsLeft > 0) {
      if (s.jumpsLeft === 2) {
        // First jump from ground
        s.velocity = s.jumpPower;
        s.jumpsLeft = 1;
        playJumpSound();
      } else {
        // Double jump in mid-air
        s.velocity = s.jumpPower * 0.92;
        s.jumpsLeft = 0;
        playDoubleJumpSound();

        // Spawn jet thruster ring
        for (let i = 0; i < 8; i++) {
          s.particles.push({
            x: 58,
            y: s.playerY + 22,
            vx: (Math.random() - 0.5) * 3,
            vy: Math.random() * 2 + 1,
            color: '#38bdf8',
            size: Math.random() * 3 + 2,
            alpha: 1,
            life: 25,
          });
        }
      }
    }
  }, [playJumpSound, playDoubleJumpSound]);

  // Start / restart game
  const startGame = useCallback(() => {
    // Generate initial buildings for parallax cyber city skyline
    const buildings: Array<{ x: number; w: number; h: number; windows: Array<{ x: number; y: number }> }> = [];
    let bX = 0;
    while (bX < 450) {
      const w = Math.floor(Math.random() * 40) + 35;
      const h = Math.floor(Math.random() * 90) + 70;
      const windows: Array<{ x: number; y: number }> = [];
      for (let wx = 6; wx < w - 6; wx += 10) {
        for (let wy = 10; wy < h - 10; wy += 14) {
          if (Math.random() > 0.45) windows.push({ x: wx, y: wy });
        }
      }
      buildings.push({ x: bX, w, h, windows });
      bX += w + Math.floor(Math.random() * 12) + 4;
    }

    // Stars
    const stars: Array<{ x: number; y: number; s: number; alpha: number }> = [];
    for (let i = 0; i < 35; i++) {
      stars.push({
        x: Math.random() * 340,
        y: Math.random() * 140,
        s: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.7 + 0.3,
      });
    }

    stateRef.current = {
      playerY: 220,
      velocity: 0,
      gravity: 0.52,
      jumpPower: -8.5,
      jumpsLeft: 2,
      groundY: 255,
      obstacles: [
        { x: 380, y: 228, width: 22, height: 27, label: 'Bug' },
        { x: 620, y: 220, width: 26, height: 35, label: 'Loop' },
      ],
      collectibles: [
        { x: 280, y: 190, type: 'python', points: 15, icon: '🐍', color: '#38bdf8', collected: false },
        { x: 500, y: 175, type: 'ts', points: 25, icon: '🔷', color: '#60a5fa', collected: false },
        { x: 740, y: 180, type: 'cpp', points: 50, icon: '⚡', color: '#f43f5e', collected: false },
      ],
      particles: [],
      floatingTexts: [],
      buildings,
      stars,
      speed: 3.4,
      frameCount: 0,
      score: 0,
      running: true,
      runnerLegAngle: 0,
    };

    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
    setUnlockedOffer(false);
  }, []);

  // Keyboard navigation: Space, ArrowUp, W jump; Enter restarts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        if (!stateRef.current.running && !isGameOver) {
          startGame();
        } else if (stateRef.current.running) {
          jump();
        } else if (isGameOver) {
          startGame();
        }
      } else if (e.code === 'Enter' && isGameOver) {
        e.preventDefault();
        startGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump, startGame, isGameOver]);

  // Main 60fps Game Loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const state = stateRef.current;

      // Clear Canvas
      ctx.fillStyle = '#060911';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 1. Stars background
      for (const star of state.stars) {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fillRect(star.x, star.y, star.s, star.s);
        if (state.running) {
          star.x -= 0.2;
          if (star.x < 0) star.x = canvas.width;
        }
      }

      // 2. Parallax Cyber City Skyline (0.4x speed)
      for (const b of state.buildings) {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(b.x, state.groundY - b.h, b.w, b.h);

        // Neon Roof Edge
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(b.x, state.groundY - b.h, b.w, 2);

        // Windows
        ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
        for (const w of b.windows) {
          ctx.fillRect(b.x + w.x, state.groundY - b.h + w.y, 4, 6);
        }

        if (state.running) {
          b.x -= state.speed * 0.35;
        }
      }

      // Recycle buildings
      if (state.buildings.length > 0 && state.buildings[0].x + state.buildings[0].w < -20) {
        const removed = state.buildings.shift()!;
        const lastB = state.buildings[state.buildings.length - 1];
        removed.x = (lastB ? lastB.x + lastB.w : canvas.width) + Math.floor(Math.random() * 14) + 4;
        state.buildings.push(removed);
      }

      // 3. Cyber Floor Grid
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
      ctx.lineWidth = 1;
      const gridOffset = (state.frameCount * state.speed) % 30;
      for (let gx = -gridOffset; gx < canvas.width; gx += 30) {
        ctx.beginPath();
        ctx.moveTo(gx, state.groundY);
        ctx.lineTo(gx - 15, canvas.height);
        ctx.stroke();
      }

      // Neon Cyber Ground Rail
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(0, state.groundY);
      ctx.lineTo(canvas.width, state.groundY);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Ground underglow
      const groundGrad = ctx.createLinearGradient(0, state.groundY, 0, canvas.height);
      groundGrad.addColorStop(0, 'rgba(6, 182, 212, 0.18)');
      groundGrad.addColorStop(1, 'rgba(6, 182, 212, 0.02)');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, state.groundY, canvas.width, canvas.height - state.groundY);

      if (state.running) {
        state.frameCount++;
        state.runnerLegAngle += 0.35;

        // Player physics
        state.velocity += state.gravity;
        state.playerY += state.velocity;

        // Ground collision & jump reset
        if (state.playerY >= state.groundY - 25) {
          state.playerY = state.groundY - 25;
          state.velocity = 0;
          state.jumpsLeft = 2; // Reset jumps upon touching the ground
        }

        // Spawn obstacles
        if (state.frameCount % 105 === 0) {
          const heights = [22, 28, 32];
          const chosenH = heights[Math.floor(Math.random() * heights.length)];
          const labels = ['Bug', 'Loop', 'Crash', 'Leak'];
          state.obstacles.push({
            x: canvas.width + 30,
            y: state.groundY - chosenH,
            width: 22,
            height: chosenH,
            label: labels[Math.floor(Math.random() * labels.length)],
          });
        }

        // Spawn collectibles
        if (state.frameCount % 85 === 0) {
          const types: Array<{ type: 'python' | 'ts' | 'cpp'; points: number; icon: string; color: string }> = [
            { type: 'python', points: 15, icon: '🐍', color: '#38bdf8' },
            { type: 'ts', points: 25, icon: '🔷', color: '#60a5fa' },
            { type: 'cpp', points: 50, icon: '⚡', color: '#f43f5e' },
          ];
          const t = types[Math.floor(Math.random() * types.length)];
          state.collectibles.push({
            x: canvas.width + 20,
            y: state.groundY - 45 - Math.random() * 55,
            type: t.type,
            points: t.points,
            icon: t.icon,
            color: t.color,
            collected: false,
          });
        }

        // Move & Check Obstacles
        for (let i = state.obstacles.length - 1; i >= 0; i--) {
          const obs = state.obstacles[i];
          obs.x -= state.speed;

          // Forgiving hitbox (4px buffer)
          const pLeft = 50 + 4;
          const pRight = 50 + 18 - 4;
          const pTop = state.playerY + 4;
          const pBottom = state.playerY + 25 - 2;

          const oLeft = obs.x + 2;
          const oRight = obs.x + obs.width - 2;
          const oTop = obs.y + 2;
          const oBottom = obs.y + obs.height;

          if (pRight > oLeft && pLeft < oRight && pBottom > oTop && pTop < oBottom) {
            // Collision crash!
            state.running = false;
            setIsGameOver(true);
            setIsPlaying(false);
            setShake(true);
            setTimeout(() => setShake(false), 400);
            playGameOverSound();
            break;
          }

          if (obs.x < -35) {
            state.obstacles.splice(i, 1);
            state.score += 5;
            setScore(state.score);
          }
        }

        // Move & Check Collectibles
        for (let i = state.collectibles.length - 1; i >= 0; i--) {
          const col = state.collectibles[i];
          col.x -= state.speed;

          const playerCenterX = 50 + 9;
          const playerCenterY = state.playerY + 12;

          if (
            !col.collected &&
            Math.abs(col.x - playerCenterX) < 20 &&
            Math.abs(col.y - playerCenterY) < 24
          ) {
            col.collected = true;
            state.score += col.points;
            setScore(state.score);
            playCoinSound();

            // Spawn celebration particles
            for (let p = 0; p < 10; p++) {
              state.particles.push({
                x: col.x,
                y: col.y,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                color: col.color,
                size: Math.random() * 3 + 2,
                alpha: 1,
                life: 30,
              });
            }

            // Floating text popup
            state.floatingTexts.push({
              x: col.x,
              y: col.y - 10,
              text: `+${col.points}`,
              color: col.color,
              alpha: 1,
            });

            // Unlock offer milestone
            if (state.score >= 250 && !unlockedOffer) {
              setUnlockedOffer(true);
              playMilestoneSound();
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

        // Speed ramp
        if (state.frameCount % 350 === 0 && state.speed < 6.8) {
          state.speed += 0.25;
        }
      }

      // 4. Draw Collectibles with subtle levitation bob
      for (const col of state.collectibles) {
        if (!col.collected) {
          const bob = Math.sin(state.frameCount * 0.08) * 3;
          ctx.font = '16px sans-serif';
          ctx.fillText(col.icon, col.x - 8, col.y + bob + 6);
        }
      }

      // 5. Draw Obstacles (Red Neon Glitch Blocks)
      for (const obs of state.obstacles) {
        ctx.fillStyle = '#ef4444';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 8;
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        ctx.shadowBlur = 0;

        // Label
        ctx.fillStyle = '#ffffff';
        ctx.font = '8px monospace';
        ctx.fillText(obs.label, obs.x + 2, obs.y + 11);
      }

      // 6. Draw Player (Cyberpunk Runner)
      const pX = 50;
      const pY = state.playerY;

      // Aura
      ctx.fillStyle = 'rgba(56, 189, 248, 0.28)';
      ctx.beginPath();
      ctx.arc(pX + 9, pY + 12, 16, 0, Math.PI * 2);
      ctx.fill();

      // Cyber Torso & Helmet
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(pX + 2, pY, 15, 18);

      // Glowing Gold Visor
      ctx.fillStyle = '#facc15';
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 6;
      ctx.fillRect(pX + 9, pY + 3, 9, 4);
      ctx.shadowBlur = 0;

      // Animated Running Legs (when on ground)
      if (pY >= state.groundY - 26) {
        const leg1Offset = Math.sin(state.runnerLegAngle) * 5;
        const leg2Offset = -leg1Offset;
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(pX + 3 + leg1Offset, pY + 18, 4, 7);
        ctx.fillRect(pX + 11 + leg2Offset, pY + 18, 4, 7);
      } else {
        // Tucked jump legs
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(pX + 3, pY + 17, 5, 5);
        ctx.fillRect(pX + 10, pY + 17, 5, 5);
      }

      // Jetpack Thruster Flame (when in air or jumping)
      if (state.velocity < 0 || state.jumpsLeft < 2) {
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.moveTo(pX - 2, pY + 10);
        ctx.lineTo(pX - 8 - Math.random() * 4, pY + 14);
        ctx.lineTo(pX - 2, pY + 18);
        ctx.fill();
      }

      // 7. Update & Draw Particles
      for (let i = state.particles.length - 1; i >= 0; i--) {
        const pt = state.particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.alpha -= 1 / pt.life;

        if (pt.alpha <= 0) {
          state.particles.splice(i, 1);
        } else {
          ctx.fillStyle = pt.color;
          ctx.globalAlpha = Math.max(0, pt.alpha);
          ctx.fillRect(pt.x, pt.y, pt.size, pt.size);
          ctx.globalAlpha = 1;
        }
      }

      // 8. Update & Draw Floating Score Popups
      for (let i = state.floatingTexts.length - 1; i >= 0; i--) {
        const ft = state.floatingTexts[i];
        ft.y -= 1.2;
        ft.alpha -= 0.035;

        if (ft.alpha <= 0) {
          state.floatingTexts.splice(i, 1);
        } else {
          ctx.fillStyle = ft.color;
          ctx.globalAlpha = Math.max(0, ft.alpha);
          ctx.font = 'bold 12px -apple-system, monospace';
          ctx.fillText(ft.text, ft.x, ft.y);
          ctx.globalAlpha = 1;
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [highScore, unlockedOffer, playGameOverSound, playCoinSound, playMilestoneSound]);

  return (
    <div className={`arcade-app-page ${shake ? 'screen-shake' : ''}`}>
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
          <p className="game-sub">Dodge bugs · Double jump · Collect Python &amp; TypeScript</p>
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
            <p>Score 250+ reached. Direct recruiter package unlocked!</p>
          </div>
        </div>
      )}

      {/* Canvas Area */}
      <div
        className="arcade-canvas-wrap"
        onClick={() => {
          if (!isPlaying && !isGameOver) {
            startGame();
          } else if (isPlaying) {
            jump();
          }
        }}
        onTouchStart={(e) => {
          e.preventDefault();
          if (!isPlaying && !isGameOver) {
            startGame();
          } else if (isPlaying) {
            jump();
          }
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
              onClick={(e) => {
                e.stopPropagation();
                startGame();
              }}
            >
              <Play size={18} fill="currentColor" />
              <span>TAP TO START</span>
            </button>
            <span className="arcade-tap-hint">Tap screen or press SPACE to Jump (Supports Double Jump!)</span>
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
              onClick={(e) => {
                e.stopPropagation();
                startGame();
              }}
            >
              <RotateCw size={16} />
              <span>PLAY AGAIN</span>
            </button>
            <span className="arcade-tap-hint">Press SPACE or ENTER to retry</span>
          </div>
        )}
      </div>

      {/* Controls & Quick Hint Bar */}
      <div className="arcade-footer-card">
        <div className="arcade-spec-line">
          <span>🎮 Jump: <strong>Tap / Space</strong></span>
          <span>🚀 Double Jump: <strong>Tap in Air</strong></span>
          <span>🐍 +15</span>
          <span>🔷 +25</span>
          <span>⚡ +50</span>
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
