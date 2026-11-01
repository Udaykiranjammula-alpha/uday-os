import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  QrCode,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  GraduationCap,
  ExternalLink,
  Zap,
  Briefcase,
  Mail,
  Copy,
  Check,
  Download,
  GitPullRequest,
  Trophy,
  ArrowRight,
  Code2,
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
  const [qrPassType, setQrPassType] = useState<'resume' | 'student'>('resume');

  // 3D Gyro / Pointer Tilt for Titanium Apple Card
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Gyroscope tilt support on mobile devices
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (activeCard !== 'apple-card') return;
      const gamma = e.gamma || 0; // Left-to-right (-90 to 90)
      const beta = e.beta || 0;   // Front-to-back (-180 to 180)
      const clampedGamma = Math.max(-25, Math.min(25, gamma));
      const clampedBeta = Math.max(-25, Math.min(25, beta - 45)); // assume holding at ~45deg
      setCardTilt({
        x: (clampedBeta / 25) * -12,
        y: (clampedGamma / 25) * 12,
        glareX: 50 + (clampedGamma / 25) * 40,
        glareY: 50 + (clampedBeta / 25) * 40,
      });
    };

    if (window.DeviceOrientationEvent && typeof window.DeviceOrientationEvent === 'function') {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [activeCard]);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeCard !== 'apple-card') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -14;
    const rotateY = ((x - centerX) / centerX) * 14;
    setCardTilt({
      x: rotateX,
      y: rotateY,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
    });
  };

  const handleCardMouseLeave = () => {
    setCardTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
  };

  const handleCardClick = (card: CardType) => {
    sound.playTapSound();
    setActiveCard(card);
    setCardTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
  };

  const handleTriggerApplePay = () => {
    sound.playTapSound();
    setIsPaying(true);
    setPaySuccess(false);

    // Simulate authentic Apple Pay Face ID and NFC checkmark chime
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
    navigator.clipboard?.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const handleOpenResumeQr = () => {
    sound.playTapSound();
    setQrPassType('resume');
    setShowQrModal(true);
  };

  const handleOpenStudentQr = () => {
    sound.playTapSound();
    setQrPassType('student');
    setShowQrModal(true);
  };

  const transactions = [
    {
      id: 'tx-1',
      type: 'oss',
      title: 'Open Source Contribution',
      subtitle: 'Merged PR · Distributed ML Accelerator Engine',
      value: '+1,240 Lines',
      status: 'Verified on GitHub',
      icon: GitPullRequest,
      link: profile.github,
    },
    {
      id: 'tx-2',
      type: 'leetcode',
      title: 'LeetCode Algorithm Streak',
      subtitle: 'Graph Theory & Dynamic Programming',
      value: '+184 Solved',
      status: 'Top 5% Global Complexity',
      icon: Zap,
      action: 'leetcode',
    },
    {
      id: 'tx-3',
      type: 'hackathon',
      title: 'Smart India Hackathon',
      subtitle: 'Koneru Lakshmaiah University Core Lead',
      value: 'Finalist 🏆',
      status: 'Official Recognition',
      icon: Trophy,
    },
    {
      id: 'tx-4',
      type: 'systems',
      title: 'Titan Network Monitor v2.0',
      subtitle: 'C/C++ High-Throughput Packet Pipeline',
      value: '0 Leaks',
      status: 'Production Architecture',
      icon: Cpu,
      link: profile.github,
    },
  ];

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
          onClick={handleOpenResumeQr}
          className="ios-wallet-nav-action"
          aria-label="Resume QR Pass"
          title="Scan Resume QR"
        >
          <QrCode className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="ios-wallet-scrollable">
        <div className="ios-wallet-header">
          <div className="ios-wallet-greeting">
            <span className="ios-wallet-badge">Apple Pay &amp; Identity</span>
            <h2>Uday&apos;s Passes</h2>
          </div>
          <button
            onClick={handleTriggerApplePay}
            className="ios-apple-pay-hero-btn"
            title="Express Recruiter One-Tap Hire"
          >
            <div className="ios-apple-pay-logo">
              <span className="apple-logo"></span>Pay
            </div>
            <span className="ios-pay-subtext">Express Recruiter Hire</span>
          </button>
        </div>

        {/* Card Stack Container */}
        <div className="ios-wallet-stack">
          {/* 1. Titanium Apple Card with 3D Gyro Tilt Effect */}
          <div
            ref={cardRef}
            onClick={() => handleCardClick('apple-card')}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            className={`ios-wallet-card card-apple-card ${
              activeCard === 'apple-card' ? 'is-active' : 'is-stacked'
            }`}
            style={{
              zIndex: activeCard === 'apple-card' ? 30 : 10,
              transform:
                activeCard === 'apple-card'
                  ? `perspective(1000px) rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg) scale3d(1.02, 1.02, 1.02)`
                  : undefined,
              transition:
                activeCard === 'apple-card'
                  ? 'transform 0.08s ease-out, box-shadow 0.2s ease'
                  : 'transform 0.35s cubic-bezier(0.2, 0.9, 0.3, 1)',
            }}
          >
            {/* Dynamic Specular Shimmer Highlight */}
            <div
              className="card-shimmer-highlight"
              style={{
                position: 'absolute',
                inset: 0,
                background: `radial-gradient(circle at ${cardTilt.glareX}% ${cardTilt.glareY}%, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0) 65%)`,
                pointerEvents: 'none',
                borderRadius: '16px',
              }}
            />

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
              <div className="card-title">TITANIUM RECRUITER PASS</div>
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
                <div className="klu-dept">B.Tech - Computer Science &amp; Eng.</div>
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

          {/* 3. Engineering Systems Pass with GitHub & Resume */}
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
                <span className="github-title">Engineering Systems Pass</span>
              </div>
              <div className="github-badge">RESUME READY</div>
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
                <span className="stat-number">3nm</span>
                <span className="stat-label">Systems</span>
              </div>
            </div>

            <div className="card-bottom-row github-bottom">
              <div>
                <div className="github-role-label">ENGINEERING REPOSITORY</div>
                <div className="github-username">@Udaykiranjammula-alpha</div>
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
                Official Apple Card aesthetic with real-time 3D gyro tilt. Authenticate via Face ID for Express Recruiter One-Tap Hire to receive direct contact and verified candidate credentials.
              </p>
              <div className="pass-btn-group">
                <button
                  onClick={handleTriggerApplePay}
                  className="pass-primary-btn"
                >
                  <Zap className="w-4 h-4 mr-1.5 text-amber-500" />
                  Express One-Tap Hire
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
                Valid student identification for Koneru Lakshmaiah Education Foundation. Enrolled in B.Tech Computer Science &amp; Engineering (2023–2027).
              </p>
              <div className="pass-btn-group">
                <button
                  onClick={handleOpenStudentQr}
                  className="pass-primary-btn"
                >
                  <QrCode className="w-4 h-4 mr-1.5" />
                  Show Student Barcode
                </button>
                {onNavigate && (
                  <button
                    onClick={() => {
                      sound.playTapSound();
                      onNavigate('education');
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
                <span className="pass-status-active">GitHub Pro Certified</span>
              </div>
              <p className="pass-description">
                Verified software engineering passport. Download the official PDF resume, scan the QR code pass, or explore 50+ GitHub repositories.
              </p>
              <div className="pass-btn-group">
                <button
                  onClick={handleOpenResumeQr}
                  className="pass-primary-btn"
                >
                  <QrCode className="w-4 h-4 mr-1.5 text-sky-400" />
                  Resume QR Code
                </button>
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

        {/* Transaction History (Open Source, LeetCode, Hackathons, Systems) */}
        <div className="wallet-transactions-section">
          <div className="wallet-tx-header">
            <div>
              <h3 className="wallet-tx-title">Latest Transactions</h3>
              <span className="wallet-tx-sub">High-Impact Engineering Milestones</span>
            </div>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-sky-400 font-semibold hover:underline flex items-center gap-1"
              onClick={() => sound.playTapSound()}
            >
              <span>See All</span>
              <ArrowRight size={11} />
            </a>
          </div>

          <div className="wallet-tx-list">
            {transactions.map((tx) => {
              const IconComp = tx.icon;
              return (
                <div
                  key={tx.id}
                  className="wallet-tx-item cursor-pointer"
                  onClick={() => {
                    sound.playTapSound();
                    if (tx.link) {
                      window.open(tx.link, '_blank');
                    } else if (tx.action && onNavigate) {
                      onNavigate(tx.action);
                    }
                  }}
                >
                  <div className="wallet-tx-left">
                    <div className={`wallet-tx-icon-wrap ${tx.type}`}>
                      <IconComp size={18} />
                    </div>
                    <div>
                      <div className="wallet-tx-name">{tx.title}</div>
                      <div className="wallet-tx-date">{tx.subtitle}</div>
                    </div>
                  </div>
                  <div className="wallet-tx-amount">
                    <div className="wallet-tx-value">{tx.value}</div>
                    <div className="wallet-tx-status">{tx.status}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Express Recruiter One-Tap Hire Authentic Apple Pay Sheet */}
      {isPaying && (
        <div className="ios-apple-pay-overlay" onClick={handleDismissPay}>
          <div
            className="ios-apple-pay-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ios-apple-pay-grabber" />

            <div className="ios-pay-header">
              <span className="pay-logo-symbol"></span>
              <span className="pay-logo-text">Pay · Express Recruiter Hire</span>
            </div>

            <div className="ios-pay-card-preview">
              <div className="pay-card-mini">
                <div className="pay-card-chip" />
                <div className="pay-card-name">UDAY KIRAN JAMMULA</div>
                <div className="pay-card-num">•••• 2027 · A18 PRO</div>
              </div>
            </div>

            <div className="ios-pay-status-area" style={{ width: '100%' }}>
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
                    <p className="pay-prompt-main">Face ID Authenticating</p>
                    <p className="pay-prompt-sub">Double-click side button or hold near reader</p>
                  </div>
                </div>
              ) : (
                <div className="ios-pay-success">
                  <div className="ios-pay-check-ring">
                    <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
                  </div>
                  <h3 className="pay-done-title">Candidate Verified!</h3>
                  <p className="pay-done-msg">
                    Uday Kiran Jammula is ready to join your engineering team. Direct recruiter contact channel unlocked!
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
                        <Briefcase className="w-4 h-4 mr-1" />
                        <span>Schedule Interview</span>
                      </button>
                    )}
                  </div>

                  <div className="mt-2 flex gap-2 w-full">
                    <a
                      href={profile.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2 px-3 bg-zinc-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-zinc-700"
                      onClick={() => sound.playTapSound()}
                    >
                      <Download size={13} />
                      <span>Download Resume</span>
                    </a>
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2 px-3 bg-zinc-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-zinc-700"
                      onClick={() => sound.playTapSound()}
                    >
                      <ExternalLink size={13} />
                      <span>GitHub Code</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            <button onClick={handleDismissPay} className="ios-pay-close-btn mt-3">
              Done
            </button>
          </div>
        </div>
      )}

      {/* QR Code Pass Modal (Resume Download & Student Pass) */}
      {showQrModal && (
        <div className="ios-qr-modal-overlay" onClick={() => setShowQrModal(false)}>
          <div className="ios-qr-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="ios-qr-header">
              <h3>{qrPassType === 'resume' ? 'Engineering Systems Pass' : 'Digital Scholar Pass'}</h3>
              <p>{qrPassType === 'resume' ? 'Official Resume Download & Portfolio' : 'KL University · 2023 - 2027'}</p>
            </div>

            <div className="ios-qr-code-box">
              <svg className="w-48 h-48 mx-auto" viewBox="0 0 100 100" fill="currentColor">
                {/* Authentic QR Code Matrix pattern */}
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
              <p className="qr-id-text">
                {qrPassType === 'resume' ? 'RESUME-UDAY-KIRAN-2024' : 'KLU-CSE-2300030000'}
              </p>
              <p className="qr-desc-text">
                {qrPassType === 'resume'
                  ? 'Scan with smartphone camera to download verified resume PDF & view GitHub'
                  : 'Scan with smartphone camera to view academic records & student credentials'}
              </p>
            </div>

            <div className="flex flex-col gap-2 mb-3">
              <a
                href={profile.resumeUrl}
                download="Uday_Kiran_Jammula_Resume.pdf"
                className="w-full py-2.5 px-4 bg-sky-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-sky-400 transition-colors"
                onClick={() => sound.playTapSound()}
              >
                <Download size={14} />
                <span>Download Resume (PDF)</span>
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 bg-zinc-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-zinc-700 transition-colors"
                onClick={() => sound.playTapSound()}
              >
                <ExternalLink size={14} />
                <span>Open GitHub Profile</span>
              </a>
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
