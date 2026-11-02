import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  X,
  ChevronRight,
  Calculator,
  ArrowRightLeft,
  Sparkles,
  Zap,
  Copy,
  Check,
  FolderGit2,
  Code2,
  Camera,
  Mail,
  Palette,
  Flashlight,
  Music,
} from 'lucide-react';
import type { Project } from '../types';
import { projects } from '../data/projects';
import { mathEvaluator } from '../services/mathEvaluator';
import { spotlightIndex } from '../services/spotlightIndex';
import { sound } from '../services/sound';
import { haptics } from '../services/haptics';

interface SpotlightSearchProps {
  onBack: () => void;
  onNavigateApp: (route: string) => void;
  onNavigateProject: (p: Project) => void;
  onAction?: (action: string, payload?: string) => void;
}

interface SpotlightAppItem {
  id: string;
  label: string;
  icon: string;
  route: string;
}

const APPS: SpotlightAppItem[] = [
  { id: 'xcode', label: 'Xcode Cloud', icon: '💻', route: 'xcode' },
  { id: 'leetcode', label: 'LeetCode', icon: '/ios/leetcode.svg', route: 'leetcode' },
  { id: 'embedded-lab', label: 'Embedded Lab', icon: '⚡', route: 'embedded-lab' },
  { id: 'genmoji', label: 'Genmoji Studio', icon: '🎨', route: 'genmoji' },
  { id: 'fitness', label: 'Activity Rings', icon: '⭕', route: 'fitness' },
  { id: 'maps', label: 'Apple Maps 3D', icon: '🗺️', route: 'maps' },
  { id: 'calculator', label: 'Calculator', icon: '🧮', route: 'calculator' },
  { id: 'clock', label: 'Clock', icon: '⏱️', route: 'clock' },
  { id: 'weather', label: 'Weather', icon: '🌦️', route: 'weather' },
  { id: 'notes', label: 'Notes', icon: '/ios/notes.svg', route: 'notes' },
  { id: 'terminal', label: 'Terminal', icon: '/ios/source.svg', route: 'terminal' },
  { id: 'music', label: 'Music', icon: '🎵', route: 'music' },
  { id: 'camera', label: 'Camera', icon: '/ios/camera.svg', route: 'camera' },
  { id: 'messages', label: 'Messages', icon: '/ios/messages.svg', route: 'messages' },
  { id: 'photos', label: 'Photos', icon: '/ios/photos.png', route: 'photos' },
  { id: 'settings', label: 'Settings', icon: '/ios/settings.png', route: 'settings' },
  { id: 'contact', label: 'Mail', icon: '/ios/contact.png', route: 'contact' },
  { id: 'projects', label: 'App Store', icon: '/ios/projects.png', route: 'projects' },
];

