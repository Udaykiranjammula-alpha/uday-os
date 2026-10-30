import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Send, Sparkles, Video, Info, CheckCheck, Mail, ExternalLink } from 'lucide-react';
import { profile } from '../data/profile';
import { sound } from '../services/sound';

interface ChatMessage {
  id: string;
  sender: 'uday' | 'recruiter';
  text: string;
  timestamp: string;
  status?: string;
}

export function MessagesApp({ onBack }: { onBack: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'uday',
      text: `Hey! Thanks for stopping by my portfolio. I'm a Computer Science student at KL University specializing in Python, Data Structures, and modern web architectures.`,
      timestamp: '10:02 AM',
      status: 'Read 10:03 AM',
    },
    {
      id: 'msg-2',
      sender: 'uday',
      text: `I'm actively exploring Software Engineering Internships & Full-Stack roles. You can chat with me here or click the chips below to send an interview request!`,
      timestamp: '10:03 AM',
      status: 'Read 10:04 AM',
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

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

    setTimeout(() => {
      let replyText = `Thanks for reaching out! I've logged your message. You can also contact me directly at ${profile.email} or connect on LinkedIn!`;
      const lower = text.toLowerCase();

      if (lower.includes('interview') || lower.includes('hire') || lower.includes('role') || lower.includes('schedule')) {
        replyText = `I'd love to interview! I am available for immediate internship or full-time opportunities. Would you like to connect over Google Meet or email at ${profile.email}?`;
      } else if (lower.includes('project') || lower.includes('hospital') || lower.includes('esp32')) {
        replyText = `My main projects are the Hospital Management System (live on Vercel), ESP32 Distributed ML Accelerator, and Titan Network Monitor. All source code is on GitHub at github.com/Udaykiranjammula-alpha!`;
      } else if (lower.includes('skill') || lower.includes('python') || lower.includes('language')) {
        replyText = `My core programming stack includes Python, C/C++, TypeScript, React 18, and WebGL Three.js. Plus strong fundamentals in Data Structures & Algorithmic complexity (184+ LeetCode solved).`;
      }

      const udayReply: ChatMessage = {
        id: `u-${Date.now()}`,
        sender: 'uday',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Delivered',
      };

      setMessages((prev) => [...prev, udayReply]);
      setIsTyping(false);
    }, 700);
  };

  const quickPrompts = [
    { label: '📅 Schedule Interview', text: 'Hi Uday, I would like to schedule an interview with you.' },
    { label: '🚀 Key Projects', text: 'Can you tell me about your top projects and architectures?' },
    { label: '💻 Core Tech Stack', text: 'What programming languages and frameworks do you use?' },
    { label: '✉️ Send Direct Email', isMail: true },
  ];

  return (
    <div className="imessage-page">
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
            <img src="/uday_avatar.png" alt={profile.name} className="imessage-avatar-img" />
          </div>
          <div className="imessage-contact-text">
            <strong>{profile.name}</strong>
            <small>iMessage · KL University</small>
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

        {messages.map((m) => (
          <div key={m.id} className={`imessage-bubble-row ${m.sender}`}>
            <div className="imessage-bubble-content">
              <p>{m.text}</p>
              <div className="bubble-meta">
                <span>{m.timestamp}</span>
                {m.status && m.sender === 'recruiter' && (
                  <span className="receipt-text"> · {m.status}</span>
                )}
              </div>
            </div>
          </div>
        ))}

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

      {/* Recruiter Preset Quick Chips Strip */}
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
    </div>
  );
}
