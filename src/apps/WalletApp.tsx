import React, { useState } from 'react';
import {
  ChevronLeft,
  Plus,
  QrCode,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  GraduationCap,
  ExternalLink,
  Zap,
  Briefcase,
  Share2,
  PhoneCall,
  Mail,
  Copy,
  Check,
} from 'lucide-react';
import { sound } from '../services/sound';
import { profile } from '../data/profile';

interface WalletAppProps {
  onBack: () => void;
  onNavigate?: (route: string) => void;
}

type CardType = 'apple-card' | 'klu-id' | 'github-pass';

export function WalletApp({ onBack, onNavigate }: WalletAppProps) {
  const [activeCard, setActiveCard] = useState<CardType>('apple-card');
  const [isPaying, setIsPaying] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const handleCardClick = (card: CardType) => {
    sound.playTapSound();
    setActiveCard(card);
  };

  const handleTriggerApplePay = () => {
    sound.playTapSound();
    setIsPaying(true);
    setPaySuccess(false);

    // Simulate authentic Apple Pay Face ID and NFC checkmark
    setTimeout(() => {
      sound.playApplePayChime();
      setPaySuccess(true);
    }, 1200);
  };

  const handleDismissPay = () => {
    sound.playTapSound();
    setIsPaying(false);
    setPaySuccess(false);
  };

  const handleCopyEmail = () => {
    sound.playTapSound();
    navigator.clipboard?.writeText('udaykiran.jammula@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="ios-wallet-page">
      {/* Navigation Bar */}
      <div className="ios-wallet-nav">
        <button
          onClick={() => {
            sound.playTapSound();
            onBack();
          }}
          className="ios-wallet-nav-back"
          aria-label="Back"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
          <span>Home</span>
        </button>
        <h1 className="ios-wallet-nav-title">Wallet</h1>
        <button
          onClick={() => setShowQrModal(true)}
          className="ios-wallet-nav-action"
          aria-label="QR Pass"
        >
          <QrCode className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="ios-wallet-scrollable">
        <div className="ios-wallet-header">
          <div className="ios-wallet-greeting">
            <span className="ios-wallet-badge">Apple Pay & Identity</span>
            <h2>Uday&apos;s Passes</h2>
          </div>
          <button
            onClick={handleTriggerApplePay}
            className="ios-apple-pay-hero-btn"
          >
            <div className="ios-apple-pay-logo">
              <span className="apple-logo"></span>Pay
            </div>
            <span className="ios-pay-subtext">Double-Click / Tap to Verify</span>
          </button>
        </div>

        {/* Card Stack Container */}
        <div className="ios-wallet-stack">
          {/* 1. Titanium "Hire Uday" Pass (Apple Card Aesthetic) */}
          <div
            onClick={() => handleCardClick('apple-card')}
            className={`ios-wallet-card card-apple-card ${
              activeCard === 'apple-card' ? 'is-active' : 'is-stacked'
            }`}
            style={{ zIndex: activeCard === 'apple-card' ? 30 : 10 }}
          >
            <div className="card-shimmer-highlight" />
            <div className="card-top-row">
              <div className="card-chip-container">
                <div className="card-emv-chip" />
                <svg
                  className="card-contactless-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M8.5 16.5a5 5 0 0 1 0-9" />
                  <path d="M12 19a8.5 8.5 0 0 0 0-14" />
                  <path d="M15.5 21.5a12 12 0 0 0 0-19" />
                </svg>
              </div>
              <div className="card-brand">
                <span className="apple-icon"></span>
                <span>Card</span>
              </div>
            </div>

            <div className="card-center-details">
              <div className="card-title">TIANIUM RECRUITER PASS</div>
              <div className="card-benefit">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 inline mr-1" />
                <span>Full-Stack Mastery · 184+ LeetCode · Zero Tech Debt</span>
              </div>
            </div>

            <div className="card-bottom-row">
              <div>
                <div className="card-holder-label">CANDIDATE</div>
                <div className="card-holder-name">UDAY KIRAN JAMMULA</div>
              </div>
              <div className="card-expiry">
                <div className="card-holder-label">STATUS</div>
                <div className="card-status-pill">READY TO HIRE</div>
              </div>
            </div>
          </div>

          {/* 2. KL University Digital Student ID */}
          <div
            onClick={() => handleCardClick('klu-id')}
            className={`ios-wallet-card card-klu-id ${
              activeCard === 'klu-id' ? 'is-active' : 'is-stacked'
            }`}
            style={{ zIndex: activeCard === 'klu-id' ? 30 : 15 }}
          >
            <div className="klu-card-glow" />
            <div className="card-top-row">
              <div className="klu-uni-brand">
                <GraduationCap className="w-5 h-5 text-amber-300" />
                <div>
                  <div className="klu-name">KL UNIVERSITY</div>
                  <div className="klu-sub">Vaddeswaram, Andhra Pradesh</div>
                </div>
              </div>
              <div className="klu-verified-seal">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>OFFICIAL ID</span>
              </div>
            </div>

            <div className="klu-center-student">
              <div className="klu-avatar">UK</div>
              <div className="klu-info">
                <div className="klu-student-name">Uday Kiran Jammula</div>
                <div className="klu-dept">B.Tech - Computer Science & Eng.</div>
                <div className="klu-batch">Class of 2023 – 2027</div>
              </div>
            </div>

            <div className="card-bottom-row klu-bottom">
              <div>
                <div className="klu-meta-label">REGISTER NO</div>
                <div className="klu-reg-no">2300030000 · SCHOLAR</div>
              </div>
              <div className="klu-barcode-preview">
                <div className="klu-barcode-lines" />
                <span>NFC ENABLED</span>
              </div>
            </div>
          </div>

          {/* 3. GitHub Pro / Open Source Engineer Pass */}
          <div
            onClick={() => handleCardClick('github-pass')}
            className={`ios-wallet-card card-github-pass ${
              activeCard === 'github-pass' ? 'is-active' : 'is-stacked'
            }`}
            style={{ zIndex: activeCard === 'github-pass' ? 30 : 20 }}
          >
            <div className="github-card-mesh" />
            <div className="card-top-row">
              <div className="github-brand">
                <span className="github-logo-symbol">⚡</span>
                <span className="github-title">GitHub Pro Certified</span>
              </div>
              <div className="github-badge">50+ REPOS</div>
            </div>

            <div className="github-stats-grid">
              <div className="github-stat-pill">
                <span className="stat-number">184+</span>
                <span className="stat-label">LeetCode</span>
              </div>
              <div className="github-stat-pill">
                <span className="stat-number">100%</span>
                <span className="stat-label">TypeScript</span>
              </div>
              <div className="github-stat-pill">
                <span className="stat-number">365d</span>
                <span className="stat-label">Git Streak</span>
              </div>
            </div>

            <div className="card-bottom-row github-bottom">
              <div>
                <div className="github-role-label">ENGINEERING PROFILE</div>
                <div className="github-username">@UdayKiranJammula</div>
              </div>
              <div className="github-live-dot">
                <span className="live-ping" />
                <span>OPEN TO WORK</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Pass Actions & Details */}
        <div className="ios-wallet-pass-actions">
          {activeCard === 'apple-card' && (
            <div className="pass-detail-pane">
              <div className="pass-detail-header">
                <h3>Titanium Recruiter Pass</h3>
                <span className="pass-status-active">NFC Ready</span>
              </div>
              <p className="pass-description">
                Official Apple Card styling for technical recruiting. Authenticate via Face ID to schedule interviews or receive direct recruiter offer packages.
              </p>
              <div className="pass-btn-group">
                <button
                  onClick={handleTriggerApplePay}
                  className="pass-primary-btn"
                >
                  <Zap className="w-4 h-4 mr-1.5" />
                  Hold Near Reader / Pay
                </button>
                {onNavigate && (
                  <button
                    onClick={() => {
                      sound.playTapSound();
                      onNavigate('contact');
                    }}
                    className="pass-secondary-btn"
                  >
                    <Briefcase className="w-4 h-4 mr-1.5" />
                    Interview Uday
                  </button>
                )}
              </div>
            </div>
          )}

          {activeCard === 'klu-id' && (
            <div className="pass-detail-pane">
              <div className="pass-detail-header">
                <h3>KL University Campus ID</h3>
                <span className="pass-status-verified">Verified Scholar</span>
              </div>
              <p className="pass-description">
                Valid student identification for Koneru Lakshmaiah Education Foundation (Deemed to be University). Enrolled in B.Tech Computer Science & Engineering.
              </p>
              <div className="pass-btn-group">
                <button
                  onClick={() => setShowQrModal(true)}
                  className="pass-primary-btn"
                >
                  <QrCode className="w-4 h-4 mr-1.5" />
                  Show ID Barcode & QR
                </button>
                {onNavigate && (
                  <button
                    onClick={() => {
                      sound.playTapSound();
                      onNavigate('experience');
                    }}
                    className="pass-secondary-btn"
                  >
                    <ExternalLink className="w-4 h-4 mr-1.5" />
                    Academic Records
                  </button>
                )}
              </div>
            </div>
          )}

          {activeCard === 'github-pass' && (
            <div className="pass-detail-pane">
              <div className="pass-detail-header">
                <h3>Engineering Systems Pass</h3>
                <span className="pass-status-active">GitHub Pro</span>
              </div>
              <p className="pass-description">
                Full-stack developer passport showcasing high-throughput algorithms, React/TypeScript architecture, and 3D WebGL experiences.
              </p>
              <div className="pass-btn-group">
                {onNavigate && (
                  <button
                    onClick={() => {
                      sound.playTapSound();
                      onNavigate('projects');
                    }}
                    className="pass-primary-btn"
                  >
                    <Cpu className="w-4 h-4 mr-1.5" />
                    View 50+ Projects
                  </button>
                )}
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => sound.playTapSound()}
                  className="pass-secondary-btn"
                >
                  <ExternalLink className="w-4 h-4 mr-1.5" />
                  GitHub Profile
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Apple Pay Full Authentic Face ID Sheet */}
      {isPaying && (
        <div className="ios-apple-pay-overlay" onClick={handleDismissPay}>
          <div
            className="ios-apple-pay-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ios-apple-pay-grabber" />

            <div className="ios-pay-header">
              <span className="pay-logo-symbol"></span>
              <span className="pay-logo-text">Pay</span>
            </div>

            <div className="ios-pay-card-preview">
              <div className="pay-card-mini">
                <div className="pay-card-chip" />
                <div className="pay-card-name">UDAY KIRAN JAMMULA</div>
                <div className="pay-card-num">•••• 2027</div>
              </div>
            </div>

            <div className="ios-pay-status-area">
              {!paySuccess ? (
                <div className="ios-pay-authenticating">
                  <div className="ios-face-id-scanner">
                    <div className="face-id-crosshair top-left" />
                    <div className="face-id-crosshair top-right" />
                    <div className="face-id-crosshair bottom-left" />
                    <div className="face-id-crosshair bottom-right" />
                    <div className="face-id-smile-icon">
                      <div className="smile-eye left" />
                      <div className="smile-eye right" />
                      <div className="smile-mouth" />
                    </div>
                  </div>
                  <div className="ios-pay-prompt">
                    <p className="pay-prompt-main">Hold Near Reader</p>
                    <p className="pay-prompt-sub">Double-click side button to confirm</p>
                  </div>
                </div>
              ) : (
                <div className="ios-pay-success">
                  <div className="ios-pay-check-ring">
                    <CheckCircle2 className="w-14 h-14 text-emerald-400" />
                  </div>
                  <h3 className="pay-done-title">Done</h3>
                  <p className="pay-done-msg">
                    Verified candidate profile! You are connected directly to Uday Kiran Jammula.
                  </p>

                  <div className="pay-done-actions">
                    <button
                      onClick={handleCopyEmail}
                      className="pay-action-btn email"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-1 text-emerald-300" />
                          <span>Copied Email!</span>
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4 mr-1" />
                          <span>Copy Recruiter Email</span>
                        </>
                      )}
                    </button>
                    {onNavigate && (
                      <button
                        onClick={() => {
                          handleDismissPay();
                          onNavigate('contact');
                        }}
                        className="pay-action-btn interview"
                      >
                        <PhoneCall className="w-4 h-4 mr-1" />
                        <span>Schedule Call</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button onClick={handleDismissPay} className="ios-pay-close-btn">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* QR Code Pass Modal */}
      {showQrModal && (
        <div className="ios-qr-modal-overlay" onClick={() => setShowQrModal(false)}>
          <div className="ios-qr-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="ios-qr-header">
              <h3>Digital Scholar Pass</h3>
              <p>KL University · 2023 - 2027</p>
            </div>

            <div className="ios-qr-code-box">
              <svg className="w-48 h-48 mx-auto" viewBox="0 0 100 100" fill="currentColor">
                {/* QR Code Matrix pattern */}
                <rect x="5" y="5" width="25" height="25" fill="#111" />
                <rect x="8" y="8" width="19" height="19" fill="#fff" />
                <rect x="12" y="12" width="11" height="11" fill="#111" />
                <rect x="70" y="5" width="25" height="25" fill="#111" />
                <rect x="73" y="8" width="19" height="19" fill="#fff" />
                <rect x="77" y="12" width="11" height="11" fill="#111" />
                <rect x="5" y="70" width="25" height="25" fill="#111" />
                <rect x="8" y="73" width="19" height="19" fill="#fff" />
                <rect x="12" y="77" width="11" height="11" fill="#111" />
                {/* Data modules */}
                <rect x="35" y="10" width="6" height="6" fill="#111" />
                <rect x="45" y="15" width="6" height="6" fill="#111" />
                <rect x="55" y="8" width="6" height="6" fill="#111" />
                <rect x="35" y="35" width="30" height="30" rx="4" fill="#0071e3" />
                <rect x="42" y="42" width="16" height="16" rx="2" fill="#fff" />
                <rect x="15" y="40" width="8" height="8" fill="#111" />
                <rect x="75" y="45" width="8" height="8" fill="#111" />
                <rect x="40" y="75" width="10" height="10" fill="#111" />
                <rect x="65" y="70" width="12" height="12" fill="#111" />
                <rect x="85" y="85" width="8" height="8" fill="#111" />
              </svg>
            </div>

            <div className="ios-qr-info">
              <p className="qr-id-text">KLU-CSE-2300030000</p>
              <p className="qr-desc-text">Scan with any smartphone camera to view verified resume & portfolio</p>
            </div>

            <button onClick={() => setShowQrModal(false)} className="ios-qr-close-btn">
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
