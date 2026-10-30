import React, { useState } from 'react';
import { GitHubWidget } from './GitHubWidget';
import { CalWidget } from './CalWidget';
import { Search, Sliders, Check, Sparkles, X } from 'lucide-react';
import { sound } from '../services/sound';

interface IosHomeScreenProps {
  onNavigate: (route: string) => void;
  onOpenSearch: () => void;
  onOpenStandBy?: () => void;
}

type AppearanceMode = 'default' | 'dark' | 'tinted';
type TintColor = 'amber' | 'cyan' | 'plum' | 'emerald' | 'violet';
type IconSize = 'small' | 'large';

export function IosHomeScreen({ onNavigate, onOpenSearch, onOpenStandBy }: IosHomeScreenProps) {
  const [appearance, setAppearance] = useState<AppearanceMode>('default');
  const [tintColor, setTintColor] = useState<TintColor>('amber');
  const [iconSize, setIconSize] = useState<IconSize>('small');
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  const handleNav = (route: string) => {
    sound.playTapSound();
    onNavigate(route);
  };

  const getContainerClasses = () => {
    const list = ['ios-homescreen-view'];
    if (appearance === 'tinted') list.push(`home-tint-${tintColor}`);
    if (appearance === 'dark') list.push('home-dark-icons');
    if (iconSize === 'large') list.push('icons-large');
    return list.join(' ');
  };

  return (
    <div className={getContainerClasses()}>
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

          {/* Toolkit / Terminal App */}
          <button
            type="button"
            className="ios-home-icon-btn"
            onClick={() => handleNav('terminal')}
            aria-label="Developer Terminal application"
          >
            <div className="ios-icon-box">
              <img src="/ios/skills.svg" alt="Terminal" width={52} height={52} />
            </div>
            <span className="ios-icon-title">Terminal</span>
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

      {/* Essential Apps Grid - Row 1 */}
      <section className="apps-single-row">
        {/* Uday AI Voice Assistant */}
        <button
          type="button"
          className="ios-home-icon-btn"
          onClick={() => handleNav('ai')}
          aria-label="Uday AI Siri Voice Assistant"
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

        {/* Apple Arcade: Dev Dash Game */}
        <button
          type="button"
          className="ios-home-icon-btn"
          onClick={() => handleNav('arcade')}
          aria-label="Apple Arcade Dev Dash mini-game"
        >
          <div className="ios-icon-box arcade-home-box">
            <span className="arcade-emoji-icon">🕹️</span>
            <span className="app-red-badge">GAME</span>
          </div>
          <span className="ios-icon-title">Arcade</span>
        </button>

        {/* World Clock & Stopwatch */}
        <button
          type="button"
          className="ios-home-icon-btn"
          onClick={() => handleNav('clock')}
          aria-label="Clock application"
        >
          <div className="ios-icon-box clock-home-box">
            <span className="clock-emoji-icon">⏱️</span>
          </div>
          <span className="ios-icon-title">Clock</span>
        </button>
      </section>

      {/* Essential Apps Grid - Row 2 */}
      <section className="apps-single-row row-two">
        {/* Apple App Store */}
        <button
          type="button"
          className="ios-home-icon-btn"
          onClick={() => handleNav('appstore')}
          aria-label="Apple App Store project releases"
        >
          <div className="ios-icon-box appstore-home-box">
            <span style={{ fontSize: 28 }}>🏪</span>
            <span className="app-red-badge">STORE</span>
          </div>
          <span className="ios-icon-title">App Store</span>
        </button>

        {/* Apple Music */}
        <button
          type="button"
          className="ios-home-icon-btn"
          onClick={() => handleNav('music')}
          aria-label="Apple Music application"
        >
          <div className="ios-icon-box music-home-box">
            <span style={{ fontSize: 28 }}>🎵</span>
          </div>
          <span className="ios-icon-title">Music</span>
        </button>

        {/* Apple Fitness Activity Rings */}
        <button
          type="button"
          className="ios-home-icon-btn"
          onClick={() => handleNav('fitness')}
          aria-label="Apple Fitness Activity Rings"
        >
          <div className="ios-icon-box fitness-home-box">
            <span style={{ fontSize: 28 }}>⭕</span>
          </div>
          <span className="ios-icon-title">Fitness</span>
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

      {/* Essential Apps Grid - Row 3 (Native Apple Utilities) */}
      <section className="apps-single-row row-three">
        {/* Apple Calculator */}
        <button
          type="button"
          className="ios-home-icon-btn"
          onClick={() => handleNav('calculator')}
          aria-label="Calculator application"
        >
          <div className="ios-icon-box calculator-home-box">
            <span style={{ fontSize: 28 }}>🧮</span>
          </div>
          <span className="ios-icon-title">Calculator</span>
        </button>

        {/* Apple Weather */}
        <button
          type="button"
          className="ios-home-icon-btn"
          onClick={() => handleNav('weather')}
          aria-label="Weather application"
        >
          <div className="ios-icon-box weather-home-box">
            <span style={{ fontSize: 28 }}>🌦️</span>
          </div>
          <span className="ios-icon-title">Weather</span>
        </button>

        {/* Apple Wallet & Apple Pay */}
        <button
          type="button"
          className="ios-home-icon-btn"
          onClick={() => handleNav('wallet')}
          aria-label="Wallet application"
        >
          <div className="ios-icon-box wallet-home-box">
            <span style={{ fontSize: 28 }}>💳</span>
            <span className="app-red-badge">PAY</span>
          </div>
          <span className="ios-icon-title">Wallet</span>
        </button>

        {/* Notes */}
        <button
          type="button"
          className="ios-home-icon-btn"
          onClick={() => handleNav('notes')}
          aria-label="Notes application"
        >
          <div className="ios-icon-box notes-home-box">
            <span style={{ fontSize: 28 }}>📝</span>
          </div>
          <span className="ios-icon-title">Notes</span>
        </button>
      </section>

      {/* Search & iOS 18 Customize Bar */}
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

        <button
          type="button"
          className="ios-customize-capsule"
          onClick={() => {
            sound.playTapSound();
            setIsCustomizeOpen(true);
          }}
          aria-label="Customize Home Screen"
          title="iOS 18 Tint & Size Customizer"
        >
          <Sliders size={12} className="mr-1" />
          <span>Customize</span>
        </button>

        {onOpenStandBy && (
          <button
            type="button"
            className="ios-customize-capsule standby"
            onClick={() => {
              sound.playTapSound();
              onOpenStandBy();
            }}
            aria-label="Open iOS StandBy mode"
            title="StandBy Mode"
          >
            <span>StandBy</span>
          </button>
        )}
      </div>

      {/* Floating Glass Dock with 4 Core Apps */}
      <div className="ios-dock-container">
        <div className="ios-dock-glass-bar">
          {/* Phone / Recruiter Call Simulation */}
          <button
            type="button"
            className="dock-item-btn"
            onClick={() => handleNav('call')}
            aria-label="Phone & Recruiter Call"
          >
            <div className="dock-icon-relative dock-phone-box">
              <span style={{ fontSize: 26 }}>📞</span>
            </div>
          </button>

          {/* iMessage Recruiter Chat */}
          <button
            type="button"
            className="dock-item-btn"
            onClick={() => handleNav('messages')}
            aria-label="iMessage Recruiter Chat application"
          >
            <div className="dock-icon-relative">
              <img src="/ios/messages.svg" alt="Messages" width={52} height={52} />
              <span className="dock-unread-badge">1</span>
            </div>
          </button>

          {/* GitHub */}
          <button
            type="button"
            className="dock-item-btn"
            onClick={() => handleNav('github')}
            aria-label="GitHub application"
          >
            <img src="/ios/github.svg" alt="GitHub" width={52} height={52} />
          </button>

          {/* Photos */}
          <button
            type="button"
            className="dock-item-btn"
            onClick={() => handleNav('photos')}
            aria-label="Photos Gallery application"
          >
            <img src="/ios/photos.png" alt="Photos" width={52} height={52} />
          </button>
        </div>
      </div>

      {/* iOS 18 Home Screen Customizer Sheet */}
      {isCustomizeOpen && (
        <div
          className="ios-customize-sheet-overlay"
          onClick={() => setIsCustomizeOpen(false)}
        >
          <div
            className="ios-customize-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="customize-sheet-grabber" />

            <div className="customize-header">
              <h3>Home Screen Customizer</h3>
              <button
                type="button"
                className="customize-done-btn"
                onClick={() => setIsCustomizeOpen(false)}
              >
                Done
              </button>
            </div>

            {/* Appearance Toggles */}
            <div className="customize-segmented-control">
              <button
                type="button"
                className={`seg-btn ${appearance === 'default' ? 'active' : ''}`}
                onClick={() => {
                  sound.playTapSound();
                  setAppearance('default');
                }}
              >
                Default
              </button>
              <button
                type="button"
                className={`seg-btn ${appearance === 'dark' ? 'active' : ''}`}
                onClick={() => {
                  sound.playTapSound();
                  setAppearance('dark');
                }}
              >
                Dark
              </button>
              <button
                type="button"
                className={`seg-btn ${appearance === 'tinted' ? 'active' : ''}`}
                onClick={() => {
                  sound.playTapSound();
                  setAppearance('tinted');
                }}
              >
                Tinted
              </button>
            </div>

            {/* Tint Colors Selector */}
            {appearance === 'tinted' && (
              <div className="customize-tints-row">
                {(['amber', 'cyan', 'plum', 'emerald', 'violet'] as TintColor[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`tint-swatch-btn ${tintColor === c ? 'active' : ''} tint-${c}`}
                    onClick={() => {
                      sound.playTapSound();
                      setTintColor(c);
                    }}
                    title={c.toUpperCase()}
                  >
                    {tintColor === c && <Check size={14} className="text-white" />}
                  </button>
                ))}
              </div>
            )}

            {/* Icon Sizing */}
            <div className="customize-size-row">
              <span className="size-label">Icon Size</span>
              <div className="customize-size-pills">
                <button
                  type="button"
                  className={`size-pill ${iconSize === 'small' ? 'active' : ''}`}
                  onClick={() => {
                    sound.playTapSound();
                    setIconSize('small');
                  }}
                >
                  Small
                </button>
                <button
                  type="button"
                  className={`size-pill ${iconSize === 'large' ? 'active' : ''}`}
                  onClick={() => {
                    sound.playTapSound();
                    setIconSize('large');
                  }}
                >
                  Large (Hide Labels)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
