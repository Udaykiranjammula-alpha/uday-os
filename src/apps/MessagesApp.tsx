import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  Send,
  Sparkles,
  Mail,
  Video,
  Phone,
  Info,
  Calendar,
  Code2,
  Cpu,
  UserCheck,
  CheckCheck,
} from 'lucide-react';
import { profile } from '../data/profile';
import { sound } from '../services/sound';

interface ChatMessage {
  id: string;
  sender: 'uday' | 'recruiter';
  text: string;
  timestamp: string;
  status?: string;
  reaction?: string;
}

interface MessagesAppProps {
  onBack: () => void;
  onNavigate?: (route: string) => void;
}

const TAPBACKS = ['❤️', '👍', '👎', '😂', '‼️', '❓'];

export function MessagesApp({ onBack, onNavigate }: MessagesAppProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'uday',
      text: `Hey! Thanks for stopping by my portfolio. I'm Uday Kiran Jammula, a Computer Science scholar at KL University specializing in Python, React, TypeScript, Three.js 3D, and Algorithmic systems.`,
      timestamp: '10:02 AM',
      status: 'Read 10:03 AM',
      reaction: '❤️',
    },
    {
      id: 'msg-2',
      sender: 'uday',
      text: `I'm actively exploring Software Engineering Internships & Full-Stack roles. You can chat with me here, tap or long-press any message for iOS Tapbacks, or select a quick prompt below!`,
      timestamp: '10:03 AM',
      status: 'Read 10:04 AM',
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTapbackMsgId, setActiveTapbackMsgId] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const endRef = useRef<HTMLDivElement>(null);
  const longPressTimerRef = useRef<number | null>(null);
  const isLongPressRef = useRef(false);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const triggerConfetti = useCallback(() => {
    setShowConfetti(true);
    sound.playApplePayChime();
    setTimeout(() => setShowConfetti(false), 3800);
  }, []);

  const handleSend = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    sound.playMessageSentSound();

    const userMsg: ChatMessage = {
      id: `r-${Date.now()}`,
      sender: 'recruiter',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Delivered',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    const lower = trimmed.toLowerCase();
    const isHireOrInterview =
      lower.includes('interview') ||
      lower.includes('hire') ||
      lower.includes('offer') ||
      lower.includes('schedule');

    if (isHireOrInterview) {
      triggerConfetti();
    }

    // Realistic typing delay (1.2s)
    setTimeout(() => {
      let replyText = `Thanks for reaching out! I've logged your message. You can reach me directly at ${profile.email} or on LinkedIn anytime!`;

      if (isHireOrInterview) {
        replyText = `🎉 That is fantastic news! I would love to interview with your team. I am available immediately for Software Engineering internships or full-time roles. Let's connect over Google Meet or email at ${profile.email}!`;
      } else if (lower.includes('skill') || lower.includes('top skill') || lower.includes('stack')) {
        replyText = `Here are my core engineering proficiencies:
• Languages: Python, TypeScript, JavaScript, C/C++
• Frontend: React 18, Three.js (WebGL 3D graphics), Tailwind CSS, Next.js
• Architecture: Distributed Systems, REST APIs, ESP32 Edge ML
• Problem Solving: 184+ LeetCode algorithms with optimal time & space complexity!`;
      } else if (lower.includes('architecture') || lower.includes('code architecture') || lower.includes('review')) {
        replyText = `UDAY OS is built with production-grade engineering principles:
• Decoupled Virtual Device Pipeline: Physics-based viewport mimicking iPhone 17 Pro Max
• Pure Synthesized Audio: Real-time Web Audio API engine with zero sound-file latency
• Strict TypeScript: 100% compile-time verification and zero technical debt
• PWA & Responsive: Smooth 60fps animations, mobile haptic feedback, and GPU acceleration.`;
      } else if (lower.includes('contact') || lower.includes('email') || lower.includes('reach') || lower.includes('direct')) {
        replyText = `You can connect with me directly through:
📧 Email: ${profile.email}
💼 LinkedIn: ${profile.linkedin}
🐙 GitHub: ${profile.github}
📍 Location: ${profile.location}
I usually respond within a few hours!`;
      } else if (lower.includes('project') || lower.includes('hospital') || lower.includes('esp32')) {
        replyText = `My key projects include:
1. Hospital Management System (Enterprise Clinical Workflow)
2. ESP32 Distributed ML Accelerator (Edge neural inference)
3. Titan Network Monitor (High-throughput packet metrics)
All repositories are open source on my GitHub!`;
      }

      const udayReply: ChatMessage = {
        id: `u-${Date.now()}`,
        sender: 'uday',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Delivered',
        reaction: isHireOrInterview ? '❤️' : undefined,
      };

      setMessages((prev) => [...prev, udayReply]);
      setIsTyping(false);
      sound.playMessageReceivedSound();
    }, 1300);
  }, [triggerConfetti]);

  const handleTapback = (msgId: string, emoji: string) => {
    sound.playTapbackSound();
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId ? { ...m, reaction: m.reaction === emoji ? undefined : emoji } : m
      )
    );
    setActiveTapbackMsgId(null);
  };

  // Support both click and long-press
  const handlePointerDown = (msgId: string) => {
    isLongPressRef.current = false;
    longPressTimerRef.current = window.setTimeout(() => {
      isLongPressRef.current = true;
      sound.playTapbackSound();
      setActiveTapbackMsgId(msgId);
    }, 420);
  };

  const handlePointerUp = (msgId: string) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    if (!isLongPressRef.current) {
      // Regular click: toggle tapback menu
      sound.playTapSound();
      setActiveTapbackMsgId((curr) => (curr === msgId ? null : msgId));
    }
  };

  const handlePointerCancel = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const quickPrompts = [
    {
      id: 'schedule',
      label: '📅 Schedule Interview',
      icon: Calendar,
      text: 'Hi Uday! I would like to schedule an engineering interview with you.',
    },
    {
      id: 'skills',
      label: '⚡ What are your top skills?',
      icon: Cpu,
      text: 'What are your top skills and technical proficiencies?',
    },
    {
      id: 'architecture',
      label: '🏛️ Review Code Architecture',
      icon: Code2,
      text: 'Can you walk me through the architecture and code structure of UDAY OS?',
    },
    {
      id: 'contact',
      label: '✉️ Contact directly',
      icon: Mail,
      text: 'What is the best way to contact you directly for job opportunities?',
    },
  ];

  return (
    <div
      className="imessage-page"
      onClick={() => setActiveTapbackMsgId(null)}
      style={{ position: 'relative' }}
    >
      {/* Top iMessage Header */}
      <header className="imessage-header">
        <button
          type="button"
          className="imessage-back-btn"
          onClick={() => {
            sound.playTapSound();
            onBack();
          }}
          aria-label="Back to Home"
        >
          <ChevronLeft size={22} />
          <span>Home</span>
        </button>

        <div
          className="imessage-contact-card"
          onClick={() => {
            sound.playTapSound();
            if (onNavigate) onNavigate('contact');
          }}
          style={{ cursor: 'pointer' }}
          title="View Contact Card"
        >
          <div className="imessage-avatar-wrap">
            <span className="imessage-avatar-initials">UK</span>
          </div>
          <div className="imessage-contact-text">
            <strong>{profile.name}</strong>
            <small>iMessage &middot; KL University</small>
          </div>
        </div>

        <div className="imessage-header-actions">
          <button
            type="button"
            className="imessage-action-icon"
            onClick={() => {
              sound.playTapSound();
              if (onNavigate) onNavigate('facetime');
            }}
            title="FaceTime Video Call"
            aria-label="FaceTime"
          >
            <Video size={16} />
          </button>
          <a
            href={`mailto:${profile.email}?subject=Interview%20Inquiry%20from%20Portfolio`}
            className="imessage-action-icon"
            onClick={() => sound.playTapSound()}
            title="Send Email"
            aria-label="Email"
          >
            <Mail size={15} />
          </a>
        </div>
      </header>

      {/* Messages Thread Container */}
      <div className="imessage-thread-body">
        <div className="imessage-crypto-notice">
          <span>iMessage with {profile.name}</span>
          <small>End-to-End Encrypted Portfolio Channel &bull; Verified Candidate</small>
        </div>

        {messages.map((m) => {
          const isTapbackOpen = activeTapbackMsgId === m.id;
          const isUday = m.sender === 'uday';

          return (
            <div key={m.id} className={`imessage-bubble-row ${m.sender}`}>
              <div
                className="imessage-bubble-content"
                style={{ position: 'relative' }}
                onPointerDown={() => handlePointerDown(m.id)}
                onPointerUp={() => handlePointerUp(m.id)}
                onPointerCancel={handlePointerCancel}
                title="Tap or long-press for iOS Tapback reactions"
              >
                {/* Floating Tapback Picker Menu */}
                {isTapbackOpen && (
                  <div
                    className="imessage-tapback-picker"
                    style={{
                      position: 'absolute',
                      top: '-44px',
                      [isUday ? 'left' : 'right']: '0',
                      background: 'rgba(255, 255, 255, 0.96)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: '24px',
                      padding: '4px 8px',
                      display: 'flex',
                      gap: '6px',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                      zIndex: 50,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {TAPBACKS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        className={`tapback-emoji-btn ${m.reaction === emoji ? 'selected' : ''}`}
                        onClick={() => handleTapback(m.id, emoji)}
                        style={{
                          background: m.reaction === emoji ? 'rgba(0, 122, 255, 0.2)' : 'transparent',
                          border: 'none',
                          fontSize: '17px',
                          cursor: 'pointer',
                          padding: '3px 5px',
                          borderRadius: '50%',
                          transform: m.reaction === emoji ? 'scale(1.2)' : 'scale(1)',
                          transition: 'transform 0.15s ease',
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                <p style={{ whiteSpace: 'pre-line', margin: 0 }}>{m.text}</p>

                {/* Attached Tapback Reaction Badge */}
                {m.reaction && (
                  <div
                    className={`imessage-reaction-badge ${m.sender}`}
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      [isUday ? 'left' : 'right']: '-8px',
                      background: '#ffffff',
                      color: '#000',
                      borderRadius: '14px',
                      padding: '1px 6px',
                      fontSize: '12px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                      zIndex: 10,
                      cursor: 'pointer',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTapback(m.id, m.reaction!);
                    }}
                    title="Remove tapback"
                  >
                    <span>{m.reaction}</span>
                  </div>
                )}

                <div className="bubble-meta" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <span>{m.timestamp}</span>
                  {m.status && m.sender === 'recruiter' && (
                    <span className="receipt-text" style={{ display: 'inline-flex', alignItems: 'center' }}>
                      &middot; {m.status} <CheckCheck size={11} style={{ marginLeft: 3, opacity: 0.8 }} />
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Realistic Animated Typing Bubble */}
        {isTyping && (
          <div className="imessage-bubble-row uday typing">
            <div className="imessage-typing-bubble" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Recruiter Interactive Quick-Reply Buttons Strip */}
      <div className="imessage-chips-strip">
        {quickPrompts.map((p) => (
          <button
            key={p.id}
            type="button"
            className="imessage-chip"
            onClick={() => handleSend(p.text)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* iMessage Input Bar */}
      <form
        className="imessage-input-bar"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(inputVal);
        }}
      >
        <div className="imessage-input-pill">
          <input
            type="text"
            className="imessage-native-input"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="iMessage"
            aria-label="Type message"
          />
          <button
            type="submit"
            className={`imessage-send-arrow ${inputVal.trim() ? 'active' : ''}`}
            disabled={!inputVal.trim()}
            aria-label="Send message"
          >
            <Send size={14} />
          </button>
        </div>
      </form>

      {/* Full-Screen Confetti Celebration Overlay */}
      {showConfetti && (
        <div className="imessage-confetti-layer" style={{ pointerEvents: 'none' }}>
          {[...Array(32)].map((_, i) => (
            <span
              key={i}
              className="confetti-piece"
              style={{
                left: `${(i * 100) / 32}%`,
                animationDelay: `${(i % 5) * 0.14}s`,
                backgroundColor: ['#ff2d55', '#38bdf8', '#5bf527', '#ffd60a', '#af52de', '#ff9500'][i % 6],
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
