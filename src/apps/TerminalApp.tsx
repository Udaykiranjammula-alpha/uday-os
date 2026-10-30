import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, CornerDownLeft, ChevronLeft, Sparkles, X } from 'lucide-react';
import { profile } from '../data/profile';
import { projects } from '../data/projects';
import { skillCategories } from '../data/skills';
import { sound } from '../services/sound';

type TerminalLine = {
  text: string;
  type: 'input' | 'output' | 'system' | 'error' | 'success';
};

interface TerminalAppProps {
  onBack?: () => void;
  onSetTheme?: (theme: 'dark' | 'light') => void;
  onOpenDemo?: (projectSlug: string) => void;
}

export function TerminalApp({ onBack, onSetTheme, onOpenDemo }: TerminalAppProps) {
  const [lines, setLines] = useState<TerminalLine[]>([
    { text: 'UDAY OS Developer Terminal v2.5 (ZSH · Apple Silicon)', type: 'system' },
    { text: 'Type "help" for command listing. Try "skills --tree", "matrix", or "sudo hire uday".', type: 'system' },
  ]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMatrixActive, setIsMatrixActive] = useState(false);
  const [isHiredCelebration, setIsHiredCelebration] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const matrixCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  // Matrix Digital Rain Effect
  useEffect(() => {
    if (!isMatrixActive) return;
    const canvas = matrixCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 320;
    canvas.height = canvas.parentElement?.clientHeight || 500;

    const chars = '01UDAYKIRANJAMMULAKLUNIVERSITYPYTHONC++REACT';
    const fontSize = 12;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    const interval = setInterval(() => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff66';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }, 45);

    return () => clearInterval(interval);
  }, [isMatrixActive]);

  const availableCommands = [
    'help',
    'about',
    'whoami',
    'skills',
    'skills --tree',
    'projects',
    'projects --run hospital',
    'github',
    'contact',
    'matrix',
    'sudo hire uday',
    'date',
    'clear',
  ];

  const handleCommand = (rawInput: string) => {
    const trimmed = rawInput.trim();
    if (!trimmed) return;

    sound.playTapSound();
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    const newEntries: TerminalLine[] = [{ text: `$ ${trimmed}`, type: 'input' }];

    switch (cmd) {
      case 'help':
        newEntries.push({
          text: `UDAY OS Shell CLI 2.5 Commands:
  help              - Display this manual
  whoami            - Developer identity & credentials
  about             - Biography and university background
  skills            - Formatted technical skills
  skills --tree     - ASCII hierarchy of languages & systems
  projects          - List all engineered software
  projects --run    - Launch project demo (e.g. "projects --run hospital")
  matrix            - Enter full-screen digital rain mode
  sudo hire uday    - Elevate privileges to offer employment
  github            - Show repository telemetry
  contact           - Direct communication handles
  clear             - Clear display buffer`,
          type: 'output',
        });
        break;

      case 'whoami':
        newEntries.push({
          text: `User: guest@uday-os
Host: KL University Computer Science Subnet
Authorization: Full Read-Only / Portfolio Inspection
Target: Uday Kiran Jammula (B.Tech CSE '27)`,
          type: 'output',
        });
        break;

      case 'about':
        newEntries.push({
          text: `${profile.name} · ${profile.role}
University: ${profile.university} (${profile.location})
Focus: Algorithmic Engineering, Full-Stack Applications & Embedded Systems
Status: Open for Software Engineering Internships`,
          type: 'output',
        });
        break;

      case 'skills':
        if (args[0] === '--tree') {
          newEntries.push({
            text: `├── Systems & Core Languages
│   ├── Python (Pandas, Algorithms, APIs)
│   ├── C / C++ (FreeRTOS, Memory Management)
│   ├── TypeScript / JavaScript (ESNext)
│   └── SQL (Relational Data Modeling)
├── Frontend Engineering
│   ├── React 18 & Vite
│   ├── WebGL & Three.js 3D Viewports
│   └── Framer Motion & Responsive AMOLED Design
└── Embedded & Hardware
    ├── ESP32 Dual-Core SPI Packet Telemetry
    └── Sensor Ingestion & FreeRTOS Tasks`,
            type: 'output',
          });
        } else {
          newEntries.push({
            text: skillCategories
              .map((c) => `[${c.category}]\n  ${c.items.map((s) => s.name).join(' · ')}`)
              .join('\n\n'),
            type: 'output',
          });
        }
        break;

      case 'projects':
        if (args[0] === '--run' && args[1]?.toLowerCase().includes('hospital')) {
          onOpenDemo?.('hospital-management-system');
          newEntries.push({
            text: `🚀 Launching Hospital Management System clinical demo...`,
            type: 'success',
          });
        } else {
          newEntries.push({
            text: projects
              .map(
                (p, i) =>
                  `[${i + 1}] ${p.title} (${p.category})\n    Tech: ${p.stack.join(', ')}\n    Repo: ${p.repo}`
              )
              .join('\n\n') +
              '\n\nTip: Type "projects --run hospital" to test the live clinical app.',
            type: 'output',
          });
        }
        break;

      case 'matrix':
        setIsMatrixActive(true);
        newEntries.push({
          text: `[SYSTEM] Initializing Matrix digital rain simulation. Press (X) to exit.`,
          type: 'system',
        });
        break;

      case 'sudo':
        if (args.join(' ').toLowerCase() === 'hire uday') {
          setIsHiredCelebration(true);
          newEntries.push({
            text: `🎉 ========================================== 🎉
    [ROOT PRIVILEGES UNLOCKED]
    OFFER ACCEPTED!
    Candidate Uday Kiran Jammula is ready to join your team.
    Direct Email: ${profile.email}
🎉 ========================================== 🎉`,
            type: 'success',
          });
          setTimeout(() => setIsHiredCelebration(false), 5000);
        } else {
          newEntries.push({
            text: `sudo: ${args[0] || ''}: command requiring root credentials. Try "sudo hire uday".`,
            type: 'error',
          });
        }
        break;

      case 'github':
        newEntries.push({
          text: `GitHub Profile: ${profile.github}
Handle: @Udaykiranjammula-alpha
Telemetry: 4 Verified Production Repositories (Hospital System, ESP32 ML, Titan Network)`,
          type: 'output',
        });
        break;

      case 'contact':
        newEntries.push({
          text: `Email: ${profile.email}
GitHub: ${profile.github}
LinkedIn: ${profile.linkedin}`,
          type: 'output',
        });
        break;

      case 'date':
        newEntries.push({
          text: new Date().toString(),
          type: 'output',
        });
        break;

      case 'clear':
        setLines([]);
        setInput('');
        return;

      default:
        newEntries.push({
          text: `zsh: command not found: "${cmd}". Type "help" or hit [Tab] to auto-complete.`,
          type: 'error',
        });
    }

    setLines((prev) => [...prev, ...newEntries]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const match = availableCommands.find((c) => c.startsWith(input.toLowerCase().trim()));
      if (match) {
        setInput(match);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIndex =
          historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const nextIndex = historyIndex + 1;
        if (nextIndex < commandHistory.length) {
          setHistoryIndex(nextIndex);
          setInput(commandHistory[nextIndex]);
        } else {
          setHistoryIndex(-1);
          setInput('');
        }
      }
    }
  };

  return (
    <div className="terminal-container" onClick={() => inputRef.current?.focus({ preventScroll: true })}>
      {/* Matrix Digital Rain Overlay */}
      {isMatrixActive && (
        <div className="terminal-matrix-curtain">
          <canvas ref={matrixCanvasRef} className="matrix-canvas" />
          <button
            type="button"
            className="matrix-close-btn"
            onClick={() => setIsMatrixActive(false)}
            aria-label="Exit Matrix Mode"
          >
            <X size={16} /> Exit Matrix
          </button>
        </div>
      )}

      {/* Confetti / Celebration Banner */}
      {isHiredCelebration && (
        <div className="terminal-celebration-toast">
          <Sparkles size={16} className="text-amber" />
          <span>Root Granted: Welcome aboard Uday! 🎉</span>
        </div>
      )}

      {/* Terminal Top Bar */}
      <div className="terminal-topbar">
        {onBack && (
          <button
            type="button"
            className="ios-back-chevron"
            style={{ color: '#94a3b8', marginRight: 8, padding: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              onBack();
            }}
            aria-label="Back to Home"
          >
            <ChevronLeft size={16} />
          </button>
        )}
        <div className="term-dots">
          <span className="dot red" />
          <span className="dot yellow" />
          <span className="dot green" />
        </div>
        <span className="term-title">
          <TerminalIcon size={12} /> zsh — uday@kl-university
        </span>
      </div>

      {/* Scrollable Command Output Buffer */}
      <div className="terminal-scroll-area">
        {lines.map((l, index) => (
          <div key={index} className={`terminal-line line-${l.type}`}>
            <pre>{l.text}</pre>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Interactive Command Prompt */}
      <div className="terminal-prompt-bar">
        <span className="prompt-label">uday-os:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="prompt-input"
          aria-label="Terminal command input"
          placeholder="type help or hit tab..."
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
        />
        <button
          type="button"
          className="term-enter-btn"
          onClick={() => handleCommand(input)}
          aria-label="Execute command"
        >
          <CornerDownLeft size={14} />
        </button>
      </div>
    </div>
  );
}
