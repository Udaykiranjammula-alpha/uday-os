// Speech Recognition and Text-to-Speech Engine for "Hey Uday" / Siri Companion

export interface VoiceIntentResult {
  transcript: string;
  action?: 'navigate' | 'flashlight' | 'music' | 'speak';
  target?: string;
  responseText: string;
}

// Check browser SpeechRecognition availability
const SpeechRecognition =
  typeof window !== 'undefined'
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : null;

export class VoiceAssistantService {
  private recognition: any = null;
  private isListening = false;
  private synth: SpeechSynthesis | null = null;
  private voice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoice();
    }
    if (SpeechRecognition) {
      try {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';
      } catch (err) {
        console.warn('SpeechRecognition initialization error:', err);
      }
    }
  }

  private initVoice() {
    if (!this.synth) return;
    const loadVoices = () => {
      const voices = this.synth?.getVoices() || [];
      // Prefer modern natural English voice (Samantha, Google US English, Siri-like)
      this.voice =
        voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Alex'))) ||
        voices.find((v) => v.lang.startsWith('en')) ||
        null;
    };
    loadVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = loadVoices;
    }
  }

  public getIsSupported(): boolean {
    return Boolean(SpeechRecognition);
  }

  public getIsListening(): boolean {
    return this.isListening;
  }

  public listen(
    onResult: (result: VoiceIntentResult) => void,
    onError?: (err: string) => void
  ): () => void {
    if (!this.recognition) {
      onError?.('Speech recognition is not supported in this browser. You can type or tap suggestions.');
      return () => {};
    }

    try {
      this.isListening = true;
      this.recognition.onresult = (event: any) => {
        this.isListening = false;
        const transcript = event.results[0]?.[0]?.transcript || '';
        const intent = this.parseIntent(transcript);
        onResult(intent);
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        onError?.(event.error || 'Voice error');
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      this.recognition.start();
    } catch (err) {
      this.isListening = false;
      onError?.(err instanceof Error ? err.message : 'Could not start microphone');
    }

    return () => {
      try {
        this.recognition?.stop();
      } catch {}
      this.isListening = false;
    };
  }

  public speak(text: string, onEnd?: () => void) {
    if (!this.synth) {
      onEnd?.();
      return;
    }
    try {
      this.synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (this.voice) {
        utterance.voice = this.voice;
      }
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.onend = () => onEnd?.();
      utterance.onerror = () => onEnd?.();
      this.synth.speak(utterance);
    } catch {
      onEnd?.();
    }
  }

  public stopSpeaking() {
    try {
      this.synth?.cancel();
    } catch {}
  }

  public parseIntent(transcript: string): VoiceIntentResult {
    const text = transcript.toLowerCase().trim();

    // Navigation Commands
    if (text.includes('camera') || text.includes('take photo') || text.includes('selfie')) {
      return {
        transcript,
        action: 'navigate',
        target: 'camera',
        responseText: 'Opening Camera.',
      };
    }
    if (text.includes('github') || text.includes('repo') || text.includes('codebase')) {
      return {
        transcript,
        action: 'navigate',
        target: 'github',
        responseText: 'Opening GitHub repositories.',
      };
    }
    if (text.includes('linkedin') || text.includes('profile') || text.includes('connect')) {
      return {
        transcript,
        action: 'navigate',
        target: 'linkedin',
        responseText: 'Opening LinkedIn profile.',
      };
    }
    if (text.includes('leetcode') || text.includes('problem') || text.includes('dsa')) {
      return {
        transcript,
        action: 'navigate',
        target: 'leetcode',
        responseText: 'Opening LeetCode progress.',
      };
    }
    if (text.includes('project') || text.includes('portfolio') || text.includes('works')) {
      return {
        transcript,
        action: 'navigate',
        target: 'projects',
        responseText: 'Here are Uday’s featured engineering projects.',
      };
    }
    if (text.includes('terminal') || text.includes('console') || text.includes('matrix')) {
      return {
        transcript,
        action: 'navigate',
        target: 'terminal',
        responseText: 'Launching ZSH Terminal.',
      };
    }
    if (text.includes('message') || text.includes('chat') || text.includes('recruiter') || text.includes('contact')) {
      return {
        transcript,
        action: 'navigate',
        target: 'messages',
        responseText: 'Opening recruiter chat messages.',
      };
    }
    if (text.includes('arcade') || text.includes('game') || text.includes('play')) {
      return {
        transcript,
        action: 'navigate',
        target: 'arcade',
        responseText: 'Launching Dev Dash on Apple Arcade.',
      };
    }
    if (text.includes('clock') || text.includes('stopwatch') || text.includes('time')) {
      return {
        transcript,
        action: 'navigate',
        target: 'clock',
        responseText: 'Opening World Clock and Stopwatch.',
      };
    }
    if (text.includes('photo') || text.includes('gallery')) {
      return {
        transcript,
        action: 'navigate',
        target: 'photos',
        responseText: 'Opening Photos gallery.',
      };
    }
    if (text.includes('home') || text.includes('desktop') || text.includes('close')) {
      return {
        transcript,
        action: 'navigate',
        target: 'home',
        responseText: 'Returning to Home Screen.',
      };
    }

    // Hardware & Ambient Commands
    if (text.includes('flash') || text.includes('torch') || text.includes('light')) {
      return {
        transcript,
        action: 'flashlight',
        responseText: 'Toggling back camera flashlight.',
      };
    }
    if (text.includes('music') || text.includes('song') || text.includes('ambient') || text.includes('sound')) {
      return {
        transcript,
        action: 'music',
        responseText: 'Toggling ambient lo-fi music in Dynamic Island.',
      };
    }

    // Questions about Uday
    if (text.includes('who is uday') || text.includes('who are you') || text.includes('about')) {
      return {
        transcript,
        action: 'speak',
        responseText:
          'Uday Kiran Jammula is a Computer Science and Software Engineering student at KL University with over 184 LeetCode solutions, deep expertise in Python, Data Structures, TypeScript, and Full-Stack Systems.',
      };
    }
    if (text.includes('skills') || text.includes('stack') || text.includes('technologies')) {
      return {
        transcript,
        action: 'speak',
        responseText:
          'Uday’s technical repertoire includes Python, C, C++, Data Structures & Algorithms, React, TypeScript, Node.js, and Three.js 3D web graphics.',
      };
    }
    if (text.includes('university') || text.includes('college') || text.includes('education')) {
      return {
        transcript,
        action: 'speak',
        responseText:
          'Uday is currently pursuing his B.Tech in Computer Science and Engineering at KL University in Vijayawada, maintaining exceptional coursework in algorithms and operating systems.',
      };
    }
    if (text.includes('hire') || text.includes('job') || text.includes('resume') || text.includes('offer')) {
      return {
        transcript,
        action: 'navigate',
        target: 'resume',
        responseText:
          'Uday is actively open to Software Engineering and Full-Stack internships and full-time roles. Opening his resume now.',
      };
    }

    // General fallback
    return {
      transcript,
      action: 'speak',
      responseText: `I heard: "${transcript}". You can ask me to open projects, trigger the flashlight, play music, or hear about Uday's background.`,
    };
  }
}

export const voiceAssistant = new VoiceAssistantService();
