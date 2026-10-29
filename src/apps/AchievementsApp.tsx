import React from 'react';
import { Trophy, ShieldCheck, Cpu, Code2, Award } from 'lucide-react';
import { achievementsList } from '../data/achievements';

const categoryIcon = {
  Hardware: Cpu,
  Software: Code2,
  Milestone: Trophy,
  Academic: Award,
};

export function AchievementsApp() {
  return (
    <div className="phone-screen-content">
      {/* Intro Header */}
      <div className="section-intro-block">
        <span className="eyebrow-accent">VERIFIED RECORD</span>
        <h2>Milestones & Honors</h2>
        <p className="muted-text">
          Evidence-backed technical accomplishments, open-source projects, and engineering prototypes.
        </p>
      </div>

      <div className="achievements-timeline">
        {achievementsList.map((ach) => {
          const Icon = categoryIcon[ach.category] || Trophy;
          return (
            <div key={ach.title} className="achievement-card">
              <div className="ach-top-row">
                <span className="ach-badge-pill">{ach.verificationBadge}</span>
                <span className="ach-date">{ach.date}</span>
              </div>

              <div className="ach-content-row">
                <div className="ach-icon-circle">
                  <Icon size={18} className="text-amber" />
                </div>
                <div className="ach-body">
                  <h3 className="ach-title">{ach.title}</h3>
                  <p className="ach-detail">{ach.detail}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="detail-card info-note">
        <div className="card-header-icon text-cyan">
          <ShieldCheck size={14} />
          <strong>Integrity Guarantee</strong>
        </div>
        <p className="muted-text">
          UDAY OS deliberately excludes fabricated certificates or inflated titles. Only verifiable engineering work is displayed.
        </p>
      </div>
    </div>
  );
}
