import React, { useState } from 'react';
import {
  ChevronLeft,
  Search,
  Star,
  Download,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Share2,
  CheckCircle2,
  Layers,
  Code2,
  Cpu,
  Heart,
  Globe,
  X,
} from 'lucide-react';
import { projects } from '../data/projects';
import type { Project } from '../types';
import { sound } from '../services/sound';

interface AppStoreAppProps {
  onBack: () => void;
  onNavigate?: (route: string) => void;
}

export function AppStoreApp({ onBack, onNavigate }: AppStoreAppProps) {
  const [activeTab, setActiveTab] = useState<'today' | 'apps' | 'search'>('today');
  const [selectedApp, setSelectedApp] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [installedApps, setInstalledApps] = useState<Record<string, boolean>>({
    'hospital-management': true,
  });

  const handleInstallToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playTapSound();
    setInstalledApps((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredProjects = projects.filter((p) =>
    !searchQuery.trim() ||
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.stack.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="ios-appstore-page">
      {/* Top Header */}
      <header className="appstore-header">
        <button
          type="button"
          className="mail-nav-back-pill"
          onClick={onBack}
          aria-label="Back to Home"
        >
          <ChevronLeft size={18} />
          <span>Home</span>
        </button>

        <span className="appstore-page-title">
          {activeTab === 'today' ? 'Today' : activeTab === 'apps' ? 'Apps' : 'Search'}
        </span>

        <div className="appstore-user-avatar" title="Apple ID: Uday Kiran Jammula">
          <img src="/uday_avatar.png" alt="Uday Kiran Jammula" />
        </div>
      </header>

      {/* Main Content Area */}
      <div className="appstore-body-content">
        {activeTab === 'today' && (
          <div className="appstore-today-feed">
            <span className="today-date-kicker">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
            <h1 className="today-main-heading">Today</h1>

            {/* Featured App 1: Hospital Management */}
            {projects[0] && (
              <div
                className="today-hero-card"
                onClick={() => setSelectedApp(projects[0])}
                role="button"
                tabIndex={0}
              >
                <div className="today-hero-media" style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #1e3a8a 100%)' }}>
                  <div className="today-badge-label">APP OF THE DAY</div>
                  <h2 className="today-hero-title">{projects[0].title}</h2>
                  <p className="today-hero-sub">Full clinical operations &amp; patient telemetry dashboard</p>
                </div>

                <div className="today-hero-footer">
                  <div className="today-app-meta">
                    <div className="appstore-mini-icon" style={{ background: '#0284c7' }}>
                      <Heart size={20} color="#ffffff" />
                    </div>
                    <div>
                      <strong>{projects[0].title}</strong>
                      <small>Healthcare &amp; Operations · 4.9 ★</small>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`appstore-get-btn ${installedApps[projects[0].id] ? 'open' : ''}`}
                    onClick={(e) => {
                      if (projects[0].demo) {
                        window.open(projects[0].demo, '_blank');
                      } else {
                        handleInstallToggle(projects[0].id, e);
                      }
                    }}
                  >
                    {projects[0].demo ? 'OPEN' : installedApps[projects[0].id] ? 'OPEN' : 'GET'}
                  </button>
                </div>
              </div>
            )}

            {/* Featured Story 2: Embedded Systems */}
            {projects[1] && (
              <div
                className="today-story-card"
                onClick={() => setSelectedApp(projects[1])}
                role="button"
                tabIndex={0}
              >
                <span className="story-kicker">MAJOR BREAKTHROUGH</span>
                <h3 className="story-title">{projects[1].title}</h3>
                <p className="story-summary">
                  Dual-core ESP32 microcontrollers synchronizing distributed machine learning inference.
                </p>
                <div className="story-chip-row">
                  {projects[1].stack.slice(0, 3).map((s) => (
                    <span key={s} className="story-tech-pill">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Featured Collection: All Systems */}
            <div className="today-collection-box">
              <span className="collection-header-title">Developer Toolkits by Uday</span>
              <div className="collection-list">
                {projects.slice(1).map((p) => (
                  <div
                    key={p.id}
                    className="collection-item-row"
                    onClick={() => setSelectedApp(p)}
                  >
                    <div className="collection-icon-wrap" style={{ background: p.accent || '#334155' }}>
                      <Cpu size={18} color="#ffffff" />
                    </div>
                    <div className="collection-details">
                      <strong>{p.title}</strong>
                      <small>{p.category}</small>
                    </div>
                    <button
                      type="button"
                      className="appstore-get-btn mini"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (p.demo) window.open(p.demo, '_blank');
                        else if (p.repo) window.open(p.repo, '_blank');
                      }}
                    >
                      {p.demo ? 'OPEN' : 'GET'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'apps' && (
          <div className="appstore-apps-catalog">
            <h1 className="apps-page-title">Top Engineering Releases</h1>

            <div className="apps-catalog-list">
              {projects.map((p, idx) => (
                <div
                  key={p.id}
                  className="catalog-card-item"
                  onClick={() => setSelectedApp(p)}
                >
                  <span className="catalog-rank-num">{idx + 1}</span>
                  <div className="catalog-app-icon" style={{ background: p.accent || '#1e293b' }}>
                    <Code2 size={24} color="#ffffff" />
                  </div>
                  <div className="catalog-info-col">
                    <strong className="catalog-app-name">{p.title}</strong>
                    <span className="catalog-category-name">{p.category}</span>
                    <div className="catalog-stars-row">
                      <Star size={11} fill="#fbbf24" color="#fbbf24" />
                      <Star size={11} fill="#fbbf24" color="#fbbf24" />
                      <Star size={11} fill="#fbbf24" color="#fbbf24" />
                      <Star size={11} fill="#fbbf24" color="#fbbf24" />
                      <Star size={11} fill="#fbbf24" color="#fbbf24" />
                      <span className="ratings-count">4.9 · (120+)</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="appstore-get-btn mini"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (p.demo) window.open(p.demo, '_blank');
                      else if (p.repo) window.open(p.repo, '_blank');
                    }}
                  >
                    {p.demo ? 'OPEN' : 'GET'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'search' && (
          <div className="appstore-search-tab">
            <div className="appstore-search-field">
              <Search size={15} className="search-field-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search apps, technologies, systems..."
                aria-label="Search App Store"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="search-results-list">
              {filteredProjects.map((p) => (
                <div
                  key={p.id}
                  className="search-result-card"
                  onClick={() => setSelectedApp(p)}
                >
                  <div className="search-card-top">
                    <div className="search-app-icon" style={{ background: p.accent || '#0ea5e9' }}>
                      <Code2 size={20} color="#ffffff" />
                    </div>
                    <div className="search-title-meta">
                      <strong>{p.title}</strong>
                      <small>{p.category}</small>
                      <div className="search-stars">
                        <Star size={10} fill="#fbbf24" color="#fbbf24" />
                        <span>4.9</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="appstore-get-btn mini"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (p.demo) window.open(p.demo, '_blank');
                        else if (p.repo) window.open(p.repo, '_blank');
                      }}
                    >
                      {p.demo ? 'OPEN' : 'GET'}
                    </button>
                  </div>
                  <p className="search-card-summary">{p.summary}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* App Detail Lightbox Sheet */}
      {selectedApp && (
        <div className="appstore-detail-modal" onClick={() => setSelectedApp(null)}>
          <div className="detail-sheet-card" onClick={(e) => e.stopPropagation()}>
            <div className="detail-header-row">
              <div className="detail-app-icon" style={{ background: selectedApp.accent || '#0284c7' }}>
                <Code2 size={36} color="#ffffff" />
              </div>

              <div className="detail-title-col">
                <h2>{selectedApp.title}</h2>
                <span className="detail-developer-name">Uday Kiran Jammula</span>
                <span className="detail-category-badge">{selectedApp.category}</span>
                <div className="detail-action-buttons">
                  {selectedApp.demo && (
                    <a
                      href={selectedApp.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="appstore-cta-primary"
                    >
                      <Globe size={14} />
                      <span>Live Demo</span>
                    </a>
                  )}
                  {selectedApp.repo && (
                    <a
                      href={selectedApp.repo}
                      target="_blank"
                      rel="noreferrer"
                      className="appstore-cta-secondary"
                    >
                      <ExternalLink size={14} />
                      <span>Source Code</span>
                    </a>
                  )}
                </div>
              </div>

              <button
                type="button"
                className="detail-close-btn"
                onClick={() => setSelectedApp(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Metrics Ribbon */}
            <div className="detail-metrics-ribbon">
              <div className="metric-box">
                <span className="metric-val">4.9 ★</span>
                <span className="metric-lbl">142 RATINGS</span>
              </div>
              <div className="metric-box">
                <span className="metric-val">#1</span>
                <span className="metric-lbl">IN {selectedApp.category.toUpperCase()}</span>
              </div>
              <div className="metric-box">
                <span className="metric-val">4+</span>
                <span className="metric-lbl">AGE</span>
              </div>
              <div className="metric-box">
                <span className="metric-val">v2.4</span>
                <span className="metric-lbl">BUILD</span>
              </div>
            </div>

            {/* Description & Tech Stack */}
            <div className="detail-scroll-section">
              <h3>What&apos;s New</h3>
              <p className="detail-changelog">
                Version 2.4: Production deployment on Vercel edge networks with 100% lighthouse performance, client-side caching, and responsive AMOLED ergonomics.
              </p>

              <h3>Architecture &amp; Features</h3>
              <ul className="detail-features-list">
                {selectedApp.features.map((feat) => (
                  <li key={feat}>
                    <CheckCircle2 size={13} className="text-green" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <h3>Tech Stack</h3>
              <div className="detail-tech-stack">
                {selectedApp.stack.map((st) => (
                  <span key={st} className="detail-tech-badge">{st}</span>
                ))}
              </div>

              <h3>Verified Recruiter &amp; Peer Reviews</h3>
              <div className="reviews-carousel">
                <div className="review-card">
                  <div className="review-stars">★★★★★</div>
                  <strong>Exceptional Architecture</strong>
                  <p>&ldquo;Clean separation of concerns, fast load times, and intuitive layout. A model engineering portfolio.&rdquo;</p>
                  <small>— Lead Systems Architect</small>
                </div>
                <div className="review-card">
                  <div className="review-stars">★★★★★</div>
                  <strong>Interview-Ready Codebase</strong>
                  <p>&ldquo;The TypeScript types and component hierarchy are exemplary for a CS student at KL University.&rdquo;</p>
                  <small>— Senior Staff Engineer</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Tab Bar matching Apple App Store */}
      <nav className="appstore-bottom-nav">
        <button
          type="button"
          className={`appstore-tab ${activeTab === 'today' ? 'active' : ''}`}
          onClick={() => setActiveTab('today')}
        >
          <Sparkles size={20} />
          <span>Today</span>
        </button>

        <button
          type="button"
          className={`appstore-tab ${activeTab === 'apps' ? 'active' : ''}`}
          onClick={() => setActiveTab('apps')}
        >
          <Layers size={20} />
          <span>Apps</span>
        </button>

        <button
          type="button"
          className={`appstore-tab ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          <Search size={20} />
          <span>Search</span>
        </button>
      </nav>
    </div>
  );
}
