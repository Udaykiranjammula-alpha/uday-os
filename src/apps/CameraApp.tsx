import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  Zap,
  ZapOff,
  RefreshCw,
  Sliders,
  Image as ImageIcon,
  Sparkles,
  Circle,
  Square,
  Sun,
  Flame,
  Check,
} from 'lucide-react';
import { sound } from '../services/sound';

interface CameraAppProps {
  onBack: () => void;
  onOpenPhotos: () => void;
}

type CameraMode = 'CINEMATIC' | 'VIDEO' | 'PHOTO' | 'PORTRAIT' | 'PANO';
type FilterType = 'standard' | 'vivid' | 'warm' | 'cool' | 'noir' | 'dramatic';
type ZoomLevel = '0.5x' | '1x' | '2x' | '5x';

export function CameraApp({ onBack, onOpenPhotos }: CameraAppProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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
  const [latestPhoto, setLatestPhoto] = useState<string | null>(null);

  // Video Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);

  // Tap-to-focus indicator
  const [focusPoint, setFocusPoint] = useState<{ x: number; y: number } | null>(null);

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
        // Fallback for laptop webcams without facingMode
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
    vivid: 'saturate(1.45) contrast(1.1)',
    warm: 'sepia(0.28) saturate(1.25) hue-rotate(-10deg)',
    cool: 'saturate(1.1) hue-rotate(18deg) brightness(1.04)',
    noir: 'grayscale(1) contrast(1.3) brightness(0.95)',
    dramatic: 'contrast(1.4) brightness(0.92) saturate(1.2)',
  };

  // Zoom scale multiplier with 5x telephoto support
  const zoomScale =
    zoomLevel === '0.5x' ? 1 : zoomLevel === '1x' ? 1.25 : zoomLevel === '2x' ? 1.95 : 3.1;

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
    }, 2000);
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

    // Photo / Portrait / Pano mode
    sound.playShutterSound();
    if (flashMode === 'on' || (flashMode === 'auto' && Math.random() > 0.5)) {
      setFlashActive(true);
      setTimeout(() => setFlashActive(false), 260);
    }
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
        // Simulated iPhone shot
        const grad = ctx.createLinearGradient(0, 0, 720, 960);
        grad.addColorStop(0, '#0f172a');
        grad.addColorStop(0.5, '#1e1b4b');
        grad.addColorStop(1, '#090d16');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 720, 960);

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(360, 480, 80, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('UDAY OS · Shot on iPhone 17 Pro', 360, 470);
      }

      const photoData = canvas.toDataURL('image/jpeg', 0.85);
      setLatestPhoto(photoData);

      try {
        const stored = localStorage.getItem('uday-os-user-photos');
        const existing = stored ? JSON.parse(stored) : [];
        const newPhoto = {
          id: `photo-${Date.now()}`,
          dataUrl: photoData,
          mode: cameraMode,
          filter: activeFilter,
          label: customLabel,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        };
        const updated = [...existing, newPhoto];
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
    sound.playTapSound();
    setIsFrontCamera((prev) => !prev);
  };

  return (
    <div className={`camera-viewfinder-app mode-${cameraMode.toLowerCase()}`}>
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} style={{ display: 'none' }} width={720} height={960} />

      {/* Screen Flash Overlay */}
      {flashActive && <div className="camera-flash-curtain" />}

      {/* Top Controls Header */}
      <header className="camera-top-bar">
        {/* Back to Home */}
        <button
          type="button"
          className="camera-ctrl-btn"
          onClick={onBack}
          aria-label="Back to Home"
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
                  <Zap size={14} className={flashMode === 'on' ? 'text-amber' : ''} />
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
              >
                HDR
              </button>
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
          aria-label="Photographic Filters"
          title="Styles & Filters"
        >
          <Sliders size={17} />
        </button>
      </header>

      {/* Expandable Live Filters Strip */}
      {showFiltersMenu && (
        <div className="camera-filters-strip">
          {(['standard', 'vivid', 'warm', 'cool', 'noir', 'dramatic'] as FilterType[]).map((f) => (
            <button
              key={f}
              type="button"
              className={`filter-chip ${activeFilter === f ? 'active' : ''}`}
              onClick={() => {
                sound.playTapSound();
                setActiveFilter(f);
              }}
            >
              <span>{f.toUpperCase()}</span>
            </button>
          ))}
        </div>
      )}

      {/* Live Viewfinder Body with Tap-to-Focus */}
      <div
        className={`camera-viewfinder-screen ${cameraMode === 'CINEMATIC' ? 'letterbox-cinematic' : ''}`}
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
            transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), filter 0.2s ease',
          }}
        />

        {/* Viewfinder Telemetry Placeholder (visible if webcam disconnected) */}
        {!streamReady && (
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
              <span>48MP FUSION</span>
              <span>f/1.78</span>
              <span>1/120s</span>
              <span>ISO 64</span>
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

        {/* Portrait Mode: Natural Light Bokeh Hexagon */}
        {cameraMode === 'PORTRAIT' && (
          <div className="portrait-bokeh-badge">
            <div className="bokeh-hexagon">
              <Sun size={14} className="text-amber" />
            </div>
            <span>NATURAL LIGHT</span>
          </div>
        )}

        {/* Pano Mode: Panorama Tracking Guide */}
        {cameraMode === 'PANO' && (
          <div className="camera-pano-guideline">
            <div className="pano-arrow-track">
              <span className="pano-arrow">➔</span>
              <span className="pano-text">Move iPhone continuously</span>
            </div>
          </div>
        )}

        {/* Cinematic 24fps Badge */}
        {cameraMode === 'CINEMATIC' && (
          <div className="camera-cinematic-badge">
            <span>4K · 24 FPS</span>
          </div>
        )}

        {/* 3x3 Composition Grid */}
        <div className="camera-rule-of-thirds-grid" />

        {/* Interactive Zoom Selector Capsule */}
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

      {/* Interactive Mode Picker Strip (CINEMATIC | VIDEO | PHOTO | PORTRAIT | PANO) */}
      <div className="camera-mode-strip" role="tablist">
        {(['CINEMATIC', 'VIDEO', 'PHOTO', 'PORTRAIT', 'PANO'] as CameraMode[]).map((mode) => (
          <button
            key={mode}
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

        {/* Flip Lens / Selfie Camera Button */}
        <button
          type="button"
          className="camera-flip-btn"
          onClick={handleFlipCamera}
          title="Flip camera (Front / Rear)"
          aria-label="Toggle camera"
        >
          <RefreshCw size={20} />
        </button>
      </footer>
    </div>
  );
}
