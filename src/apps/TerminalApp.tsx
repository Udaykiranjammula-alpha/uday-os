import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, CornerDownLeft, ChevronLeft } from 'lucide-react';
import { profile } from '../data/profile';
import { projects } from '../data/projects';
import { skillCategories } from '../data/skills';

type TerminalLine = {
  text: string;
  type: 'input' | 'output' | 'system' | 'error';
};

interface TerminalAppProps {
  onBack?: () => void;
  onSetTheme?: (theme: 'dark' | 'light') => void;
}

export function TerminalApp({ onBack, onSetTheme }: TerminalAppProps) {
  const [lines, setLines] = useState<TerminalLine[]>([
    { text: 'UDAY OS Terminal v2.4 (Simulated Shell)', type: 'system' },
    { text: 'Type "help" to display available commands.', type: 'system' },
  ]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  const handleCommand = (rawInput: string) => {
    const trimmed = rawInput.trim();
    if (!trimmed) return;

    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    const newEntries: TerminalLine[] = [{ text: `$ ${trimmed}`, type: 'input' }];

    switch (cmd) {
      case 'help':
        newEntries.push({
          text: `Available commands:
  help        - Show this reference menu
  about       - Display developer summary
  projects    - List verified portfolio projects
  skills      - List categorized engineering competencies
  github      - Display public GitHub URL & status
  contact     - Display contact email and profiles
  whoami      - Print active user identity
  date        - Print current system date & time
  theme <arg> - Change UI theme ("theme dark" or "theme light")
  cat <topic> - Read file (e.g. "cat readme", "cat esp32")
  sudo        - Request elevated administrative access
  systeminfo  - Display UDAY OS kernel specifications
  clear       - Clear screen buffer`,
          type: 'output',
        });
        break;

      case 'about':
        newEntries.push({
          text: `${profile.name} · ${profile.role}\n${profile.university} (${profile.location})\n${profile.bio}`,
          type: 'output',
        });
        break;

      case 'projects':
        newEntries.push({
          text: projects
            .map((p, i) => `[${i + 1}] ${p.title} (${p.category})\n    Repo: ${p.repo}`)
            .join('\n\n'),
          type: 'output',
        });
        break;

      case 'skills':
        newEntries.push({
          text: skillCategories
            .map((c) => `${c.category}:\n  ${c.items.map((s) => s.name).join(', ')}`)
            .join('\n\n'),
          type: 'output',
        });
        break;

      case 'github':
        newEntries.push({
          text: `GitHub Profile: ${profile.github}\nOwner: Udaykiranjammula-alpha\nStatus: 4 Verified Public Repositories`,
          type: 'output',
        });
        break;

      case 'contact':
        newEntries.push({
          text: `Email: ${profile.email}\nGitHub: ${profile.github}\nLinkedIn: ${profile.linkedin}`,
          type: 'output',
        });
        break;

      case 'whoami':
        newEntries.push({
          text: `guest@uday-os (visitor terminal session)`,
          type: 'output',
        });
        break;

      case 'date':
        newEntries.push({
          text: new Date().toString(),
          type: 'output',
        });
        break;

      case 'theme':
        if (args[0] === 'light' || args[0] === 'dark') {
          if (onSetTheme) {
            onSetTheme(args[0]);
            newEntries.push({ text: `Theme updated to ${args[0]} mode.`, type: 'output' });
          } else {
            newEntries.push({ text: `Theme switcher ready.`, type: 'output' });
          }
        } else {
          newEntries.push({
            text: 'Usage: theme dark | theme light',
            type: 'error',
          });
        }
        break;

      case 'cat':
        if (args[0]?.toLowerCase() === 'readme') {
          newEntries.push({
            text: 'UDAY OS: An interactive virtual smartphone developer portfolio.\nBuilt with React 18, TypeScript, Vite, and Framer Motion.',
            type: 'output',
          });
        } else if (args[0]?.toLowerCase() === 'esp32') {
          newEntries.push({
            text: 'ESP32 Distributed ML Accelerator: Two microcontrollers coordinating feature ingestion and INT8 inference over SPI/Wi-Fi.',
            type: 'output',
          });
        } else {
          newEntries.push({
            text: `File not found. Try "cat readme" or "cat esp32"`,
            type: 'error',
          });
        }
        break;

      case 'sudo':
        newEntries.push({
          text: 'Permission denied: UDAY OS kernel enforces read-only guest privileges for portfolio security.',
          type: 'error',
        });
        break;

      case 'systeminfo':
        newEntries.push({
          text: `OS: UDAY OS 2.0 (iPhone Simulator Architecture)
Kernel: React 18.3 + TypeScript 5.6
Framework: Vite 6.0 ESM
Motion: Framer Motion Spring Engine
Viewport: Responsive Virtual Phone Container
Security: Pure Static Sandboxed Client Execution`,
          type: 'output',
        });
        break;

      case 'clear':
        setLines([]);
        setInput('');
        return;

      default:
        newEntries.push({
          text: `Command not found: "${cmd}". Type "help" for a list of valid commands.`,
          type: 'error',
        });
    }

    setLines((prev) => [...prev, ...newEntries]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(input);
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
          <TerminalIcon size={12} /> bash — uday-os
        </span>
      </div>

      <div className="terminal-scroll-area">
        {lines.map((l, index) => (
          <div key={index} className={`terminal-line line-${l.type}`}>
            <pre>{l.text}</pre>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="terminal-prompt-bar">
        <span className="prompt-label">guest@uday-os:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="prompt-input"
          aria-label="Terminal command input"
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
