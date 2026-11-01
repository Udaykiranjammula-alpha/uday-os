import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  PartyPopper,
  RefreshCw,
  Camera,
  MessageSquare,
  Award,
  Maximize2,
  Volume2,
} from 'lucide-react';
import { sound } from '../services/sound';
import { profile } from '../data/profile';

interface FaceTimeAppProps {
  onBack: () => void;
  onNavigate?: (route: string) => void;
}

type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
type ReactionType = 'heart' | 'firework' | 'confetti';

interface TopicPrompt {
  id: string;
  label: string;
  text: string;
}

const TOPICS: TopicPrompt[] = [
  {
    id: 'intro',
    label: 'Background & Degree',
    text: "Hi! I'm Uday Kiran, studying Computer Science at KL University. I specialize in full-stack architecture, high-performance web systems, and algorithms.",
  },
  {
    id: 'skills',
    label: 'Core Tech Stack',
    text: 'My core stack is built on TypeScript, React 18, Node.js, WebGL Three.js, Python, and embedded C++ FreeRTOS on ESP32 microcontrollers.',
  },
  {
    id: 'leetcode',
    label: 'LeetCode & DSA',
    text: 'I have solved 184 LeetCode problems spanning dynamic programming, graph algorithms, trees, and optimal binary search with high runtime percentiles.',
  },
  {
    id: 'hire',
    label: 'Why Hire Me?',
    text: 'I combine fast execution with deep engineering standards. I build robust, production-grade applications that delight users and scale effortlessly.',
  },
  {
    id: 'availability',
    label: 'Availability & Offer',
    text: 'I am available immediately for full-time Software Engineer positions and internships. I am eager to join your engineering team and build great products!',
  },
];

