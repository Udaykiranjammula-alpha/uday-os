import React from 'react';
import { GitHubWidget } from './GitHubWidget';
import { CalWidget } from './CalWidget';
import { Search } from 'lucide-react';
import { sound } from '../services/sound';

interface IosHomeScreenProps {
  onNavigate: (route: string) => void;
  onOpenSearch: () => void;
}

export function IosHomeScreen({ onNavigate, onOpenSearch }: IosHomeScreenProps) {
  const handleNav = (route: string) => {
    sound.playTapSound();
    onNavigate(route);
  };

  return (
    <div className="ios-homescreen-view">
      {/* Top Wide GitHub Heatmap Widget (Clicking opens GitHub & showcases all projects) */}
      <section className="widget-row-top">
        <GitHubWidget onClick={() => handleNav('github')} />
      </section>

      {/* Middle Row: Cal.com 15-min call + 2x2 App Icons */}
      <section className="widget-grid-middle">
        <CalWidget onClick={() => handleNav('contact')} />

        <div className="apps-quad-grid">
          {/* Experience App (LinkedIn) */}
          <button
            type="button"
            className="ios-home-icon-btn"
            onClick={() => handleNav('linkedin')}
            aria-label="LinkedIn Experience application"
          >
            <div className="ios-icon-box">
              <img src="/ios/linkedin.svg" alt="LinkedIn" width={52} height={52} />
              <span className="app-red-badge">WORK</span>
            </div>
            <span className="ios-icon-title">LinkedIn</span>
          </button>

          {/* Toolkit / Skills App */}
          <button
            type="button"
            className="ios-home-icon-btn"
            onClick={() => handleNav('skills')}
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
            onClick={() => handleNav('projects')}
            aria-label="Projects application"
          >
            <div className="ios-icon-box">
              <img src="/ios/safari.svg" alt="Safari" width={52} height={52} />
            </div>
            <span className="ios-icon-title">Projects</span>
          </button>

          {/* Interactive Camera App */}
          <button
            type="button"
            className="ios-home-icon-btn"
            onClick={() => handleNav('camera')}
            aria-label="Camera application"
          >
            <div className="ios-icon-box">
              <img src="/ios/camera.svg" alt="Camera" width={52} height={52} />
            </div>
            <span className="ios-icon-title">Camera</span>
          </button>
        </div>
      </section>

      {/* Third Row: 4 Essential Apps */}
      <section className="apps-single-row">
        {/* Uday AI Assistant */}
        <button
          type="button"
          className="ios-home-icon-btn"
          onClick={() => handleNav('ai')}
          aria-label="Uday AI Siri Assistant"
        >
          <div className="ios-icon-box">
            <img src="/ios/ai.svg" alt="Uday AI" width={52} height={52} />
            <span className="app-ai-glow-ring" />
          </div>
          <span className="ios-icon-title">Uday AI</span>
        </button>

        {/* LeetCode App */}
        <button
          type="button"
          className="ios-home-icon-btn"
          onClick={() => handleNav('leetcode')}
          aria-label="LeetCode Profile application"
        >
          <div className="ios-icon-box">
            <img src="/ios/leetcode.svg" alt="LeetCode" width={52} height={52} />
          </div>
          <span className="ios-icon-title">LeetCode</span>
        </button>

        {/* Notes */}
        <button
          type="button"
          className="ios-home-icon-btn"
          onClick={() => handleNav('notes')}
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
          onClick={() => handleNav('settings')}
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
          onClick={() => {
            sound.playTapSound();
            onOpenSearch();
          }}
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
            onClick={() => handleNav('projects')}
            aria-label="Projects application"
          >
            <img src="/ios/projects.png" alt="Projects" width={52} height={52} />
          </button>

          <button
            type="button"
            className="dock-item-btn"
            onClick={() => handleNav('github')}
            aria-label="GitHub application"
          >
            <img src="/ios/github.svg" alt="GitHub" width={52} height={52} />
          </button>

          <button
            type="button"
            className="dock-item-btn"
            onClick={() => handleNav('photos')}
            aria-label="Photos Gallery application"
          >
            <img src="/ios/photos.png" alt="Photos" width={52} height={52} />
          </button>

          <button
            type="button"
            className="dock-item-btn"
            onClick={() => handleNav('resume')}
            aria-label="Resume application"
          >
            <img src="/ios/resume.png" alt="Resume" width={52} height={52} />
          </button>
        </div>
      </div>
    </div>
  );
}
