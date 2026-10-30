import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  Send,
  Sparkles,
  Bot,
  User,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { voiceAssistant, VoiceIntentResult } from '../services/speech';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

interface AiAssistantAppProps {
  onBack: () => void;
  onNavigate?: (route: string) => void;
  onToggleFlashlight?: () => void;
  onToggleMusic?: () => void;
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

export function AiAssistantApp({
  onBack,
  onNavigate,
  onToggleFlashlight,
  onToggleMusic,
}: AiAssistantAppProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hi! I'm Uday AI, an intelligent companion built into UDAY OS. Speak aloud with the mic or ask me anything about Uday's skills, projects, or how to hire him!`,
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [listeningStatus, setListeningStatus] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const stopListeningRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    return () => {
      stopListeningRef.current?.();
      voiceAssistant.stopSpeaking();
    };
  }, []);

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListeningRef.current?.();
      setIsListening(false);
      setListeningStatus(null);
      return;
    }

    setIsListening(true);
    setListeningStatus('Listening to your voice... Speak now');

    const stop = voiceAssistant.listen(
      (result: VoiceIntentResult) => {
        setIsListening(false);
        setListeningStatus(null);
        handleExecuteIntent(result);
      },
      (error) => {
        setIsListening(false);
        setListeningStatus(error || 'Voice error');
        setTimeout(() => setListeningStatus(null), 3500);
      }
    );
    stopListeningRef.current = stop;
  };

  const handleExecuteIntent = (intent: VoiceIntentResult) => {
    // Add user message
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: intent.transcript,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      let reply = intent.responseText;
      const q = intent.transcript.toLowerCase();

      // Enrich knowledge responses
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

      // Speak aloud if enabled
      if (voiceEnabled) {
        const spokenText = intent.action === 'navigate' ? intent.responseText : reply.slice(0, 180);
        voiceAssistant.speak(spokenText);
      }

      // Execute Action
      if (intent.action === 'navigate' && intent.target && onNavigate) {
        setTimeout(() => {
          onNavigate(intent.target!);
        }, 1200);
      } else if (intent.action === 'flashlight') {
        onToggleFlashlight?.();
      } else if (intent.action === 'music') {
        onToggleMusic?.();
      }
    }, 450);
  };

  const handleSendQuery = (query: string) => {
    if (!query.trim()) return;
    setInputText('');
    const intent = voiceAssistant.parseIntent(query);
    handleExecuteIntent(intent);
  };

  const presetChips = [
    { label: 'Technical Skills', query: 'What are your core technical skills?' },
    { label: 'Featured Projects', query: 'Tell me about your key software projects' },
    { label: 'KL University Coursework', query: 'What is your education at KL University?' },
    { label: 'Launch Dev Dash Game', query: 'Open Arcade game' },
    { label: 'Toggle 3D Torch', query: 'Turn on flashlight' },
    { label: 'How to Hire Uday', query: 'Are you open to internships or software roles?' },
    { label: 'Direct Contact', query: 'How can I contact Uday?' },
  ];

  return (
    <div className="ai-assistant-page">
      {/* Siri Header */}
      <header className="ai-assistant-header">
        <button
          type="button"
          className="mail-nav-back-pill"
          onClick={onBack}
          aria-label="Back to Home"
        >
          <ChevronLeft size={18} />
          <span>Home</span>
        </button>

        <div className="ai-header-title">
          <div className={`ai-siri-orb mini ${isListening ? 'listening' : ''}`} />
          <span>Uday AI</span>
        </div>

        <button
          type="button"
          className="ai-voice-toggle-btn"
          onClick={() => {
            const next = !voiceEnabled;
            setVoiceEnabled(next);
            if (!next) voiceAssistant.stopSpeaking();
          }}
          aria-label={voiceEnabled ? 'Mute AI voice' : 'Enable AI voice'}
          title={voiceEnabled ? 'Voice output active' : 'Voice output muted'}
        >
          {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
      </header>

      {/* Messages Scroll Area */}
      <div className="ai-messages-container">
        {/* Animated Siri Waveform Hero */}
        <div className="ai-orb-hero">
          <div
            className={`ai-siri-orb large ${isListening ? 'listening pulsing' : ''}`}
            onClick={handleVoiceToggle}
            role="button"
            tabIndex={0}
            title={isListening ? 'Listening... Tap to stop' : 'Tap to speak with Uday AI'}
          >
            <div className="siri-inner-core" />
            <div className="siri-ring-1" />
            <div className="siri-ring-2" />
          </div>
          <h2>{listeningStatus || 'Tap the Orb or Mic to Speak with Uday AI'}</h2>
          <p className="ai-subtitle">Voice-enabled intelligence for navigation, projects, and queries</p>
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
        <button
          type="button"
          className={`ai-mic-btn ${isListening ? 'active-listening' : ''}`}
          onClick={handleVoiceToggle}
          aria-label={isListening ? 'Stop listening' : 'Start voice recognition'}
          title="Speak into microphone"
        >
          {isListening ? <MicOff size={16} /> : <Mic size={16} />}
        </button>

        <input
          type="text"
          className="ai-chat-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isListening ? 'Listening...' : 'Type or speak: "Open GitHub", "Turn on torch"...'}
          aria-label="Ask Uday AI"
        />

        <button
          type="submit"
          className="ai-send-btn"
          disabled={!inputText.trim()}
          aria-label="Send query"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
