import React, { useState, useMemo } from 'react';
import { ChevronLeft, Layers, Globe, Search, ArrowUpRight, Github, ExternalLink, Activity, Cpu, Radio, Sparkles } from 'lucide-react';
import type { Project } from '../types';
import { projects } from '../data/projects';
import { profile } from '../data/profile';

interface IosProjectsAppProps {
  onBack: () => void;
  onOpenProject: (project: Project) => void;
}

export function IosProjectsApp({ onBack, onOpenProject }: IosProjectsAppProps) {
  const [activeTab, setActiveTab] = useState<'Apps' | 'Web' | 'Search'>('Apps');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Systems', 'Web', 'AI'];

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchCat =
        selectedCategory === 'All' ||
        (selectedCategory === 'Systems' && (p.category === 'Embedded Systems' || p.category.includes('Systems'))) ||
        (selectedCategory === 'Web' && p.category === 'Web Development') ||
        (selectedCategory === 'AI' && (p.category.includes('AI') || p.id.includes('ai') || p.id.includes('ml')));

      const matchSearch =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.summary.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const featured = projects[0]; // Hospital Management System

  return (
    <div className="store-page">
      {/* Top Bar matching prsd.dev App Store */}
      <header className="personal-nav">
        <button
          type="button"
          className="mail-nav-back-pill"
          onClick={onBack}
          aria-label="Back to Home Screen"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="toolkit-nav-right-label">App Store</span>
      </header>

      {/* Main Apps Title Row */}
      <div className="store-heading">
        <h1>Apps</h1>
        <button
          type="button"
          className="store-heading-avatar-btn"
          aria-label="User Account"
          onClick={onBack}
        >
          <img src="/uday_avatar.png" alt={profile.name} />
        </button>
      </div>

      {/* Category Pills Strip */}
      <div className="store-categories" role="tablist">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-pressed={selectedCategory === cat}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Hero Featured Card (Exact prsd.dev style) */}
      {selectedCategory === 'All' && !searchQuery && (
        <button
          type="button"
          className="store-feature"
          onClick={() => onOpenProject(featured)}
          aria-label={`Explore ${featured.title}`}
        >
          <small>BUILT FOR IMPACT</small>
          <strong>{featured.title}</strong>
          <span>Supervise clinical triage & patient telemetry</span>

          {/* Device Mockup Graphic */}
          <div className="store-feature-device-art">
            <div className="store-mockup-screen">
              <span className="mockup-header-tag">HMS CLOUD</span>
              <div className="mockup-bars">
                <span className="bar bar-1" />
                <span className="bar bar-2" />
                <span className="bar bar-3" />
              </div>
              <p className="mockup-status-text">Live on Vercel</p>
            </div>
          </div>

          {/* Bottom Banner inside Card */}
          <div className="store-feature-bottom-bar">
            <div className="store-artwork store-art-1">
              <Activity size={20} className="text-cyan" />
            </div>
            <span>
              Explore the app
              <small>By {profile.name}</small>
            </span>
            <b>VIEW</b>
          </div>
        </button>
      )}

      {/* Section List: Made for your phone */}
      <section className="store-list">
        <h2>{activeTab === 'Apps' ? 'Made for your phone' : activeTab === 'Web' ? 'Built for the web' : 'Search Results'}</h2>

        {filteredProjects.map((project, idx) => (
          <div key={project.id} className="store-row">
            <button
              type="button"
              className="store-row-info"
              onClick={() => onOpenProject(project)}
            >
              <div className={`store-artwork store-art-${(idx % 4) + 1}`}>
                {idx === 0 ? (
                  <Activity size={22} />
                ) : idx === 1 ? (
                  <Cpu size={22} />
                ) : idx === 2 ? (
                  <Radio size={22} />
                ) : (
                  <Sparkles size={22} />
                )}
              </div>
              <span>
                <strong>{project.title}</strong>
                <small>{project.summary}</small>
              </span>
            </button>
            <button
              type="button"
              className="store-pill"
              onClick={() => onOpenProject(project)}
              aria-label={`View ${project.title}`}
            >
              VIEW
            </button>
          </div>
        ))}
      </section>

      {/* Floating Bottom Media Tabs Navigation Capsule */}
      <nav className="media-tabs" aria-label="App Store navigation">
        <button
          type="button"
          aria-pressed={activeTab === 'Apps'}
          onClick={() => {
            setActiveTab('Apps');
            setSelectedCategory('All');
            setSearchQuery('');
          }}
        >
          <Layers size={16} />
          Apps
        </button>
        <button
          type="button"
          aria-pressed={activeTab === 'Web'}
          onClick={() => {
            setActiveTab('Web');
            setSelectedCategory('Web');
            setSearchQuery('');
          }}
        >
          <Globe size={16} />
          Web
        </button>
        <button
          type="button"
          aria-pressed={activeTab === 'Search'}
          onClick={() => {
            setActiveTab('Search');
            setSelectedCategory('All');
          }}
        >
          <Search size={16} />
          Search
        </button>
      </nav>
    </div>
  );
}
