import React, { useState, useEffect } from 'react';
import {
  Watch,
  Heart,
  Flame,
  Compass,
  BellRing,
  RotateCw,
  X,
  Volume2,
} from 'lucide-react';
import { sound } from '../services/sound';

interface AppleWatchCompanionProps {
  isOpen: boolean;
  onClose: () => void;
  onPingPhone: () => void;
  onScrollPhone?: (delta: number) => void;
}

export function AppleWatchCompanion({
  isOpen,
  onClose,
  onPingPhone,
  onScrollPhone,
}: AppleWatchCompanionProps) {
  const [crownAngle, setCrownAngle] = useState(0);
  const [timeStr, setTimeStr] = useState('10:09');
  const [isPinging, setIsPinging] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const h = d.getHours().toString().padStart(2, '0');
      const m = d.getMinutes().toString().padStart(2, '0');
      setTimeStr(`${h}:${m}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRotateCrown = (delta: number) => {
    setCrownAngle((prev) => prev + delta);
    sound.playTapSound();
    if (onScrollPhone) onScrollPhone(delta * 4);
  };

  const handlePing = () => {
    sound.playWatchPingSound();
    setIsPinging(true);
    onPingPhone();
    setTimeout(() => setIsPinging(false), 2400);
  };

  if (!isOpen) return null;

  return (
    <aside
      className="apple-watch-companion-frame"
      aria-label="Apple Watch Ultra 2 Titanium Companion"
    >
      <div className="watch-outer-shell">
        {/* Top Dismiss Button */}
        <button
          type="button"
          className="watch-close-btn"
          onClick={onClose}
          aria-label="Close Apple Watch companion"
          title="Hide Apple Watch"
        >
          <X size={12} />
        </button>

        {/* Orange International Action Button on Left Rail */}
        <button
          type="button"
          className={`watch-action-button ${isPinging ? 'active' : ''}`}
          onClick={handlePing}
          title="Action Button · Ping iPhone"
          aria-label="Ping iPhone"
        >
          <BellRing size={13} />
        </button>

        {/* Titanium Chassis Case */}
        <div className="watch-chassis-titanium">
          {/* Bezel Protection Rim */}
          <div className="watch-bezel-rim">
            {/* Sapphire OLED Screen */}
            <div className="watch-screen">
              {/* Modular Ultra Face Header */}
              <div className="watch-face-header">
                <span className="watch-location">VIJAYAWADA</span>
                <span className="watch-elevation">22M</span>
              </div>

              {/* Big Digital Clock Time */}
              <div className="watch-face-time">
                <span className="watch-time-digits">{timeStr}</span>
                <span className="watch-seconds-dot" />
              </div>

              {/* Modular Complications Grid */}
              <div className="watch-complications-grid">
                {/* Complication 1: LeetCode Streak */}
                <div className="watch-complication-card">
                  <Flame size={12} className="text-amber-400" />
                  <span className="comp-value">184</span>
                  <span className="comp-label">SOLVED</span>
                </div>

                {/* Complication 2: Systems Heart Rate */}
                <div className="watch-complication-card">
                  <Heart size={12} className="text-rose-500 animate-pulse" />
                  <span className="comp-value">72</span>
                  <span className="comp-label">BPM</span>
                </div>

                {/* Complication 3: Compass Compass Heading */}
                <div className="watch-complication-card">
                  <Compass size={12} className="text-cyan" />
                  <span className="comp-value">315°</span>
                  <span className="comp-label">NW</span>
                </div>
              </div>

              {/* Find My Ping Phone Button */}
              <button
                type="button"
                className={`watch-ping-button ${isPinging ? 'pinging' : ''}`}
                onClick={handlePing}
              >
                <BellRing size={12} />
                <span>{isPinging ? 'Pinging iPhone...' : 'Find My · Ping iPhone'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Rotating Digital Crown on Right Rail */}
        <div className="watch-crown-housing">
          <button
            type="button"
            className="watch-digital-crown"
            style={{ transform: `rotate(${crownAngle}deg)` }}
            onClick={() => handleRotateCrown(25)}
            onWheel={(e) => {
              e.preventDefault();
              handleRotateCrown(e.deltaY > 0 ? 15 : -15);
            }}
            title="Click or scroll Digital Crown"
            aria-label="Rotate Digital Crown"
          >
            <div className="crown-fluting" />
          </button>
          <div className="watch-side-button" onClick={() => handleRotateCrown(-25)} />
        </div>
      </div>
    </aside>
  );
}
