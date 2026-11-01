import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  Zap,
  ZapOff,
  RefreshCw,
  Sliders,
  Image as ImageIcon,
  Square,
  Sun,
  Eye,
  Camera,
  Compass,
  Film,
  Sparkles,
} from 'lucide-react';
import { sound } from '../services/sound';

interface CameraAppProps {
  onBack: () => void;
  onOpenPhotos: () => void;
}

export type CameraMode = 'PHOTO' | 'VIDEO' | 'PORTRAIT' | 'CINEMATIC' | 'SPATIAL' | 'PANORAMA';
export type FilterType = 'standard' | 'vivid' | 'warm' | 'cool' | 'noir' | 'dramatic';
export type ZoomLevel = '0.5x' | '1x' | '2x' | '5x';

const CAMERA_MODES: CameraMode[] = [
  'PHOTO',
  'VIDEO',
  'PORTRAIT',
  'CINEMATIC',
  'SPATIAL',
  'PANORAMA',
];

const FILTERS: { id: FilterType; label: string; desc: string }[] = [
  { id: 'standard', label: 'Standard', desc: 'True to life tone & balance' },
  { id: 'vivid', label: 'Vivid', desc: 'Vibrant punchy contrast' },
  { id: 'warm', label: 'Warm', desc: 'Golden hour undertones' },
  { id: 'cool', label: 'Cool', desc: 'Crisp cinematic blues' },
  { id: 'noir', label: 'Noir', desc: 'High contrast monochrome' },
  { id: 'dramatic', label: 'Dramatic', desc: 'Deep shadows and highlights' },
];

