import React, { useState } from 'react';
import {
  ChevronLeft,
  Share2,
  Sparkles,
  Type,
  Palette,
  Briefcase,
  Check,
  Layers,
  Sliders,
  Sun,
  Eye,
  Copy,
} from 'lucide-react';
import { sound } from '../services/sound';
import { profile } from '../data/profile';

interface ContactPosterAppProps {
  onBack: () => void;
  onNavigate?: (route: string) => void;
}

type TypographyStyle =
  | 'san-francisco'
  | 'new-york-serif'
  | 'compact-mono'
  | 'rounded-display'
  | 'condensed-athletic';

type ColorGradient =
  | 'titanium-natural'
  | 'sunset-ember'
  | 'cupertino-cyan'
  | 'neon-emerald'
  | 'cosmic-amethyst'
  | 'studio-noir';

const GRADIENTS_DATA: Record<ColorGradient, { name: string; bg: string; textTint: string }> = {
  'titanium-natural': {
    name: 'Natural Titanium',
    bg: 'linear-gradient(180deg, #1e293b 0%, #0f172a 60%, #020617 100%)',
    textTint: '#f8fafc',
  },
  'sunset-ember': {
    name: 'Sunset Ember',
    bg: 'linear-gradient(180deg, #ea580c 0%, #9a3412 50%, #451a03 100%)',
    textTint: '#ffedd5',
  },
  'cupertino-cyan': {
    name: 'Cupertino Cyan',
    bg: 'linear-gradient(180deg, #0284c7 0%, #0369a1 50%, #082f49 100%)',
    textTint: '#e0f2fe',
  },
  'neon-emerald': {
    name: 'Neon Emerald',
    bg: 'linear-gradient(180deg, #059669 0%, #065f46 50%, #022c22 100%)',
    textTint: '#d1fae5',
  },
  'cosmic-amethyst': {
    name: 'Cosmic Amethyst',
    bg: 'linear-gradient(180deg, #7c3aed 0%, #5b21b6 50%, #2e1065 100%)',
    textTint: '#ede9fe',
  },
  'studio-noir': {
    name: 'Studio Noir',
    bg: 'linear-gradient(180deg, #27272a 0%, #18181b 60%, #09090b 100%)',
    textTint: '#ffffff',
  },
};

const FONT_STYLES_DATA: Record<
  TypographyStyle,
  { name: string; fontFamily: string; letterSpacing: string; textTransform?: 'uppercase' | 'none' }
