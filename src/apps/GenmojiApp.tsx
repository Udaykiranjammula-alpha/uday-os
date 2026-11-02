import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  Sparkles,
  Copy,
  Check,
  Download,
  Share2,
  Wand2,
  Layers,
  MessageSquare,
  Plus,
  X,
  Palette,
  Send,
} from 'lucide-react';
import { sound } from '../services/sound';
import { haptics } from '../services/haptics';

interface GenmojiAppProps {
  onBack: () => void;
  onNavigate?: (route: string) => void;
}

interface Archetype {
  id: string;
  name: string;
  emoji: string;
  badge: string;
  quote: string;
  skills: string;
  color: string;
}

const ARCHETYPES: Archetype[] = [
  {
    id: 'fullstack',
    name: 'Full-Stack Architect',
    emoji: '🧙‍♂️',
    badge: 'TS + REACT + THREE.JS',
    quote: '"Building high-performance operating systems in the browser."',
    skills: 'TypeScript, React 18, Three.js, Node.js, Vite',
    color: '#38bdf8',
  },
  {
    id: 'leetcode',
    name: 'LeetCode Grandmaster',
    emoji: '⚡',
    badge: '184+ PROBLEMS SOLVED',
    quote: '"O(1) space, O(N) time. Every edge case accounted for."',
    skills: 'Dynamic Programming, Graphs, Trees, Trie, Heaps',
    color: '#f59e0b',
  },
  {
    id: 'embedded',
    name: 'Silicon & IoT Hacker',
    emoji: '📡',
    badge: 'ESP32 & WI-FI CSI',
    quote: '"Bridging hardware silicon to micro-inference pipelines."',
    skills: 'C++, ESP32, FreeRTOS, SPI Transport, CSI Radar',
    color: '#10b981',
  },
  {
    id: 'keynote',
    name: 'Apple Keynote Speaker',
    emoji: '✨',
    badge: 'A18 PRO OPTIMIZED',
    quote: '"This is the most powerful portfolio we have ever created."',
    skills: 'Keynote 3D CAD, VisionOS Spatial Gaze, ProMotion 120Hz',
    color: '#a855f7',
  },
  {
    id: 'coffee',
    name: '3AM Production Deployer',
    emoji: '☕',
    badge: 'ZERO REGRESSIONS',
    quote: '"Clean commits, 100% test coverage, deployed to the edge."',
    skills: 'Git, CI/CD, Vitest, Vercel Edge, Production Resiliency',
    color: '#ec4899',
  },
];

const PRESET_STYLES = [
  'Photorealistic',
  'Anime',
  'Claymation',
  'Vector',
  'Sketch',
  '3D Memoji',
  'Cyberpunk',
];

const CONCEPT_TAGS = [
  'Full-Stack Architect',
  'Apple Park',
  'Cyberpunk',
  'Silicon & IoT Hacker',
  'Matrix Neon',
  'ESP32 Silicon',
  '184 LeetCode Master',
  'VisionOS Spatial Hologram',
];

