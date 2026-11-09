import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { GitHubWidget } from './GitHubWidget';
import { CalWidget } from './CalWidget';
import { AppleSiliconWidget } from './AppleSiliconWidget';
import {
  Search,
  Sliders,
  Check,
  ChevronRight,
  ChevronLeft,
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
  const [pageIndex, setPageIndex] = useState<number>(0); // 0 = Page 1 (Main & GitHub), 1 = Page 2 (Engineering Suite), 2 = Page 3 (Spatial & Academic Suite)
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
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleNav = (route: string) => {
    sound.playTapSound();
    onNavigate(route);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      isDown: true,
    };
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.isDown) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (Math.abs(dx) > Math.abs(dy)) {
      setDragOffset(dx);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragRef.current.isDown) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    dragRef.current.isDown = false;
    setIsDragging(false);
    setDragOffset(0);

    // Horizontal swipe gesture check
    if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0 && pageIndex < 2) {
        sound.playTapSound();
        setPageIndex((p) => p + 1);
      } else if (dx > 0 && pageIndex > 0) {
        sound.playTapSound();
        setPageIndex((p) => p - 1);
      }
    }
  };

  // Keyboard navigation between home pages
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && pageIndex < 2) {
        sound.playTapSound();
        setPageIndex((p) => p + 1);
      } else if (e.key === 'ArrowLeft' && pageIndex > 0) {
        sound.playTapSound();
        setPageIndex((p) => p - 1);
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
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          dragRef.current.isDown = false;
          setIsDragging(false);
          setDragOffset(0);
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
          animate={{
            x: isDragging
              ? `calc(-${pageIndex * (100 / 3)}% + ${dragOffset}px)`
              : `-${pageIndex * (100 / 3)}%`,
          }}
          transition={isDragging ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32 }}
          style={{
            display: 'flex',
            width: '300%',
            height: '100%',
          }}
        >
          {/* ==================== PAGE 1: CORE PORTFOLIO & GITHUB SUITE ==================== */}
          <div
            className="ios-homescreen-page page-1"
            style={{
              width: '33.333333%',
              height: '100%',
              padding: '0 16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxSizing: 'border-box',
              overflow: 'hidden',
            }}
          >
            {/* Top Wide GitHub Heatmap Widget (Prominent at top) */}
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
          </div>

          {/* ==================== PAGE 2: ENGINEERING & SYSTEMS SUITE ==================== */}
          <div
            className="ios-homescreen-page page-2"
            style={{
              width: '33.333333%',
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

            {/* Row 1: Pro Developer Tools */}
            <section className="apps-single-row" style={{ marginTop: '4px' }}>
              {/* Xcode Cloud In-Phone IDE */}
              <button
                type="button"
                className="ios-home-icon-btn"
                onClick={() => handleNav('xcode')}
                aria-label="Xcode Cloud In-Phone Compiler"
              >
                <div className="ios-icon-box xcode-home-box">
                  <span style={{ fontSize: 26 }}>🛠️</span>
                  <span className="app-red-badge">A18</span>
                </div>
                <span className="ios-icon-title">Xcode</span>
              </button>

              {/* Embedded Systems Lab */}
              <button
                type="button"
                className="ios-home-icon-btn"
                onClick={() => handleNav('embedded-lab')}
                aria-label="ESP32 Dual-Core FreeRTOS & Oscilloscope Lab"
              >
                <div className="ios-icon-box embedded-home-box">
                  <span style={{ fontSize: 26 }}>⚡</span>
                  <span className="app-red-badge">RTOS</span>
                </div>
                <span className="ios-icon-title">Systems Lab</span>
              </button>

              {/* Calculator */}
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

            {/* Row 2: Utilities & Spatial Tools */}
            <section className="apps-single-row" style={{ marginTop: '4px' }}>
              {/* Weather */}
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
            </section>

            {/* Row 3: Lifestyle & Media */}
            <section className="apps-single-row" style={{ marginTop: '4px' }}>
              {/* Fitness Activity Rings */}
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

          {/* ==================== PAGE 3: SPATIAL, ACADEMIC & PRO SUITE ==================== */}
          <div
            className="ios-homescreen-page page-3"
            style={{
              width: '33.333333%',
              height: '100%',
              padding: '0 16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxSizing: 'border-box',
              overflow: 'hidden',
            }}
          >
            {/* Top VisionOS & Spatial Header Card */}
            <section className="widget-row-top" style={{ marginTop: '4px' }}>
              <div
                className="ios-pro-suite-card"
                onClick={() => handleNav('spatial-gallery')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleNav('spatial-gallery');
                }}
                aria-label="VisionOS Spatial Computing & Apple Intelligence Suite"
              >
                <div className="pro-suite-badge">
                  <span className="pro-suite-dot" />
                  <span>SPATIAL &amp; PRO SUITE</span>
                </div>
                <div className="pro-suite-title">Apple Intelligence &amp; VisionOS</div>
                <div className="pro-suite-desc">
                  Spatial holograms, dual-core telemetry, and macOS Sequoia continuity.
                </div>
              </div>
            </section>

            {/* Row 1: Spatial & Intelligence */}
            <section className="apps-single-row" style={{ marginTop: '4px' }}>
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
            </section>

            {/* Row 2: Credentials & Settings */}
            <section className="apps-single-row" style={{ marginTop: '4px' }}>
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

              {/* Resume & CV */}
              <button
                type="button"
                className="ios-home-icon-btn"
                onClick={() => handleNav('resume')}
                aria-label="Uday Kiran Jammula Resume & CV"
              >
                <div className="ios-icon-box resume-home-box" style={{ background: 'linear-gradient(135deg, #0284c7, #0369a1)', display: 'grid', placeItems: 'center', borderRadius: 14 }}>
                  <span style={{ fontSize: 26 }}>📄</span>
                  <span className="app-red-badge">PDF</span>
                </div>
                <span className="ios-icon-title">Resume</span>
              </button>

              {/* Achievements & Honors */}
              <button
                type="button"
                className="ios-home-icon-btn"
                onClick={() => handleNav('achievements')}
                aria-label="Achievements and Honors"
              >
                <div className="ios-icon-box achievements-home-box" style={{ background: 'linear-gradient(135deg, #d97706, #b45309)', display: 'grid', placeItems: 'center', borderRadius: 14 }}>
                  <span style={{ fontSize: 26 }}>🏆</span>
                  <span className="app-red-badge">AWARDS</span>
                </div>
                <span className="ios-icon-title">Honors</span>
              </button>

              {/* University Education */}
              <button
                type="button"
                className="ios-home-icon-btn"
                onClick={() => handleNav('education')}
                aria-label="KL University Academic Education"
              >
                <div className="ios-icon-box education-home-box" style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', display: 'grid', placeItems: 'center', borderRadius: 14 }}>
                  <span style={{ fontSize: 26 }}>🎓</span>
                  <span className="app-red-badge">KLU</span>
                </div>
                <span className="ios-icon-title">Education</span>
              </button>
            </section>

            {/* Row 3: Professional Suite */}
            <section className="apps-single-row" style={{ marginTop: '4px' }}>
              {/* NameDrop & Contact */}
              <button
                type="button"
                className="ios-home-icon-btn"
                onClick={() => handleNav('contact')}
                aria-label="Contact and NameDrop"
              >
                <div className="ios-icon-box contact-home-box" style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', display: 'grid', placeItems: 'center', borderRadius: 14 }}>
                  <span style={{ fontSize: 26 }}>📇</span>
                  <span className="app-red-badge">VCARD</span>
                </div>
                <span className="ios-icon-title">Contact</span>
              </button>

              {/* Technical Skills Matrix */}
              <button
                type="button"
                className="ios-home-icon-btn"
                onClick={() => handleNav('skills')}
                aria-label="Technical Skills Matrix"
              >
                <div className="ios-icon-box skills-home-box" style={{ background: 'linear-gradient(135deg, #059669, #047857)', display: 'grid', placeItems: 'center', borderRadius: 14 }}>
                  <span style={{ fontSize: 26 }}>🧠</span>
                  <span className="app-red-badge">SKILLS</span>
                </div>
                <span className="ios-icon-title">Skills</span>
              </button>

              {/* Instagram */}
              <button
                type="button"
                className="ios-home-icon-btn"
                onClick={() => handleNav('instagram')}
                aria-label="Instagram social feed"
              >
                <div className="ios-icon-box">
                  <img src="/ios/instagram.svg" alt="Instagram" width={52} height={52} />
                </div>
                <span className="ios-icon-title">Instagram</span>
              </button>

              {/* StandBy Mode */}
              <button
                type="button"
                className="ios-home-icon-btn"
                onClick={() => onOpenStandBy && onOpenStandBy()}
                aria-label="iOS 18 Nightstand StandBy Mode"
              >
                <div className="ios-icon-box standby-home-box" style={{ background: 'linear-gradient(135deg, #ea580c, #c2410c)', display: 'grid', placeItems: 'center', borderRadius: 14 }}>
                  <span style={{ fontSize: 26 }}>🌙</span>
                  <span className="app-red-badge">NIGHT</span>
                </div>
                <span className="ios-icon-title">StandBy</span>
              </button>
            </section>
          </div>
        </motion.div>

        {/* Side Swipe Chevron Indicators for Desktop / Tablet */}
        {pageIndex > 0 && (
          <button
            type="button"
            className="ios-home-page-arrow left"
            onClick={() => {
              sound.playTapSound();
              setPageIndex((p) => p - 1);
            }}
            aria-label={`Swipe to Page ${pageIndex}`}
            title={`Swipe to Page ${pageIndex} (or press ←)`}
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

        {pageIndex < 2 && (
          <button
            type="button"
            className="ios-home-page-arrow right"
            onClick={() => {
              sound.playTapSound();
              setPageIndex((p) => p + 1);
            }}
            aria-label={`Swipe to Page ${pageIndex + 2}`}
            title={`Swipe to Page ${pageIndex + 2} (or press →)`}
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
        {[0, 1, 2].map((idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              sound.playTapSound();
              setPageIndex(idx);
            }}
            className={`ios-page-dot ${pageIndex === idx ? 'active' : ''}`}
            aria-label={`Switch to Page ${idx + 1}`}
            style={{
              width: pageIndex === idx ? '16px' : '7px',
              height: '7px',
              borderRadius: '4px',
              background: pageIndex === idx ? '#ffffff' : 'rgba(255, 255, 255, 0.35)',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          />
        ))}
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

      {/* Universal Bottom Dock (Fixed across all 3 pages) */}
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

            {/* Icon Size Toggle */}
            <div className="customize-section">
              <span className="customize-label">App Icon Size</span>
              <div className="customize-segmented-control">
                <button
                  type="button"
                  className={`seg-btn ${iconSize === 'small' ? 'active' : ''}`}
                  onClick={() => {
                    sound.playTapSound();
                    setIconSize('small');
                  }}
                >
                  Small
                </button>
                <button
                  type="button"
                  className={`seg-btn ${iconSize === 'large' ? 'active' : ''}`}
                  onClick={() => {
                    sound.playTapSound();
                    setIconSize('large');
                  }}
                >
                  Large (No Labels)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
