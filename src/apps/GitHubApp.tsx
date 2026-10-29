import React, { useState, useEffect, useMemo } from 'react';
import {
  Github,
  Star,
  GitFork,
  ExternalLink,
  RotateCw,
  Search,
  AlertTriangle,
  Code2,
  ChevronLeft,
  Globe,
  Sparkles,
  BookMarked,
  MapPin,
  Building,
  CheckCircle2,
  GitPullRequest,
  History,
} from 'lucide-react';
import type { GitHubRepo } from '../types';
import { fetchUserRepos, fallbackRepos } from '../services/github';
import { profile } from '../data/profile';
import { projects } from '../data/projects';

interface GitHubAppProps {
  onBack?: () => void;
  onOpenProjectDetail?: (projectId: string) => void;
}

export function GitHubApp({ onBack, onOpenProjectDetail }: GitHubAppProps) {
  const [repos, setRepos] = useState<GitHubRepo[]>(fallbackRepos);
  const [loading, setLoading] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedLang, setSelectedLang] = useState<string>('All');

  const loadData = async (force: boolean = false) => {
    setLoading(true);
    setStatusMessage(null);
    try {
      const res = await fetchUserRepos('Udaykiranjammula-alpha', force);
      if (res.repos && res.repos.length > 0) {
        setRepos(res.repos);
      }
      setRateLimited(Boolean(res.isRateLimited));
      if (res.error) {
        setStatusMessage(res.error);
      }
    } catch {
      setStatusMessage('Showing verified portfolio codebases.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData(false);
  }, []);

  const getLangColor = (lang?: string) => {
    switch (lang?.toLowerCase()) {
      case 'typescript':
        return '#3178c6';
      case 'c++':
      case 'c':
        return '#f34b7d';
      case 'python':
        return '#3572A5';
      case 'javascript':
        return '#f1e05a';
      default:
        return '#8b949e';
    }
  };

  const filteredRepos = useMemo(() => {
    return repos.filter((r) => {
      const matchSearch =
        !searchFilter.trim() ||
        r.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        (r.description && r.description.toLowerCase().includes(searchFilter.toLowerCase()));

      const matchLang =
        selectedLang === 'All' ||
        (r.language && r.language.toLowerCase() === selectedLang.toLowerCase());

      return matchSearch && matchLang;
    });
  }, [repos, searchFilter, selectedLang]);

  return (
    <div className="github-native-app">
      {/* iOS App Navigation Header */}
      <header className="github-top-nav">
        <button
          type="button"
          className="gh-nav-back-pill"
          onClick={onBack}
          aria-label="Back to Home Screen"
        >
          <ChevronLeft size={20} />
          <span>Home</span>
        </button>

        <span className="gh-nav-title">GitHub</span>

        <a
          href={profile.github}
          target="_blank"
          rel="noreferrer"
          className="gh-nav-external"
          aria-label="Open on GitHub.com"
          title="Open in GitHub"
        >
          <ExternalLink size={16} />
        </a>
      </header>

      {/* Scrollable Content Body */}
      <div className="github-scroll-body">
        {/* User Profile Hero */}
        <section className="gh-profile-card">
          <div className="gh-profile-header-row">
            <div className="gh-avatar-squircle">
              <Github size={36} />
            </div>

            <div className="gh-profile-titles">
              <div className="gh-name-badge-row">
                <h1 className="gh-display-name">{profile.name}</h1>
                <span className="gh-verified-tag" title="Verified GitHub Contributor">
                  <CheckCircle2 size={13} />
                </span>
              </div>
              <span className="gh-handle">Udaykiranjammula-alpha</span>
            </div>
          </div>

          <p className="gh-bio-text">
            Student @ KL University | Python, Data Structures, C
            <br />
            ⚡ Turning Ideas Into Impact through systems engineering.
          </p>

          <div className="gh-meta-tags-row">
            <span>
              <Building size={12} /> KL University
            </span>
            <span>
              <MapPin size={12} /> India
            </span>
            <a href={profile.github} target="_blank" rel="noreferrer">
              <ExternalLink size={11} /> github.com/Udaykiranjammula-alpha
            </a>
          </div>

          {/* Stats Bar */}
          <div className="gh-stats-ribbon">
            <div className="gh-stat-block">
              <strong>4</strong>
              <span>Repositories</span>
            </div>
            <div className="gh-stat-block">
              <strong>500+</strong>
              <span>Contributions</span>
            </div>
            <div className="gh-stat-block">
              <strong>14</strong>
              <span>Followers</span>
            </div>
            <div className="gh-stat-block">
              <strong>12</strong>
              <span>Following</span>
            </div>
          </div>

          {/* Direct CTA Action Button */}
          <div className="gh-action-row">
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="gh-cta-primary-btn"
            >
              <Github size={15} />
              <span>Open on GitHub.com</span>
              <ExternalLink size={13} />
            </a>

            <button
              type="button"
              className="gh-refresh-icon-btn"
              onClick={() => void loadData(true)}
              disabled={loading}
              aria-label="Refresh Repositories"
              title="Refresh repository cache"
            >
              <RotateCw size={14} className={loading ? 'spinning-icon' : ''} />
            </button>
          </div>
        </section>

        {/* Pinned Showcase of All Featured Systems */}
        <section className="gh-pinned-section">
          <div className="gh-section-header">
            <Sparkles size={14} className="text-cyan" />
            <h2>PINNED PROJECTS</h2>
          </div>

          <div className="gh-pinned-grid">
            {projects.map((proj) => (
              <div key={proj.id} className="gh-pinned-card">
                <div className="gh-card-top-line">
                  <div className="gh-repo-title-box">
                    <BookMarked size={14} className="gh-book-icon" />
                    <strong>{proj.title}</strong>
                  </div>
                  <span className="gh-public-pill">Public</span>
                </div>

                <p className="gh-repo-desc">{proj.summary}</p>

                {/* Tech Pills */}
                <div className="gh-card-tech-row">
                  {proj.stack.slice(0, 3).map((st) => (
                    <span key={st} className="gh-mini-pill">
                      {st}
                    </span>
                  ))}
                </div>

                {/* Footer Metrics & Actions */}
                <div className="gh-card-footer">
                  <div className="gh-lang-metric">
                    <span
                      className="gh-lang-dot"
                      style={{ background: getLangColor(proj.stack[0]) }}
                    />
                    <span>{proj.stack[0] || 'Mixed'}</span>
                  </div>

                  <div className="gh-card-actions">
                    {proj.demo && (
                      <a
                        href={proj.demo}
                        target="_blank"
                        rel="noreferrer"
                        className="gh-card-btn demo-btn"
                      >
                        <Globe size={11} />
                        <span>Live</span>
                      </a>
                    )}
                    {proj.repo && (
                      <a
                        href={proj.repo}
                        target="_blank"
                        rel="noreferrer"
                        className="gh-card-btn code-btn"
                      >
                        <Github size={11} />
                        <span>Code</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Repository Filter & Search */}
        <section className="gh-repos-section">
          <div className="gh-section-header">
            <Code2 size={14} className="text-cyan" />
            <h2>ALL REPOSITORIES</h2>
          </div>

          <div className="gh-search-filter-box">
            <div className="gh-search-input-wrap">
              <Search size={14} className="gh-search-icon" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Find a repository..."
                aria-label="Filter repositories"
              />
            </div>

            <div className="gh-lang-filter-strip" role="tablist">
              {['All', 'TypeScript', 'C++', 'Python'].map((lang) => (
                <button
                  key={lang}
                  type="button"
                  role="tab"
                  aria-selected={selectedLang === lang}
                  className={`gh-lang-btn ${selectedLang === lang ? 'active' : ''}`}
                  onClick={() => setSelectedLang(lang)}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Repo List */}
          <div className="gh-repos-list">
            {filteredRepos.map((repo) => (
              <a
                key={repo.name}
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="gh-repo-row"
              >
                <div className="gh-repo-row-header">
                  <strong className="gh-repo-name">{repo.name}</strong>
                  <span className="gh-public-tag">Public</span>
                </div>

                <p className="gh-repo-row-desc">{repo.description}</p>

                <div className="gh-repo-row-meta">
                  {repo.language && (
                    <span className="gh-lang-spec">
                      <span
                        className="gh-lang-dot"
                        style={{ background: getLangColor(repo.language) }}
                      />
                      <span>{repo.language}</span>
                    </span>
                  )}

                  <span className="gh-counter-spec">
                    <Star size={11} />
                    <span>{repo.stargazers_count}</span>
                  </span>

                  <span className="gh-counter-spec">
                    <GitFork size={11} />
                    <span>{repo.forks_count}</span>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