export function GenmojiApp({ onBack, onNavigate }: GenmojiAppProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedArchetype, setSelectedArchetype] = useState<Archetype>(ARCHETYPES[0]);
  const [selectedStyle, setSelectedStyle] = useState<string>('Photorealistic');
  const [selectedConcepts, setSelectedConcepts] = useState<string[]>([
    'Full-Stack Architect',
    'Apple Park',
  ]);
  const [copied, setCopied] = useState(false);
  const [diffusionState, setDiffusionState] = useState<'idle' | 'diffusing' | 'shimmering' | 'resolved'>('idle');

  // Particle Diffusion Shimmer Loop (Feature 29)
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 160;
    const height = 160;
    const dpr = window.devicePixelRatio || 2;
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const appleAiColors = ['#00e5ff', '#ff375f', '#ffd60a', '#bf5af2'];
    const particleCount = 40;
    const particles = Array.from({ length: particleCount }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 2.4,
      vy: (Math.random() - 0.5) * 2.4,
      radius: Math.random() * 2 + 1,
      color: appleAiColors[i % appleAiColors.length],
    }));

    const render = () => {
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const isDiffusing = diffusionState === 'diffusing' || diffusionState === 'shimmering';

      particles.forEach((p) => {
        if (isDiffusing) {
          // Particle convergence math towards center with chromatic drift
          p.x += (centerX - p.x) * 0.08 + p.vx;
          p.y += (centerY - p.y) * 0.08 + p.vy;
        } else {
          p.x += p.vx * 0.4;
          p.y += p.vy * 0.4;
        }

        // Wrap boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.fill();
      });

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [diffusionState]);

  // Concept Selection (Max 4 limit)
  const handleToggleConcept = (concept: string) => {
    sound.playTapSound();
    haptics.wheelTick();
    if (selectedConcepts.includes(concept)) {
      setSelectedConcepts((prev) => prev.filter((c) => c !== concept));
    } else {
      if (selectedConcepts.length >= 4) return;
      setSelectedConcepts((prev) => [...prev, concept]);
    }
  };

  // Trigger Apple Intelligence Diffusion Generation
  const handleGenerate = () => {
    sound.playApplePayChime();
    haptics.actionButton();

    setDiffusionState('diffusing');
    setTimeout(() => {
      setDiffusionState('shimmering');
      setTimeout(() => {
        setDiffusionState('resolved');
        haptics.success();
      }, 700);
    }, 600);
  };

  // Generate 512x512 High-DPI PNG Sticker Export (Feature 30)
  const handleExportPNG = () => {
    sound.playTapSound();
    haptics.tap();

    const offscreen = document.createElement('canvas');
    const size = 512;
    offscreen.width = size;
    offscreen.height = size;
    const ctx = offscreen.getContext('2d');
    if (!ctx) return;

    // 1. Authentic Cupertino Continuous Curvature Squircle Geometry
    const r = size * 0.225; // 115.2px
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(size - r, 0);
    ctx.quadraticCurveTo(size, 0, size, r);
    ctx.lineTo(size, size - r);
    ctx.quadraticCurveTo(size, size, size - r, size);
    ctx.lineTo(r, size);
    ctx.quadraticCurveTo(0, size, 0, size - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();

    // Fill Background
    const bgGradient = ctx.createLinearGradient(0, 0, size, size);
    bgGradient.addColorStop(0, '#0f172a');
    bgGradient.addColorStop(1, '#020617');
    ctx.fillStyle = bgGradient;
    ctx.fill();

    // Border
    ctx.strokeStyle = selectedArchetype.color;
    ctx.lineWidth = 6;
    ctx.stroke();

    // 2. Render Base Emoji
    ctx.font = '180px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(selectedArchetype.emoji, size / 2, size / 2 - 30);

    // 3. Render Badge Pill
    ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = selectedArchetype.color;
    ctx.fillText(selectedArchetype.badge, size / 2, size / 2 + 130);

    // 4. Download Trigger with Authentic Naming
    const dataUrl = offscreen.toDataURL('image/png');
    const filename = `uday-genmoji-${selectedArchetype.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;

    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();

    haptics.success();
  };

  // 1-Click Send to iMessage (Feature 31)
  const handleSendToiMessage = () => {
    sound.playTapSound();
    haptics.tap();

    try {
      localStorage.setItem(
        'uday_latest_genmoji_sticker',
        JSON.stringify({
          emoji: selectedArchetype.emoji,
          badge: selectedArchetype.badge,
          name: selectedArchetype.name,
          color: selectedArchetype.color,
          timestamp: Date.now(),
        })
      );
    } catch {}

    if (onNavigate) {
      onNavigate('messages');
    }
  };

  const handleCopyCard = () => {
    sound.playTapSound();
    haptics.tap();
    const text = `Apple Genmoji: ${selectedArchetype.name} ${selectedArchetype.emoji}\n${selectedArchetype.quote}\nVerified Skills: ${selectedArchetype.skills}\nCreated via UDAY OS (https://uday-os-five.vercel.app/)`;
    try {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const promptText = `High-fidelity Cupertino concept art featuring ${selectedConcepts.join(', ')} rendered in authentic ${selectedStyle} with Apple Intelligence chromatic glow.`;

  return (
    <div className="genmoji-page-screen bg-black text-white min-h-full flex flex-col font-sans select-none overflow-y-auto">
      {/* Apple Intelligence Flowing Edge Halo */}
      <div className="apple-intelligence-halo" />

      {/* Top Header */}
      <div className="genmoji-header">
        <button
          type="button"
          className="genmoji-back-btn"
          onClick={() => {
            sound.playTapSound();
            haptics.tap();
            onBack();
          }}
          aria-label="Back to Home"
        >
          <ChevronLeft size={20} />
          <span>Home</span>
        </button>

        <div className="genmoji-title-wrap">
          <Sparkles size={16} className="text-ai-rainbow" />
          <span className="genmoji-title">Image Playground &middot; Genmoji</span>
        </div>

        <button
          type="button"
          className="genmoji-action-icon"
          onClick={handleCopyCard}
          title="Copy Genmoji card"
        >
          {copied ? <Check size={18} className="text-green" /> : <Copy size={18} />}
        </button>
      </div>

      {/* Main Genmoji Stage */}
      <div className="genmoji-stage-container relative">
        {/* Canvas Particle Diffusion Shimmer Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <canvas ref={canvasRef} className="w-40 h-40 opacity-75" />
        </div>

        <div
          className={`genmoji-avatar-disc ${selectedStyle.toLowerCase()} ${
            diffusionState === 'diffusing' || diffusionState === 'shimmering' ? 'generating' : ''
          }`}
        >
          <div
            className="genmoji-aura"
            style={{
              background: `radial-gradient(circle, ${selectedArchetype.color}33 0%, transparent 70%)`,
            }}
          />

          <span className="genmoji-big-emoji relative z-20 drop-shadow-2xl">
            {selectedArchetype.emoji}
          </span>

          <span className="genmoji-style-badge relative z-20">
             {selectedStyle}
          </span>
        </div>

        <div className="genmoji-info-card">
          <div className="genmoji-name-row">
            <h4>{selectedArchetype.name}</h4>
            <span className="genmoji-badge-pill" style={{ color: selectedArchetype.color }}>
              {selectedArchetype.badge}
            </span>
          </div>
          <p className="genmoji-quote">{selectedArchetype.quote}</p>
          <p className="genmoji-skills-list">
            <strong>Prompt:</strong> {promptText}
          </p>
        </div>
      </div>

      {/* Concept Mixing Studio: Multi-Concept Selection (Feature 28) */}
      <div className="genmoji-scroll-section px-3.5 mb-2">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-zinc-300">Image Playground Concepts</span>
          <span className="text-[10px] text-zinc-500 font-mono">
            {selectedConcepts.length}/4 Selected
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {CONCEPT_TAGS.map((tag) => {
            const isSelected = selectedConcepts.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                  isSelected
                    ? 'bg-sky-500/20 text-sky-300 border-sky-400 font-semibold'
                    : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white'
                }`}
                onClick={() => handleToggleConcept(tag)}
              >
                {isSelected ? '✓ ' : '+ '}
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Choose Archetype */}
      <div className="genmoji-scroll-section">
        <span className="section-label">Choose Developer Archetype</span>
        <div className="archetype-chips-row">
          {ARCHETYPES.map((arch) => (
            <button
              key={arch.id}
              type="button"
              className={`archetype-chip ${selectedArchetype.id === arch.id ? 'active' : ''}`}
              onClick={() => {
                sound.playTapSound();
                haptics.tap();
                setSelectedArchetype(arch);
              }}
            >
              <span className="chip-emoji">{arch.emoji}</span>
              <span className="chip-name">{arch.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Style Selector */}
      <div className="genmoji-scroll-section">
        <span className="section-label">Preset Visual Style</span>
        <div className="style-chips-row">
          {PRESET_STYLES.map((st) => (
            <button
              key={st}
              type="button"
              className={`style-chip ${selectedStyle === st ? 'active' : ''}`}
              onClick={() => {
                sound.playTapSound();
                haptics.tap();
                setSelectedStyle(st);
              }}
            >
              <span>{st}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Action Bar */}
      <div className="genmoji-bottom-bar flex items-center gap-2 px-3.5 pb-6">
        <button
          type="button"
          className="genmoji-generate-btn flex-1"
          onClick={handleGenerate}
        >
          <Wand2 size={16} />
          <span>Regenerate with Apple Intelligence</span>
        </button>

        <button
          type="button"
          className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl border border-zinc-700/60"
          onClick={handleExportPNG}
          title="Export 512x512 High-DPI PNG Sticker"
        >
          <Download size={16} />
        </button>

        <button
          type="button"
          className="genmoji-send-btn"
          onClick={handleSendToiMessage}
          title="Send to iMessage"
        >
          <MessageSquare size={16} />
          <span>iMessage</span>
        </button>
      </div>
    </div>
  );
}
