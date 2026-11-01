import React, { useState } from 'react';
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
} from 'lucide-react';
import { sound } from '../services/sound';

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

type ArtStyle = '3d-apple' | 'cyberpunk' | 'pixel-art';

export function GenmojiApp({ onBack, onNavigate }: GenmojiAppProps) {
  const [selectedArchetype, setSelectedArchetype] = useState<Archetype>(ARCHETYPES[0]);
  const [selectedStyle, setSelectedStyle] = useState<ArtStyle>('3d-apple');
  const [customPrompt, setCustomPrompt] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSelectArchetype = (arch: Archetype) => {
    sound.playTapSound();
    setSelectedArchetype(arch);
  };

  const handleGenerate = () => {
    sound.playApplePayChime();
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 600);
  };

  const handleCopy = () => {
    sound.playTapSound();
    const text = `Apple Genmoji: ${selectedArchetype.name} ${selectedArchetype.emoji}\n${selectedArchetype.quote}\nVerified Skills: ${selectedArchetype.skills}\nCreated via UDAY OS (https://uday-os-five.vercel.app/)`;
    if (navigator.clipboard) {
      void navigator.clipboard.writeText(text);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="genmoji-page-screen">
      {/* Apple Intelligence Flowing Edge Halo */}
      <div className="apple-intelligence-halo" />

      {/* Top Header */}
      <div className="genmoji-header">
        <button
          type="button"
          className="genmoji-back-btn"
          onClick={onBack}
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
          onClick={handleCopy}
          title="Copy Genmoji card"
        >
          {copied ? <Check size={18} className="text-green" /> : <Copy size={18} />}
        </button>
      </div>

      {/* Main Genmoji Playground Stage */}
      <div className="genmoji-stage-container">
        <div className={`genmoji-avatar-disc ${selectedStyle} ${isGenerating ? 'generating' : ''}`}>
          <div
            className="genmoji-aura"
            style={{
              background: `radial-gradient(circle, ${selectedArchetype.color}33 0%, transparent 70%)`,
            }}
          />

          <span className="genmoji-big-emoji">{selectedArchetype.emoji}</span>

          <span className="genmoji-style-badge">
            {selectedStyle === '3d-apple' && ' Apple 3D Memoji'}
            {selectedStyle === 'cyberpunk' && '⚡ Cyber Hologram'}
            {selectedStyle === 'pixel-art' && '👾 8-Bit Pixel'}
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
            <strong>Key Technologies:</strong> {selectedArchetype.skills}
          </p>
        </div>
      </div>

      {/* Concept Selector: Choose Persona */}
      <div className="genmoji-scroll-section">
        <span className="section-label">Choose Developer Archetype</span>
        <div className="archetype-chips-row">
          {ARCHETYPES.map((arch) => (
            <button
              key={arch.id}
              type="button"
              className={`archetype-chip ${selectedArchetype.id === arch.id ? 'active' : ''}`}
              onClick={() => handleSelectArchetype(arch)}
            >
              <span className="chip-emoji">{arch.emoji}</span>
              <span className="chip-name">{arch.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Style Selector */}
      <div className="genmoji-scroll-section">
        <span className="section-label">Art Direction</span>
        <div className="style-chips-row">
          <button
            type="button"
            className={`style-chip ${selectedStyle === '3d-apple' ? 'active' : ''}`}
            onClick={() => {
              sound.playTapSound();
              setSelectedStyle('3d-apple');
            }}
          >
            <span> 3D Memoji</span>
          </button>
          <button
            type="button"
            className={`style-chip ${selectedStyle === 'cyberpunk' ? 'active' : ''}`}
            onClick={() => {
              sound.playTapSound();
              setSelectedStyle('cyberpunk');
            }}
          >
            <span>⚡ Cyber Hologram</span>
          </button>
          <button
            type="button"
            className={`style-chip ${selectedStyle === 'pixel-art' ? 'active' : ''}`}
            onClick={() => {
              sound.playTapSound();
              setSelectedStyle('pixel-art');
            }}
          >
            <span>👾 8-Bit Pixel</span>
          </button>
        </div>
      </div>

      {/* Action Bar */}
      <div className="genmoji-bottom-bar">
        <button
          type="button"
          className="genmoji-generate-btn"
          onClick={handleGenerate}
        >
          <Wand2 size={16} />
          <span>Regenerate with Apple Intelligence</span>
        </button>

        <button
          type="button"
          className="genmoji-send-btn"
          onClick={() => {
            sound.playTapSound();
            if (onNavigate) onNavigate('messages');
          }}
          title="Insert sticker in iMessage"
        >
          <MessageSquare size={16} />
          <span>iMessage</span>
        </button>
      </div>
    </div>
  );
}
