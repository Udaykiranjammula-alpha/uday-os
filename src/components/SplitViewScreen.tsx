import React, { useState, useRef } from 'react';
import {
  X,
  Minimize2,
  Maximize2,
  Columns,
  Terminal as TerminalIcon,
  FolderGit2,
  Video,
  Music,
  Code2,
  Sparkles,
  ChevronLeft,
} from 'lucide-react';
import { sound } from '../services/sound';
import { TerminalApp } from '../apps/TerminalApp';
import { ProjectsApp } from '../apps/ProjectsApp';
import { FaceTimeApp } from '../apps/FaceTimeApp';
import { MusicApp } from '../apps/MusicApp';
import { NotesApp } from '../apps/NotesApp';
import type { Project } from '../types';

interface SplitViewScreenProps {
  onClose: () => void;
  onNavigate: (route: string) => void;
  activeProject?: Project | null;
  setActiveProject?: (p: Project | null) => void;
}

type TopAppChoice = 'terminal' | 'notes';
type BottomAppChoice = 'projects' | 'facetime' | 'music';

export function SplitViewScreen({
  onClose,
  onNavigate,
  activeProject,
  setActiveProject,
}: SplitViewScreenProps) {
  const [topApp, setTopApp] = useState<TopAppChoice>('terminal');
  const [bottomApp, setBottomApp] = useState<BottomAppChoice>('projects');
  const [splitRatio, setSplitRatio] = useState(50); // percentage (30 to 70)
  const isDraggingRef = useRef(false);

  const handleStartDrag = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    sound.playTapSound();

    const handleMove = (clientY: number) => {
      const container = document.getElementById('split-view-container');
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const relativeY = clientY - rect.top;
      const percentage = Math.round((relativeY / rect.height) * 100);
      const clamped = Math.max(25, Math.min(75, percentage));
      setSplitRatio(clamped);
    };

    const onMouseMove = (ev: MouseEvent) => {
      if (isDraggingRef.current) handleMove(ev.clientY);
    };
    const onTouchMove = (ev: TouchEvent) => {
      if (isDraggingRef.current && ev.touches[0]) handleMove(ev.touches[0].clientY);
    };

    const onEnd = () => {
      isDraggingRef.current = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onEnd);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onEnd);
  };

  const handleResetSplit = () => {
    sound.playTapSound();
    setSplitRatio(50);
  };

  return (
    <div className="split-view-page" id="split-view-container">
      {/* Top Controls Header */}
      <div className="split-top-bar">
        <button
          type="button"
          className="split-back-btn"
          onClick={onClose}
          aria-label="Exit Split View"
        >
          <ChevronLeft size={18} />
          <span>Exit Multitasking</span>
        </button>

        <div className="split-title-pill">
          <Columns size={13} className="text-cyan" />
          <span>Stage Manager Split View</span>
        </div>

        <div className="split-actions-right">
          <button
            type="button"
            className="split-pill-btn"
            onClick={handleResetSplit}
            title="Reset to 50/50 balance"
          >
            <span>50:50</span>
          </button>
        </div>
      </div>

      {/* Main Split Body */}
      <div className="split-panes-wrapper">
        {/* Top Pane */}
        <div
          className="split-pane top-pane"
          style={{ height: `${splitRatio}%` }}
        >
          <div className="pane-app-selector">
            <span className="pane-label">Top Window:</span>
            <button
              type="button"
              className={`pane-chip ${topApp === 'terminal' ? 'active' : ''}`}
              onClick={() => {
                sound.playTapSound();
                setTopApp('terminal');
              }}
            >
              <TerminalIcon size={12} />
              <span>Terminal</span>
            </button>
            <button
              type="button"
              className={`pane-chip ${topApp === 'notes' ? 'active' : ''}`}
              onClick={() => {
                sound.playTapSound();
                setTopApp('notes');
              }}
            >
              <span>Notes</span>
            </button>
          </div>

          <div className="pane-content-frame">
            {topApp === 'terminal' ? (
              <TerminalApp onBack={onClose} />
            ) : (
              <NotesApp onBack={onClose} />
            )}
          </div>
        </div>

        {/* Draggable Divider Bar */}
        <div
          className="split-draggable-divider"
          onMouseDown={handleStartDrag}
          onTouchStart={handleStartDrag}
          onDoubleClick={handleResetSplit}
          title="Drag up or down to resize · Double-click to reset 50/50"
        >
          <div className="divider-glow-line" />
          <div className="divider-grip-pill">
            <span className="grip-dot" />
            <span className="grip-dot" />
            <span className="grip-dot" />
          </div>
        </div>

        {/* Bottom Pane */}
        <div
          className="split-pane bottom-pane"
          style={{ height: `${100 - splitRatio}%` }}
        >
          <div className="pane-app-selector">
            <span className="pane-label">Bottom Window:</span>
            <button
              type="button"
              className={`pane-chip ${bottomApp === 'projects' ? 'active' : ''}`}
              onClick={() => {
                sound.playTapSound();
                setBottomApp('projects');
              }}
            >
              <FolderGit2 size={12} />
              <span>Projects</span>
            </button>
            <button
              type="button"
              className={`pane-chip ${bottomApp === 'facetime' ? 'active' : ''}`}
              onClick={() => {
                sound.playTapSound();
                setBottomApp('facetime');
              }}
            >
              <Video size={12} />
              <span>FaceTime</span>
            </button>
            <button
              type="button"
              className={`pane-chip ${bottomApp === 'music' ? 'active' : ''}`}
              onClick={() => {
                sound.playTapSound();
                setBottomApp('music');
              }}
            >
              <Music size={12} />
              <span>Music</span>
            </button>
          </div>

          <div className="pane-content-frame">
            {bottomApp === 'projects' ? (
              <ProjectsApp
                onOpenProject={(p: Project) => setActiveProject && setActiveProject(p)}
              />
            ) : bottomApp === 'facetime' ? (
              <FaceTimeApp onBack={onClose} onNavigate={onNavigate} />
            ) : (
              <MusicApp onBack={onClose} onNavigate={onNavigate} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
