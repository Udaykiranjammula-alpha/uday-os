import React, { useState } from 'react';
import {
  ChevronLeft,
  Share2,
  Download,
  Sparkles,
  Type,
  Palette,
  Briefcase,
  Check,
  Camera,
  Layers,
} from 'lucide-react';
import { sound } from '../services/sound';
import { profile } from '../data/profile';

interface ContactPosterAppProps {
  onBack: () => void;
  onNavigate?: (route: string) => void;
}

type FontStyle = 'bold-chunky' | 'modern-condensed' | 'keynote-serif' | 'neon-script';
type ColorTreatment = 'titanium-natural' | 'studio-noir' | 'cyber-duotone' | 'golden-hour';

export function ContactPosterApp({ onBack }: ContactPosterAppProps) {
  const [fontStyle, setFontStyle] = useState<FontStyle>('bold-chunky');
  const [colorTreatment, setColorTreatment] = useState<ColorTreatment>('titanium-natural');
  const [recruiterCompany, setRecruiterCompany] = useState('Google');
  const [isCopied, setIsCopied] = useState(false);

  const handleSelectFont = (font: FontStyle) => {
    sound.playTapSound();
    setFontStyle(font);
  };

  const handleSelectTreatment = (treatment: ColorTreatment) => {
    sound.playTapSound();
    setColorTreatment(treatment);
  };

  const handleExportPoster = () => {
    sound.playApplePayChime();
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2400);
  };

  return (
    <div className="contact-poster-page">
      {/* Top Header */}
      <div className="poster-header">
        <button
          type="button"
          className="poster-back-btn"
          onClick={onBack}
          aria-label="Back to Home"
        >
          <ChevronLeft size={20} />
          <span>Home</span>
        </button>

        <div className="poster-header-title">
          <Sparkles size={14} className="text-cyan" />
          <span>iOS 18 Contact Poster Studio</span>
        </div>

        <button
          type="button"
          className="poster-done-btn"
          onClick={handleExportPoster}
        >
          {isCopied ? <Check size={14} className="text-green" /> : <span>Export</span>}
        </button>
      </div>

      {/* Main Full-Bleed Contact Poster Card */}
      <div className="poster-card-stage">
        <div className={`poster-bleed-card ${colorTreatment}`}>
          {/* Ambient Lighting Gradient */}
          <div className="poster-ambient-glow" />

          {/* Top Huge Typography Name */}
          <div className={`poster-name-typography ${fontStyle}`}>
            <span className="first-name">UDAY</span>
            <span className="last-name">KIRAN</span>
          </div>

          {/* Central Portrait Hero Representation */}
          <div className="poster-portrait-wrap">
            <div className="poster-silhouette">
              <span className="portrait-monogram">UK</span>
              <div className="portrait-ring" />
            </div>

            {/* Recruiter Co-Branded Badge */}
            {recruiterCompany && (
              <div className="poster-recruiter-badge">
                <Briefcase size={12} />
                <span>Verified Candidate for {recruiterCompany}</span>
              </div>
            )}
          </div>

          {/* Bottom Card Identity Footer */}
          <div className="poster-footer-strip">
            <div className="poster-role-tag">Full-Stack &middot; Systems Architecture</div>
            <div className="poster-metrics-row">
              <span className="pm-chip">184 LeetCode</span>
              <span className="pm-chip">A18 Pro 3nm</span>
              <span className="pm-chip">KL University</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customizer Controls Bar */}
      <div className="poster-controls-sheet">
        {/* Recruiter Company Input */}
        <div className="control-group">
          <label className="control-label">Recruiter Co-Branding Company</label>
          <div className="recruiter-input-wrap">
            <Briefcase size={14} className="text-cyan" />
            <input
              type="text"
              value={recruiterCompany}
              onChange={(e) => setRecruiterCompany(e.target.value)}
              placeholder="e.g. Google, Apple, Microsoft, NVIDIA"
              className="recruiter-input"
            />
          </div>
        </div>

        {/* Typography Style Selector */}
        <div className="control-group">
          <label className="control-label">
            <Type size={12} />
            <span>Typography Direction</span>
          </label>
          <div className="poster-chips-grid">
            <button
              type="button"
              className={`poster-chip ${fontStyle === 'bold-chunky' ? 'active' : ''}`}
              onClick={() => handleSelectFont('bold-chunky')}
            >
              <span>Bold Chunky</span>
            </button>
            <button
              type="button"
              className={`poster-chip ${fontStyle === 'modern-condensed' ? 'active' : ''}`}
              onClick={() => handleSelectFont('modern-condensed')}
            >
              <span>Modern Condensed</span>
            </button>
            <button
              type="button"
              className={`poster-chip ${fontStyle === 'keynote-serif' ? 'active' : ''}`}
              onClick={() => handleSelectFont('keynote-serif')}
            >
              <span>Keynote Serif</span>
            </button>
            <button
              type="button"
              className={`poster-chip ${fontStyle === 'neon-script' ? 'active' : ''}`}
              onClick={() => handleSelectFont('neon-script')}
            >
              <span>Neon Script</span>
            </button>
          </div>
        </div>

        {/* Color Treatment Filter Selector */}
        <div className="control-group">
          <label className="control-label">
            <Palette size={12} />
            <span>Photographic Color Treatment</span>
          </label>
          <div className="poster-chips-grid">
            <button
              type="button"
              className={`poster-chip ${colorTreatment === 'titanium-natural' ? 'active' : ''}`}
              onClick={() => handleSelectTreatment('titanium-natural')}
            >
              <span>Natural Titanium</span>
            </button>
            <button
              type="button"
              className={`poster-chip ${colorTreatment === 'studio-noir' ? 'active' : ''}`}
              onClick={() => handleSelectTreatment('studio-noir')}
            >
              <span>Studio Noir</span>
            </button>
            <button
              type="button"
              className={`poster-chip ${colorTreatment === 'cyber-duotone' ? 'active' : ''}`}
              onClick={() => handleSelectTreatment('cyber-duotone')}
            >
              <span>Cyber Duotone</span>
            </button>
            <button
              type="button"
              className={`poster-chip ${colorTreatment === 'golden-hour' ? 'active' : ''}`}
              onClick={() => handleSelectTreatment('golden-hour')}
            >
              <span>Golden Keynote</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
