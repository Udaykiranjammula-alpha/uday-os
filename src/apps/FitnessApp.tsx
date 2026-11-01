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
  Code2,
  GitCommit,
  Cpu,
  X,
  Dumbbell,
  Timer,
  Check,
} from 'lucide-react';
import { sound } from '../services/sound';

interface FitnessAppProps {
  onBack: () => void;
  onNavigate?: (route: string) => void;
}

interface AwardBadge {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  emoji: string;
  theme: 'gold' | 'cyan' | 'rose' | 'emerald' | 'purple' | 'amber';
}

export function FitnessApp({ onBack, onNavigate }: FitnessAppProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedDay, setSelectedDay] = useState(4); // Friday
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<AwardBadge | null>(null);

  // Exact Apple Fitness 3 activity rings metrics requested:
  // Move 620/600 kcal, Exercise 45/30 min, Stand 12/12 hr
  const ringData = {
    move: {
      current: 620,
      target: 600,
      unit: 'kcal',
      label: 'Move',
      sublabel: 'Active Energy',
      color: '#ff2d55',
      bg: '#3a0815',
    },
    exercise: {
      current: 45,
      target: 30,
      unit: 'min',
      label: 'Exercise',
      sublabel: 'Focus & Logic',
      color: '#5bf527',
      bg: '#0b3504',
    },
    stand: {
      current: 12,
      target: 12,
      unit: 'hr',
      label: 'Stand',
      sublabel: 'Systems Uptime',
      color: '#00e5ff',
      bg: '#002f35',
    },
  };

  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  // Award Badges Grid featuring exact requested awards:
  // 100+ LeetCode Streak, First 3D Model, Speed Demon
  const awardBadges: AwardBadge[] = [
    {
      id: 'leetcode-100',
      title: '100+ LeetCode Streak',
      subtitle: 'Daily Algorithmic Dedication',
      description: 'Solved algorithm problems for over 100 consecutive days across Dynamic Programming, Graphs, and Trees with optimal complexity.',
      date: 'Earned Oct 2024',
      emoji: '🥇',
      theme: 'gold',
    },
    {
      id: 'first-3d-model',
      title: 'First 3D Model',
      subtitle: 'Interactive Three.js Master',
      description: 'Engineered a full 60fps real-time 3D PBR WebGL viewport featuring interactive raymarching and hardware-accelerated shaders.',
      date: 'Earned Sep 2024',
      emoji: '⚡',
      theme: 'cyan',
    },
    {
      id: 'speed-demon',
      title: 'Speed Demon',
      subtitle: 'A18 Pro Benchmark 60FPS',
      description: 'Sustained zero dropped frames and sub-16ms latency across heavy physics animations and real-time audio synthesis.',
      date: 'Earned Nov 2024',
      emoji: '🚀',
      theme: 'rose',
    },
    {
      id: 'clean-arch',
      title: 'Clean Architecture',
      subtitle: 'Zero Technical Debt',
      description: 'Maintained 100% strict TypeScript compliance and zero build warnings across all virtual operating system apps.',
      date: 'Earned Oct 2024',
      emoji: '💎',
      theme: 'emerald',
    },
    {
      id: 'smart-india',
      title: 'Hackathon Finalist',
      subtitle: 'Smart India Hackathon',
      description: 'Represented KL University as core engineering lead building scalable distributed telemetry architectures.',
      date: 'Earned Oct 2024',
      emoji: '🏆',
      theme: 'amber',
    },
    {
      id: 'full-stack',
      title: 'Full-Stack Maestro',
      subtitle: 'React & Distributed Node',
      description: 'Delivered end-to-end full stack architecture for Hospital Management & Titan Network Monitor.',
      date: 'Earned Aug 2024',
      emoji: '🌟',
      theme: 'purple',
    },
  ];

  // High-DPI Smooth Animated Canvas Ring Arcs with Rounded Caps
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Retina / High-DPI scaling
    const dpr = window.devicePixelRatio || 2;
    const displaySize = 140;
    canvas.width = displaySize * dpr;
    canvas.height = displaySize * dpr;
    canvas.style.width = `${displaySize}px`;
    canvas.style.height = `${displaySize}px`;

    let progress = 0;
    const render = () => {
      progress = Math.min(1, progress + 0.03);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, displaySize, displaySize);

      const cx = displaySize / 2;
      const cy = displaySize / 2;
      const lineWidth = 12;
      const spacing = 3;

      const rings = [
        {
          radius: 56,
          current: ringData.move.current,
          target: ringData.move.target,
          color: ringData.move.color,
          bg: ringData.move.bg,
        },
        {
          radius: 56 - (lineWidth + spacing),
          current: ringData.exercise.current,
          target: ringData.exercise.target,
          color: ringData.exercise.color,
          bg: ringData.exercise.bg,
        },
        {
          radius: 56 - (lineWidth + spacing) * 2,
          current: ringData.stand.current,
          target: ringData.stand.target,
          color: ringData.stand.color,
          bg: ringData.stand.bg,
        },
      ];

      rings.forEach((r) => {
        const startAngle = -Math.PI / 2;
        const ratio = (r.current / r.target) * ease;
        const totalAngle = ratio * Math.PI * 2;
        const endAngle = startAngle + totalAngle;

        // 1. Background full track ring
        ctx.beginPath();
        ctx.arc(cx, cy, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = r.bg;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.stroke();

        // 2. Active animated arc
        if (ratio > 0) {
          ctx.beginPath();
          // If overcompleted (> 100%), draw full circle then overlap arc
          if (ratio > 1) {
            ctx.arc(cx, cy, r.radius, startAngle, startAngle + Math.PI * 2);
            ctx.strokeStyle = r.color;
            ctx.lineWidth = lineWidth;
            ctx.lineCap = 'round';
            ctx.stroke();

            // Overlap portion with subtle drop shadow at cap
            ctx.save();
            ctx.beginPath();
            ctx.arc(cx, cy, r.radius, startAngle, endAngle);
            ctx.strokeStyle = r.color;
            ctx.lineWidth = lineWidth;
            ctx.lineCap = 'round';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
            ctx.shadowBlur = 6;
            ctx.stroke();
            ctx.restore();
          } else {
            ctx.arc(cx, cy, r.radius, startAngle, endAngle);
            ctx.strokeStyle = r.color;
            ctx.lineWidth = lineWidth;
            ctx.lineCap = 'round';
            ctx.shadowColor = r.color;
            ctx.shadowBlur = 8;
            ctx.stroke();
            ctx.shadowBlur = 0;
          }
        }
      });

      ctx.restore();

      if (progress < 1) {
        animId = requestAnimationFrame(render);
      }
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleCelebrate = () => {
    sound.playWatchPingSound();
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3200);
  };

  const handleOpenBadge = (badge: AwardBadge) => {
    sound.playTapSound();
    setSelectedBadge(badge);
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

        {/* 3 Rings Canvas Card with exact values */}
        <div className="fitness-rings-card" onClick={handleCelebrate}>
          <div className="canvas-wrapper">
            <canvas ref={canvasRef} className="fitness-rings-canvas" />
          </div>

          <div className="rings-metrics-column">
            {/* Move: 620/600 kcal */}
            <div className="metric-row red">
              <div className="metric-label-row">
                <Flame size={14} className="text-rose-500" />
                <span>Move</span>
              </div>
              <div className="metric-val-row">
                <strong>{ringData.move.current}</strong>
                <small>/{ringData.move.target} {ringData.move.unit}</small>
              </div>
            </div>

            {/* Exercise: 45/30 min */}
            <div className="metric-row green">
              <div className="metric-label-row">
                <Zap size={14} className="text-emerald-400" />
                <span>Exercise</span>
              </div>
              <div className="metric-val-row">
                <strong>{ringData.exercise.current}</strong>
                <small>/{ringData.exercise.target} {ringData.exercise.unit}</small>
              </div>
            </div>

            {/* Stand: 12/12 hr */}
            <div className="metric-row cyan">
              <div className="metric-label-row">
                <Clock size={14} className="text-cyan-400" />
                <span>Stand</span>
              </div>
              <div className="metric-val-row">
                <strong>{ringData.stand.current}</strong>
                <small>/{ringData.stand.target} {ringData.stand.unit}</small>
              </div>
            </div>
          </div>
        </div>

        {/* Engineering Workout Dedicated Metrics */}
        <div className="fitness-section-header">
          <div className="flex items-center gap-1.5">
            <Dumbbell size={15} className="text-rose-500" />
            <h2>Engineering Workout</h2>
          </div>
          <span className="text-xs text-emerald-400 font-semibold">Today &middot; Completed</span>
        </div>

        <div className="fitness-trends-grid">
          {/* Metric 1: Lines written */}
          <div className="trend-box">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <Code2 size={13} className="text-rose-400" />
              <span className="trend-title">Lines Written</span>
            </div>
            <div className="trend-num text-rose-400">1,480 Lines</div>
            <span className="trend-sub text-emerald-400">↑ 28% velocity</span>
          </div>

          {/* Metric 2: Commits */}
          <div className="trend-box">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <GitCommit size={13} className="text-emerald-400" />
              <span className="trend-title">Commits</span>
            </div>
            <div className="trend-num text-emerald-400">18 Commits</div>
            <span className="trend-sub text-emerald-400">Zero regressions</span>
          </div>

          {/* Metric 3: Algorithms solved */}
          <div className="trend-box">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <Zap size={13} className="text-amber-400" />
              <span className="trend-title">Algorithms Solved</span>
            </div>
            <div className="trend-num text-amber-400">184+ Solved</div>
            <span className="trend-sub text-sky-400">Top 5% optimal O(N)</span>
          </div>

          {/* Metric 4: Focus Time */}
          <div className="trend-box">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <Timer size={13} className="text-sky-400" />
              <span className="trend-title">Deep Focus Session</span>
            </div>
            <div className="trend-num text-sky-400">4h 45m</div>
            <span className="trend-sub text-zinc-400">Flow state sustained</span>
          </div>
        </div>

        {/* Apple Fitness Award Badges Grid */}
        <div className="fitness-section-header">
          <div className="flex items-center gap-1.5">
            <Trophy size={14} className="text-amber-400" />
            <h2>Award Badges</h2>
          </div>
          <span className="text-[11px] text-zinc-400 font-medium">Tap badge for details</span>
        </div>

        <div className="grid grid-cols-3 gap-2.5 mb-4">
          {awardBadges.map((badge) => (
            <div
              key={badge.id}
              className="award-card cursor-pointer hover:border-zinc-600 active:scale-95 transition-all"
              onClick={() => handleOpenBadge(badge)}
              title={badge.title}
            >
              <div
                className="award-badge-disc"
                style={{
                  background:
                    badge.theme === 'gold'
                      ? 'linear-gradient(135deg, #ffd60a, #d97706)'
                      : badge.theme === 'cyan'
                      ? 'linear-gradient(135deg, #38bdf8, #0284c7)'
                      : badge.theme === 'rose'
                      ? 'linear-gradient(135deg, #fb7185, #e11d48)'
                      : badge.theme === 'emerald'
                      ? 'linear-gradient(135deg, #4ade80, #15803d)'
                      : badge.theme === 'amber'
                      ? 'linear-gradient(135deg, #f59e0b, #b45309)'
                      : 'linear-gradient(135deg, #c084fc, #7e22ce)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                }}
              >
                <span className="award-emoji">{badge.emoji}</span>
              </div>
              <strong className="award-title line-clamp-1">{badge.title}</strong>
              <small className="award-desc line-clamp-1">{badge.subtitle}</small>
            </div>
          ))}
        </div>

        {/* Recruiter Hiring Call to Action */}
        <div className="fitness-recruiter-banner">
          <div className="banner-left">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <div>
              <strong>Uday is Ready to Perform</strong>
              <small>Consistent high-output engineer &bull; 100% Ring Streak</small>
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

      {/* Award Badge Detail Sheet Modal */}
      {selectedBadge && (
        <div
          className="ios-qr-modal-overlay"
          onClick={() => setSelectedBadge(null)}
          style={{ zIndex: 120 }}
        >
          <div
            className="ios-qr-modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '300px' }}
          >
            <div
              className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-3xl mb-3 shadow-xl"
              style={{
                background:
                  selectedBadge.theme === 'gold'
                    ? 'linear-gradient(135deg, #ffd60a, #d97706)'
                    : selectedBadge.theme === 'cyan'
                    ? 'linear-gradient(135deg, #38bdf8, #0284c7)'
                    : selectedBadge.theme === 'rose'
                    ? 'linear-gradient(135deg, #fb7185, #e11d48)'
                    : selectedBadge.theme === 'emerald'
                    ? 'linear-gradient(135deg, #4ade80, #15803d)'
                    : selectedBadge.theme === 'amber'
                    ? 'linear-gradient(135deg, #f59e0b, #b45309)'
                    : 'linear-gradient(135deg, #c084fc, #7e22ce)',
              }}
            >
              <span>{selectedBadge.emoji}</span>
            </div>

            <h3 className="text-base font-bold text-white mb-1">{selectedBadge.title}</h3>
            <p className="text-xs text-sky-400 font-semibold mb-2">{selectedBadge.subtitle}</p>
            <p className="text-xs text-zinc-300 leading-relaxed mb-3">{selectedBadge.description}</p>
            <p className="text-[10px] text-zinc-500 font-mono mb-4">{selectedBadge.date}</p>

            <button
              onClick={() => setSelectedBadge(null)}
              className="ios-qr-close-btn bg-white text-black font-semibold"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Full-Screen Confetti Celebration Overlay */}
      {showConfetti && (
        <div className="imessage-confetti-layer" style={{ pointerEvents: 'none', position: 'fixed' }}>
          {[...Array(35)].map((_, i) => (
            <span
              key={i}
              className="confetti-piece"
              style={{
                left: `${(i * 100) / 35}%`,
                animationDelay: `${(i % 5) * 0.12}s`,
                backgroundColor: ['#ff2d55', '#5bf527', '#00e5ff', '#ffd60a', '#af52de'][i % 5],
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
