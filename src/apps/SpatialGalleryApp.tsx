import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  Layers,
  Sparkles,
  Eye,
  Sliders,
  ExternalLink,
  Github,
  Compass,
} from 'lucide-react';
import { sound } from '../services/sound';
import { projects } from '../data/projects';
import type { Project } from '../types';

interface SpatialGalleryAppProps {
  onBack: () => void;
  onNavigate?: (route: string) => void;
  onSelectProject?: (p: Project) => void;
}

export function SpatialGalleryApp({
  onBack,
  onNavigate,
  onSelectProject,
}: SpatialGalleryAppProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [depthIntensity, setDepthIntensity] = useState(65); // 0 to 100%
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const stageRef = useRef<HTMLDivElement>(null);

  const activeProject = projects[selectedIdx] || projects[0];

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!stageRef.current) return;
      const rect = stageRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setTilt({
        x: Math.round(-y * 22),
        y: Math.round(x * 26),
      });
    };

    const stage = stageRef.current;
    if (stage) {
      stage.addEventListener('mousemove', handleMove);
      stage.addEventListener('mouseleave', () => setTilt({ x: 0, y: 0 }));
    }
    return () => {
      if (stage) {
        stage.removeEventListener('mousemove', handleMove);
      }
    };
  }, []);

  const separationFactor = depthIntensity / 100;

  return (
    <div className="spatial-gallery-page">
      {/* Top Header */}
      <div className="spatial-gallery-header">
        <button
          type="button"
          className="gallery-back-btn"
          onClick={onBack}
          aria-label="Back to Home"
        >
          <ChevronLeft size={20} />
          <span>Home</span>
        </button>

        <div className="gallery-title-box">
          <Eye size={15} className="text-cyan" />
          <span>VisionOS Spatial Hologram 3D</span>
        </div>

        <div className="gallery-badge-box">
          <span className="spatial-3d-pill">Stereoscopic</span>
        </div>
      </div>

      {/* Main 3D Stereoscopic Parallax Stage */}
      <div className="spatial-stage-wrapper" ref={stageRef}>
        <div
          className="spatial-perspective-box"
          style={{
            transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          }}
        >
          {/* Layer 4: Deep Ambient Hologram Horizon */}
          <div
            className="spatial-hologram-layer layer-deep"
            style={{
              transform: `translateZ(${-60 * separationFactor}px) scale(${1 - 0.05 * separationFactor})`,
              background: `radial-gradient(circle at center, ${activeProject.accent}33 0%, rgba(0, 0, 0, 0.95) 80%)`,
            }}
          />

          {/* Layer 3: Background Code Matrix & Traces */}
          <div
            className="spatial-hologram-layer layer-code"
            style={{
              transform: `translateZ(${-25 * separationFactor}px)`,
            }}
          >
            <div className="code-matrix-lines">
              <span className="code-line">import &#123; createEngine &#125; from '@uday/kernel';</span>
              <span className="code-line">const pipeline = new SpatialPipeline(&#123;</span>
              <span className="code-line">&nbsp;&nbsp;architecture: '{activeProject.category}',</span>
              <span className="code-line">&nbsp;&nbsp;status: '{activeProject.status}',</span>
              <span className="code-line">&nbsp;&nbsp;throughput: 'Zero Latency WebGL'</span>
              <span className="code-line">&#125;);</span>
            </div>
          </div>

          {/* Layer 2: Main Subject Architecture Card */}
          <div
            className="spatial-hologram-layer layer-subject"
            style={{
              transform: `translateZ(${15 * separationFactor}px)`,
              borderColor: `${activeProject.accent}66`,
            }}
          >
            <div className="subject-card-inner">
              <div className="subject-top-row">
                <span className="subject-category">{activeProject.category}</span>
                <span className="subject-status" style={{ color: activeProject.accent }}>
                  {activeProject.status}
                </span>
              </div>
              <h3 className="subject-title">{activeProject.title}</h3>
              <p className="subject-summary">{activeProject.summary}</p>

              <div className="subject-tech-chips">
                {activeProject.stack.slice(0, 4).map((tech) => (
                  <span key={tech} className="tech-chip">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Layer 1: Foreground Glass Badges & Interactive Buttons */}
          <div
            className="spatial-hologram-layer layer-foreground"
            style={{
              transform: `translateZ(${55 * separationFactor}px)`,
            }}
          >
            <div className="foreground-floating-bar">
              <span className="fg-hologram-chip">
                <Sparkles size={11} />
                <span>3D Parallax Active</span>
              </span>

              <a
                href={activeProject.repo}
                target="_blank"
                rel="noreferrer"
                className="fg-action-link"
                onClick={(e) => e.stopPropagation()}
              >
                <Github size={12} />
                <span>Source</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Spatial Depth Separation Slider */}
      <div className="spatial-depth-controls">
        <div className="slider-label-row">
          <span className="slider-label">
            <Layers size={13} />
            <span>3D Spatial Separation Depth</span>
          </span>
          <span className="slider-val">{depthIntensity}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={depthIntensity}
          onChange={(e) => {
            sound.playTapSound();
            setDepthIntensity(parseInt(e.target.value, 10));
          }}
          className="spatial-depth-slider"
          aria-label="3D Depth Separation Slider"
        />
        <small className="slider-hint">
          Move your cursor over the project card to rotate stereoscopic 3D parallax planes in real time.
        </small>
      </div>

      {/* Project Selector Carousel */}
      <div className="spatial-projects-carousel">
        <span className="carousel-label">Select Hologram Project</span>
        <div className="carousel-chips-strip">
          {projects.map((proj, idx) => (
            <button
              key={proj.id}
              type="button"
              className={`carousel-chip ${selectedIdx === idx ? 'active' : ''}`}
              onClick={() => {
                sound.playTapSound();
                setSelectedIdx(idx);
              }}
            >
              <span className="chip-bullet" style={{ background: proj.accent }} />
              <span className="chip-text">{proj.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
