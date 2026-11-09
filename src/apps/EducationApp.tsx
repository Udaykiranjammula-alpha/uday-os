import React from 'react';
import { GraduationCap, BookOpen, Layers, CheckCircle2, ChevronLeft } from 'lucide-react';
import { educationList } from '../data/education';

interface EducationAppProps {
  onBack?: () => void;
}

export function EducationApp({ onBack }: EducationAppProps) {
  return (
    <div className="phone-screen-content">
      {onBack && (
        <header className="files-top-header" style={{ marginBottom: 8 }}>
          <button
            type="button"
            className="files-back-btn"
            onClick={onBack}
            aria-label="Back to Home Screen"
          >
            <ChevronLeft size={22} />
            <span>Home</span>
          </button>
          <span className="files-doc-name">Education</span>
          <div style={{ width: 44 }} />
        </header>
      )}
      {/* Intro Header */}
      <div className="section-intro-block">
        <span className="eyebrow-accent">ACADEMIC FOUNDATION</span>
        <h2>University Education</h2>
        <p className="muted-text">
          Formal engineering coursework, computing theory, and laboratory experimentation.
        </p>
      </div>

      <div className="education-cards-stack">
        {educationList.map((entry) => (
          <div key={entry.degree} className="education-card">
            <div className="edu-top-row">
              <div className="edu-icon-bubble">
                <GraduationCap size={20} className="text-cyan" />
              </div>
              <div className="edu-title-col">
                <span className="edu-duration-tag">{entry.duration}</span>
                <h3 className="edu-degree">{entry.degree}</h3>
                <p className="edu-institution">{entry.institution}</p>
              </div>
            </div>

            <p className="edu-detail-text">{entry.detail}</p>

            {/* Relevant Coursework */}
            <div className="edu-subcard">
              <div className="card-header-icon text-violet">
                <BookOpen size={14} />
                <strong>Key Coursework</strong>
              </div>
              <div className="pill-tag-grid">
                {entry.relevantCoursework.map((course) => (
                  <span key={course} className="pill-tag">
                    {course}
                  </span>
                ))}
              </div>
            </div>

            {/* Practical Synthesis */}
            <div className="edu-subcard">
              <div className="card-header-icon text-emerald">
                <Layers size={14} />
                <strong>Practical Synthesis</strong>
              </div>
              <p className="muted-text">{entry.projectsSummary}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="detail-card info-note">
        <div className="card-header-icon text-cyan">
          <CheckCircle2 size={14} />
          <strong>Academic Verification</strong>
        </div>
        <p className="muted-text">
          Enrolled at KL University. All coursework, grades, and laboratory assignments adhere strictly to verified academic standards.
        </p>
      </div>
    </div>
  );
}
