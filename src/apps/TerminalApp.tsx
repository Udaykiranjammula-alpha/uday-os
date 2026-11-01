import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Terminal as TerminalIcon, CornerDownLeft, ChevronLeft, Sparkles, X, TerminalSquare } from 'lucide-react';
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
    { text: 'Type "help" for command listing. Try "neofetch", "cat resume", "leetcode", or "matrix".', type: 'system' },
  ]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMatrixActive, setIsMatrixActive] = useState(false);
  const [isHiredCelebration, setIsHiredCelebration] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const matrixCanvasRef = useRef<HTMLCanvasElement>(null);
  const tabMatchesRef = useRef<{ matches: string[]; index: number }>({ matches: [], index: 0 });

  const availableCommands = [
    'help',
    'about',
    'whoami',
    'skills',
    'skills --tree',
    'projects',
    'projects --run hospital',
    'leetcode',
    'neofetch',
    'matrix',
    'cat resume',
    'sudo hire uday',
    'github',
    'contact',
    'date',
    'clear',
    'exit',
  ];

  const quickPills = [
    'help',
    'neofetch',
    'projects',
    'leetcode',
    'skills',
    'cat resume',
    'matrix',
    'sudo hire uday',
    'clear',
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  // Listen for Escape to close matrix mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMatrixActive) {
        setIsMatrixActive(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMatrixActive]);

  // Matrix Digital Rain Effect
  useEffect(() => {
    if (!isMatrixActive) return;
    const canvas = matrixCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 360;
    canvas.height = canvas.parentElement?.clientHeight || 600;

    const chars = '01UDAYKIRANJAMMULAKLUNIVERSITYPYTHONC++REACTTYPESCRIPT';
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

  const handleCommand = useCallback((rawInput: string) => {
    const trimmed = rawInput.trim();
    if (!trimmed) return;

    sound.playTapSound();
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);
    tabMatchesRef.current = { matches: [], index: 0 };

    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    const fullArg = args.join(' ').toLowerCase();

    const newEntries: TerminalLine[] = [{ text: `$ ${trimmed}`, type: 'input' }];

    switch (cmd) {
      case 'help':
        newEntries.push({
          text: `UDAY OS Shell CLI 2.5 Commands:
  help              - Display this manual
  about             - Biography and university background
  skills            - Formatted technical skills
  skills --tree     - ASCII hierarchy of languages & systems
  projects          - List all engineered software
  projects --run    - Launch project demo (e.g. "projects --run hospital")
  leetcode          - Solved algorithmic problems & competitive telemetry
  cat resume        - Render complete developer resume & credentials
  neofetch          - Print hardware, kernel, and OS specifications
  matrix            - Enter full-screen digital rain mode (ESC to exit)
  sudo hire uday    - Elevate privileges to offer employment
  whoami            - Developer identity & credentials
  date              - Show current system timestamp
  contact           - Direct communication channels
  github            - Show repository telemetry
  clear             - Clear terminal screen buffer
  exit              - Exit shell and return to home screen`,
          type: 'output',
        });
        break;

      case 'whoami':
        newEntries.push({
          text: `User: guest@uday-os
Host: KL University Computer Science Subnet
Authorization: Full Read-Only / Portfolio Inspection
Target: Uday Kiran Jammula (B.Tech CSE '27)
Location: Andhra Pradesh, India`,
          type: 'output',
        });
        break;

      case 'about':
        newEntries.push({
          text: `${profile.name} · ${profile.role}
University: ${profile.university} (${profile.location})
Focus: Algorithmic Engineering, Full-Stack Applications & Embedded Systems
Interests: ${profile.interests.join(' · ')}
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
              .join('\n\n') + '\n\nTip: Type "skills --tree" for hierarchy view.',
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

      case 'leetcode':
        newEntries.push({
          text: `LeetCode Competitive Problem Solving — Uday Kiran Jammula
  Total Solved: 184 / 3,100
  ├── Easy:    85  (Arrays, Two Pointers, Strings, Hash Maps)
  ├── Medium:  78  (Trees, Graphs, BFS/DFS, Dynamic Programming)
  └── Hard:    21  (Trapping Rain Water, LRU Cache, Sliding Window)

  Contest Rating: 1,684 (Top 8.5% Globally)
  Current Streak: 128 Days Active
  Acceptance Rate: 68.4%
  Active Languages: Python 3 (62%), C++ (30%), C (8%)
  Top Solved: LRU Cache, Trapping Rain Water, Number of Islands, Two Sum`,
          type: 'output',
        });
        break;

      case 'neofetch':
        newEntries.push({
          text: `       .:'                   uday@kl-university
     __ :'__                 ------------------
  .'\`  \`-'  \`\`.              OS: UDAY OS 2.5 (Darwin 24.1.0 ARM64)
 :          .-'              Host: iPhone 17 Pro Max (Apple A18 Pro 3nm)
:         :                  Kernel: Darwin 24.1.0 Mach-O
 :         \`-.__             Uptime: 248 days, 16 hours, 42 mins
  \`.        ..--'            Shell: zsh 5.9 (arm64-apple-darwin24)
    \`-..__..-'               CPU: Apple A18 Pro (2P @ 4.04GHz + 4E)
                             GPU: Apple 6-Core Metal 3 Ray-Tracing GPU
                             NPU: 16-Core Neural Engine (35 TOPS)
                             Memory: 8 GB LPDDR5X Unified Memory
                             Storage: 512 GB NVMe (184 Solved LC blocks)
                             Screen: 6.9" Super Retina XDR OLED (120Hz)
                             Theme: Apple Dark Titanium AMOLED

                             [■ Red] [■ Green] [■ Yellow] [■ Blue] [■ Magenta] [■ Cyan]`,
          type: 'output',
        });
        break;

      case 'cat':
        if (fullArg === 'resume' || fullArg === 'resume.txt' || fullArg === 'resume.pdf' || fullArg === '') {
          newEntries.push({
            text: `================================================================
                    UDAY KIRAN JAMMULA
             Software Engineer & Systems Builder
  📍 Vijayawada, India | ✉️ ${profile.email}
  🐙 github.com/Udaykiranjammula-alpha | 💼 linkedin.com/in/uday-kiran-jammula
================================================================

[EDUCATION]
  B.Tech in Computer Science and Engineering (2023 - 2027)
  K L University · Andhra Pradesh, India · CGPA: 9.2/10
  Relevant Coursework: Data Structures, Analysis of Algorithms,
  Operating Systems, Computer Networks, Object-Oriented Design

[CORE TECHNICAL SKILLS]
  Languages:     Python 3, C, C++, TypeScript, JavaScript, SQL
  Frameworks:    React 18, Vite, Node.js, Express, TailwindCSS
  Systems/IoT:   ESP32, FreeRTOS, MQTT, WebSockets, Embedded C
  Developer Kit: Git, GitHub, Docker, Linux/POSIX Shell, Postman

[KEY PROJECTS]
  1. Hospital Management System (React, TypeScript, Express, PostgreSQL)
     • Role-based clinical workflow with appointment booking & triage
     • Encrypted patient records and real-time bed occupancy tracker
  2. Edge Machine Learning & ESP32 Sensor Telemetry (C++, FreeRTOS)
     • Real-time packet parsing over SPI/I2C with sub-5ms latency
     • MQTT live bridge streaming telemetry to AMOLED frontend
  3. Titan Multi-Tenant Cloud Architecture (React, Tailwind, Node.js)
     • Multi-tenant interactive dashboard with microservice telemetry

[PROBLEM SOLVING METRICS]
  • 184+ LeetCode problems solved (Easy: 85, Medium: 78, Hard: 21)
  • 128-day daily coding streak · Top 8.5% global contest standing

[STATUS & AVAILABILITY]
  Available for Summer 2025 / 2026 Software Engineering Internships!
================================================================`,
            type: 'output',
          });
        } else {
          newEntries.push({
            text: `cat: ${args[0]}: No such file or directory. Try "cat resume".`,
            type: 'error',
          });
        }
        break;

      case 'matrix':
        setIsMatrixActive(true);
        newEntries.push({
          text: `[SYSTEM] Initializing Matrix digital rain simulation. Press (X) or hit ESC to exit.`,
          type: 'system',
        });
        break;

      case 'sudo':
        if (args.join(' ').toLowerCase() === 'hire uday') {
          setIsHiredCelebration(true);
          sound.playApplePayChime();
          newEntries.push({
            text: `🎉 ======================================================= 🎉
    [ROOT PRIVILEGES UNLOCKED]
    OFFER ACCEPTED!
    Candidate Uday Kiran Jammula is ready to join your team.
    Direct Email: ${profile.email}
    LinkedIn: ${profile.linkedin}
🎉 ======================================================= 🎉`,
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
Telemetry: 4 Verified Production Repositories (Hospital System, ESP32 ML, Titan Network, LeetCode)`,
          type: 'output',
        });
        break;

      case 'contact':
        newEntries.push({
          text: `Direct Communication Handles:
  Email:    ${profile.email}
  GitHub:   ${profile.github}
  LinkedIn: ${profile.linkedin}
  Location: ${profile.location}`,
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

      case 'exit':
        if (onBack) {
          onBack();
        } else {
          newEntries.push({
            text: `Session closed. Type "help" to start again.`,
            type: 'system',
          });
        }
        break;

      default:
        newEntries.push({
          text: `zsh: command not found: "${cmd}". Type "help" or click suggestion pills below.`,
          type: 'error',
        });
    }

    setLines((prev) => [...prev, ...newEntries]);
    setInput('');
  }, [onBack, onOpenDemo]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const current = input.toLowerCase().trim();
      let { matches, index } = tabMatchesRef.current;

      if (matches.length === 0 || !matches.includes(input)) {
        matches = availableCommands.filter((c) => c.startsWith(current));
        index = 0;
      } else {
        index = (index + 1) % matches.length;
      }

      if (matches.length > 0) {
        setInput(matches[index]);
        tabMatchesRef.current = { matches, index };
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
          <TerminalIcon size={12} /> zsh — uday@kl-university (A18 Pro)
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

      {/* Quick Command Suggestion Pills for 1-Tap Execution */}
      <div className="terminal-pills-bar" onClick={(e) => e.stopPropagation()}>
        <span style={{ fontSize: 10, color: '#64748b', marginRight: 2, display: 'flex', alignItems: 'center', gap: 3 }}>
          <TerminalSquare size={11} /> Quick:
        </span>
        {quickPills.map((pill) => (
          <button
            key={pill}
            type="button"
            className="term-pill-btn"
            onClick={() => {
              setInput(pill);
              handleCommand(pill);
            }}
          >
            {pill}
          </button>
        ))}
      </div>

      {/* Interactive Command Prompt */}
      <div className="terminal-prompt-bar">
        <span className="prompt-label">uday-os:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            tabMatchesRef.current = { matches: [], index: 0 };
          }}
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