export function FaceTimeApp({ onBack, onNavigate }: FaceTimeAppProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [cameraView, setCameraView] = useState<'avatar' | 'workspace'>('avatar');
  const [callDuration, setCallDuration] = useState(1);
  const [activeSpeech, setActiveSpeech] = useState<string>(
    "Hi there! Welcome to my FaceTime portfolio call. I'm Uday Kiran, full-stack engineer and problem solver. Great to meet you!"
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeReaction, setActiveReaction] = useState<ReactionType | null>(null);
  const [pipCorner, setPipCorner] = useState<Corner>('bottom-right');
  const [isPipDragging, setIsPipDragging] = useState(false);
  const [pipWebcamActive, setPipWebcamActive] = useState(false);
  const [statusToast, setStatusToast] = useState<string | null>(null);

  const pipRef = useRef<HTMLDivElement>(null);
  const pipVideoRef = useRef<HTMLVideoElement>(null);
  const pipStreamRef = useRef<MediaStream | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Call duration counter
  useEffect(() => {
    const timer = setInterval(() => setCallDuration((d) => d + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Text-to-Speech function
  const speakText = useCallback((text: string) => {
    setActiveSpeech(text);
    setIsSpeaking(true);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.02;
      utterance.pitch = 1.0;

      // Select natural English voice if present
      const voices = window.speechSynthesis.getVoices();
      const enVoice = voices.find((v) => v.lang.startsWith('en') && !v.name.includes('Bad'));
      if (enVoice) {
        utterance.voice = enVoice;
      }

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsSpeaking(false), 3000);
    }
  }, []);

  // Greeting on mount
  useEffect(() => {
    sound.playCallChime();
    const greetTimeout = setTimeout(() => {
      speakText(
        "Hi there! Welcome to my FaceTime portfolio call. I'm Uday Kiran, full-stack engineer and problem solver. Great to meet you!"
      );
    }, 800);

    return () => {
      clearTimeout(greetTimeout);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [speakText]);

  // Clean up PIP camera on unmount
  useEffect(() => {
    return () => {
      if (pipStreamRef.current) {
        pipStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Recruiter PIP camera toggle
  const togglePipWebcam = async () => {
    sound.playTapSound();
    if (pipWebcamActive) {
      if (pipStreamRef.current) {
        pipStreamRef.current.getTracks().forEach((track) => track.stop());
        pipStreamRef.current = null;
      }
      setPipWebcamActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240, facingMode: 'user' },
          audio: false,
        });
        pipStreamRef.current = stream;
        if (pipVideoRef.current) {
          pipVideoRef.current.srcObject = stream;
          pipVideoRef.current.play().catch(() => {});
        }
        setPipWebcamActive(true);
      } catch {
        showToast('Webcam unavailable');
      }
    }
  };

  const showToast = (msg: string) => {
    setStatusToast(msg);
    setTimeout(() => setStatusToast(null), 2000);
  };

  // End Call Handler
  const handleEndCall = () => {
    sound.playCallEndSound();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (pipStreamRef.current) {
      pipStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    onBack();
  };

  // Reactions Handler
  const handleTriggerReaction = (type: ReactionType) => {
    if (type === 'heart') {
      sound.playHeartReactionSound();
    } else if (type === 'firework') {
      sound.playFireworkSound();
    } else if (type === 'confetti') {
      sound.playConfettiPopSound();
    }
    setActiveReaction(type);
    setTimeout(() => setActiveReaction(null), 2800);
  };

  // Camera Flip Handler (Switches between Avatar & Workspace)
  const handleFlipCamera = () => {
    sound.playActionClickSound();
    setCameraView((prev) => (prev === 'avatar' ? 'workspace' : 'avatar'));
    showToast(cameraView === 'avatar' ? 'Switched to Workspace View' : 'Switched to Center Stage');
  };

  // Dragging logic for Picture-In-Picture window
  const handlePipPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsPipDragging(true);
  };

  const handleStagePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPipDragging || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width;
    const yRatio = (e.clientY - rect.top) / rect.height;

    let targetCorner: Corner = 'bottom-right';
    if (xRatio < 0.5 && yRatio < 0.5) targetCorner = 'top-left';
    else if (xRatio >= 0.5 && yRatio < 0.5) targetCorner = 'top-right';
    else if (xRatio < 0.5 && yRatio >= 0.5) targetCorner = 'bottom-left';
    else targetCorner = 'bottom-right';

    if (targetCorner !== pipCorner) {
      setPipCorner(targetCorner);
    }
  };

  const handleStagePointerUp = () => {
    if (isPipDragging) {
      setIsPipDragging(false);
      sound.playTapSound();
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? `0${s}` : s}`;
  };

  return (
    <div
      className="facetime-page-screen"
      onPointerMove={handleStagePointerMove}
      onPointerUp={handleStagePointerUp}
      onPointerLeave={handleStagePointerUp}
    >
      {/* Status Toast Banner */}
      {statusToast && <div className="facetime-status-toast">{statusToast}</div>}

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

        {/* Reaction Quick Triggers */}
        <div className="facetime-top-reactions">
          <button
            type="button"
            className="facetime-mini-btn"
            onClick={() => handleTriggerReaction('heart')}
            title="Heart Reaction"
          >
            <Heart size={16} className="text-rose-500 fill-rose-500" />
          </button>
          <button
            type="button"
            className="facetime-mini-btn"
            onClick={() => handleTriggerReaction('confetti')}
            title="Confetti Reaction"
          >
            <PartyPopper size={16} className="text-amber-400" />
          </button>
        </div>
      </div>

      {/* Main Video Stage */}
      <div className="facetime-main-video-stage" ref={stageRef}>
        {cameraView === 'avatar' ? (
          /* Center Stage Avatar View */
          <div className={`facetime-avatar-frame ${isSpeaking ? 'speaking-pulse' : ''}`}>
            <div className={`avatar-ambient-glow ${isSpeaking ? 'active' : ''}`} />
            <div className="avatar-image-disc">
              <img src="/uday_avatar.png" alt="Uday Kiran" className="avatar-photo" />
            </div>
            <div className="avatar-nameplate">
              <div className="avatar-title-row">
                <strong>{profile.name}</strong>
                {isSpeaking && (
                  <span className="voice-waves">
                    <i /><i /><i /><i />
                  </span>
                )}
              </div>
              <small>Center Stage &middot; 1080p Spatial</small>
            </div>
          </div>
        ) : (
          /* Workspace Screen-Share View */
          <div className="facetime-workspace-frame">
            <div className="workspace-code-header">
              <div className="code-dots">
                <span className="dot red" /><span className="dot yellow" /><span className="dot green" />
              </div>
              <span>uday-os-kernel.ts &middot; Three.js 60FPS</span>
            </div>
            <div className="workspace-code-preview">
              <p><span className="kw">const</span> engineer = <span className="str">"Uday Kiran"</span>;</p>
              <p><span className="kw">const</span> university = <span className="str">"KL University"</span>;</p>
              <p><span className="kw">const</span> status = <span className="val">"Ready for High-Impact SDE Roles"</span>;</p>
              <p><span className="fn">console</span>.log(<span className="str">"184 LeetCode Problems Solved"</span>);</p>
            </div>
          </div>
        )}

        {/* Real-time Subtitle Teleprompter Bubble */}
        <div className="facetime-speech-bubble" onClick={() => speakText(activeSpeech)}>
          <div className="speech-live-indicator">
            <span className="dot" />
            <small>{isSpeaking ? 'Uday is speaking...' : 'Tap topic below to ask question'}</small>
          </div>
          <p>{activeSpeech}</p>
        </div>

        {/* Draggable Recruiter Picture-in-Picture (PIP) Window */}
        <div
          ref={pipRef}
          className={`facetime-pip-window pos-${pipCorner} ${isPipDragging ? 'dragging' : ''}`}
          onPointerDown={handlePipPointerDown}
          title="Draggable Recruiter Preview (drag to any corner)"
        >
          <div className="pip-user-badge">
            <span>You</span>
            <button
              type="button"
              className="pip-cam-toggle-btn"
              onClick={togglePipWebcam}
              title={pipWebcamActive ? 'Disable webcam' : 'Enable webcam'}
            >
              <Camera size={10} />
            </button>
          </div>

          {pipWebcamActive ? (
            <video
              ref={pipVideoRef}
              autoPlay
              playsInline
              muted
              className="pip-video-stream"
            />
          ) : (
            <div className="pip-avatar-fallback">
              <div className="pip-recruiter-disc">
                <span>HR</span>
              </div>
              <span>Recruiter</span>
            </div>
          )}

          <div className="pip-audio-meter">
            <span className="meter-bar m1" />
            <span className="meter-bar m2" />
            <span className="meter-bar m3" />
          </div>
        </div>

        {/* 3D Floating Reaction Animations */}

        {/* 1. Heart Burst */}
        {activeReaction === 'heart' && (
          <div className="facetime-reaction-burst heart">
            {[...Array(8)].map((_, i) => (
              <span
                key={i}
                className="floating-emoji"
                style={{
                  left: `${20 + (i % 5) * 16}%`,
                  animationDelay: `${i * 0.14}s`,
                  fontSize: `${28 + (i % 3) * 8}px`,
                }}
              >
                ❤️
              </span>
            ))}
          </div>
        )}

        {/* 2. Thumbs Up Fireworks */}
        {activeReaction === 'firework' && (
          <div className="facetime-reaction-burst firework">
            {[...Array(8)].map((_, i) => (
              <span
                key={i}
                className="floating-emoji thumbs"
                style={{
                  left: `${25 + (i % 4) * 18}%`,
                  animationDelay: `${i * 0.12}s`,
                  fontSize: `${30 + (i % 3) * 6}px`,
                }}
              >
                👍
              </span>
            ))}
            <div className="firework-sparkle-center">
              <Sparkles size={48} className="text-amber-400" />
            </div>
          </div>
        )}

        {/* 3. Confetti Shower */}
        {activeReaction === 'confetti' && (
          <div className="facetime-reaction-burst confetti">
            {[...Array(14)].map((_, i) => (
              <span
                key={i}
                className="confetti-piece"
                style={{
                  left: `${(i / 14) * 100}%`,
                  animationDelay: `${(i % 5) * 0.15}s`,
                  backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'][i % 6],
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recruiter Interview Inquiry Topics */}
      <div className="facetime-topics-strip">
        {TOPICS.map((t) => (
          <button
            key={t.id}
            type="button"
            className="facetime-topic-chip"
            onClick={() => speakText(t.text)}
          >
            <span>{t.label}</span>
          </button>
        ))}

        <button
          type="button"
          className="facetime-topic-chip reaction-chip"
          onClick={() => handleTriggerReaction('firework')}
        >
          <ThumbsUp size={13} />
          <span>Firework</span>
        </button>
      </div>

      {/* Bottom FaceTime Glass Control Dock */}
      <div className="facetime-dock-bar">
        {/* Mute Button */}
        <button
          type="button"
          className={`facetime-ctrl-btn ${isMuted ? 'active-off' : ''}`}
          onClick={() => {
            sound.playTapSound();
            setIsMuted(!isMuted);
            showToast(isMuted ? 'Microphone Active' : 'Microphone Muted');
          }}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
          title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
        >
          {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        {/* Camera Flip Button */}
        <button
          type="button"
          className="facetime-ctrl-btn"
          onClick={handleFlipCamera}
          aria-label="Flip Camera View"
          title="Switch between Center Stage & Workspace"
        >
          <RefreshCw size={20} />
        </button>

        {/* Video Toggle Button */}
        <button
          type="button"
          className={`facetime-ctrl-btn ${isVideoOff ? 'active-off' : ''}`}
          onClick={() => {
            sound.playTapSound();
            setIsVideoOff(!isVideoOff);
            showToast(isVideoOff ? 'Video Enabled' : 'Video Disabled');
          }}
          aria-label={isVideoOff ? 'Enable Video' : 'Disable Video'}
          title={isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
        >
          {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
        </button>

        {/* End Call Button */}
        <button
          type="button"
          className="facetime-ctrl-btn end-call"
          onClick={handleEndCall}
          aria-label="End Call"
          title="End FaceTime Call"
        >
          <PhoneOff size={22} />
        </button>
      </div>
    </div>
  );
}
