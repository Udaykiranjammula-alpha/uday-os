import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  Calendar,
  Sparkles,
  Check,
  Building,
} from 'lucide-react';
import { sound } from '../services/sound';
import { voiceAssistant } from '../services/speech';

interface RecruiterCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  callerName?: string;
  callerCompany?: string;
  onOpenContact?: () => void;
}

export function RecruiterCallModal({
  isOpen,
  onClose,
  callerName = 'Sarah Jenkins',
  callerCompany = 'Google / Big Tech Recruiter',
  onOpenContact,
}: RecruiterCallModalProps) {
  const [callState, setCallState] = useState<'incoming' | 'connected'>('incoming');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Play call ringtone on incoming
  useEffect(() => {
    if (isOpen && callState === 'incoming') {
      sound.playCallChime();
      const ringInterval = setInterval(() => {
        sound.playCallChime();
      }, 3500);
      return () => clearInterval(ringInterval);
    }
  }, [isOpen, callState]);

  // Call timer once connected
  useEffect(() => {
    if (isOpen && callState === 'connected') {
      const timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);

      // Synthesize Recruiter Voice Message
      voiceAssistant.speak(
        'Hello Uday! We reviewed your portfolio, especially your LeetCode problem solving, systems architecture, and full-stack projects. We are thoroughly impressed and would love to schedule a software engineering interview with you!'
      );

      return () => clearInterval(timer);
    }
  }, [isOpen, callState]);

  const handleAccept = () => {
    sound.playTapSound();
    setCallState('connected');
    setCallDuration(0);
  };

  const handleDecline = () => {
    sound.playLockSound();
    voiceAssistant.stopSpeaking();
    setCallState('incoming');
    onClose();
  };

  const handleScheduleOffer = () => {
    sound.playTapSound();
    navigator.clipboard?.writeText('jammulaudaykiran12@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 3000);
    onOpenContact?.();
  };

  const formatCallTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="recruiter-call-overlay"
          className="recruiter-call-backdrop"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          {callState === 'incoming' ? (
            /* Incoming Call Card (iOS Dynamic Island Style) */
            <div className="incoming-call-card">
              <div className="caller-profile-row">
                <div className="caller-avatar-circle">
                  <span>SJ</span>
                </div>
                <div className="caller-text-info">
                  <span className="incoming-kicker">INCOMING CALL</span>
                  <h3 className="caller-name">{callerName}</h3>
                  <small className="caller-company">{callerCompany}</small>
                </div>
              </div>

              <div className="call-actions-row">
                <button
                  type="button"
                  className="call-action-btn decline"
                  onClick={handleDecline}
                  aria-label="Decline Call"
                >
                  <PhoneOff size={22} />
                  <span>Decline</span>
                </button>

                <button
                  type="button"
                  className="call-action-btn accept"
                  onClick={handleAccept}
                  aria-label="Accept Call"
                >
                  <Phone size={22} />
                  <span>Accept</span>
                </button>
              </div>
            </div>
          ) : (
            /* Active Connected Call Screen */
            <div className="connected-call-screen">
              <div className="connected-caller-hero">
                <div className="connected-avatar-pulse">
                  <div className="pulse-ring-ambient" />
                  <span>SJ</span>
                </div>
                <h2 className="connected-name">{callerName}</h2>
                <span className="connected-company">{callerCompany}</span>
                <span className="call-timer-ticker">{formatCallTime(callDuration)}</span>
              </div>

              {/* Offer Speech Transcript Card */}
              <div className="recruiter-speech-transcript">
                <div className="transcript-header">
                  <Sparkles size={13} className="text-amber" />
                  <strong>Live AI Recruiter Transcription</strong>
                </div>
                <p>
                  &ldquo;Hello Uday! We reviewed your portfolio, especially your LeetCode problem solving, systems architecture, and full-stack projects. We are thoroughly impressed and would love to schedule a software engineering interview with you!&rdquo;
                </p>

                <button
                  type="button"
                  className="interview-cta-btn"
                  onClick={handleScheduleOffer}
                >
                  {copiedEmail ? <Check size={14} /> : <Calendar size={14} />}
                  <span>{copiedEmail ? 'Email Copied (jammulaudaykiran12@gmail.com)' : 'Schedule Interview / Open Email'}</span>
                </button>
              </div>

              {/* Call Controls Bar */}
              <div className="connected-controls-grid">
                <button
                  type="button"
                  className={`call-tool-btn ${isMuted ? 'active-mute' : ''}`}
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
                  <span>{isMuted ? 'Muted' : 'Mute'}</span>
                </button>

                <button
                  type="button"
                  className="call-tool-btn end-call-btn"
                  onClick={handleDecline}
                >
                  <PhoneOff size={26} />
                  <span>End</span>
                </button>

                <button
                  type="button"
                  className="call-tool-btn active-tool"
                  onClick={() => sound.playTapSound()}
                >
                  <Volume2 size={22} />
                  <span>Speaker</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
