import React from 'react';
import { ChevronLeft, ChevronRight, LayoutGrid, Cpu, Radio, Sparkles, GraduationCap } from 'lucide-react';
import { profile } from '../data/profile';

interface IosExperienceAppProps {
  onBack: () => void;
}

export function IosExperienceApp({ onBack }: IosExperienceAppProps) {
  const experiences = [
    {
      id: 'hms',
      company: 'Hospital Management System',
      role: 'Lead Architect & Full-Stack Developer',
      period: '2026 · Live on Vercel',
      icon: LayoutGrid,
      iconBg: 'bg-cyan',
      url: 'https://hospital-management-system-msz2.vercel.app/',
    },
    {
      id: 'esp32',
      company: 'ESP32 Distributed ML Accelerator',
      role: 'Systems & Edge ML Engineer',
      period: '2026 · Hardware Prototype',
      icon: Cpu,
      iconBg: 'bg-purple',
      url: profile.github,
    },
    {
      id: 'nexus',
      company: 'NEXUS-PRESENCE',
      role: 'Founding Real-Time Engineer',
      period: '2025 – Present',
      icon: Radio,
      iconBg: 'bg-emerald',
      url: profile.github,
    },
    {
      id: 'sri-ai',
      company: 'SRI AI Orchestrator',
      role: 'AI Researcher & Core Developer',
      period: '2025 – Present',
      icon: Sparkles,
      iconBg: 'bg-violet',
      url: profile.github,
    },
    {
      id: 'klu',
      company: 'KL University, Vaddeswaram',
      role: 'Bachelor of Technology - B.Tech, CSE',
      period: '2023 – 2027',
      icon: GraduationCap,
      iconBg: 'bg-maroon',
      url: profile.linkedin,
    },
  ];

  return (
    <div className="personal-app experience-native-page">
      {/* Top Navigation */}
      <header className="personal-nav">
        <button
          type="button"
          className="mail-nav-back-pill"
          onClick={onBack}
          aria-label="Back to Home"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="personal-nav-spacer" />
      </header>

      {/* Page Header */}
      <div className="personal-large-header">
        <h1 className="personal-large-title">Experience</h1>
        <p className="personal-sub-desc">The teams and products I&apos;ve worked on.</p>
      </div>

      {/* Section Eyebrow */}
      <div className="experience-section-label">
        <span>Work history</span>
      </div>

      {/* Grouped Experience List (Exact prsd.dev style) */}
      <div className="personal-group experience-list-group">
        {experiences.map((exp) => {
          const IconComp = exp.icon;
          return (
            <a
              key={exp.id}
              href={exp.url}
              target="_blank"
              rel="noreferrer"
              className="experience-item-link"
            >
              <div className={`exp-avatar-box ${exp.iconBg}`}>
                <IconComp size={18} />
              </div>

              <div className="exp-info-block">
                <strong className="exp-company-title">{exp.company}</strong>
                <span className="exp-role-title">{exp.role}</span>
                <small className="exp-period-label">{exp.period}</small>
              </div>

              <ChevronRight size={16} className="exp-chevron-icon" />
            </a>
          );
        })}
      </div>

      {/* Location Footnote */}
      <div className="experience-footer-footnote">
        <span>📍 Based in Vijayawada, Andhra Pradesh, India</span>
      </div>
    </div>
  );
}
