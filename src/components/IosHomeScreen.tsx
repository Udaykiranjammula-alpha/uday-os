import React from 'react';
import { GitHubWidget } from './GitHubWidget';
import { CalWidget } from './CalWidget';
import { Search } from 'lucide-react';

interface IosHomeScreenProps {
  onNavigate: (route: string) => void;
  onOpenSearch: () => void;
}

export function IosHomeScreen({ onNavigate, onOpenSearch }: IosHomeScreenProps) {
  return (
    <div className="ios-homescreen-view">
      {/* Top Wide GitHub Heatmap Widget (Clicking opens GitHub & showcases all projects) */}
      <section className="widget-row-top">
        <GitHubWidget onClick={() => onNavigate('github')} />
      </section>

      {/* Middle Row: Cal.com 15-min call + 2x2 App Icons */}
      <section className="widget-grid-middle">
        <CalWidget onClick={() => onNavigate('contact')} />

        <div className="apps-quad-grid">
          {/* Experience App */}
          <button
            type="button"
            className="ios-home-icon-btn"
            onClick={() => onNavigate('experience')}
            aria-label="Experience application"
          >
            <div className="ios-icon-box">
              <img src="/ios/experience.svg" alt="Experience" width={52} height={52} />
              <span className="app-red-badge">WORK</span>
            </div>
            <span className="ios-icon-title">Experience</span>
          </button>

          {/* Toolkit / Skills App */}
          <button
            type="button"
            className="ios-home-icon-btn"
            onClick={() => onNavigate('skills')}
            aria-label="Toolkit application"
          >
            <div className="ios-icon-box">
              <img src="/ios/skills.svg" alt="Toolkit" width={52} height={52} />
            </div>
            <span className="ios-icon-title">Toolkit</span>
          </button>

          {/* Safari / Projects Browser App */}
          <button
            type="button"
            className="ios-home-icon-btn"
            onClick={() => onNavigate('projects')}
            aria-label="Safari application"
          >
            <div className="ios-icon-box">
              <img src="/ios/safari.svg" alt="Safari" width={52} height={52} />
            </div>
            <span className="ios-icon-title">Safari</span>
          </button>

          {/* LinkedIn App */}
          <button
            type="button"
            className="ios-home-icon-btn"
            onClick={() => onNavigate('linkedin')}
            aria-label="LinkedIn application"
          >
            <div className="ios-icon-box">
              <img src="/ios/linkedin.svg" alt="LinkedIn" width={52} height={52} />
            </div>
            <span className="ios-icon-title">LinkedIn</span>
          </button>
        </div>
      </section>

      {/* Third Row: 4 Icons */}
      <section className="apps-single-row">
        {/* GitHub */}
        <button
          type="button"
          className="ios-home-icon-btn"
          onClick={() => onNavigate('github')}
          aria-label="GitHub application"
        >
          <div className="ios-icon-box">
            <img src="/ios/github.svg" alt="GitHub" width={52} height={52} />
          </div>
          <span className="ios-icon-title">GitHub</span>
        </button>

        {/* Instagram */}
        <button
          type="button"
          className="ios-home-icon-btn"
          onClick={() => onNavigate('instagram')}
          aria-label="Instagram application"
        >
          <div className="ios-icon-box">
            <img src="/ios/instagram.svg" alt="Instagram" width={52} height={52} />
          </div>
          <span className="ios-icon-title">Instagram</span>
        </button>

        {/* Notes */}
        <button
          type="button"
          className="ios-home-icon-btn"
          onClick={() => onNavigate('notes')}
          aria-label="Notes application"
        >
          <div className="ios-icon-box">
            <img src="/ios/notes.svg" alt="Notes" width={52} height={52} />
          </div>
          <span className="ios-icon-title">Notes</span>
        </button>

        {/* Settings */}
        <button
          type="button"
          className="ios-home-icon-btn"
          onClick={() => onNavigate('settings')}
          aria-label="Settings application"
        >
          <div className="ios-icon-box">
            <img src="/ios/settings.png" alt="Settings" width={52} height={52} />
          </div>
          <span className="ios-icon-title">Settings</span>
        </button>
      </section>

      {/* Search Pill */}
      <div className="ios-search-pill-container">
        <button
          type="button"
          className="ios-search-capsule"
          onClick={onOpenSearch}
          aria-label="Search apps and projects"
        >
          <Search size={12} className="search-pill-icon" />
          <span>Search</span>
        </button>
      </div>

      {/* Floating Glass Dock with 4 Core Developer Apps */}
      <div className="ios-dock-container">
        <div className="ios-dock-glass-bar">
          <button
            type="button"
            className="dock-item-btn"
            onClick={() => onNavigate('projects')}
            aria-label="Projects application"
          >
            <img src="/ios/projects.png" alt="Projects" width={52} height={52} />
          </button>

          <button
            type="button"
            className="dock-item-btn"
            onClick={() => onNavigate('github')}
            aria-label="GitHub application"
          >
            <img src="/ios/github.svg" alt="GitHub" width={52} height={52} />
          </button>

          <button
            type="button"
            className="dock-item-btn"
            onClick={() => onNavigate('contact')}
            aria-label="Contact application"
          >
            <img src="/ios/contact.png" alt="Contact" width={52} height={52} />
          </button>

          <button
            type="button"
            className="dock-item-btn"
            onClick={() => onNavigate('resume')}
            aria-label="Resume application"
          >
            <img src="/ios/resume.png" alt="Resume" width={52} height={52} />
          </button>
        </div>
      </div>
    </div>
  );
}
