import React from 'react';
import {
  ChevronLeft,
  Search,
  Bell,
  MessageSquare,
  UserPlus,
  Send,
  MoreHorizontal,
  ExternalLink,
  Eye,
  TrendingUp,
  BarChart2,
  GraduationCap,
  Briefcase,
  Code2,
  Cpu,
  LayoutGrid,
  Radio,
  Sparkles,
} from 'lucide-react';
import { profile } from '../data/profile';

interface LinkedInAppProps {
  onBack?: () => void;
}

export function LinkedInApp({ onBack }: LinkedInAppProps) {
  return (
    <div className="ios-linkedin-page">
      {/* Top Header Navigation matching iOS LinkedIn */}
      <header className="linkedin-header-bar">
        <button
          type="button"
          className="linkedin-back-btn"
          onClick={onBack}
          aria-label="Go back to Home"
        >
          <ChevronLeft size={22} />
        </button>

        <div className="linkedin-logo-badge">
          <span>in</span>
        </div>

        <div className="linkedin-search-capsule">
          <Search size={14} className="search-glass-icon" />
          <input
            type="text"
            readOnly
            value="Search"
            placeholder="Search"
            className="search-fake-input"
            aria-label="Search LinkedIn"
          />
        </div>

        <div className="linkedin-top-actions">
          <div className="icon-with-badge">
            <Bell size={18} />
            <span className="notif-badge">2</span>
          </div>
          <div className="icon-with-badge">
            <MessageSquare size={18} />
            <span className="notif-badge">1</span>
          </div>
        </div>
      </header>

      {/* Scrollable Content Body */}
      <div className="linkedin-scroll-body">
        {/* Real Cover Photo Banner */}
        <div className="linkedin-cover-photo">
          <img
            src="/uday_banner.png?v=4"
            alt="LinkedIn Cover Banner: Turning Ideas Into Impact"
            className="linkedin-cover-img"
          />
        </div>

        {/* Profile Card Info */}
        <section className="linkedin-profile-card">
          <div className="profile-avatar-row">
            <div className="profile-avatar-wrap">
              <img
                src="/uday_avatar.png"
                alt={profile.name}
                className="linkedin-photo-avatar-img"
              />
            </div>
          </div>

          <div className="profile-text-group">
            <div className="profile-name-row">
              <h2 className="profile-full-name">{profile.name}</h2>
              {/* LinkedIn Verified Shield Badge */}
              <span className="linkedin-verified-badge" title="Verified Member">
                <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                  <path
                    d="M8 0L9.8 1.4L12 1.2L12.9 3.2L15 4.1L14.7 6.3L16 8L14.7 9.7L15 11.9L12.9 12.8L12 14.8L9.8 14.6L8 16L6.2 14.6L4 14.8L3.1 12.8L1 11.9L1.3 9.7L0 8L1.3 6.3L1 4.1L3.1 3.2L4 1.2L6.2 1.4L8 0Z"
                    fill="#70b5f9"
                  />
                  <path
                    d="M6.8 10.8L4.2 8.2L5.2 7.2L6.8 8.8L10.8 4.8L11.8 5.8L6.8 10.8Z"
                    fill="#000000"
                  />
                </svg>
              </span>
            </div>

            <p className="profile-headline">
              Student @ KL University | Python, Data Structures, C
            </p>

            {/* University Affiliation Line with Crest Logo */}
            <div className="profile-affiliation-row">
              <img
                src="/kl_university_logo.png"
                alt="KL University Logo"
                className="affiliation-logo"
              />
              <span className="affiliation-text">KL University, Vaddeswaram</span>
            </div>

            <p className="profile-location-line">
              {profile.location} ·{' '}
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="contact-info-link"
              >
                Contact info
              </a>
            </p>

            <p className="connections-count">125 connections</p>
          </div>

          {/* Action Buttons: Connect, Message, More */}
          <div className="linkedin-action-buttons-row">
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="linkedin-btn-primary"
            >
              <UserPlus size={14} />
              <span>Connect</span>
            </a>

            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="linkedin-btn-secondary"
            >
              <Send size={14} />
              <span>Message</span>
            </a>

            <button
              type="button"
              className="linkedin-btn-icon"
              aria-label="More profile actions"
              onClick={() => window.open(profile.linkedin, '_blank')}
            >
              <MoreHorizontal size={16} />
            </button>
          </div>
        </section>

        {/* Analytics Section (Exact replica of real LinkedIn profile) */}
        <section className="linkedin-grouped-section analytics-section">
          <div className="section-header-row">
            <h3 className="section-title">Analytics</h3>
            <span className="private-sub-label">
              <Eye size={12} />
              <span>Private to you</span>
            </span>
          </div>

          <div className="analytics-grid">
            <div className="analytic-card">
              <div className="analytic-icon-wrap">
                <Eye size={15} />
              </div>
              <strong className="analytic-metric">21 profile views</strong>
              <p className="analytic-desc">Discover who&apos;s viewed your profile.</p>
            </div>

            <div className="analytic-card">
              <div className="analytic-icon-wrap">
                <TrendingUp size={15} />
              </div>
              <strong className="analytic-metric">166 post impressions</strong>
              <p className="analytic-desc">Check out who&apos;s engaging with your posts.</p>
            </div>

            <div className="analytic-card">
              <div className="analytic-icon-wrap">
                <BarChart2 size={15} />
              </div>
              <strong className="analytic-metric">5 search appearances</strong>
              <p className="analytic-desc">See how often you appear in search results.</p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="linkedin-grouped-section">
          <h3 className="section-title">About</h3>
          <p className="about-text-body">
            Passionate Computer Science student and software developer at KL University with a strong foundation in Python, Data Structures, and C. Dedicated to turning ideas into impact through thoughtful engineering, algorithmic problem solving, and modern web & intelligent systems architectures.
          </p>
        </section>

        {/* Education Section */}
        <section className="linkedin-grouped-section">
          <h3 className="section-title">Education</h3>
          <div className="experience-item-row">
            <div className="exp-logo-box bg-maroon">
              <img
                src="/kl_university_logo.png"
                alt="KL University"
                className="exp-institution-logo"
              />
            </div>
            <div className="exp-details">
              <strong className="exp-role">KL University, Vaddeswaram</strong>
              <p className="exp-company">Bachelor of Technology - B.Tech, Computer Science and Engineering</p>
              <small className="exp-dates">2023 – 2027</small>
              <p className="exp-summary">
                Core coursework in Data Structures & Algorithms, Object-Oriented Programming with Python, C Systems Programming, and Computer Networks.
              </p>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section className="linkedin-grouped-section">
          <h3 className="section-title">Experience & Projects</h3>

          <div className="experience-list-stack">
            {/* Experience Item 1: Hospital Management System */}
            <div className="experience-item-row">
              <div className="exp-logo-box bg-cyan">
                <LayoutGrid size={18} />
              </div>
              <div className="exp-details">
                <strong className="exp-role">Lead Architect & Full-Stack Developer</strong>
                <p className="exp-company">Hospital Management System</p>
                <small className="exp-dates">2026 · Live on Vercel</small>
                <p className="exp-summary">
                  Architected responsive healthcare application orchestrating real-time patient triage, clinic queue coordination, and medical staff records.
                </p>
              </div>
            </div>

            {/* Experience Item 2: ESP32 Distributed ML */}
            <div className="experience-item-row">
              <div className="exp-logo-box bg-purple">
                <Cpu size={18} />
              </div>
              <div className="exp-details">
                <strong className="exp-role">Systems & Edge ML Engineer</strong>
                <p className="exp-company">ESP32 Distributed ML Accelerator</p>
                <small className="exp-dates">2026 · Hardware Prototype</small>
                <p className="exp-summary">
                  Engineered a two-node ESP32 microcontroller pipeline decoupling sensor ingestion/FFT feature extraction from INT8 quantized neural inference over low-latency SPI/Wi-Fi.
                </p>
              </div>
            </div>

            {/* Experience Item 3: NEXUS-PRESENCE */}
            <div className="experience-item-row">
              <div className="exp-logo-box bg-emerald">
                <Radio size={18} />
              </div>
              <div className="exp-details">
                <strong className="exp-role">Founding Real-Time Engineer</strong>
                <p className="exp-company">NEXUS-PRESENCE</p>
                <small className="exp-dates">2025 – Present</small>
                <p className="exp-summary">
                  Created multi-node Wi-Fi CSI/RSSI presence detection engine with sub-meter spatial tracking and reactive WebSocket visualization.
                </p>
              </div>
            </div>

            {/* Experience Item 4: SRI AI */}
            <div className="experience-item-row">
              <div className="exp-logo-box bg-violet">
                <Sparkles size={18} />
              </div>
              <div className="exp-details">
                <strong className="exp-role">AI Researcher & Core Developer</strong>
                <p className="exp-company">SRI AI</p>
                <small className="exp-dates">2025 – Present</small>
                <p className="exp-summary">
                  Developed multi-agent orchestration architecture utilizing LLMs, semantic RAG pipelines, and automated reasoning tools.
                </p>
              </div>
            </div>
          </div>

          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="see-all-exp-link"
          >
            <span>Open Verified Profile on LinkedIn</span>
            <ExternalLink size={13} />
          </a>
        </section>
      </div>
    </div>
  );
}
