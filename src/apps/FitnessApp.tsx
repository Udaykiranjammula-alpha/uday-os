import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  Flame,
  Zap,
  Clock,
  Trophy,
  Award,
  Sparkles,
  TrendingUp,
  Share2,
  CheckCircle2,
} from 'lucide-react';
import { sound } from '../services/sound';

interface FitnessAppProps {
  onBack: () => void;
  onNavigate?: (route: string) => void;
}

export function FitnessApp({ onBack, onNavigate }: FitnessAppProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedDay, setSelectedDay] = useState(4); // Friday
  const [showConfetti, setShowConfetti] = useState(false);

  // Rings targets & values for an elite engineer
  const ringData = {
    move: { current: 440, target: 500, unit: 'lines', label: 'Code Velocity', color: '#ff2d55', bg: '#3a0815' },
    exercise: { current: 36, target: 30, unit: 'mins', label: 'LeetCode & Logic', color: '#5bf527', bg: '#0b3504' },
    stand: { current: 11, target: 12, unit: 'hrs', label: 'Systems Uptime', color: '#00e5ff', bg: '#002f35' },
  };

  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  // Draw 3 Concentric Rings on Canvas
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let progress = 0;
    const render = () => {
      progress = Math.min(1, progress + 0.035);
      const ease = 1 - Math.pow(1 - progress, 3);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const lineWidth = 16;
      const spacing = 4;

      const rings = [
        {
          radius: 80,
          current: ringData.move.current,
          target: ringData.move.target,
          color: ringData.move.color,
          bg: ringData.move.bg,
        },
        {
          radius: 80 - (lineWidth + spacing),
          current: ringData.exercise.current,
          target: ringData.exercise.target,
          color: ringData.exercise.color,
          bg: ringData.exercise.bg,
        },
        {
          radius: 80 - (lineWidth + spacing) * 2,
          current: ringData.stand.current,
          target: ringData.stand.target,
          color: ringData.stand.color,
          bg: ringData.stand.bg,
        },
      ];

      rings.forEach((r) => {
        const startAngle = -Math.PI / 2;
        const pct = (r.current / r.target) * ease;
        const endAngle = startAngle + pct * Math.PI * 2;

        // Background track ring
        ctx.beginPath();
        ctx.arc(cx, cy, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = r.bg;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Active animated colored ring
        ctx.beginPath();
        ctx.arc(cx, cy, r.radius, startAngle, endAngle);
        ctx.strokeStyle = r.color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.shadowColor = r.color;
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      if (progress < 1) {
        animId = requestAnimationFrame(render);
      }
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleCelebrate = () => {
    sound.playTapSound();
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <div className="ios-fitness-page">
      {/* Top Header */}
      <header className="fitness-header">
        <button
          type="button"
          className="fitness-back-btn"
          onClick={() => {
            sound.playTapSound();
            onBack();
          }}
          aria-label="Back"
        >
          <ChevronLeft size={20} />
          <span>Home</span>
        </button>

        <h1 className="fitness-title">Activity</h1>

        <button
          type="button"
          className="fitness-share-btn"
          onClick={handleCelebrate}
          aria-label="Celebrate"
          title="Celebrate Ring Closures"
        >
          <Sparkles size={16} className="text-amber-400" />
        </button>
      </header>

      {/* Main Scrollable Content */}
      <div className="fitness-scroll-body">
        {/* Weekly Day Selector */}
        <div className="fitness-days-strip">
          {daysOfWeek.map((day, idx) => (
            <button
              key={idx}
              type="button"
              className={`fitness-day-btn ${selectedDay === idx ? 'active' : ''}`}
              onClick={() => {
                sound.playTapSound();
                setSelectedDay(idx);
              }}
            >
              <span className="fitness-day-label">{day}</span>
              <div className="fitness-day-mini-ring">
                <span className="mini-ring-dot" />
              </div>
            </button>
          ))}
        </div>

        {/* 3 Rings Canvas Card */}
        <div className="fitness-rings-card" onClick={handleCelebrate}>
          <div className="canvas-wrapper">
            <canvas
              ref={canvasRef}
              width={200}
              height={200}
              className="fitness-rings-canvas"
            />
          </div>

          <div className="rings-metrics-column">
            {/* Move / Velocity */}
            <div className="metric-row red">
              <div className="metric-label-row">
                <Flame size={14} className="text-rose-500" />
                <span>Move</span>
              </div>
              <div className="metric-val-row">
                <strong>{ringData.move.current}</strong>
                <small>/{ringData.move.target} lines</small>
              </div>
            </div>

            {/* Exercise / LeetCode */}
            <div className="metric-row green">
              <div className="metric-label-row">
                <Zap size={14} className="text-emerald-400" />
                <span>Exercise</span>
              </div>
              <div className="metric-val-row">
                <strong>{ringData.exercise.current}</strong>
                <small>/{ringData.exercise.target} mins</small>
              </div>
            </div>

            {/* Stand / Uptime */}
            <div className="metric-row cyan">
              <div className="metric-label-row">
                <Clock size={14} className="text-cyan-400" />
                <span>Stand</span>
              </div>
              <div className="metric-val-row">
                <strong>{ringData.stand.current}</strong>
                <small>/{ringData.stand.target} hrs</small>
              </div>
            </div>
          </div>
        </div>

        {/* Engineering Performance Highlights */}
        <div className="fitness-section-header">
          <h2>Engineering Trends</h2>
          <TrendingUp size={14} className="text-emerald-400" />
        </div>

        <div className="fitness-trends-grid">
          <div className="trend-box">
            <span className="trend-title">Commit Velocity</span>
            <div className="trend-num">18 Commits</div>
            <span className="trend-sub text-emerald-400">↑ 24% vs last week</span>
          </div>

          <div className="trend-box">
            <span className="trend-title">LeetCode Solutions</span>
            <div className="trend-num">184+ Solved</div>
            <span className="trend-sub text-cyan-400">Top 5% Algorithms</span>
          </div>

          <div className="trend-box">
            <span className="trend-title">Code Cleanliness</span>
            <div className="trend-num">99.8%</div>
            <span className="trend-sub text-emerald-400">Zero Technical Debt</span>
          </div>

          <div className="trend-box">
            <span className="trend-title">Focus Time</span>
            <div className="trend-num">6h 42m</div>
            <span className="trend-sub text-amber-400">Deep Architecture</span>
          </div>
        </div>

        {/* Apple Fitness Awards Showcase */}
        <div className="fitness-section-header">
          <h2>Awards &amp; Badges</h2>
          <Trophy size={14} className="text-amber-400" />
        </div>

        <div className="fitness-awards-scroll">
          <div className="award-card">
            <div className="award-badge-disc gold">
              <span className="award-emoji">🥇</span>
            </div>
            <strong className="award-title">Centurion</strong>
            <small className="award-desc">184+ LeetCode</small>
          </div>

          <div className="award-card">
            <div className="award-badge-disc cyan">
              <span className="award-emoji">⚡</span>
            </div>
            <strong className="award-title">WebGL Master</strong>
            <small className="award-desc">3D WebGL PBR</small>
          </div>

          <div className="award-card">
            <div className="award-badge-disc purple">
              <span className="award-emoji">🚀</span>
            </div>
            <strong className="award-title">Full-Stack</strong>
            <small className="award-desc">React &amp; Node.js</small>
          </div>

          <div className="award-card">
            <div className="award-badge-disc green">
              <span className="award-emoji">🌟</span>
            </div>
            <strong className="award-title">7-Day Streak</strong>
            <small className="award-desc">Perfect Week</small>
          </div>
        </div>

        {/* Recruiter Hiring Call to Action */}
        <div className="fitness-recruiter-banner">
          <div className="banner-left">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <div>
              <strong>Uday is Ready to Perform</strong>
              <small>Consistent high-output engineer</small>
            </div>
          </div>
          {onNavigate && (
            <button
              type="button"
              className="fitness-hire-btn"
              onClick={() => {
                sound.playTapSound();
                onNavigate('contact');
              }}
            >
              Interview
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
