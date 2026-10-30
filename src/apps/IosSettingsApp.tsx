import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  Accessibility,
  Sun,
  Image as ImageIcon,
  Shield,
  Search,
  ExternalLink,
  Github,
  Linkedin,
  Instagram,
  Mail,
} from 'lucide-react';
import { profile } from '../data/profile';

interface IosSettingsAppProps {
  onBack: () => void;
  color: 'plum' | 'desert' | 'natural' | 'black';
  setColor: (c: 'plum' | 'desert' | 'natural' | 'black') => void;
  onOpenApp: (app: string) => void;
}

export function IosSettingsApp({ onBack, color, setColor, onOpenApp }: IosSettingsAppProps) {
  const [activeSubView, setActiveSubView] = useState<string | null>(null);

  if (activeSubView === 'profile') {
    return (
      <div className="ios-settings-page">
        <div className="settings-top-nav">
          <button type="button" className="settings-back-btn" onClick={() => setActiveSubView(null)}>
            <ChevronLeft size={20} />
            <span>Settings</span>
          </button>
        </div>

        <div className="profile-detail-card">
          <div className="profile-large-avatar">
          <img src="/uday_avatar.png" alt={profile.name} className="apple-id-img" />
        </div>
          <h3>{profile.name}</h3>
          <p>{profile.role} · {profile.university}</p>
        </div>

        <div className="ios-settings-group">
          <a href={`mailto:${profile.email}`} className="ios-settings-row">
            <div className="row-icon-cell bg-blue">
              <Mail size={16} />
            </div>
            <span className="row-label">Email: {profile.email}</span>
            <ExternalLink size={14} className="row-chevron" />
          </a>
          <a href={profile.github} target="_blank" rel="noreferrer" className="ios-settings-row">
            <div className="row-icon-cell bg-dark">
              <Github size={16} />
            </div>
            <span className="row-label">GitHub Profile</span>
            <ExternalLink size={14} className="row-chevron" />
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="ios-settings-row">
            <div className="row-icon-cell bg-blue-deep">
              <Linkedin size={16} />
            </div>
            <span className="row-label">LinkedIn Profile</span>
            <ExternalLink size={14} className="row-chevron" />
          </a>
          <a href={profile.instagram} target="_blank" rel="noreferrer" className="ios-settings-row">
            <div className="row-icon-cell bg-instagram">
              <Instagram size={16} />
            </div>
            <span className="row-label">Instagram Profile</span>
            <ExternalLink size={14} className="row-chevron" />
          </a>
        </div>
      </div>
    );
  }

  if (activeSubView === 'wallpaper') {
    return (
      <div className="ios-settings-page">
        <div className="settings-top-nav">
          <button type="button" className="settings-back-btn" onClick={() => setActiveSubView(null)}>
            <ChevronLeft size={20} />
            <span>Settings</span>
          </button>
        </div>
        <h2 className="settings-page-title">Wallpaper & Chassis</h2>

        <div className="ios-settings-group">
          <button
            type="button"
            className="ios-settings-row"
            onClick={() => setColor('desert')}
          >
            <div className="row-icon-cell bg-amber">
              <div className="swatch-mini desert" />
            </div>
            <span className="row-label">Desert Titanium (Warm Amber)</span>
            {color === 'desert' && <span className="active-tag">Active</span>}
          </button>

          <button
            type="button"
            className="ios-settings-row"
            onClick={() => setColor('plum')}
          >
            <div className="row-icon-cell bg-plum">
              <div className="swatch-mini plum" />
            </div>
            <span className="row-label">Deep Plum (Dark Titanium)</span>
            {color === 'plum' && <span className="active-tag">Active</span>}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ios-settings-page">
      {/* Top Bar with Back Button */}
      <div className="settings-top-nav">
        <button type="button" className="settings-back-btn" onClick={onBack} aria-label="Go back to Home">
          <ChevronLeft size={20} />
        </button>
      </div>

      <h1 className="settings-page-title">Settings</h1>

      {/* Profile / Apple ID Card */}
      <button
        type="button"
        className="ios-apple-id-card"
        onClick={() => setActiveSubView('profile')}
      >
        <div className="apple-id-avatar">
          <img src="/uday_avatar.png" alt={profile.name} className="apple-id-img" />
        </div>
        <div className="apple-id-info">
          <strong className="apple-id-name">{profile.name}</strong>
          <span className="apple-id-sub">Personal Information, Contact & Links</span>
        </div>
        <ChevronRight size={18} className="row-chevron" />
      </button>

      {/* Main Settings Group 1 */}
      <div className="ios-settings-group">
        <button
          type="button"
          className="ios-settings-row"
          onClick={() => onOpenApp('about')}
        >
          <div className="row-icon-cell bg-gray">
            <Settings size={17} />
          </div>
          <span className="row-label">General</span>
          <ChevronRight size={18} className="row-chevron" />
        </button>

        <button
          type="button"
          className="ios-settings-row"
          onClick={() => onOpenApp('skills')}
        >
          <div className="row-icon-cell bg-blue">
            <Accessibility size={17} />
          </div>
          <span className="row-label">Accessibility & Skills</span>
          <ChevronRight size={18} className="row-chevron" />
        </button>

        <button
          type="button"
          className="ios-settings-row"
          onClick={() => setActiveSubView('wallpaper')}
        >
          <div className="row-icon-cell bg-sky">
            <Sun size={17} />
          </div>
          <span className="row-label">Display & Brightness</span>
          <ChevronRight size={18} className="row-chevron" />
        </button>

        <button
          type="button"
          className="ios-settings-row"
          onClick={() => setActiveSubView('wallpaper')}
        >
          <div className="row-icon-cell bg-teal">
            <ImageIcon size={17} />
          </div>
          <span className="row-label">Wallpaper</span>
          <ChevronRight size={18} className="row-chevron" />
        </button>
      </div>

      {/* Group 2 */}
      <div className="ios-settings-group">
        <button
          type="button"
          className="ios-settings-row"
          onClick={() => onOpenApp('terminal')}
        >
          <div className="row-icon-cell bg-blue">
            <Shield size={17} />
          </div>
          <span className="row-label">Privacy & Security</span>
          <ChevronRight size={18} className="row-chevron" />
        </button>
      </div>

      {/* Bottom Search Pill */}
      <div className="settings-bottom-search">
        <Search size={14} className="search-icon" />
        <span>Search</span>
      </div>
    </div>
  );
}
