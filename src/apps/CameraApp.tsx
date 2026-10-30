import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Zap, ZapOff, RefreshCw, Aperture, Image as ImageIcon } from 'lucide-react';
import { sound } from '../services/sound';

interface CameraAppProps {
  onBack: () => void;
  onOpenPhotos: () => void;
}

export function CameraApp({ onBack, onOpenPhotos }: CameraAppProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [flashActive, setFlashActive] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<'0.5x' | '1x' | '2x'>('1x');
  const [cameraPermission, setCameraPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [latestPhoto, setLatestPhoto] = useState<string | null>(null);

  // Load latest photo from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('uday-os-user-photos');
      if (stored) {
        const photos = JSON.parse(stored);
        if (Array.isArray(photos) && photos.length > 0) {
          setLatestPhoto(photos[photos.length - 1].dataUrl);
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Initialize camera stream
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    let isMounted = true;

    async function initCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const s = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: 'user',
              width: { ideal: 720 },
              height: { ideal: 1280 },
            },
            audio: false,
          });
          if (isMounted) {
            activeStream = s;
            setStream(s);
            setCameraPermission('granted');
            if (videoRef.current) {
              videoRef.current.srcObject = s;
              void videoRef.current.play();
            }
          } else {
            s.getTracks().forEach((track) => track.stop());
          }
        } else {
          setCameraPermission('denied');
        }
      } catch {
        if (isMounted) {
          setCameraPermission('denied');
        }
      }
    }

    void initCamera();

    return () => {
      isMounted = false;
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Capture photo
  const handleCapture = () => {
    sound.playShutterSound();
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 240);

    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = 720;
    canvas.height = 960;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      if (stream && videoRef.current && videoRef.current.readyState >= 2) {
        // Draw live webcam frame
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      } else {
        // Generate simulated iPhone camera shot with timestamp and stylized art
        const grad = ctx.createLinearGradient(0, 0, 720, 960);
        grad.addColorStop(0, '#0f172a');
        grad.addColorStop(0.5, '#1e1b4b');
        grad.addColorStop(1, '#090d16');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 720, 960);

        // Grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(240, 0); ctx.lineTo(240, 960);
        ctx.moveTo(480, 0); ctx.lineTo(480, 960);
        ctx.moveTo(0, 320); ctx.lineTo(720, 320);
        ctx.moveTo(0, 640); ctx.lineTo(720, 640);
        ctx.stroke();

        // Shutter focus ring
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(360, 480, 80, 0, Math.PI * 2);
        ctx.stroke();

        // Watermark typography
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('UDAY OS · Shot on iPhone 17 Pro', 360, 470);

        ctx.font = '18px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('Dual 48MP Fusion Camera · KL University', 360, 510);

        ctx.font = '14px monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fillText(new Date().toLocaleString(), 360, 545);
      }

      const photoData = canvas.toDataURL('image/jpeg', 0.85);
      setLatestPhoto(photoData);

      try {
        const stored = localStorage.getItem('uday-os-user-photos');
        const existing = stored ? JSON.parse(stored) : [];
        const newPhoto = {
          id: `photo-${Date.now()}`,
          dataUrl: photoData,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        };
        const updated = [...existing, newPhoto];
        localStorage.setItem('uday-os-user-photos', JSON.stringify(updated));
      } catch {
        // LocalStorage quota or blocked
      }
    }
  };

  return (
    <div className="camera-viewfinder-app">
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} style={{ display: 'none' }} width={720} height={960} />

      {/* Screen Flash Overlay */}
      {flashActive && <div className="camera-flash-curtain" />}

      {/* Top Controls Header */}
      <header className="camera-top-bar">
        <button
          type="button"
          className="camera-ctrl-btn"
          onClick={onBack}
          aria-label="Back to Home"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="camera-header-center">
          <button
            type="button"
            className={`camera-pill-btn ${flashEnabled ? 'active' : ''}`}
            onClick={() => setFlashEnabled(!flashEnabled)}
            aria-label="Toggle flash"
          >
            {flashEnabled ? <Zap size={14} className="text-amber" /> : <ZapOff size={14} />}
          </button>
          <span className="camera-hdr-pill">HDR</span>
        </div>

        <button
          type="button"
          className="camera-ctrl-btn"
          onClick={() => {
            sound.playTapSound();
            const next = zoomLevel === '0.5x' ? '1x' : zoomLevel === '1x' ? '2x' : '0.5x';
            setZoomLevel(next);
          }}
          aria-label="Toggle zoom ratio"
        >
          <Aperture size={18} />
        </button>
      </header>

      {/* Live Viewfinder Body */}
      <div className={`camera-viewfinder-screen zoom-${zoomLevel}`}>
        {cameraPermission === 'granted' ? (
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className="camera-live-video"
          />
        ) : (
          <div className="camera-simulated-view">
            <div className="camera-sim-grid">
              <div className="sim-focus-box">
                <span className="corner c-tl" />
                <span className="corner c-tr" />
                <span className="corner c-bl" />
                <span className="corner c-br" />
                <div className="focus-center-cross" />
              </div>
            </div>
            <div className="camera-telemetry-hud">
              <span>48MP RAW</span>
              <span>f/1.78</span>
              <span>1/120s</span>
              <span>ISO 64</span>
            </div>
          </div>
        )}

        {/* 3x3 Composition Grid */}
        <div className="camera-rule-of-thirds-grid" />

        {/* Zoom Selector Capsule */}
        <div className="camera-zoom-capsule">
          {(['0.5x', '1x', '2x'] as const).map((z) => (
            <button
              key={z}
              type="button"
              className={`zoom-btn ${zoomLevel === z ? 'active' : ''}`}
              onClick={() => {
                sound.playTapSound();
                setZoomLevel(z);
              }}
            >
              {z}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Mode Picker */}
      <div className="camera-mode-strip">
        <span className="camera-mode-label">CINEMATIC</span>
        <span className="camera-mode-label">VIDEO</span>
        <span className="camera-mode-label active">PHOTO</span>
        <span className="camera-mode-label">PORTRAIT</span>
        <span className="camera-mode-label">PANO</span>
      </div>

      {/* Bottom Shutter Action Bar */}
      <footer className="camera-shutter-bar">
        {/* Latest Photo Gallery Shortcut */}
        <button
          type="button"
          className="camera-gallery-thumb-btn"
          onClick={onOpenPhotos}
          aria-label="Open Photos Library"
        >
          {latestPhoto ? (
            <img src={latestPhoto} alt="Latest taken photo" className="camera-thumb-img" />
          ) : (
            <div className="camera-thumb-placeholder">
              <ImageIcon size={18} />
            </div>
          )}
        </button>

        {/* Native iOS Shutter Button */}
        <button
          type="button"
          className="camera-ios-shutter-btn"
          onClick={handleCapture}
          aria-label="Take picture"
        >
          <div className="shutter-inner-circle" />
        </button>

        {/* Flip Lens Button */}
        <button
          type="button"
          className="camera-flip-btn"
          onClick={() => {
            sound.playTapSound();
            const next = zoomLevel === '1x' ? '2x' : '1x';
            setZoomLevel(next);
          }}
          aria-label="Toggle camera"
        >
          <RefreshCw size={20} />
        </button>
      </footer>
    </div>
  );
}
