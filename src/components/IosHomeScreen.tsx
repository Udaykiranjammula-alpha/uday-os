import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { GitHubWidget } from './GitHubWidget';
import { CalWidget } from './CalWidget';
import { AppleSiliconWidget } from './AppleSiliconWidget';
import {
  Search,
  Sliders,
  Check,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Columns,
  Radio,
  Share2,
  Presentation,
  Wand2,
} from 'lucide-react';
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
  const [pageIndex, setPageIndex] = useState<number>(0); // 0 = Page 1 (Main & GitHub), 1 = Page 2 (Engineering Suite)
  const [appearance, setAppearance] = useState<AppearanceMode>('default');
  const [tintColor, setTintColor] = useState<TintColor>('amber');
  const [iconSize, setIconSize] = useState<IconSize>('small');
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  // Touch & Pointer horizontal swipe tracking
  const dragRef = useRef<{ startX: number; startY: number; isDown: boolean }>({
    startX: 0,
    startY: 0,
    isDown: false,
  });

  const handleNav = (route: string) => {
    sound.playTapSound();
    onNavigate(route);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only track if left mouse button or touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      isDown: true,
    };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragRef.current.isDown) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    dragRef.current.isDown = false;

    // Horizontal swipe gesture check (only if horizontal movement is dominant)
    if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0 && pageIndex === 0) {
        sound.playTapSound();
        setPageIndex(1);
      } else if (dx > 0 && pageIndex === 1) {
        sound.playTapSound();
        setPageIndex(0);
      }
    }
  };

  // Keyboard navigation between home pages
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && pageIndex === 0) {
        sound.playTapSound();
        setPageIndex(1);
      } else if (e.key === 'ArrowLeft' && pageIndex === 1) {
        sound.playTapSound();
        setPageIndex(0);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pageIndex]);

  const getContainerClasses = () => {
    const list = ['ios-homescreen-view'];
    if (appearance === 'tinted') list.push(`home-tint-${tintColor}`);
    if (appearance === 'dark') list.push('home-dark-icons');
    if (iconSize === 'large') list.push('icons-large');
    return list.join(' ');
  };

  return (
    <div
      className={getContainerClasses()}
      style={{
        flex: 1,
        height: '100%',
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        position: 'relative',
        userSelect: 'none',
      }}
    >
      {/* Horizontal Carousel Viewport */}
      <div
        className="ios-homescreen-viewport"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          dragRef.current.isDown = false;
        }}
        style={{
          flex: 1,
          minHeight: 0,
          width: '100%',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <motion.div
          className="ios-homescreen-slider"
          animate={{ x: `-${pageIndex * 100}%` }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          style={{
            display: 'flex',
            width: '200%',
            height: '100%',
          }}
        >
          {/* ==================== PAGE 1: CORE PORTFOLIO & GITHUB SUITE ==================== */}
          <div
            className="ios-homescreen-page page-1"
            style={{
              width: '50%',
              height: '100%',
              padding: '0 16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxSizing: 'border-box',
              overflow: 'hidden',
            }}
          >
            {/* Top Wide GitHub Heatmap Widget (Always prominent at the top) */}
            <section className="widget-row-top" style={{ marginTop: '4px' }}>
              <GitHubWidget onClick={() => handleNav('github')} />
            </section>

            {/* Middle Row: Cal.com 15-min call + 2x2 App Icons */}
            <section className="widget-grid-middle" style={{ marginTop: '6px' }}>
              <CalWidget onClick={() => handleNav('contact')} />

              <div className="apps-quad-grid">
                {/* LinkedIn Experience */}
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

                {/* Developer Terminal */}
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

                {/* Projects Showcase */}
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

                {/* Camera */}
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

            {/* Row 1: Core Apps */}
            <section className="apps-single-row" style={{ marginTop: '4px' }}>
              {/* Uday AI */}
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

              {/* LeetCode */}
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

              {/* Dev Dash Arcade */}
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

              {/* World Clock */}
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

            {/* Row 2: Essential Utilities */}
            <section className="apps-single-row row-three" style={{ marginTop: '4px' }}>
              {/* Max Cal Calculator */}
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
                <div className="ios-icon-box">
                  <img src="/ios/notes.svg" alt="Notes" width={52} height={52} />
                </div>
                <span className="ios-icon-title">Notes</span>
              </button>
            </section>
          </div>

          {/* ==================== PAGE 2: ENGINEERING, MEDIA & SPATIAL SUITE ==================== */}
          <div
            className="ios-homescreen-page page-2"
            style={{
              width: '50%',
              height: '100%',
              padding: '0 16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxSizing: 'border-box',
              overflow: 'hidden',
            }}
          >
            {/* Top Silicon Telemetry Widget */}
            <section className="widget-row-top" style={{ marginTop: '4px' }}>
              <AppleSiliconWidget onClick={() => handleNav('benchmark')} />
            </section>

            {/* Row 1: Media & Creative */}
            <section className="apps-single-row" style={{ marginTop: '6px' }}>
              {/* Photos Gallery */}
              <button
                type="button"
                className="ios-home-icon-btn"
                onClick={() => handleNav('photos')}
                aria-label="Photos application"
              >
                <div className="ios-icon-box">
                  <img src="/ios/photos.png" alt="Photos" width={52} height={52} />
                </div>
                <span className="ios-icon-title">Photos</span>
              </button>

              {/* Apple Maps 3D Flyover */}
              <button
                type="button"
                className="ios-home-icon-btn"
                onClick={() => handleNav('maps')}
                aria-label="Apple Maps 3D Flyover"
              >
                <div className="ios-icon-box maps-home-box">
                  <span style={{ fontSize: 26 }}>🗺️</span>
                  <span className="app-red-badge">3D</span>
                </div>
                <span className="ios-icon-title">Maps</span>
              </button>

              {/* Contact Poster Studio */}
              <button
                type="button"
                className="ios-home-icon-btn"
                onClick={() => handleNav('poster')}
                aria-label="iOS 18 Contact Poster Studio"
              >
                <div className="ios-icon-box poster-home-box">
                  <span style={{ fontSize: 26 }}>📇</span>
                  <span className="app-red-badge">POSTER</span>
                </div>
                <span className="ios-icon-title">Poster</span>
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

            {/* Row 2: Silicon & Multi-Window */}
            <section className="apps-single-row" style={{ marginTop: '4px' }}>
              {/* Geekbench Benchmark */}
              <button
                type="button"
                className="ios-home-icon-btn"
                onClick={() => handleNav('benchmark')}
                aria-label="Geekbench Benchmark"
              >
                <div className="ios-icon-box benchmark-home-box">
                  <span style={{ fontSize: 26 }}>⚡</span>
                  <span className="app-red-badge">3nm</span>
                </div>
                <span className="ios-icon-title">Geekbench</span>
              </button>

              {/* Genmoji Studio */}
              <button
                type="button"
                className="ios-home-icon-btn"
                onClick={() => handleNav('genmoji')}
                aria-label="Apple Intelligence Genmoji"
              >
                <div className="ios-icon-box genmoji-home-box">
                  <span style={{ fontSize: 26 }}>🎨</span>
                  <span className="app-ai-glow-ring" />
                </div>
                <span className="ios-icon-title">Genmoji</span>
              </button>

              {/* VisionOS Spatial 3D */}
              <button
                type="button"
                className="ios-home-icon-btn"
                onClick={() => handleNav('spatial-gallery')}
                aria-label="VisionOS Spatial Hologram 3D Gallery"
              >
                <div className="ios-icon-box spatial-home-box">
                  <span style={{ fontSize: 26 }}>👓</span>
                  <span className="app-red-badge">3D</span>
                </div>
                <span className="ios-icon-title">Spatial 3D</span>
              </button>

              {/* Stage Manager Split View */}
              <button
                type="button"
                className="ios-home-icon-btn"
                onClick={() => handleNav('splitview')}
                aria-label="Stage Manager Split View"
              >
                <div className="ios-icon-box splitview-home-box">
                  <span style={{ fontSize: 24 }}>📱</span>
                  <span className="app-red-badge">SPLIT</span>
                </div>
                <span className="ios-icon-title">Split View</span>
              </button>
            </section>

            {/* Row 3: Lifestyle & Communication */}
            <section className="apps-single-row" style={{ marginTop: '4px' }}>
              {/* Fitness Rings */}
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

              {/* FaceTime Call */}
              <button
                type="button"
                className="ios-home-icon-btn"
                onClick={() => handleNav('facetime')}
                aria-label="FaceTime application"
              >
                <div className="ios-icon-box facetime-home-box">
                  <span style={{ fontSize: 26 }}>📹</span>
                  <span className="app-red-badge">LIVE</span>
                </div>
                <span className="ios-icon-title">FaceTime</span>
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

              {/* App Store */}
              <button
                type="button"
                className="ios-home-icon-btn"
                onClick={() => handleNav('appstore')}
                aria-label="Apple App Store releases"
              >
                <div className="ios-icon-box appstore-home-box">
                  <span style={{ fontSize: 28 }}>🏪</span>
                  <span className="app-red-badge">STORE</span>
                </div>
                <span className="ios-icon-title">App Store</span>
              </button>
            </section>
          </div>
        </motion.div>

        {/* Side Swipe Chevron Indicators for Desktop / Tablet */}
        {pageIndex === 0 && (
          <button
            type="button"
            className="ios-home-page-arrow right"
            onClick={() => {
              sound.playTapSound();
              setPageIndex(1);
            }}
            aria-label="Swipe to Page 2 (Engineering Suite)"
            title="Swipe to Engineering Suite (or press →)"
            style={{
              position: 'absolute',
              right: '4px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '28px',
              height: '48px',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: 'none',
              borderRadius: '14px',
              color: '#ffffff',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              zIndex: 30,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.15s ease',
            }}
          >
            <ChevronRight size={18} />
          </button>
        )}

        {pageIndex === 1 && (
          <button
            type="button"
            className="ios-home-page-arrow left"
            onClick={() => {
              sound.playTapSound();
              setPageIndex(0);
            }}
            aria-label="Swipe to Page 1 (Main Home Screen)"
            title="Swipe to Main Home Screen (or press ←)"
            style={{
              position: 'absolute',
              left: '4px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '28px',
              height: '48px',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: 'none',
              borderRadius: '14px',
              color: '#ffffff',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              zIndex: 30,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.15s ease',
            }}
          >
            <ChevronLeft size={18} />
          </button>
        )}
      </div>

      {/* iOS 18 Page Dots Indicator Pill Bar */}
      <div
        className="ios-page-dots-bar"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 0 2px',
          zIndex: 20,
        }}
      >
        <button
          type="button"
          onClick={() => {
            sound.playTapSound();
            setPageIndex(0);
          }}
          className={`ios-page-dot ${pageIndex === 0 ? 'active' : ''}`}
          aria-label="Switch to Page 1"
          style={{
            width: pageIndex === 0 ? '16px' : '7px',
            height: '7px',
            borderRadius: '4px',
            background: pageIndex === 0 ? '#ffffff' : 'rgba(255, 255, 255, 0.35)',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        />
        <button
          type="button"
          onClick={() => {
            sound.playTapSound();
            setPageIndex(1);
          }}
          className={`ios-page-dot ${pageIndex === 1 ? 'active' : ''}`}
          aria-label="Switch to Page 2"
          style={{
            width: pageIndex === 1 ? '16px' : '7px',
            height: '7px',
            borderRadius: '4px',
            background: pageIndex === 1 ? '#ffffff' : 'rgba(255, 255, 255, 0.35)',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        />
      </div>

      {/* Search & iOS 18 Customize Bar */}
      <div
        className="ios-search-pill-container"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          padding: '2px 0 6px',
          zIndex: 20,
        }}
      >
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

      {/* Universal Bottom Dock (Fixed across both pages) */}
      <div className="ios-dock-container" style={{ zIndex: 20 }}>
        <div className="ios-dock-glass-bar">
          {/* Phone / Recruiter Call */}
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
