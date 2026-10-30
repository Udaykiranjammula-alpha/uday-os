import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  Send,
  Sparkles,
  Mail,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Smile,
  AlertCircle,
  HelpCircle,
  Award,
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

const TAPBACKS = ['❤️', '👍', '👎', '😂', '‼️', '❓'];

export function MessagesApp({ onBack }: { onBack: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'uday',
      text: `Hey! Thanks for stopping by my portfolio. I'm a Computer Science scholar at KL University specializing in React, TypeScript, Three.js, and Algorithmic systems.`,
      timestamp: '10:02 AM',
      status: 'Read 10:03 AM',
      reaction: '❤️',
    },
    {
      id: 'msg-2',
      sender: 'uday',
      text: `I'm actively exploring Software Engineering Internships & Full-Stack roles. You can chat with me here, tap any message for iOS Tapbacks, or send an interview request!`,
      timestamp: '10:03 AM',
      status: 'Read 10:04 AM',
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTapbackMsgId, setActiveTapbackMsgId] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const triggerConfetti = () => {
    setShowConfetti(true);
    sound.playApplePayChime();
    setTimeout(() => setShowConfetti(false), 3500);
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    sound.playTapSound();

    const userMsg: ChatMessage = {
      id: `r-${Date.now()}`,
      sender: 'recruiter',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Delivered',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    const lower = text.toLowerCase();
    const isHireOrInterview =
      lower.includes('interview') ||
      lower.includes('hire') ||
      lower.includes('offer') ||
      lower.includes('schedule');

    if (isHireOrInterview) {
      triggerConfetti();
    }

    setTimeout(() => {
      let replyText = `Thanks for reaching out! I've logged your message. You can also contact me directly at ${profile.email} or connect on LinkedIn!`;

      if (isHireOrInterview) {
        replyText = `🎉 That's fantastic! I'd love to interview. I am available for immediate internship or full-time software engineering roles. Let's connect over Google Meet or email at ${profile.email}!`;
      } else if (lower.includes('project') || lower.includes('hospital') || lower.includes('esp32')) {
        replyText = `My featured projects are the Hospital Management System, ESP32 Distributed ML Accelerator, and Titan Network Monitor. All source code is verified on GitHub at github.com/Udaykiranjammula-alpha!`;
      } else if (lower.includes('skill') || lower.includes('python') || lower.includes('stack')) {
        replyText = `My core programming stack includes Python, TypeScript, React 18, and WebGL Three.js. Plus 184+ LeetCode algorithms solved!`;
      }

      const udayReply: ChatMessage = {
        id: `u-${Date.now()}`,
        sender: 'uday',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Delivered',
        reaction: isHireOrInterview ? '👍' : undefined,
      };

      setMessages((prev) => [...prev, udayReply]);
      setIsTyping(false);
    }, 700);
  };

  const handleTapback = (msgId: string, emoji: string) => {
    sound.playTapSound();
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId ? { ...m, reaction: m.reaction === emoji ? undefined : emoji } : m
      )
    );
    setActiveTapbackMsgId(null);
  };

  const quickPrompts = [
    { label: '🎉 Hire / Offer', text: 'Hi Uday! We would love to extend an interview / offer package to you.' },
    { label: '📅 Schedule Interview', text: 'Hi Uday, I would like to schedule an engineering interview with you.' },
    { label: '🚀 Key Projects', text: 'Can you tell me about your top architectures and projects?' },
    { label: '💻 Core Tech Stack', text: 'What programming languages and frameworks do you use?' },
    { label: '✉️ Send Direct Email', isMail: true },
  ];

  return (
    <div className="imessage-page" onClick={() => setActiveTapbackMsgId(null)}>
      {/* Top iMessage Header */}
      <header className="imessage-header">
        <button
          type="button"
          className="imessage-back-btn"
          onClick={onBack}
          aria-label="Back to Home"
        >
          <ChevronLeft size={22} />
          <span>Home</span>
        </button>

        <div className="imessage-contact-card">
          <div className="imessage-avatar-wrap">
            <span className="imessage-avatar-initials">UK</span>
          </div>
          <div className="imessage-contact-text">
            <strong>{profile.name}</strong>
            <small>iMessage &middot; KL University</small>
          </div>
        </div>

        <div className="imessage-header-actions">
          <a
            href={`mailto:${profile.email}?subject=Interview%20Inquiry%20from%20Portfolio`}
            className="imessage-action-icon"
            title="Send Email"
          >
            <Mail size={16} />
          </a>
        </div>
      </header>

      {/* Messages Thread Container */}
      <div className="imessage-thread-body">
        <div className="imessage-crypto-notice">
          <span>iMessage with {profile.name}</span>
          <small>End-to-End Encrypted Portfolio Channel</small>
        </div>

        {messages.map((m) => {
          const isTapbackOpen = activeTapbackMsgId === m.id;

          return (
            <div key={m.id} className={`imessage-bubble-row ${m.sender}`}>
              <div
                className="imessage-bubble-content"
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playTapSound();
                  setActiveTapbackMsgId(isTapbackOpen ? null : m.id);
                }}
                title="Tap for iOS Tapback reactions"
              >
                {/* Floating Tapback Picker Menu */}
                {isTapbackOpen && (
                  <div
                    className="imessage-tapback-picker"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {TAPBACKS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        className={`tapback-emoji-btn ${m.reaction === emoji ? 'selected' : ''}`}
                        onClick={() => handleTapback(m.id, emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                <p>{m.text}</p>

                {/* Attached Tapback Reaction Badge */}
                {m.reaction && (
                  <div className={`imessage-reaction-badge ${m.sender}`}>
                    <span>{m.reaction}</span>
                  </div>
                )}

                <div className="bubble-meta">
                  <span>{m.timestamp}</span>
                  {m.status && m.sender === 'recruiter' && (
                    <span className="receipt-text"> &middot; {m.status}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="imessage-bubble-row uday typing">
            <div className="imessage-typing-bubble">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Recruiter Quick Prompts Strip */}
      <div className="imessage-chips-strip">
        {quickPrompts.map((p) => (
          <button
            key={p.label}
            type="button"
            className="imessage-chip"
            onClick={() => {
              if (p.isMail) {
                window.open(`mailto:${profile.email}?subject=Opportunity%20Inquiry%20from%20UDAY%20OS`, '_blank');
              } else if (p.text) {
                handleSend(p.text);
              }
            }}
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
        <div className="imessage-confetti-layer" pointer-events="none">
          {[...Array(30)].map((_, i) => (
            <span
              key={i}
              className="confetti-piece"
              style={{
                left: `${(i * 100) / 30}%`,
                animationDelay: `${(i % 5) * 0.15}s`,
                backgroundColor: ['#ff2d55', '#38bdf8', '#5bf527', '#ffd60a', '#af52de'][i % 5],
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
