import React from 'react';
import {
  ChevronRight,
  Sparkles,
  MapPin,
  GraduationCap,
  Code2,
  Cpu,
  Layers,
  Heart,
  FileText,
} from 'lucide-react';
import type { AppId } from '../types';
import { profile } from '../data/profile';

interface AboutAppProps {
  onOpenApp: (id: AppId) => void;
}

export function AboutApp({ onOpenApp }: AboutAppProps) {
  return (
    <div className="phone-screen-content">
      {/* Hero Profile Card */}
      <section className="about-hero-card">
        <div className="about-avatar-ring">
          <div className="avatar-monogram">UK</div>
        </div>
        <div className="about-hero-text">
          <span className="profile-eyebrow">IDENTITY / 01</span>
          <h2 className="profile-name">{profile.name}</h2>
          <p className="profile-role">{profile.role}</p>
          <div className="profile-location-tag">
            <MapPin size={12} />
            <span>{profile.location}</span>
          </div>
        </div>
      </section>

      {/* Headline & Long Bio */}
      <section className="about-card">
        <p className="about-lead">{profile.headline}</p>
        <p className="about-bio">{profile.bio}</p>
      </section>

      {/* University & Degree Badge */}
      <section className="about-card highlight-border">
        <div className="card-header-icon">
          <GraduationCap size={16} className="text-cyan" />
          <strong>Education Baseline</strong>
        </div>
        <p className="academic-title">{profile.degree}</p>
        <p className="academic-school">{profile.university}</p>
        <p className="muted-detail">
          Pursuing computer engineering with practical focus on systems, algorithms, and connected hardware.
        </p>
      </section>

      {/* Core Specializations */}
      <section className="about-card">
        <div className="card-header-icon">
          <Cpu size={16} className="text-violet" />
          <strong>Specializations</strong>
        </div>
        <div className="pill-tag-grid">
          {profile.specializations.map((spec) => (
            <span key={spec} className="pill-tag">
              {spec}
            </span>
          ))}
        </div>
      </section>

      {/* Technical Interests */}
      <section className="about-card">
        <div className="card-header-icon">
          <Code2 size={16} className="text-cyan" />
          <strong>Technical Interests</strong>
        </div>
        <div className="bullet-list">
          {profile.interests.map((interest) => (
            <div key={interest} className="bullet-item">
              <span className="bullet-dot" />
              <span>{interest}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Career Goals */}
      <section className="about-card">
        <div className="card-header-icon">
          <Sparkles size={16} className="text-amber" />
          <strong>Vision & Goals</strong>
        </div>
        <p className="goals-text">{profile.careerGoals}</p>
      </section>

      {/* Core Engineering Values */}
      <section className="about-card">
        <div className="card-header-icon">
          <Heart size={16} className="text-pink" />
          <strong>Engineering Values</strong>
        </div>
        <ul className="values-list">
          {profile.values.map((val) => (
            <li key={val}>{val}</li>
          ))}
        </ul>
      </section>

      {/* Action Buttons to Resume & Projects */}
      <div className="action-button-stack">
        <button
          type="button"
          className="phone-primary-action"
          onClick={() => onOpenApp('projects')}
        >
          <Layers size={16} />
          <span>Explore Selected Projects</span>
          <ChevronRight size={16} />
        </button>

        <button
          type="button"
          className="phone-secondary-action"
          onClick={() => onOpenApp('resume')}
        >
          <FileText size={16} />
          <span>View Resume Document</span>
        </button>
      </div>
    </div>
  );
}
