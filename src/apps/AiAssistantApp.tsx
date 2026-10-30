import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Send, Sparkles, Bot, User, Code2, GraduationCap, Briefcase, Mail } from 'lucide-react';
import { profile } from '../data/profile';
import { projects } from '../data/projects';
import { skillCategories } from '../data/skills';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  chips?: string[];
}

const KNOWLEDGE_RESPONSES: Record<string, string> = {
  skills: `Uday specializes in systems programming, algorithmic problem solving, and modern web applications.
• Core Languages: Python, C, C++, TypeScript, JavaScript
• Frontend & Systems: React 18, Vite, Three.js (WebGL), Framer Motion
• Embedded & IoT: ESP32 Dual-Core Telemetry, FreeRTOS, SPI/I2C
• Academic Fundamentals: Data Structures & Algorithms, Object-Oriented Architecture`,

  projects: `Uday has engineered several verified platforms:
1. Hospital Management System: Responsive clinical dashboard with triage queue, patient telemetry, and instant status tracking. Live on Vercel.
2. ESP32 Distributed ML Accelerator: Dual-core embedded system with SPI bus packet synchronization and sensor telemetry.
3. Titan Monitor Ultimate: Network security and systems monitoring toolkit.`,

  education: `Uday is pursuing his Bachelor of Technology (B.Tech) in Computer Science and Engineering at KL University (2023 – 2027) in Vijayawada, Andhra Pradesh, India.
Key coursework: Data Structures, Algorithmic Analysis, C Systems Programming, and Computer Networks.`,

  contact: `You can reach Uday directly:
• Direct Email: jammulaudaykiran12@gmail.com
• GitHub: github.com/Udaykiranjammula-alpha
• LinkedIn: linkedin.com/in/uday-kiran-jammula-a79982376
• Instagram: @udaykiran.jammula`,

  hire: `Uday is actively open to Software Engineering Internships and Full-Stack / Systems development roles. He brings strong algorithmic fundamentals, clean architecture skills, and proven experience building complete web & embedded solutions. Contact him at jammulaudaykiran12@gmail.com!`,
};

export function AiAssistantApp({ onBack }: { onBack: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hi! I'm Uday AI, an intelligent companion built into UDAY OS. Ask me anything about Uday's technical background, projects at KL University, or how to collaborate!`,
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendQuery = (query: string) => {
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const q = query.toLowerCase();
      let reply = `That's a great question! Uday is a dedicated Computer Science student at KL University focusing on Python, Data Structures, and modern web architectures. Feel free to explore his Projects or reach out directly at jammulaudaykiran12@gmail.com!`;

      if (q.includes('skill') || q.includes('stack') || q.includes('tech') || q.includes('python')) {
        reply = KNOWLEDGE_RESPONSES.skills;
      } else if (q.includes('project') || q.includes('hospital') || q.includes('esp32') || q.includes('portfolio')) {
        reply = KNOWLEDGE_RESPONSES.projects;
      } else if (q.includes('college') || q.includes('education') || q.includes('university') || q.includes('kl') || q.includes('degree')) {
        reply = KNOWLEDGE_RESPONSES.education;
      } else if (q.includes('contact') || q.includes('email') || q.includes('reach') || q.includes('phone') || q.includes('social')) {
        reply = KNOWLEDGE_RESPONSES.contact;
      } else if (q.includes('hire') || q.includes('job') || q.includes('intern') || q.includes('role') || q.includes('work with')) {
        reply = KNOWLEDGE_RESPONSES.hire;
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  const presetChips = [
    { label: 'Technical Skills', query: 'What are your core technical skills?' },
    { label: 'Featured Projects', query: 'Tell me about your key software projects' },
    { label: 'KL University Coursework', query: 'What is your education at KL University?' },
    { label: 'How to Hire Uday', query: 'Are you open to internships or software roles?' },
    { label: 'Direct Contact', query: 'How can I contact Uday?' },
  ];

  return (
    <div className="ai-assistant-page">
      {/* Siri Header */}
      <header className="ai-assistant-header">
        <button type="button" className="mail-nav-back-pill" onClick={onBack} aria-label="Back to Home">
          <ChevronLeft size={18} />
          <span>Home</span>
        </button>
        <div className="ai-header-title">
          <div className="ai-siri-orb mini" />
          <span>Uday AI</span>
        </div>
        <div style={{ width: 44 }} />
      </header>

      {/* Messages Scroll Area */}
      <div className="ai-messages-container">
        {/* Animated Siri Waveform Hero */}
        <div className="ai-orb-hero">
          <div className="ai-siri-orb large" />
          <h2>How can I help you explore Uday&apos;s work?</h2>
        </div>

        {/* Preset Chips */}
        <div className="ai-preset-chips-strip">
          {presetChips.map((chip) => (
            <button
              key={chip.label}
              type="button"
              className="ai-chip-pill"
              onClick={() => handleSendQuery(chip.query)}
            >
              <Sparkles size={11} className="text-cyan" />
              <span>{chip.label}</span>
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="ai-thread-list">
          {messages.map((m) => (
            <div key={m.id} className={`ai-message-row ${m.sender}`}>
              <div className="ai-avatar-icon">
                {m.sender === 'ai' ? <Bot size={14} /> : <User size={14} />}
              </div>
              <div className="ai-bubble-box">
                <p className="ai-bubble-text">{m.text}</p>
                <span className="ai-msg-time">{m.timestamp}</span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="ai-message-row ai typing">
              <div className="ai-avatar-icon">
                <Bot size={14} />
              </div>
              <div className="ai-typing-indicator">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </div>

      {/* Input Bar */}
      <form
        className="ai-input-bar"
        onSubmit={(e) => {
          e.preventDefault();
          handleSendQuery(inputText);
        }}
      >
        <input
          type="text"
          className="ai-chat-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask about skills, projects, contact..."
          aria-label="Ask Uday AI"
        />
        <button type="submit" className="ai-send-btn" disabled={!inputText.trim()} aria-label="Send query">
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
