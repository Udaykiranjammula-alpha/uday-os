import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X, ChevronRight } from 'lucide-react';
import type { Project } from '../types';
import { projects } from '../data/projects';

interface SpotlightSearchProps {
  onBack: () => void;
  onNavigateApp: (route: string) => void;
  onNavigateProject: (p: Project) => void;
}

interface SpotlightAppItem {
  id: string;
  label: string;
  icon: string;
  route: string;
}

const APPS: SpotlightAppItem[] = [
  { id: 'facetime', label: 'FaceTime', icon: '📹', route: 'facetime' },
  { id: 'fitness', label: 'Activity Rings', icon: '⭕', route: 'fitness' },
  { id: 'calculator', label: 'Calculator', icon: '🧮', route: 'calculator' },
  { id: 'weather', label: 'Weather', icon: '🌦️', route: 'weather' },
  { id: 'wallet', label: 'Wallet', icon: '💳', route: 'wallet' },
  { id: 'github', label: 'GitHub', icon: '/ios/github.svg', route: 'github' },
  { id: 'projects', label: 'App Store', icon: '/ios/projects.png', route: 'projects' },
  { id: 'messages', label: 'Messages', icon: '/ios/messages.svg', route: 'messages' },
  { id: 'camera', label: 'Camera', icon: '/ios/camera.svg', route: 'camera' },
  { id: 'leetcode', label: 'LeetCode', icon: '/ios/leetcode.svg', route: 'leetcode' },
  { id: 'arcade', label: 'Arcade', icon: '🕹️', route: 'arcade' },
  { id: 'clock', label: 'Clock', icon: '⏱️', route: 'clock' },
  { id: 'music', label: 'Music', icon: '🎵', route: 'music' },
  { id: 'ai', label: 'Uday AI', icon: '/ios/ai.svg', route: 'ai' },
  { id: 'experience', label: 'Experience', icon: '/ios/experience.svg', route: 'experience' },
  { id: 'skills', label: 'Toolkit', icon: '/ios/skills.svg', route: 'skills' },
  { id: 'linkedin', label: 'LinkedIn', icon: '/ios/linkedin.svg', route: 'linkedin' },
  { id: 'photos', label: 'Photos', icon: '/ios/photos.png', route: 'photos' },
  { id: 'instagram', label: 'Instagram', icon: '/ios/instagram.svg', route: 'instagram' },
  { id: 'notes', label: 'Notes', icon: '/ios/notes.svg', route: 'notes' },
  { id: 'settings', label: 'Settings', icon: '/ios/settings.png', route: 'settings' },
  { id: 'contact', label: 'Mail', icon: '/ios/contact.png', route: 'contact' },
  { id: 'resume', label: 'Files', icon: '/ios/resume.png', route: 'resume' },
  { id: 'terminal', label: 'Terminal', icon: '/ios/source.svg', route: 'terminal' },
  { id: 'safari', label: 'Safari', icon: '/ios/safari.svg', route: 'projects' },
];

export function SpotlightSearch({ onBack, onNavigateApp, onNavigateProject }: SpotlightSearchProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  const matchingApps = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return APPS.slice(0, 8);
    return APPS.filter((app) => app.label.toLowerCase().includes(q) || app.id.toLowerCase().includes(q));
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

  return (
    <div className="spotlight-overlay" role="dialog" aria-modal="true" aria-label="iOS Spotlight Search">
      <button
        type="button"
        className="spotlight-dismiss"
        aria-label="Close search"
        onClick={onBack}
      />

      <div className="spotlight-content">
        {/* Rounded Frosted Glass Search Input */}
        <div className="spotlight-input-shell">
          <label className="spotlight-input">
            <Search size={18} aria-hidden="true" />
            <input
              ref={inputRef}
              type="search"
              aria-label="Search apps and projects"
              placeholder="Search apps or projects"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => {
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
          {/* Apps Quad Grid */}
          <div className="spotlight-apps">
            {matchingApps.map((app) => (
              <button
                key={app.id}
                type="button"
                onClick={() => {
                  onNavigateApp(app.route);
                }}
              >
                <img src={app.icon} alt={app.label} width={48} height={48} />
                <span>{app.label}</span>
              </button>
            ))}
          </div>

          {/* Project Results when typing */}
          {query.trim() && (
            <section className="spotlight-project-results">
              <h2>Projects</h2>
              {matchingProjects.map((proj) => (
                <button
                  key={proj.id}
                  type="button"
                  className="spotlight-project-row"
                  onClick={() => {
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

              {matchingProjects.length === 0 && (
                <p className="media-empty">No matching projects. Try a name, stack or technology.</p>
              )}
            </section>
          )}
        </div>

        {/* Done Button to Dismiss */}
        <button type="button" className="spotlight-close" onClick={onBack}>
          Done
        </button>
      </div>
    </div>
  );
}
