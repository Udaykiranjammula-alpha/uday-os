import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Minus,
  Maximize2,
  Copy,
  Check,
  FileText,
  Image as ImageIcon,
  Send,
  UploadCloud,
  Laptop,
  Smartphone,
  Sparkles,
  Clipboard,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { sound } from '../services/sound';
import { haptics } from '../services/haptics';

interface MacMirrorViewProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigatePhone?: (route: string) => void;
  onUniversalPaste?: (text: string) => void;
}

export interface ClipboardItem {
  id: string;
  text: string;
  source: 'mac' | 'iphone';
  timestamp: number;
}

export function MacMirrorView({
  isOpen,
  onClose,
  onNavigatePhone,
  onUniversalPaste,
}: MacMirrorViewProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [airDropActive, setAirDropActive] = useState(false);
  const [airDropFile, setAirDropFile] = useState<string | null>(null);

  // Universal Clipboard History
  const [clipboardHistory, setClipboardHistory] = useState<ClipboardItem[]>([
    {
      id: 'clip-1',
      text: 'const A18_PRO = { architecture: "3nm", neuralEngine: "16-Core", int8Compute: "35 TOPS" };',
      source: 'mac',
      timestamp: Date.now() - 120000,
    },
    {
      id: 'clip-2',
      text: 'git commit -m "feat: complete apple ecosystem master plan with 0 regressions"',
      source: 'mac',
      timestamp: Date.now() - 60000,
    },
    {
      id: 'clip-3',
      text: 'https://github.com/Udaykiranjammula-alpha/uday-os.git',
      source: 'mac',
      timestamp: Date.now() - 30000,
    },
    {
      id: 'clip-4',
      text: 'udaykiran.jammula@example.com · Recruiter Direct Inquiry',
      source: 'mac',
      timestamp: Date.now() - 10000,
    },
  ]);

  // Quick paste action from Mac to iPhone
  const handleCopyFromMac = (snippet: string, id: string) => {
    sound.playTapSound();
    haptics.tap();
    try {
      navigator.clipboard.writeText(snippet);
    } catch {}

    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);

    // Add to history
    const newItem: ClipboardItem = {
      id: `clip-${Date.now()}`,
      text: snippet,
      source: 'mac',
      timestamp: Date.now(),
    };
    setClipboardHistory((prev) => [newItem, ...prev.slice(0, 9)]);

    // Trigger iOS "Pasted from MacBook Pro" toast
    if (onUniversalPaste) {
      onUniversalPaste(snippet);
    }
  };

  // Drag and Drop Transfer Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);

    let fileName = 'Project_Asset.png';
    let fileType = 'image/png';

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      fileName = file.name;
      fileType = file.type || 'image/png';
    }

    // Trigger AirDrop animation
    sound.playApplePayChime();
    haptics.success();
    setAirDropFile(fileName);
    setAirDropActive(true);

    setTimeout(() => {
      setAirDropActive(false);
      // Route based on MIME type
      if (onNavigatePhone) {
        if (fileType.startsWith('image/')) onNavigatePhone('photos');
        else if (fileType === 'application/pdf') onNavigatePhone('resume');
        else if (fileType.includes('vcard')) onNavigatePhone('contact');
        else onNavigatePhone('notes');
      }
    }, 2400);
  };

  // Simulate dropping sample file
  const handleSimulateAirDrop = (filename: string, route: string) => {
    sound.playApplePayChime();
    haptics.success();
    setAirDropFile(filename);
    setAirDropActive(true);

    setTimeout(() => {
      setAirDropActive(false);
      if (onNavigatePhone) onNavigatePhone(route);
    }, 2400);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed top-14 right-6 w-96 bg-zinc-900/95 border border-zinc-700/80 rounded-2xl shadow-2xl backdrop-blur-2xl z-50 text-white font-sans transition-all duration-300 overflow-hidden ${
        isMinimized ? 'h-11' : 'max-h-[600px]'
      }`}
    >
      {/* macOS Sequoia Window Chrome / Titlebar */}
      <div className="h-11 bg-zinc-800/90 px-3.5 flex items-center justify-between border-b border-zinc-700/60 select-none">
        {/* Authentic Traffic Light Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-110 active:brightness-90 transition-all flex items-center justify-center text-[8px] text-zinc-900 group"
            onClick={() => {
              sound.playTapSound();
              haptics.tap();
              onClose();
            }}
            aria-label="Close Mirroring"
            title="Close Mirroring"
          >
            <X size={7} className="opacity-0 group-hover:opacity-100" />
          </button>
          <button
            type="button"
            className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:brightness-110 active:brightness-90 transition-all flex items-center justify-center text-[8px] text-zinc-900 group"
            onClick={() => {
              sound.playTapSound();
              haptics.tap();
              setIsMinimized(!isMinimized);
            }}
            aria-label="Minimize"
            title="Minimize"
          >
            <Minus size={7} className="opacity-0 group-hover:opacity-100" />
          </button>
          <button
            type="button"
            className="w-3 h-3 rounded-full bg-[#27c93f] hover:brightness-110 active:brightness-90 transition-all flex items-center justify-center text-[8px] text-zinc-900 group"
            onClick={() => {
              sound.playTapSound();
              haptics.tap();
              setIsMinimized(false);
            }}
            aria-label="Zoom Window"
            title="Zoom Window"
          >
            <Maximize2 size={6} className="opacity-0 group-hover:opacity-100" />
          </button>
        </div>

        {/* Title */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
          <Laptop size={13} className="text-zinc-400" />
          <span>iPhone Mirroring</span>
        </div>

        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Connected" />
          <span className="text-[10px] text-zinc-400 font-mono">16 Pro</span>
        </div>
      </div>

      {/* Window Body (When Not Minimized) */}
      {!isMinimized && (
        <div
          className="p-3.5 space-y-3.5 max-h-[550px] overflow-y-auto"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Universal Clipboard Continuity Panel (Feature 26) */}
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-400">
                <Clipboard size={13} />
                <span>Universal Clipboard</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">MacBook Pro &harr; iPhone</span>
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed mb-2.5">
              Click any snippet to copy on Mac &amp; seamlessly broadcast to virtual iPhone with iOS
              toast notification.
            </p>

            <div className="space-y-1.5">
              {clipboardHistory.slice(0, 4).map((clip) => (
                <div
                  key={clip.id}
                  className="bg-zinc-900/90 hover:bg-zinc-850 p-2 rounded-lg border border-zinc-800/80 flex items-center justify-between group transition-all"
                >
                  <code className="text-[10px] font-mono text-zinc-300 truncate max-w-[240px]">
                    {clip.text}
                  </code>
                  <button
                    type="button"
                    className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-all"
                    onClick={() => handleCopyFromMac(clip.text, clip.id)}
                    title="Paste into iPhone"
                  >
                    {copiedId === clip.id ? (
                      <Check size={12} className="text-emerald-400" />
                    ) : (
                      <Copy size={12} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Drag-and-Drop Continuity Drop Zone (Feature 27) */}
          <div
            className={`border-2 border-dashed rounded-xl p-3.5 text-center transition-all ${
              isDraggingFile
                ? 'border-sky-400 bg-sky-500/10'
                : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700'
            }`}
          >
            <UploadCloud size={24} className="mx-auto text-sky-400 mb-1.5" />
            <strong className="text-xs font-semibold text-zinc-200 block">
              Drag &amp; Drop Files to AirDrop
            </strong>
            <p className="text-[10px] text-zinc-400 mb-2.5">
              Drop PNG, PDF, or VCF here to transfer directly to iPhone
            </p>

            {/* Quick Demo AirDrop Buttons */}
            <div className="flex gap-1.5 justify-center">
              <button
                type="button"
                className="text-[10px] bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded text-zinc-300 border border-zinc-700/60 flex items-center gap-1"
                onClick={() => handleSimulateAirDrop('resume.pdf', 'resume')}
              >
                <FileText size={10} className="text-rose-400" />
                <span>Resume.pdf</span>
              </button>
              <button
                type="button"
                className="text-[10px] bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded text-zinc-300 border border-zinc-700/60 flex items-center gap-1"
                onClick={() => handleSimulateAirDrop('screenshot.png', 'photos')}
              >
                <ImageIcon size={10} className="text-sky-400" />
                <span>Screenshot.png</span>
              </button>
            </div>
          </div>

          {/* AirDrop Active Transfer Animation Banner */}
          {airDropActive && (
            <div className="bg-sky-950/80 border border-sky-500/60 rounded-xl p-3 text-center animate-pulse">
              <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 mx-auto flex items-center justify-center mb-1">
                <Send size={15} />
              </div>
              <strong className="text-xs text-white block">AirDrop Transferring...</strong>
              <span className="text-[10px] text-sky-300 font-mono">{airDropFile} &rarr; iPhone</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
