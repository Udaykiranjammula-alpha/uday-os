import React, { useState } from 'react';
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
  Clipboard,
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

    const newItem: ClipboardItem = {
      id: `clip-${Date.now()}`,
      text: snippet,
      source: 'mac',
      timestamp: Date.now(),
    };
    setClipboardHistory((prev) => [newItem, ...prev.slice(0, 9)]);

    if (onUniversalPaste) {
      onUniversalPaste(snippet);
    }
  };

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

    sound.playApplePayChime();
    haptics.success();
    setAirDropFile(fileName);
    setAirDropActive(true);

    setTimeout(() => {
      setAirDropActive(false);
      if (onNavigatePhone) {
        if (fileType.startsWith('image/')) onNavigatePhone('photos');
        else if (fileType === 'application/pdf') onNavigatePhone('resume');
        else if (fileType.includes('vcard')) onNavigatePhone('contact');
        else onNavigatePhone('notes');
      }
    }, 2400);
  };

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
    <>
      {/* Semi-transparent backdrop for mobile/tablet screens */}
      <div
        className="mac-mirror-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Floating macOS Sequoia iPhone Mirroring Window */}
      <div
        className={`mac-mirror-window ${isMinimized ? 'minimized' : ''}`}
        role="dialog"
        aria-label="macOS Sequoia iPhone Mirroring"
      >
        {/* macOS Titlebar Chrome */}
        <div className="mac-mirror-titlebar">
          <div className="mac-traffic-lights">
            <button
              type="button"
              className="mac-traffic-btn close"
              onClick={() => {
                sound.playTapSound();
                haptics.tap();
                onClose();
              }}
              aria-label="Close Mirroring"
              title="Close Mirroring"
            >
              <X size={8} style={{ opacity: 0.85, color: '#4c0519' }} />
            </button>
            <button
              type="button"
              className="mac-traffic-btn minimize"
              onClick={() => {
                sound.playTapSound();
                haptics.tap();
                setIsMinimized(!isMinimized);
              }}
              aria-label={isMinimized ? 'Expand' : 'Minimize'}
              title={isMinimized ? 'Expand' : 'Minimize'}
            >
              <Minus size={8} style={{ opacity: 0.85, color: '#78350f' }} />
            </button>
            <button
              type="button"
              className="mac-traffic-btn zoom"
              onClick={() => {
                sound.playTapSound();
                haptics.tap();
                setIsMinimized(false);
              }}
              aria-label="Zoom Window"
              title="Zoom Window"
            >
              <Maximize2 size={7} style={{ opacity: 0.85, color: '#064e3b' }} />
            </button>
          </div>

          <div className="mac-mirror-title">
            <Laptop size={13} style={{ color: '#94a3b8' }} />
            <span>iPhone Mirroring</span>
          </div>

          <div className="mac-mirror-status">
            <span className="mac-status-pulse" title="Connected via Continuity" />
            <span className="mac-device-pill">17 Pro</span>
          </div>
        </div>

        {/* Window Body (When Not Minimized) */}
        {!isMinimized && (
          <div
            className="mac-mirror-body"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {/* Universal Clipboard Continuity Card */}
            <div className="mac-card">
              <div className="mac-card-header">
                <div className="mac-card-title">
                  <Clipboard size={13} />
                  <span>Universal Clipboard</span>
                </div>
                <span className="mac-card-badge">MacBook Pro &harr; iPhone</span>
              </div>

              <p className="mac-card-desc">
                Click any snippet to copy on Mac &amp; seamlessly broadcast to virtual iPhone with iOS toast notification.
              </p>

              <div className="mac-clip-list">
                {clipboardHistory.slice(0, 4).map((clip) => (
                  <div key={clip.id} className="mac-clip-row">
                    <code className="mac-clip-code">{clip.text}</code>
                    <button
                      type="button"
                      className="mac-clip-copy-btn"
                      onClick={() => handleCopyFromMac(clip.text, clip.id)}
                      title="Paste into iPhone"
                      aria-label="Copy snippet to iPhone"
                    >
                      {copiedId === clip.id ? (
                        <Check size={12} style={{ color: '#34d399' }} />
                      ) : (
                        <Copy size={12} />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Drag & Drop AirDrop Drop Zone */}
            <div className={`mac-dropzone ${isDraggingFile ? 'dragging' : ''}`}>
              <UploadCloud size={24} className="mac-dropzone-icon" />
              <div className="mac-dropzone-title">Drag &amp; Drop Files to AirDrop</div>
              <div className="mac-dropzone-sub">
                Drop PNG, PDF, or VCF here to transfer directly to iPhone
              </div>

              <div className="mac-airdrop-pills">
                <button
                  type="button"
                  className="mac-airdrop-demo-btn"
                  onClick={() => handleSimulateAirDrop('Resume.pdf', 'resume')}
                  aria-label="Simulate AirDrop Resume.pdf"
                >
                  <FileText size={11} style={{ color: '#f43f5e' }} />
                  <span>Resume.pdf</span>
                </button>
                <button
                  type="button"
                  className="mac-airdrop-demo-btn"
                  onClick={() => handleSimulateAirDrop('Screenshot.png', 'photos')}
                  aria-label="Simulate AirDrop Screenshot.png"
                >
                  <ImageIcon size={11} style={{ color: '#38bdf8' }} />
                  <span>Screenshot.png</span>
                </button>
              </div>
            </div>

            {/* AirDrop Active Transfer Animation Banner */}
            {airDropActive && (
              <div className="mac-airdrop-banner">
                <div className="mac-airdrop-pulse-icon">
                  <Send size={15} />
                </div>
                <strong style={{ fontSize: 12, color: '#ffffff', display: 'block' }}>
                  AirDrop Transferring...
                </strong>
                <span style={{ fontSize: 10, color: '#7dd3fc', fontFamily: 'SF Mono, monospace' }}>
                  {airDropFile} &rarr; iPhone
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
