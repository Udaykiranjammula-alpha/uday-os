import React, { useState } from 'react';
import {
  ChevronLeft,
  Download,
  ExternalLink,
  Share2,
  FileText,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Code2,
  Cpu,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { profile } from '../data/profile';

interface ResumeAppProps {
  onBack?: () => void;
}

export function ResumeApp({ onBack }: ResumeAppProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    const link = document.createElement('a');
    link.href = profile.resumeUrl;
    link.download = 'Uday_Kiran_Jammula_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloading(false), 2000);
  };

  return (
    <div className="files-page-container">
      {/* iOS Files / Quick Look Top Header */}
      <header className="files-top-header">
        <button
          type="button"
          className="files-back-btn"
          onClick={onBack}
          aria-label="Back to Home Screen"
        >
          <ChevronLeft size={22} />
          <span>Home</span>
        </button>

        <span className="files-doc-name">Uday_Kiran_Resume.pdf</span>

        <button
          type="button"
          className="files-header-action"
          onClick={handleDownload}
          aria-label="Download Resume"
          title="Download Resume PDF"
        >
          <Download size={17} />
        </button>
      </header>

      {/* Main Scrollable Content */}
      <div className="files-scroll-viewport">
        {/* Document Stats & Download Bar */}
        <section className="doc-meta-banner">
          <div className="doc-meta-info">
            <span className="doc-file-tag">PDF DOCUMENT</span>
            <span className="doc-file-specs">Updated October 2026 · 184 KB</span>
          </div>

          <div className="doc-meta-actions">
            <button
              type="button"
              className="doc-primary-download-btn"
              onClick={handleDownload}
            >
              <Download size={14} />
              <span>{downloading ? 'Downloading...' : 'Download PDF'}</span>
            </button>

            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="doc-secondary-action-btn"
            >
              <ExternalLink size={13} />
              <span>Fullscreen</span>
            </a>
          </div>
        </section>

        {/* The Authentic Resume Paper */}
        <article className="file-paper resume-paper">
          {/* Paper Header */}
          <header className="resume-paper-header">
            <h1 className="resume-applicant-name">{profile.name}</h1>
            <p className="resume-applicant-title">
              B.Tech in Computer Science & Engineering · KL University
            </p>
            <div className="resume-contact-ribbon">
              <span>✉️ {profile.email}</span>
              <span>📍 {profile.location}</span>
            </div>
            <div className="resume-social-links">
              <a href={profile.github} target="_blank" rel="noreferrer">
                github.com/Udaykiranjammula-alpha
              </a>
              <span>·</span>
              <a href={profile.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <span>·</span>
              <a href={profile.instagram} target="_blank" rel="noreferrer">
                Instagram
              </a>
            </div>
          </header>

          <hr className="paper-divider" />

          {/* Education */}
          <section className="paper-section">
            <div className="section-title-row">
              <GraduationCap size={15} className="section-title-icon" />
              <h2>EDUCATION</h2>
            </div>
            <div className="paper-entry">
              <div className="entry-header">
                <strong>KL University (KLEF)</strong>
                <span className="entry-year">2023 – 2027</span>
              </div>
              <p className="entry-sub">Bachelor of Technology in Computer Science & Engineering</p>
              <p className="entry-location">Vijayawada Rural, Andhra Pradesh, India</p>
              <p className="entry-desc">
                Core Coursework: Python Programming, Data Structures & Algorithms, C Systems Programming, Object-Oriented Software Design, Database Systems.
              </p>
            </div>
          </section>

          <hr className="paper-divider" />

          {/* Technical Skills */}
          <section className="paper-section">
            <div className="section-title-row">
              <Code2 size={15} className="section-title-icon" />
              <h2>TECHNICAL SKILLS</h2>
            </div>
            <div className="paper-skills-grid">
              <div className="paper-skill-row">
                <span className="skill-cat-label">Languages:</span>
                <span className="skill-cat-value">Python, C, C++, TypeScript, JavaScript, SQL</span>
              </div>
              <div className="paper-skill-row">
                <span className="skill-cat-label">Frameworks:</span>
                <span className="skill-cat-value">React, Vite, Node.js, Express, TailwindCSS, Three.js</span>
              </div>
              <div className="paper-skill-row">
                <span className="skill-cat-label">Systems & Edge:</span>
                <span className="skill-cat-value">ESP32, FreeRTOS, SPI, I2C, Microcontrollers</span>
              </div>
              <div className="paper-skill-row">
                <span className="skill-cat-label">Tools & Cloud:</span>
                <span className="skill-cat-value">Git, GitHub Actions, Docker, Linux, Vercel, VS Code</span>
              </div>
            </div>
          </section>

          <hr className="paper-divider" />

          {/* Featured Projects */}
          <section className="paper-section">
            <div className="section-title-row">
              <Briefcase size={15} className="section-title-icon" />
              <h2>FEATURED PROJECTS</h2>
            </div>

            <div className="paper-entry">
              <div className="entry-header">
                <strong>Hospital Management System</strong>
                <span className="entry-tag">Live Production</span>
              </div>
              <p className="entry-sub">React · TypeScript · Responsive Clinical SPA</p>
              <ul className="entry-bullets">
                <li>Architected responsive clinic dashboard managing real-time patient triage, intake queues, and appointment scheduling.</li>
                <li>Engineered accessible interfaces compliant with high-contrast healthcare ergonomics and zero runtime lag.</li>
              </ul>
            </div>

            <div className="paper-entry">
              <div className="entry-header">
                <strong>ESP32 Dual-Node Telemetry Protocol</strong>
                <span className="entry-tag">Embedded C++</span>
              </div>
              <p className="entry-sub">FreeRTOS · SPI Packet Transport · Logic Analyzer Validation</p>
              <ul className="entry-bullets">
                <li>Developed low-latency inter-microcontroller data pipeline with hardware checksum verification and automatic retransmission.</li>
                <li>Validated sub-millisecond round-trip packet transport under burst payload conditions.</li>
              </ul>
            </div>

            <div className="paper-entry">
              <div className="entry-header">
                <strong>Wi-Fi CSI RF Spatial Analytics</strong>
                <span className="entry-tag">Signal Processing</span>
              </div>
              <p className="entry-sub">Python · NumPy · OFDM Subcarrier Perturbation Analysis</p>
              <ul className="entry-bullets">
                <li>Processed channel state information (CSI) matrices to detect spatial movement perturbations without physical cameras.</li>
                <li>Implemented digital noise filtering and time-frequency spectrogram visualization.</li>
              </ul>
            </div>
          </section>

          <hr className="paper-divider" />

          {/* Achievements */}
          <section className="paper-section">
            <div className="section-title-row">
              <Award size={15} className="section-title-icon" />
              <h2>ACHIEVEMENTS & VALUES</h2>
            </div>
            <ul className="entry-bullets">
              <li>Top academic performance in algorithmic problem solving and data structures at KL University.</li>
              <li>Engineered interactive 3D WebGL developer experiences and responsive full-stack applications.</li>
              <li>Dedicated to precision engineering: "Turning Ideas Into Impact".</li>
            </ul>
          </section>
        </article>

        {/* Security & Verification Badge */}
        <section className="resume-verify-badge">
          <ShieldCheck size={18} className="verify-icon text-emerald" />
          <div className="verify-text">
            <strong>Official Verified Curriculum Vitae</strong>
            <small>Direct document download authorized for recruiters and engineering managers.</small>
          </div>
        </section>
      </div>
    </div>
  );
}
