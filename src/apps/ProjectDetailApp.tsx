import React, { useState } from 'react';
import {
  ChevronLeft,
  Share2,
  ExternalLink,
  Github,
  Play,
  CheckCircle2,
  Cpu,
  Layers,
  AlertCircle,
  BarChart3,
  FileCode2,
  Star,
  Activity,
  Radio,
  Sparkles,
} from 'lucide-react';
import type { Project } from '../types';
import { profile } from '../data/profile';

interface ProjectDetailAppProps {
  project: Project;
  onBack: () => void;
  onOpenDemo: (project: Project) => void;
}

export function ProjectDetailApp({ project, onBack, onOpenDemo }: ProjectDetailAppProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture' | 'code'>('overview');

  const getProjectIcon = () => {
    if (project.category.includes('Embedded') || project.id.includes('esp')) {
      return <Cpu size={32} />;
    }
    if (project.category.includes('AI') || project.id.includes('ai')) {
      return <Sparkles size={32} />;
    }
    if (project.id.includes('wifi') || project.id.includes('signal')) {
      return <Radio size={32} />;
    }
    return <Activity size={32} />;
  };

  const getCategoryShort = () => {
    if (project.category.includes('Embedded')) return 'Systems';
    if (project.category.includes('AI')) return 'AI/ML';
    if (project.category.includes('Web')) return 'Web App';
    return 'Tools';
  };

  return (
    <div className="store-page store-detail">
      {/* iOS App Store Navigation Bar */}
      <header className="personal-nav">
        <button
          type="button"
          className="mail-nav-back-pill"
          onClick={onBack}
          aria-label="Back to Apps"
        >
          <ChevronLeft size={18} />
          <span>Apps</span>
        </button>
        <span className="toolkit-nav-right-label">App Store</span>
      </header>

      {/* Main Product Hero Row */}
      <section className="store-product">
        <div
          className="store-product-icon-box"
          style={{
            background: `linear-gradient(135deg, ${project.accent}33, ${project.accent})`,
            borderColor: `${project.accent}55`,
          }}
        >
          {getProjectIcon()}
        </div>

        <div className="store-product-meta">
          <h1 className="store-product-title">{project.title}</h1>
          <p className="store-product-subtitle">{project.summary}</p>
          <span className="store-product-author">By {profile.name}</span>

          <div className="store-product-actions">
            {project.demo ? (
              <button
                type="button"
                className="store-get-btn"
                onClick={() => onOpenDemo(project)}
                aria-label={`Open interactive demo of ${project.title}`}
              >
                <Play size={12} fill="currentColor" />
                <span>OPEN DEMO</span>
              </button>
            ) : (
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                className="store-get-btn"
                aria-label={`View code for ${project.title}`}
              >
                <span>VISIT REPO</span>
              </a>
            )}

            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer"
              className="store-source-pill"
              aria-label={`Source repository for ${project.title}`}
            >
              <Github size={13} />
              <span>SOURCE</span>
            </a>
          </div>
        </div>
      </section>

      {/* 4-Item Metric Facts Strip */}
      <section className="store-facts" aria-label="Project metrics">
        <div className="store-fact-item">
          <small>RATING</small>
          <strong>4.9 ★</strong>
          <span>9 Ratings</span>
        </div>
        <div className="store-fact-item">
          <small>CATEGORY</small>
          <strong>{getCategoryShort()}</strong>
          <span>#1 Featured</span>
        </div>
        <div className="store-fact-item">
          <small>PLATFORM</small>
          <strong>Universal</strong>
          <span>Web & Edge</span>
        </div>
        <div className="store-fact-item">
          <small>DEVELOPER</small>
          <strong>Uday</strong>
          <span>Verified ✓</span>
        </div>
      </section>

      {/* Interactive Architecture & Telemetry Visual Card */}
      <section className="store-preview-media">
        <div className="store-preview-header">
          <span>PREVIEW & TELEMETRY</span>
          <div className="store-preview-tabs">
            <button
              type="button"
              className={`preview-tab-pill ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              type="button"
              className={`preview-tab-pill ${activeTab === 'architecture' ? 'active' : ''}`}
              onClick={() => setActiveTab('architecture')}
            >
              Pipeline
            </button>
            <button
              type="button"
              className={`preview-tab-pill ${activeTab === 'code' ? 'active' : ''}`}
              onClick={() => setActiveTab('code')}
            >
              Stack
            </button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="store-preview-content">
            <div className="preview-stat-card">
              <span className="preview-stat-tag">ENGINEERED SOLUTION</span>
              <p className="preview-stat-text">{project.solution}</p>
            </div>
            <div className="preview-features-box">
              <span className="preview-subtitle">Core Capabilities:</span>
              <ul className="preview-features-list">
                {project.features.slice(0, 3).map((f) => (
                  <li key={f}>
                    <CheckCircle2 size={13} className="text-cyan" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'architecture' && (
          <div className="store-preview-content">
            <div className="preview-pipeline-flow">
              {project.architecture.map((item, idx) => (
                <div key={item.step} className="pipeline-step-item">
                  <div className="pipeline-step-num">0{idx + 1}</div>
                  <div className="pipeline-step-info">
                    <strong>{item.step}</strong>
                    <p>{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="store-preview-content">
            <div className="preview-stack-grid">
              {project.stack.map((tech) => (
                <span key={tech} className="preview-tech-chip">
                  {tech}
                </span>
              ))}
            </div>
            <div className="preview-challenges-box">
              <span className="preview-subtitle">Technical Challenges Solved:</span>
              <p className="preview-challenges-text">{project.challenges}</p>
            </div>
          </div>
        )}
      </section>

      {/* Description Section */}
      <section className="store-description">
        <h2>About This Project</h2>
        <div className="description-problem-box">
          <div className="problem-label">
            <AlertCircle size={14} className="text-amber" />
            <strong>The Problem</strong>
          </div>
          <p>{project.problem}</p>
        </div>

        <div className="description-features-group">
          <h3>Full Specifications</h3>
          <ul className="description-bullet-list">
            {project.features.map((feature) => (
              <li key={feature}>
                <CheckCircle2 size={13} className="text-cyan" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* App Information Grouped List */}
      <section className="store-information">
        <h2>Information</h2>
        <div className="info-row">
          <span>Provider</span>
          <strong>{profile.name}</strong>
        </div>
        <div className="info-row">
          <span>Category</span>
          <strong>{project.category}</strong>
        </div>
        <div className="info-row">
          <span>Status</span>
          <strong className="status-badge-inline">{project.status}</strong>
        </div>
        <div className="info-row">
          <span>Compatibility</span>
          <strong>Universal (Web & Mobile)</strong>
        </div>
        <div className="info-row">
          <span>Languages</span>
          <strong>TypeScript, C++, Python</strong>
        </div>
        <div className="info-row">
          <span>License</span>
          <strong>MIT Open Source</strong>
        </div>
      </section>

      {/* Bottom Action Footer */}
      <div className="store-detail-bottom-dock">
        {project.demo && (
          <button
            type="button"
            className="store-dock-primary-btn"
            onClick={() => onOpenDemo(project)}
          >
            <Play size={14} fill="currentColor" />
            <span>Launch Live Demo</span>
          </button>
        )}
        <a
          href={project.repo}
          target="_blank"
          rel="noreferrer"
          className="store-dock-secondary-btn"
        >
          <Github size={14} />
          <span>View Source on GitHub</span>
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}
