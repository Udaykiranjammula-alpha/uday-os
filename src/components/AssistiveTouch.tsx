import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Calculator,
  CloudSun,
  Gamepad2,
  Sparkles,
  Settings,
  Zap,
  Layers,
  EyeOff,
} from 'lucide-react';
import { sound } from '../services/sound';

export interface AssistiveTouchProps {
  onNavigate: (route: string) => void;
  onOpenAppSwitcher: () => void;
  currentRoute?: string;
  isEnabled?: boolean;
  onToggleEnabled?: (enabled: boolean) => void;
}

// Authentic Apple concentric rings icon for AssistiveTouch
export function ConcentricRingsIcon({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="assistive-touch-icon-svg"
      aria-hidden="true"
    >
      {/* Outer Ring */}
      <circle
        cx="18"
        cy="18"
        r="14.5"
        stroke="rgba(255, 255, 255, 0.42)"
        strokeWidth="2.3"
      />
      {/* Middle Ring */}
      <circle
        cx="18"
        cy="18"
        r="9.5"
        stroke="rgba(255, 255, 255, 0.82)"
        strokeWidth="2.3"
      />
      {/* Inner Solid Core */}
      <circle
        cx="18"
        cy="18"
        r="4.8"
        fill="#ffffff"
      />
    </svg>
  );
}