export function SpotlightSearch({
  onBack,
  onNavigateApp,
  onNavigateProject,
  onAction,
}: SpotlightSearchProps) {
  const [query, setQuery] = useState('');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  // 1. Math evaluation (e.g. 128 * 64, sqrt(256), 2^16, 15% of 80)
  const mathResult = useMemo(() => {
    return mathEvaluator.evaluateMath(query);
  }, [query]);

  // 2. Unit & Currency conversions (e.g. 16 gb in mb, 100 ms in fps, salary 150k, 100 usd in inr)
  const conversionResult = useMemo(() => {
    return mathEvaluator.evaluateConversion(query);
  }, [query]);

  // 3. Action shortcut (e.g. take photo, hire, dark, orange, torch, music)
  const actionShortcut = useMemo(() => {
    return mathEvaluator.evaluateActionShortcuts(query);
  }, [query]);

  // 4. Universal deep index search results (projects, skills, apps)
  const searchResults = useMemo(() => {
    return spotlightIndex.search(query);
  }, [query]);

  const matchingApps = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return APPS.slice(0, 8);
    return APPS.filter(
      (app) => app.label.toLowerCase().includes(q) || app.id.toLowerCase().includes(q)
    );
  }, [query]);

  const matchingProjects = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.stack.some((tech) => tech.toLowerCase().includes(q))
    );
  }, [query]);

  const matchingSkills = useMemo(() => {
    return searchResults.filter((r) => r.type === 'skill');
  }, [searchResults]);

  const handleCopy = (text: string) => {
    haptics.tap();
    sound.playTapSound();
    try {
      navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
    } catch {
      // Ignored
    }
  };

  const handleExecuteAction = (actionId: string, route?: string, payload?: string) => {
    haptics.actionButton();
    sound.playActionClickSound();
    if (route) {
      onNavigateApp(route);
    } else if (payload && onAction) {
      onAction(actionId, payload);
    }
  };

  return (
    <div className="spotlight-overlay" role="dialog" aria-modal="true" aria-label="iOS Spotlight Search">
      <button
        type="button"
        className="spotlight-dismiss"
        aria-label="Close search"
        onClick={() => {
          haptics.tap();
          onBack();
        }}
      />

      <div className="spotlight-content">
        {/* Rounded Frosted Glass Search Input */}
        <div className="spotlight-input-shell">
          <label className="spotlight-input">
            <Search size={18} aria-hidden="true" />
            <input
              ref={inputRef}
              type="search"
              aria-label="Search apps, math, conversions and projects"
              placeholder="Search apps, math, conversions, code..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  haptics.tap();
                  setQuery('');
                  inputRef.current?.focus({ preventScroll: true });
                }}
              >
                <X size={16} />
              </button>
            )}
          </label>
          <span className="spotlight-glass-lip" aria-hidden="true" />
        </div>

        {/* Results Panel */}
        <div className="spotlight-results">
          {/* Feature 19: Natural Language Math Calculation Card */}
          {mathResult && (
            <div
              className="bg-zinc-900/90 border border-emerald-500/30 rounded-2xl p-3.5 mb-3 backdrop-blur-md cursor-pointer hover:border-emerald-500/60 active:scale-[0.98] transition-all"
              onClick={() => handleCopy(mathResult.result)}
              title="Click to copy result"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                  <Calculator size={14} />
                  <span>Calculator</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
                  {copiedText === mathResult.result ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Check size={12} /> Copied
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Copy size={12} /> 1-Click Copy
                    </span>
                  )}
                </div>
              </div>
              <div className="text-2xl font-bold font-mono text-white tracking-tight">
                {mathResult.result}
              </div>
              <div className="text-xs text-zinc-400 font-mono mt-0.5">
                = {mathResult.expression}
              </div>
            </div>
          )}

          {/* Feature 20: Tech Unit & Currency Converter Card */}
          {conversionResult && (
            <div
              className="bg-zinc-900/90 border border-sky-500/30 rounded-2xl p-3.5 mb-3 backdrop-blur-md cursor-pointer hover:border-sky-500/60 active:scale-[0.98] transition-all"
              onClick={() => handleCopy(conversionResult.result)}
              title="Click to copy conversion"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 text-xs text-sky-400 font-semibold">
                  <ArrowRightLeft size={14} />
                  <span>Unit Converter</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
                  {copiedText === conversionResult.result ? (
                    <span className="text-sky-400 flex items-center gap-1">
                      <Check size={12} /> Copied
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Copy size={12} /> 1-Click Copy
                    </span>
                  )}
                </div>
              </div>
              <div className="text-xl font-bold font-mono text-white tracking-tight">
                {conversionResult.result}
              </div>
              <div className="text-xs text-zinc-400 font-medium mt-0.5">
                {conversionResult.title}
              </div>
            </div>
          )}

          {/* Feature 21: Direct App Action Shortcuts */}
          {actionShortcut && (
            <div className="bg-zinc-900/90 border border-amber-500/30 rounded-2xl p-3 mb-3 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold mb-2">
                <Zap size={14} />
                <span>Quick Action</span>
              </div>
              <button
                type="button"
                className="w-full flex items-center justify-between bg-zinc-800/80 hover:bg-zinc-700/80 p-2.5 rounded-xl text-left transition-all active:scale-[0.98]"
                onClick={() =>
                  handleExecuteAction(
                    actionShortcut.id,
                    actionShortcut.route,
                    actionShortcut.actionPayload
                  )
                }
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    {actionShortcut.route === 'camera' && <Camera size={16} />}
                    {actionShortcut.route === 'contact' && <Mail size={16} />}
                    {actionShortcut.actionPayload?.includes('titanium') && <Palette size={16} />}
                    {actionShortcut.actionPayload === 'toggle-torch' && <Flashlight size={16} />}
                    {actionShortcut.route === 'music' && <Music size={16} />}
                  </div>
                  <div>
                    <strong className="text-sm font-semibold text-white block">
                      {actionShortcut.title}
                    </strong>
                    <small className="text-xs text-zinc-400 block">{actionShortcut.subtitle}</small>
                  </div>
                </div>
                <ChevronRight size={16} className="text-zinc-400" />
              </button>
            </div>
          )}

          {/* Apps Quad Grid */}
          <div className="spotlight-apps">
            {matchingApps.map((app) => (
              <button
                key={app.id}
                type="button"
                onClick={() => {
                  haptics.tap();
                  onNavigateApp(app.route);
                }}
              >
                <span className="text-2xl mb-1 block">{app.icon.startsWith('/') ? <img src={app.icon} alt={app.label} width={40} height={40} className="mx-auto" /> : app.icon}</span>
                <span>{app.label}</span>
              </button>
            ))}
          </div>

          {/* Project Results when typing */}
          {query.trim() && matchingProjects.length > 0 && (
            <section className="spotlight-project-results mt-3">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-semibold mb-2 px-1">
                <FolderGit2 size={13} className="text-indigo-400" />
                <span>Projects</span>
              </div>
              {matchingProjects.map((proj) => (
                <button
                  key={proj.id}
                  type="button"
                  className="spotlight-project-row"
                  onClick={() => {
                    haptics.tap();
                    onNavigateProject(proj);
                  }}
                >
                  <span>
                    <strong>{proj.title}</strong>
                    <small>{proj.summary}</small>
                  </span>
                  <ChevronRight size={16} />
                </button>
              ))}
            </section>
          )}

          {/* Skills Results when typing */}
          {query.trim() && matchingSkills.length > 0 && (
            <section className="spotlight-project-results mt-3">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-semibold mb-2 px-1">
                <Code2 size={13} className="text-emerald-400" />
                <span>Skills & Technologies</span>
              </div>
              {matchingSkills.slice(0, 5).map((skill) => (
                <button
                  key={skill.id}
                  type="button"
                  className="spotlight-project-row"
                  onClick={() => {
                    haptics.tap();
                    onNavigateApp('skills');
                  }}
                >
                  <span>
                    <strong>{skill.title}</strong>
                    <small>{skill.subtitle}</small>
                  </span>
                  <ChevronRight size={16} />
                </button>
              ))}
            </section>
          )}

          {query.trim() &&
            matchingProjects.length === 0 &&
            matchingSkills.length === 0 &&
            !mathResult &&
            !conversionResult &&
            !actionShortcut && (
              <p className="media-empty text-zinc-400 text-xs text-center py-4">
                No matching results. Try a calculation (e.g. 128 * 64), conversion (16 gb in mb), or skill.
              </p>
            )}
        </div>

        {/* Done Button to Dismiss */}
        <button
          type="button"
          className="spotlight-close"
          onClick={() => {
            haptics.tap();
            onBack();
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
}