export function CameraApp({ onBack, onOpenPhotos }: CameraAppProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const modeStripRef = useRef<HTMLDivElement>(null);
  const modeButtonsRef = useRef<{ [key in CameraMode]?: HTMLButtonElement | null }>({});

  // Core camera states
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [streamReady, setStreamReady] = useState(false);
  const [cameraMode, setCameraMode] = useState<CameraMode>('PHOTO');
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('1x');
  const [showCameraControlHud, setShowCameraControlHud] = useState(false);
  const [flashActive, setFlashActive] = useState(false);
  const [flashMode, setFlashMode] = useState<'off' | 'on' | 'auto'>('auto');
  const [hdrEnabled, setHdrEnabled] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>('standard');
  const [showFiltersMenu, setShowFiltersMenu] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [isFlipping, setIsFlipping] = useState(false);
  const [latestPhoto, setLatestPhoto] = useState<string | null>(null);

  // Video Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);

  // Tap-to-focus indicator
  const [focusPoint, setFocusPoint] = useState<{ x: number; y: number } | null>(null);

  // Portrait lighting preset
  const [portraitLight, setPortraitLight] = useState<'NATURAL' | 'STUDIO' | 'CONTOUR'>('NATURAL');

  // Load latest photo from localStorage (prefer ios_user_photos)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ios_user_photos') || localStorage.getItem('uday-os-user-photos');
      if (stored) {
        const photos = JSON.parse(stored);
        if (Array.isArray(photos) && photos.length > 0) {
          const last = photos[photos.length - 1];
          setLatestPhoto(last.dataUrl || last.url);
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  // Video recording timer
  useEffect(() => {
    let timer: number;
    if (isRecording) {
      timer = window.setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    } else {
      setRecordSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  // Stop active stream helper
  const stopCurrentStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // Ignore
        }
      });
      streamRef.current = null;
    }
  }, []);

  // Initialize camera stream
  const startCamera = useCallback(async (facingUser: boolean) => {
    stopCurrentStream();
    setStreamReady(false);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return;
    }

    try {
      let mediaStream: MediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facingUser ? 'user' : 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch {
        // Fallback for laptop webcams without facingMode constraint
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      streamRef.current = mediaStream;
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.muted = true;
        try {
          await videoRef.current.play();
          setStreamReady(true);
        } catch {
          // Play was deferred
        }
      }
    } catch (err) {
      console.warn('Camera access error or denied:', err);
      setStream(null);
      setStreamReady(false);
    }
  }, [stopCurrentStream]);

  // Mount effect to start camera
  useEffect(() => {
    void startCamera(isFrontCamera);

    return () => {
      stopCurrentStream();
    };
  }, [isFrontCamera, startCamera, stopCurrentStream]);

  // Re-bind stream if video element re-mounts
  useEffect(() => {
    const video = videoRef.current;
    if (video && stream && video.srcObject !== stream) {
      video.srcObject = stream;
      video.muted = true;
      video.play().then(() => setStreamReady(true)).catch(() => {});
    }
  }, [stream]);

  // Smooth scroll mode selector when active mode changes
  useEffect(() => {
    const btn = modeButtonsRef.current[cameraMode];
    const container = modeStripRef.current;
    if (btn && container) {
      const btnRect = btn.getBoundingClientRect();
      const contRect = container.getBoundingClientRect();
      const offset = btnRect.left - contRect.left - (contRect.width / 2) + (btnRect.width / 2);
      container.scrollBy({ left: offset, behavior: 'smooth' });
    }
  }, [cameraMode]);

  // Tap-to-focus on viewfinder
  const handleViewfinderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setFocusPoint({ x, y });
    sound.playTapSound();
    setTimeout(() => {
      setFocusPoint(null);
    }, 2200);
  };

  // Filter CSS styles
  const filterStyles: Record<FilterType, string> = {
    standard: 'none',
    vivid: 'saturate(1.45) contrast(1.12)',
    warm: 'sepia(0.28) saturate(1.25) hue-rotate(-10deg) brightness(1.02)',
    cool: 'saturate(1.1) hue-rotate(18deg) brightness(1.05)',
    noir: 'grayscale(1) contrast(1.35) brightness(0.95)',
    dramatic: 'contrast(1.4) brightness(0.92) saturate(1.25)',
  };

  // Realistic zoom scale transform
  const zoomScale =
    zoomLevel === '0.5x' ? 0.72 : zoomLevel === '1x' ? 1.0 : zoomLevel === '2x' ? 1.55 : 2.75;

  // Capacitive Camera Control Sensor drag & tap handler
  const handleSensorPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeY = (e.clientY - rect.top) / rect.height; // 0 (top) to 1 (bottom)
    let nextZoom: ZoomLevel = '1x';

    if (relativeY < 0.25) {
      nextZoom = '5x';
    } else if (relativeY < 0.5) {
      nextZoom = '2x';
    } else if (relativeY < 0.75) {
      nextZoom = '1x';
    } else {
      nextZoom = '0.5x';
    }

    if (nextZoom !== zoomLevel) {
      sound.playActionClickSound();
      setZoomLevel(nextZoom);
    }

    setShowCameraControlHud(true);
    window.clearTimeout((window as unknown as { _camControlTimer?: number })._camControlTimer);
    (window as unknown as { _camControlTimer?: number })._camControlTimer = window.setTimeout(() => {
      setShowCameraControlHud(false);
    }, 2200);
  };

  // Shutter action (Photos & Video recording)
  const handleShutterAction = () => {
    if (cameraMode === 'VIDEO' || cameraMode === 'CINEMATIC') {
      sound.playActionClickSound();
      if (!isRecording) {
        setIsRecording(true);
      } else {
        // Stop recording and save a video snapshot
        setIsRecording(false);
        saveSnapshot(`Video Clip (${recordSeconds}s)`);
      }
      return;
    }

    // Photo / Portrait / Spatial / Panorama modes
    sound.playShutterSound();
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 240);

    saveSnapshot();
  };

  const saveSnapshot = (customLabel?: string) => {
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = 720;
    canvas.height = 960;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const video = videoRef.current;
      const isVideoPlaying = video && video.readyState >= 2 && video.videoWidth > 0;

      if (isVideoPlaying) {
        // Apply active filter to snapshot canvas
        ctx.filter = filterStyles[activeFilter];

        const vRatio = video.videoWidth / video.videoHeight;
        const cRatio = canvas.width / canvas.height;
        let sWidth = video.videoWidth;
        let sHeight = video.videoHeight;
        let sx = 0;
        let sy = 0;

        if (vRatio > cRatio) {
          sWidth = video.videoHeight * cRatio;
          sx = (video.videoWidth - sWidth) / 2;
        } else {
          sHeight = video.videoWidth / cRatio;
          sy = (video.videoHeight - sHeight) / 2;
        }

        ctx.save();
        if (isFrontCamera) {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
        ctx.restore();
      } else {
        // High-aesthetic simulated iPhone 17 Pro Max portfolio capture
        const grad = ctx.createLinearGradient(0, 0, 720, 960);
        grad.addColorStop(0, '#0f172a');
        grad.addColorStop(0.3, '#1e1b4b');
        grad.addColorStop(0.7, '#2e1065');
        grad.addColorStop(1, '#020617');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 720, 960);

        // Ambient lighting glow circles
        ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.beginPath();
        ctx.arc(360, 420, 220, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(168, 85, 247, 0.25)';
        ctx.beginPath();
        ctx.arc(280, 520, 180, 0, Math.PI * 2);
        ctx.fill();

        // Target reticle
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(260, 360, 200, 200);

        // Corner ticks
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        const s = 25;
        // Top Left
        ctx.beginPath(); ctx.moveTo(250, 350 + s); ctx.lineTo(250, 350); ctx.lineTo(250 + s, 350); ctx.stroke();
        // Top Right
        ctx.beginPath(); ctx.moveTo(470 - s, 350); ctx.lineTo(470, 350); ctx.lineTo(470, 350 + s); ctx.stroke();
        // Bottom Left
        ctx.beginPath(); ctx.moveTo(250, 570 - s); ctx.lineTo(250, 570); ctx.lineTo(250 + s, 570); ctx.stroke();
        // Bottom Right
        ctx.beginPath(); ctx.moveTo(470 - s, 570); ctx.lineTo(470, 570); ctx.lineTo(470, 570 - s); ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 30px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('UDAY OS · iPhone 17 Pro Max', 360, 440);

        ctx.fillStyle = '#38bdf8';
        ctx.font = '600 20px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
        ctx.fillText(`${cameraMode} · ${zoomLevel} · ${activeFilter.toUpperCase()} STYLE`, 360, 480);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '500 15px monospace';
        ctx.fillText(`48MP FUSION · f/1.78 · ISO 64 · 24mm`, 360, 515);
      }

      const photoData = canvas.toDataURL('image/jpeg', 0.88);
      setLatestPhoto(photoData);

      try {
        const stored = localStorage.getItem('ios_user_photos') || localStorage.getItem('uday-os-user-photos');
        const existing = stored ? JSON.parse(stored) : [];
        const newPhoto = {
          id: `photo-${Date.now()}`,
          dataUrl: photoData,
          mode: cameraMode,
          filter: activeFilter,
          label: customLabel || `${cameraMode} Capture`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          isFavorite: false,
        };
        const updated = [...existing, newPhoto];
        // Save to both keys so any consumer finds it immediately
        localStorage.setItem('ios_user_photos', JSON.stringify(updated));
        localStorage.setItem('uday-os-user-photos', JSON.stringify(updated));
      } catch {
        // Ignore quota
      }
    }
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${mins}:${s}`;
  };

  const handleModeChange = (mode: CameraMode) => {
    sound.playTapSound();
    setCameraMode(mode);
    if (isRecording) {
      setIsRecording(false);
    }
  };

  const handleFlipCamera = () => {
    sound.playActionClickSound();
    setIsFlipping(true);
    setTimeout(() => {
      setIsFrontCamera((prev) => !prev);
      setIsFlipping(false);
    }, 180);
  };

  return (
    <div className={`camera-viewfinder-app mode-${cameraMode.toLowerCase()}`}>
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} style={{ display: 'none' }} width={720} height={960} />

      {/* Screen Shutter Flash Overlay */}
      {flashActive && <div className="camera-flash-curtain" />}

      {/* Top Controls Header */}
      <header className="camera-top-bar">
        {/* Back to Home */}
        <button
          type="button"
          className="camera-ctrl-btn"
          onClick={onBack}
          aria-label="Back to Home"
          title="Back to Home"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Center Indicators / Recording Timer */}
        <div className="camera-header-center">
          {isRecording ? (
            <div className="camera-recording-badge">
              <span className="rec-red-dot" />
              <span>{formatTimer(recordSeconds)}</span>
            </div>
          ) : (
            <>
              {/* Flash Cycle Button */}
              <button
                type="button"
                className={`camera-pill-btn ${flashMode !== 'off' ? 'active' : ''}`}
                onClick={() => {
                  sound.playTapSound();
                  setFlashMode((prev) => (prev === 'off' ? 'on' : prev === 'on' ? 'auto' : 'off'));
                }}
                aria-label="Toggle Flash Mode"
                title={`Flash: ${flashMode.toUpperCase()}`}
              >
                {flashMode === 'off' ? (
                  <ZapOff size={14} />
                ) : (
                  <Zap size={14} className={flashMode === 'on' ? 'text-amber-400' : ''} />
                )}
                <span className="pill-sub">{flashMode === 'auto' ? 'A' : ''}</span>
              </button>

              {/* HDR Toggle Button */}
              <button
                type="button"
                className={`camera-hdr-pill-btn ${hdrEnabled ? 'active' : ''}`}
                onClick={() => {
                  sound.playTapSound();
                  setHdrEnabled(!hdrEnabled);
                }}
                aria-label="Toggle HDR"
                title="Smart HDR 5"
              >
                HDR
              </button>

              {/* Mode indicator pill */}
              <span className="camera-mode-pill-tag">{cameraMode}</span>
            </>
          )}
        </div>

        {/* Photographic Styles / Filters Toggle */}
        <button
          type="button"
          className={`camera-ctrl-btn ${showFiltersMenu || activeFilter !== 'standard' ? 'active-filter' : ''}`}
          onClick={() => {
            sound.playTapSound();
            setShowFiltersMenu(!showFiltersMenu);
          }}
          aria-label="Photographic Styles"
          title="Photographic Styles"
        >
          <Sliders size={17} />
        </button>
      </header>

      {/* Expandable Live Filters Strip */}
      {showFiltersMenu && (
        <div className="camera-filters-strip">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`filter-chip ${activeFilter === f.id ? 'active' : ''}`}
              onClick={() => {
                sound.playTapSound();
                setActiveFilter(f.id);
              }}
              title={f.desc}
            >
              <span>{f.label.toUpperCase()}</span>
            </button>
          ))}
        </div>
      )}

      {/* Live Viewfinder Body with Tap-to-Focus */}
      <div
        className={`camera-viewfinder-screen ${cameraMode === 'CINEMATIC' ? 'letterbox-cinematic' : ''} ${
          isFlipping ? 'camera-flipping' : ''
        }`}
        onClick={handleViewfinderClick}
      >
        {/* Live Webcam Element */}
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          onLoadedMetadata={() => {
            setStreamReady(true);
            videoRef.current?.play().catch(() => {});
          }}
          className="camera-live-video"
          style={{
            display: streamReady ? 'block' : 'none',
            transform: `scale(${zoomScale}) ${isFrontCamera ? 'scaleX(-1)' : 'scaleX(1)'}`,
            filter: filterStyles[activeFilter],
            transition: 'transform 0.3s cubic-bezier(0.2, 0.9, 0.3, 1), filter 0.2s ease',
          }}
        />

        {/* Viewfinder Telemetry Placeholder (visible if webcam disconnected) */}
        {!streamReady && (
          <div
            className="camera-simulated-view"
            style={{
              transform: `scale(${zoomScale})`,
              filter: filterStyles[activeFilter],
              transition: 'transform 0.3s cubic-bezier(0.2, 0.9, 0.3, 1), filter 0.2s ease',
            }}
          >
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
              <span>48MP FUSION</span>
              <span>f/1.78</span>
              <span>1/120s</span>
              <span>ISO 64</span>
              <span>{isFrontCamera ? 'TRUE-DEPTH 12MP' : 'PRO CAMERA SYS'}</span>
            </div>
          </div>
        )}

        {/* Tap-To-Focus Yellow Ring */}
        {focusPoint && (
          <div
            className="camera-tap-focus-ring"
            style={{ left: focusPoint.x - 30, top: focusPoint.y - 30 }}
          >
            <div className="focus-ring-box" />
            <Sun size={12} className="focus-exposure-sun" />
          </div>
        )}

        {/* Mode-Specific Overlays */}

        {/* 1. PORTRAIT: Natural Light Bokeh Hexagon & Lighting Switcher */}
        {cameraMode === 'PORTRAIT' && (
          <div className="portrait-bokeh-badge" onClick={(e) => e.stopPropagation()}>
            <div className="bokeh-hexagon">
              <Sun size={14} className="text-amber-400" />
            </div>
            <button
              type="button"
              className="portrait-light-toggle"
              onClick={() => {
                sound.playTapSound();
                setPortraitLight((prev) =>
                  prev === 'NATURAL' ? 'STUDIO' : prev === 'STUDIO' ? 'CONTOUR' : 'NATURAL'
                );
              }}
            >
              <span>{portraitLight} LIGHT</span>
            </button>
            <span className="portrait-aperture-f">f/1.4</span>
          </div>
        )}

        {/* 2. SPATIAL: Vision Pro 3D Stereoscopic Capture HUD */}
        {cameraMode === 'SPATIAL' && (
          <div className="camera-spatial-badge">
            <div className="spatial-vision-icon">
              <Eye size={13} />
            </div>
            <span>SPATIAL VIDEO · VISION PRO</span>
            <div className="spatial-stereo-brackets">
              <span className="stereo-left">[L]</span>
              <span className="stereo-right">[R]</span>
            </div>
          </div>
        )}

        {/* 3. PANORAMA: Wide Panoramic Guideline */}
        {cameraMode === 'PANORAMA' && (
          <div className="camera-pano-guideline">
            <div className="pano-arrow-track">
              <Compass size={14} className="text-amber-400" />
              <span className="pano-arrow">➔</span>
              <span className="pano-text">Move iPhone continuously</span>
            </div>
          </div>
        )}

        {/* 4. CINEMATIC: 4K 24fps Letterbox Badge & Subject Tracking */}
        {cameraMode === 'CINEMATIC' && (
          <div className="camera-cinematic-badge">
            <Film size={12} />
            <span>4K · 24 FPS · RACK FOCUS</span>
          </div>
        )}

        {/* 5. VIDEO: 4K 60fps Badge */}
        {cameraMode === 'VIDEO' && (
          <div className="camera-video-spec-badge">
            <span>4K · 60 FPS</span>
          </div>
        )}

        {/* 3x3 Composition Grid */}
        <div className="camera-rule-of-thirds-grid" />

        {/* Interactive Zoom Selector Capsule (0.5x, 1x, 2x, 5x) */}
        <div className="camera-zoom-capsule">
          {(['0.5x', '1x', '2x', '5x'] as const).map((z) => (
            <button
              key={z}
              type="button"
              className={`zoom-btn ${zoomLevel === z ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                sound.playTapSound();
                setZoomLevel(z);
              }}
            >
              {z}
            </button>
          ))}
        </div>

        {/* Right Rail: Apple Camera Control Sensor (Capacitive slide & tap) */}
        <div
          className="camera-control-sensor-strip"
          title="Camera Control: Slide up/down to adjust zoom"
          onPointerDown={handleSensorPointer}
          onPointerMove={(e) => {
            if (e.buttons === 1) handleSensorPointer(e);
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sensor-touch-surface">
            <span className="sensor-tick-mark t-5x" />
            <span className="sensor-tick-mark t-2x" />
            <span className="sensor-tick-mark t-1x" />
            <span className="sensor-tick-mark t-05x" />
          </div>
        </div>

        {/* Camera Control HUD Visual Indicator */}
        {showCameraControlHud && (
          <div className="camera-control-hud">
            <span className="hud-zoom-value">{zoomLevel}</span>
            <span className="hud-lens-spec">
              {zoomLevel === '0.5x'
                ? '13mm Ultra-Wide'
                : zoomLevel === '1x'
                ? '24mm Fusion'
                : zoomLevel === '2x'
                ? '48mm 2x Crop'
                : '120mm 5x Telephoto'}
            </span>
          </div>
        )}
      </div>

      {/* Interactive Mode Picker Strip: PHOTO, VIDEO, PORTRAIT, CINEMATIC, SPATIAL, PANORAMA */}
      <div className="camera-mode-strip" ref={modeStripRef} role="tablist">
        {CAMERA_MODES.map((mode) => (
          <button
            key={mode}
            ref={(el) => {
              modeButtonsRef.current[mode] = el;
            }}
            type="button"
            role="tab"
            aria-selected={cameraMode === mode}
            className={`camera-mode-btn ${cameraMode === mode ? 'active' : ''}`}
            onClick={() => handleModeChange(mode)}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Bottom Shutter Action Bar */}
      <footer className="camera-shutter-bar">
        {/* Latest Photo Gallery Shortcut */}
        <button
          type="button"
          className="camera-gallery-thumb-btn"
          onClick={onOpenPhotos}
          aria-label="Open Photos Library"
          title="Open Photos Gallery"
        >
          {latestPhoto ? (
            <img src={latestPhoto} alt="Latest taken photo" className="camera-thumb-img" />
          ) : (
            <div className="camera-thumb-placeholder">
              <ImageIcon size={18} />
            </div>
          )}
        </button>

        {/* Native iOS Shutter / Record Button */}
        <button
          type="button"
          className={`camera-ios-shutter-btn mode-${cameraMode.toLowerCase()} ${isRecording ? 'recording' : ''}`}
          onClick={handleShutterAction}
          aria-label={
            cameraMode === 'VIDEO' || cameraMode === 'CINEMATIC'
              ? isRecording
                ? 'Stop recording'
                : 'Start recording'
              : 'Take picture'
          }
        >
          <div className="shutter-inner-circle">
            {isRecording && <Square size={16} fill="currentColor" />}
          </div>
        </button>

        {/* Flip Lens / Selfie Camera Button with mirror handling */}
        <button
          type="button"
          className={`camera-flip-btn ${isFlipping ? 'spinning' : ''}`}
          onClick={handleFlipCamera}
          title={isFrontCamera ? 'Switch to Rear Ultra-Wide Camera' : 'Switch to Front TrueDepth Camera'}
          aria-label="Flip camera"
        >
          <RefreshCw size={20} />
        </button>
      </footer>
    </div>
  );
}