export function AssistiveTouch({
  onNavigate,
  onOpenAppSwitcher,
  isEnabled = true,
  onToggleEnabled,
}: AssistiveTouchProps) {
  // Screen bounds: 372px width, 806px height
  // Button size: 54px x 54px
  // Snapped X positions: Left = 10px, Right = 372 - 54 - 10 = 308px
  // Clamped Y bounds: Top = 68px, Bottom = 806 - 54 - 40 = 712px
  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    try {
      const saved = localStorage.getItem('ios_assistive_touch_pos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed?.x === 'number' && typeof parsed?.y === 'number') {
          return {
            x: parsed.x < 159 ? 10 : 308,
            y: Math.max(68, Math.min(712, parsed.y)),
          };
        }
      }
    } catch {}
    return { x: 308, y: 460 };
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isIdle, setIsIdle] = useState(false);

  const buttonRef = useRef<HTMLDivElement>(null);
  const startPointerRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);
  const isDraggingRef = useRef(false);

  // iOS Idle Dimming: gently dims to ~45% opacity after 3.2s of inactivity
  useEffect(() => {
    if (isOpen || isDragging) {
      setIsIdle(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsIdle(true);
    }, 3200);

    return () => clearTimeout(timer);
  }, [isOpen, isDragging, position]);

  // Pointer Down: begin tracking drag or click
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsDragging(true);
    isDraggingRef.current = true;
    setIsIdle(false);
    hasMovedRef.current = false;
    startPointerRef.current = { x: e.clientX, y: e.clientY };
    startPosRef.current = { ...position };

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  // Pointer Move: smooth dragging with container scaling compensation
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    e.stopPropagation();

    const screenEl = buttonRef.current?.closest('.iphone-screen');
    const rect = screenEl?.getBoundingClientRect();
    const scale = rect ? rect.width / 372 : 1;

    const dx = (e.clientX - startPointerRef.current.x) / (scale || 1);
    const dy = (e.clientY - startPointerRef.current.y) / (scale || 1);

    if (Math.hypot(dx, dy) > 4) {
      hasMovedRef.current = true;
    }

    const nextX = Math.max(6, Math.min(372 - 54 - 6, startPosRef.current.x + dx));
    const nextY = Math.max(68, Math.min(712, startPosRef.current.y + dy));
    setPosition({ x: nextX, y: nextY });
  };

  // Pointer Up: edge snap or tap to open
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    e.stopPropagation();
    isDraggingRef.current = false;
    setIsDragging(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    if (hasMovedRef.current) {
      // Draggable edge snap to closest screen boundary (left or right)
      const midX = (372 - 54) / 2; // 159
      const snappedX = position.x < midX ? 10 : 308;
      const snappedY = Math.max(68, Math.min(712, position.y));

      setPosition({ x: snappedX, y: snappedY });
      try {
        localStorage.setItem(
          'ios_assistive_touch_pos',
          JSON.stringify({ x: snappedX, y: snappedY })
        );
      } catch {}

      sound.playTapSound();
    } else {
      // Tap detected: open AssistiveTouch menu
      setIsOpen(true);
      sound.playTapSound();
    }
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    const midX = (372 - 54) / 2;
    const snappedX = position.x < midX ? 10 : 308;
    const snappedY = Math.max(68, Math.min(712, position.y));
    setPosition({ x: snappedX, y: snappedY });
  };

  // Action execution: play haptic sound and execute
  const handleAction = useCallback(
    (actionId: string) => {
      sound.playActionClickSound();
      setIsOpen(false);

      if (actionId === 'switcher') {
        onOpenAppSwitcher();
      } else {
        onNavigate(actionId);
      }
    },
    [onNavigate, onOpenAppSwitcher]
  );

  // Collapse / Close menu
  const handleClose = useCallback(() => {
    sound.playTapSound();
    setIsOpen(false);
  }, []);

  // Hide AssistiveTouch toggle
  const handleHide = useCallback(() => {
    sound.playTapSound();
    setIsOpen(false);
    onToggleEnabled?.(false);
  }, [onToggleEnabled]);

  if (!isEnabled) return null;

  return (
    <>
      {/* 1. Floating Translucent AssistiveTouch Button */}
      <motion.div
        ref={buttonRef}
        className={`assistive-touch-float ${isIdle ? 'is-idle' : ''} ${isDragging ? 'is-dragging' : ''}`}
        style={{
          display: isOpen ? 'none' : 'flex',
        }}
        animate={{
          x: position.x,
          y: position.y,
          scale: isDragging ? 1.08 : 1,
          opacity: isIdle ? 0.45 : 1,
        }}
        transition={
          isDragging
            ? { duration: 0 }
            : { type: 'spring', stiffness: 420, damping: 28 }
        }
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onMouseEnter={() => setIsIdle(false)}
        onClick={(e) => {
          e.stopPropagation();
          if (!hasMovedRef.current) {
            setIsOpen(true);
            sound.playTapSound();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="iOS AssistiveTouch Menu · Drag to reposition, tap to expand"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(true);
            sound.playTapSound();
          }
        }}
      >
        <ConcentricRingsIcon size={34} />
      </motion.div>

      {/* 2. Authentic Frosted Glass Radial / Grid Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="assistive-backdrop"
            className="assistive-touch-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
          >
            <motion.div
              className="assistive-touch-menu"
              initial={{ opacity: 0, scale: 0.72 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.75 }}
              transition={{ type: 'spring', stiffness: 420, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Title and Hide Toggle */}
              <div className="assistive-menu-header">
                <span className="assistive-header-title">AssistiveTouch</span>
                <button
                  type="button"
                  className="assistive-header-action"
                  onClick={handleHide}
                  title="Hide AssistiveTouch (Can be re-enabled in Settings > Accessibility)"
                >
                  <EyeOff size={11} />
                  <span>Hide</span>
                </button>
              </div>

              {/* 3x3 Authentic Apple Radial / Grid Layout */}
              <div className="assistive-actions-grid">
                {/* 1. Benchmark */}
                <button
                  type="button"
                  className="assistive-action-btn"
                  onClick={() => handleAction('benchmark')}
                  title="Benchmark & Core Metrics"
                >
                  <div className="assistive-action-icon-wrap">
                    <Zap size={22} className="assistive-glyph text-amber" />
                  </div>
                  <span className="assistive-action-label">Benchmark</span>
                </button>

                {/* 2. Calculator */}
                <button
                  type="button"
                  className="assistive-action-btn"
                  onClick={() => handleAction('calculator')}
                  title="Calculator"
                >
                  <div className="assistive-action-icon-wrap">
                    <Calculator size={22} className="assistive-glyph text-orange" />
                  </div>
                  <span className="assistive-action-label">Calculator</span>
                </button>

                {/* 3. Weather */}
                <button
                  type="button"
                  className="assistive-action-btn"
                  onClick={() => handleAction('weather')}
                  title="Weather Forecast"
                >
                  <div className="assistive-action-icon-wrap">
                    <CloudSun size={22} className="assistive-glyph text-sky" />
                  </div>
                  <span className="assistive-action-label">Weather</span>
                </button>

                {/* 4. Settings */}
                <button
                  type="button"
                  className="assistive-action-btn"
                  onClick={() => handleAction('settings')}
                  title="Settings & Accessibility"
                >
                  <div className="assistive-action-icon-wrap">
                    <Settings size={22} className="assistive-glyph text-silver" />
                  </div>
                  <span className="assistive-action-label">Settings</span>
                </button>

                {/* 5. Center: Apple Concentric Rings / Close */}
                <button
                  type="button"
                  className="assistive-action-btn assistive-center-btn"
                  onClick={handleClose}
                  title="Collapse AssistiveTouch"
                >
                  <div className="assistive-action-icon-wrap center-wrap">
                    <ConcentricRingsIcon size={26} />
                  </div>
                  <span className="assistive-action-label center-label">Close</span>
                </button>

                {/* 6. Arcade */}
                <button
                  type="button"
                  className="assistive-action-btn"
                  onClick={() => handleAction('arcade')}
                  title="Apple Arcade Games"
                >
                  <div className="assistive-action-icon-wrap">
                    <Gamepad2 size={22} className="assistive-glyph text-rose" />
                  </div>
                  <span className="assistive-action-label">Arcade</span>
                </button>

                {/* 7. App Switcher */}
                <button
                  type="button"
                  className="assistive-action-btn"
                  onClick={() => handleAction('switcher')}
                  title="Multitasking App Switcher"
                >
                  <div className="assistive-action-icon-wrap">
                    <Layers size={22} className="assistive-glyph text-purple" />
                  </div>
                  <span className="assistive-action-label">Switcher</span>
                </button>

                {/* 8. Home */}
                <button
                  type="button"
                  className="assistive-action-btn"
                  onClick={() => handleAction('home')}
                  title="Go to Home Screen"
                >
                  <div className="assistive-action-icon-wrap">
                    <Home size={22} className="assistive-glyph text-green" />
                  </div>
                  <span className="assistive-action-label">Home</span>
                </button>

                {/* 9. Uday AI / Siri */}
                <button
                  type="button"
                  className="assistive-action-btn"
                  onClick={() => handleAction('ai')}
                  title="Uday AI / Siri Assistant"
                >
                  <div className="assistive-action-icon-wrap ai-glow-wrap">
                    <Sparkles size={22} className="assistive-glyph assistive-ai-glow" />
                  </div>
                  <span className="assistive-action-label">Uday AI</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
