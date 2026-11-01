import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  X,
  Sparkles,
  Download,
  Mail,
  PhoneCall,
  ExternalLink,
  Cpu,
} from 'lucide-react';
import { sound } from '../services/sound';

interface ApplePayRecruiterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (route: string) => void;
}

export function ApplePayRecruiterSheet({
  isOpen,
  onClose,
  onNavigate,
}: ApplePayRecruiterSheetProps) {
  const [authStatus, setAuthStatus] = useState<'idle' | 'scanning' | 'verified'>('idle');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleTriggerFaceID = () => {
    sound.playTapSound();
    setAuthStatus('scanning');

    setTimeout(() => {
      sound.playApplePayChime();
      setAuthStatus('verified');
    }, 1200);
  };

  const handleDownloadResume = () => {
    sound.playTapSound();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
    // Trigger download or navigation to resume app
    if (onNavigate) {
      onNavigate('resume');
      onClose();
    }
  };

  const handleEmailOffer = () => {
    sound.playTapSound();
    const mailto = `mailto:jammulaudaykiran12@gmail.com?subject=Software%20Engineering%20Role%20-%20Interview%20Invitation&body=Hi%20Uday,%0A%0AWe%20were%20blown%20away%20by%20your%20interactive%20UDAY%20OS%20portfolio.%20We%20would%20love%20to%20invite%20you%20for%20an%20interview%20for%20our%20engineering%20team.%0A%0ABest%20regards,%0A[Recruiter%20Name]%0A[Company]`;
    window.open(mailto, '_blank');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="studio-modal-backdrop" onClick={onClose}>
        <motion.div
          className="apple-pay-sheet"
          initial={{ y: 80, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="apple-pay-header">
            <div className="apple-pay-brand">
              <span className="apple-glyph"></span>
              <span>Pay · Recruiter Express</span>
            </div>
            <button
              type="button"
              className="apple-pay-close"
              onClick={onClose}
              aria-label="Dismiss Apple Pay"
            >
              <X size={15} />
            </button>
          </div>

          {/* Titanium Laser Apple Card */}
          <div className="apple-card-container">
            <div className="apple-card-titanium">
              <div className="apple-card-top">
                <span className="card-chip" />
                <span className="card-logo"> Card</span>
              </div>
              <div className="apple-card-middle">
                <span className="card-chip-number">•••• •••• •••• 2027</span>
                <span className="card-tier-badge">A18 PRO TIER</span>
              </div>
              <div className="apple-card-bottom">
                <div className="card-holder-info">
                  <span className="card-label">TALENT CANDIDATE</span>
                  <span className="card-name">UDAY KIRAN JAMMULA</span>
                </div>
                <div className="card-reward">
                  <span className="reward-pct">3%</span>
                  <span className="reward-sub">DAILY IMPACT</span>
                </div>
              </div>
            </div>
          </div>

          {/* Authentication State */}
          <div className="apple-pay-action-section">
            {authStatus === 'idle' && (
              <div className="pay-prompt-box">
                <p className="pay-instructions">
                  Double-Click or Tap to Authenticate with Face ID & Generate Recruiter Offer Sheet
                </p>
                <button
                  type="button"
                  className="face-id-confirm-btn"
                  onClick={handleTriggerFaceID}
                >
                  <ShieldCheck size={18} />
                  <span>Authenticate with Face ID</span>
                </button>
              </div>
            )}

            {authStatus === 'scanning' && (
              <div className="pay-scanning-box">
                <div className="face-id-scanner-rings">
                  <div className="scanner-ring outer" />
                  <div className="scanner-ring inner" />
                  <span className="face-id-smile-icon">:)</span>
                </div>
                <span className="scanning-text">Scanning Face ID...</span>
              </div>
            )}

            {authStatus === 'verified' && (
              <motion.div
                className="pay-success-box"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="verified-badge-row">
                  <CheckCircle2 size={24} className="text-emerald-400" />
                  <h4>Face ID Verified · Candidate Unlocked</h4>
                </div>

                <div className="recruiter-receipt-card">
                  <div className="receipt-line">
                    <span>Engineering Role</span>
                    <strong>Full-Stack / Systems Engineer</strong>
                  </div>
                  <div className="receipt-line">
                    <span>Availability</span>
                    <strong className="text-emerald-400">Immediate Internship / FTE</strong>
                  </div>
                  <div className="receipt-line">
                    <span>Core Stack</span>
                    <strong>React 18 · Vite · Three.js · Python · C++</strong>
                  </div>
                </div>

                <div className="receipt-actions">
                  <button
                    type="button"
                    className="receipt-btn primary"
                    onClick={handleEmailOffer}
                  >
                    <Mail size={15} />
                    <span>Send Interview Offer Email</span>
                  </button>

                  <button
                    type="button"
                    className="receipt-btn secondary"
                    onClick={handleDownloadResume}
                  >
                    <Download size={15} />
                    <span>{downloadSuccess ? 'Resume Opened!' : 'View Resume App'}</span>
                  </button>

                  <a
                    href="tel:+919391060960"
                    className="receipt-btn tertiary"
                    onClick={() => sound.playTapSound()}
                  >
                    <PhoneCall size={14} />
                    <span>Call Direct (+91 93910 60960)</span>
                  </a>
                </div>
              </motion.div>
            )}
          </div>

          <div className="apple-pay-footer">
            <span className="secure-element-tag">
              <Cpu size={12} className="text-cyan inline mr-1" />
              Protected by Apple Secure Enclave & A18 Pro Cryptography
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
