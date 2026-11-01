import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Sparkles,
  Heart,
  ThumbsUp,
  MessageSquare,
  Award,
} from 'lucide-react';
import { sound } from '../services/sound';
import { profile } from '../data/profile';

interface FaceTimeAppProps {
  onBack: () => void;
  onNavigate?: (route: string) => void;
}

export function FaceTimeApp({ onBack, onNavigate }: FaceTimeAppProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(14);
  const [activeSpeech, setActiveSpeech] = useState<string>(
    'Hello! Thanks for connecting over FaceTime. I am ready to discuss engineering roles!'
  );
  const [reactionFloating, setReactionFloating] = useState<'heart' | 'thumbs' | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCallDuration((d) => d + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const speakText = (text: string) => {
    setActiveSpeech(text);
    setIsSpeaking(true);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsSpeaking(false), 2500);
    }
  };

  const handleEndCall = () => {
    sound.playTapSound();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    onBack();
  };

  const handleTriggerReaction = (type: 'heart' | 'thumbs') => {
    sound.playApplePayChime();
    setReactionFloating(type);
    setTimeout(() => setReactionFloating(null), 2500);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? `0${s}` : s}`;
  };

  return (
    <div className="facetime-page-screen">
      {/* Top Header */}
      <div className="facetime-top-bar">
        <button
          type="button"
          className="facetime-back-pill"
          onClick={handleEndCall}
          aria-label="Back"
        >
          <ChevronLeft size={20} />
          <span>Home</span>
        </button>

        <div className="facetime-call-timer">
          <span className="facetime-live-dot" />
          <span>FaceTime &middot; {formatTime(callDuration)}</span>
        </div>

        <button
          type="button"
          className="facetime-mini-btn"
          onClick={() => handleTriggerReaction('heart')}
          title="Send Heart Reaction"
        >
          <Heart size={16} className="text-rose-500 fill-rose-500" />
        </button>
      </div>

      {/* Main Video Stage: Center Stage Uday Avatar */}
      <div className="facetime-main-video-stage">
        <div className={`facetime-avatar-frame ${isSpeaking ? 'speaking-pulse' : ''}`}>
          <div className="avatar-ambient-glow" />
          <div className="avatar-image-disc">
            <span className="avatar-initials">UK</span>
          </div>
          <div className="avatar-nameplate">
            <strong>{profile.name}</strong>
            <small>Center Stage &middot; 1080p Spatial</small>
          </div>
        </div>

        {/* Speech Subtitle Teleprompter Bubble */}
        <div className="facetime-speech-bubble">
          <p>{activeSpeech}</p>
        </div>

        {/* Recruiter Picture-in-Picture (PIP) Window */}
        <div className="facetime-pip-window">
          <div className="pip-user-badge">
            <span>You</span>
          </div>
          <div className="pip-avatar-fallback">
            <span>Recruiter</span>
          </div>
        </div>

        {/* 3D Floating Reaction Emojis */}
        {reactionFloating === 'heart' && (
          <div className="facetime-reaction-burst heart">
            {[...Array(6)].map((_, i) => (
              <span key={i} className="floating-emoji" style={{ animationDelay: `${i * 0.15}s` }}>
                ❤️
              </span>
            ))}
          </div>
        )}

        {reactionFloating === 'thumbs' && (
          <div className="facetime-reaction-burst thumbs">
            {[...Array(6)].map((_, i) => (
              <span key={i} className="floating-emoji" style={{ animationDelay: `${i * 0.15}s` }}>
                👍
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Recruiter Interview Inquiry Topics */}
      <div className="facetime-topics-strip">
        <button
          type="button"
          className="facetime-topic-chip"
          onClick={() =>
            speakText(
              'My core architecture is built with TypeScript, React 18, and WebGL Three.js. I have also solved 184 LeetCode problems!'
            )
          }
        >
          <span>Architecture &amp; Skills</span>
        </button>

        <button
          type="button"
          className="facetime-topic-chip"
          onClick={() =>
            speakText(
              'I am available immediately for full-time software engineering roles and internships. I look forward to contributing to your engineering team!'
            )
          }
        >
          <span>Availability &amp; Offer</span>
        </button>

        <button
          type="button"
          className="facetime-topic-chip"
          onClick={() => handleTriggerReaction('thumbs')}
        >
          <span>Send Thumbs Up</span>
        </button>
      </div>

      {/* Bottom FaceTime Glass Control Dock */}
      <div className="facetime-dock-bar">
        <button
          type="button"
          className={`facetime-ctrl-btn ${isMuted ? 'active-off' : ''}`}
          onClick={() => setIsMuted(!isMuted)}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        <button
          type="button"
          className={`facetime-ctrl-btn ${isVideoOff ? 'active-off' : ''}`}
          onClick={() => setIsVideoOff(!isVideoOff)}
          aria-label={isVideoOff ? 'Enable Video' : 'Disable Video'}
        >
          {isVideoOff ? <VideoOff size={18} /> : <Video size={18} />}
        </button>

        <button
          type="button"
          className="facetime-ctrl-btn end-call"
          onClick={handleEndCall}
          aria-label="End Call"
        >
          <PhoneOff size={20} />
        </button>
      </div>
    </div>
  );
}