> = {
  'san-francisco': {
    name: 'San Francisco',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
    letterSpacing: '-0.03em',
    textTransform: 'none',
  },
  'new-york-serif': {
    name: 'New York Serif',
    fontFamily: 'Georgia, "Times New Roman", serif',
    letterSpacing: '-0.01em',
    textTransform: 'none',
  },
  'compact-mono': {
    name: 'Compact Mono',
    fontFamily: 'ui-monospace, "SF Mono", monospace',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  'rounded-display': {
    name: 'Rounded Display',
    fontFamily: '"SF Pro Rounded", system-ui, sans-serif',
    letterSpacing: '-0.02em',
    textTransform: 'none',
  },
  'condensed-athletic': {
    name: 'Condensed Tall',
    fontFamily: '"Arial Narrow", sans-serif-condensed, sans-serif',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
};

export function ContactPosterApp({ onBack }: ContactPosterAppProps) {
  const [typography, setTypography] = useState<TypographyStyle>('san-francisco');
  const [fontWeight, setFontWeight] = useState<number>(800);
  const [gradient, setGradient] = useState<ColorGradient>('titanium-natural');
  const [depthEffect, setDepthEffect] = useState<boolean>(true);
  const [fontTint, setFontTint] = useState<string>('#ffffff');
  const [recruiterCompany, setRecruiterCompany] = useState('Google');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Contact Poster Saved & Ready to Share!');

  const handleSelectFont = (style: TypographyStyle) => {
    sound.playTapSound();
    setTypography(style);
  };

  const handleSelectGradient = (grad: ColorGradient) => {
    sound.playTapSound();
    setGradient(grad);
    setFontTint(GRADIENTS_DATA[grad].textTint);
  };

  const handleToggleDepthEffect = () => {
    sound.playTapSound();
    setDepthEffect((prev) => !prev);
  };

  const handleSaveAndShare = async () => {
    sound.playApplePayChime();

    const shareData = {
      title: `${profile.name} - iOS 18 Contact Poster`,
      text: `Connect with ${profile.name} (Verified Candidate for ${recruiterCompany || 'Tech Teams'}). Portfolio: ${profile.github}`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        setToastMessage('Contact Poster Shared!');
      } catch {
        setToastMessage('Contact Poster Copied to Clipboard!');
      }
    } else {
      navigator.clipboard?.writeText(
        `Contact Poster: ${profile.name} · Candidate for ${recruiterCompany || 'Software Engineering'} · ${profile.email} · ${profile.github}`
      );
      setToastMessage('Contact Poster Saved & Copied to Clipboard!');
    }

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const currentFont = FONT_STYLES_DATA[typography];
  const currentGradient = GRADIENTS_DATA[gradient];

  return (
    <div className="contact-poster-page" style={{ position: 'relative' }}>
      {/* Toast Notification */}
      {showToast && (
        <div className="poster-toast">
          <Check size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="poster-header">
        <button
          type="button"
          className="poster-back-btn"
          onClick={() => {
            sound.playTapSound();
            onBack();
          }}
          aria-label="Back to Home"
        >
          <ChevronLeft size={20} />
          <span>Home</span>
        </button>

        <div className="poster-header-title">
          <Sparkles size={14} className="text-sky-400" />
          <span>Contact Poster Studio</span>
        </div>

        <button
          type="button"
          className="poster-done-btn flex items-center gap-1.5 bg-sky-500 hover:bg-sky-400 text-white font-medium"
          onClick={handleSaveAndShare}
          title="Save & Share Contact Poster"
        >
          <Share2 size={13} />
          <span>Save &amp; Share</span>
        </button>
      </div>

      {/* Main Full-Bleed Contact Poster Card Stage */}
      <div className="poster-card-stage">
        <div
          className="poster-bleed-card"
          style={{
            background: currentGradient.bg,
            position: 'relative',
          }}
        >
          {/* Ambient Lighting Gradient */}
          <div className="poster-ambient-glow" />

          {/* Top Huge Typography Name with Dynamic Weight & Depth Z-Index */}
          <div
            className="poster-name-typography"
            style={{
              fontFamily: currentFont.fontFamily,
              fontWeight,
              letterSpacing: currentFont.letterSpacing,
              textTransform: currentFont.textTransform || 'none',
              color: fontTint,
              fontSize: typography === 'condensed-athletic' ? '54px' : '46px',
              zIndex: depthEffect ? 4 : 12,
              transition: 'all 0.25s ease',
              marginTop: '4px',
            }}
          >
            <span className="first-name">UDAY</span>
            <span className="last-name">KIRAN</span>
          </div>

          {/* Central Portrait Hero Representation with Depth Effect overlap */}
          <div
            className="poster-portrait-wrap"
            style={{
              position: 'relative',
              zIndex: depthEffect ? 10 : 6,
              marginTop: depthEffect ? '-28px' : '0px',
              transition: 'all 0.3s cubic-bezier(0.2, 0.9, 0.3, 1)',
            }}
          >
            <div
              className="poster-silhouette"
              style={{
                boxShadow: depthEffect
                  ? '0 18px 45px rgba(0, 0, 0, 0.85), 0 0 30px rgba(56, 189, 248, 0.25)'
                  : '0 10px 30px rgba(0, 0, 0, 0.5)',
                transform: depthEffect ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.3s ease',
              }}
            >
              <span className="portrait-monogram">UK</span>
              <div className="portrait-ring" />
            </div>

            {/* Recruiter Co-Branded Badge */}
            {recruiterCompany && (
              <div className="poster-recruiter-badge">
                <Briefcase size={12} className="text-sky-300" />
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

      {/* Customizer Controls Sheet */}
      <div className="poster-controls-sheet">
        {/* Depth Effect Toggle */}
        <div className="control-group">
          <div className="flex items-center justify-between">
            <label className="control-label">
              <Layers size={13} className="text-sky-400" />
              <span>Live Photo Depth Effect</span>
            </label>
            <button
              type="button"
              onClick={handleToggleDepthEffect}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                depthEffect
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                  : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
              }`}
            >
              <Eye size={12} />
              <span>{depthEffect ? 'Depth: ON (Avatar Overlaps)' : 'Depth: OFF (Text Front)'}</span>
            </button>
          </div>
          <p className="text-[10px] text-zinc-400 m-0">
            {depthEffect
              ? 'Subject separates in 3D space, overlapping the typography name in authentic iOS 18 lock screen style.'
              : 'Typography renders flat directly over the avatar.'}
          </p>
        </div>

        {/* Font Weight Slider */}
        <div className="control-group">
          <div className="flex items-center justify-between">
            <label className="control-label">
              <Sliders size={13} className="text-sky-400" />
              <span>Font Weight: {fontWeight}</span>
            </label>
            <span className="text-xs text-sky-400 font-semibold">
              {fontWeight <= 300
                ? 'Light'
                : fontWeight <= 500
                ? 'Regular'
                : fontWeight <= 700
                ? 'Bold'
                : 'Heavy'}
            </span>
          </div>
          <input
            type="range"
            min="300"
            max="900"
            step="100"
            value={fontWeight}
            onChange={(e) => {
              setFontWeight(Number(e.target.value));
              sound.playTapSound();
            }}
            className="w-full accent-sky-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
          />
          <div className="flex justify-between text-[9px] text-zinc-400">
            <span>Light (300)</span>
            <span>Regular (500)</span>
            <span>Bold (700)</span>
            <span>Heavy (900)</span>
          </div>
        </div>

        {/* Typography Style Selector */}
        <div className="control-group">
          <label className="control-label">
            <Type size={13} className="text-sky-400" />
            <span>Typography Direction</span>
          </label>
          <div className="poster-chips-grid">
            {(Object.keys(FONT_STYLES_DATA) as TypographyStyle[]).map((styleKey) => (
              <button
                key={styleKey}
                type="button"
                className={`poster-chip ${typography === styleKey ? 'active' : ''}`}
                onClick={() => handleSelectFont(styleKey)}
              >
                <span>{FONT_STYLES_DATA[styleKey].name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Color Gradient Treatment Selector */}
        <div className="control-group">
          <label className="control-label">
            <Palette size={13} className="text-sky-400" />
            <span>Photographic Color Treatment</span>
          </label>
          <div className="poster-chips-grid">
            {(Object.keys(GRADIENTS_DATA) as ColorGradient[]).map((gradKey) => (
              <button
                key={gradKey}
                type="button"
                className={`poster-chip ${gradient === gradKey ? 'active' : ''}`}
                onClick={() => handleSelectGradient(gradKey)}
              >
                <span>{GRADIENTS_DATA[gradKey].name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recruiter Co-Branding Input */}
        <div className="control-group">
          <label className="control-label">
            <Briefcase size={13} className="text-sky-400" />
            <span>Recruiter Co-Branding Company</span>
          </label>
          <div className="recruiter-input-wrap">
            <Briefcase size={14} className="text-sky-400" />
            <input
              type="text"
              value={recruiterCompany}
              onChange={(e) => setRecruiterCompany(e.target.value)}
              placeholder="e.g. Google, Apple, Microsoft, NVIDIA"
              className="recruiter-input"
            />
          </div>
        </div>

        {/* Quick Save & Share Action Button */}
        <button
          type="button"
          onClick={handleSaveAndShare}
          className="w-full py-3 px-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 hover:opacity-95 active:scale-[0.98] transition-all"
        >
          <Share2 size={14} />
          <span>Save &amp; Share Custom Contact Poster</span>
        </button>
      </div>
    </div>
  );
}
