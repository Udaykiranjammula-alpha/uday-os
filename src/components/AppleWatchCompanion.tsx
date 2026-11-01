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
  Sparkles,
  Satellite,
  Radio,
} from 'lucide-react';
import { sound } from '../services/sound';

export type VisionOSEnvironment = 'steve-jobs' | 'mount-hood' | 'deep-space' | 'cyberpunk';

export interface AppleWatchCompanionProps {
  isOpen: boolean;
  onClose: () => void;
  onPingPhone: () => void;
  onScrollPhone?: (delta: number) => void;
  currentEnv?: VisionOSEnvironment;
  onSelectEnv?: (env: VisionOSEnvironment) => void;
  onNavigatePhone?: (route: string) => void;
  onTriggerSOS?: () => void;
}

const ENVIRONMENTS: VisionOSEnvironment[] = [
  'steve-jobs',
  'mount-hood',
  'deep-space',
  'cyberpunk',
];

const ENV_TITLES: Record<VisionOSEnvironment, string> = {
  'steve-jobs': 'STEVE JOBS THEATER',
  'mount-hood': 'MOUNT HOOD OREGON',
  'deep-space': 'DEEP SPACE ORBIT',
  'cyberpunk': 'CYBERPUNK NEON',
};

export function AppleWatchCompanion({
  isOpen,
  onClose,
  onPingPhone,
  onScrollPhone,
  currentEnv = 'steve-jobs',
  onSelectEnv,
  onNavigatePhone,
  onTriggerSOS,
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

    // Cycle VisionOS environment when Digital Crown is spun
    if (onSelectEnv) {
      const currentIndex = ENVIRONMENTS.indexOf(currentEnv);
      const nextIndex =
        delta > 0
          ? (currentIndex + 1) % ENVIRONMENTS.length
          : (currentIndex - 1 + ENVIRONMENTS.length) % ENVIRONMENTS.length;
      onSelectEnv(ENVIRONMENTS[nextIndex]);
    }
  };

  const handlePing = () => {
    sound.playWatchPingSound();
    setIsPinging(true);
    onPingPhone();
    setTimeout(() => setIsPinging(false), 2400);
  };

  const handleCycleEnvDirect = () => {
    sound.playTapSound();
    if (onSelectEnv) {
      const currentIndex = ENVIRONMENTS.indexOf(currentEnv);
      const nextIndex = (currentIndex + 1) % ENVIRONMENTS.length;
      onSelectEnv(ENVIRONMENTS[nextIndex]);
    }
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
              <div
                className="watch-face-header clickable-env-header"
                onClick={handleCycleEnvDirect}
                title="Click to cycle VisionOS Environment"
              >
                <span className="watch-location">{ENV_TITLES[currentEnv]}</span>
                <span className="watch-elevation">3K NIT</span>
              </div>

              {/* Big Digital Clock Time */}
              <div className="watch-face-time">
                <span className="watch-time-digits">{timeStr}</span>
                <span className="watch-seconds-dot" />
              </div>

              {/* Modular Complications Grid - Fully Interactive with iPhone */}
              <div className="watch-complications-grid">
                {/* Complication 1: LeetCode Streak */}
                <button
                  type="button"
                  className="watch-complication-card interactive"
                  onClick={() => {
                    sound.playTapSound();
                    onNavigatePhone?.('leetcode');
                  }}
                  title="Open LeetCode App on iPhone"
                >
                  <Flame size={12} className="text-amber-400" />
                  <span className="comp-value">184</span>
                  <span className="comp-label">SOLVED</span>
                </button>

                {/* Complication 2: Systems Heart Rate */}
                <button
                  type="button"
                  className="watch-complication-card interactive"
                  onClick={() => {
                    sound.playTapSound();
                    onNavigatePhone?.('fitness');
                  }}
                  title="Open Activity Rings & Health on iPhone"
                >
                  <Heart size={12} className="text-rose-500 animate-pulse" />
                  <span className="comp-value">72</span>
                  <span className="comp-label">BPM</span>
                </button>

                {/* Complication 3: Compass Heading */}
                <button
                  type="button"
                  className="watch-complication-card interactive"
                  onClick={() => {
                    sound.playTapSound();
                    onNavigatePhone?.('maps');
                  }}
                  title="Open Apple Maps 3D on iPhone"
                >
                  <Compass size={12} className="text-cyan" />
                  <span className="comp-value">315°</span>
                  <span className="comp-label">NW</span>
                </button>
              </div>

              {/* Interactive Control Row */}
              <div className="watch-control-buttons-row">
                <button
                  type="button"
                  className={`watch-ping-button ${isPinging ? 'pinging' : ''}`}
                  onClick={handlePing}
                  title="Find My · Play Ping Tone on iPhone"
                >
                  <BellRing size={11} />
                  <span>{isPinging ? 'Pinging...' : 'Find My'}</span>
                </button>

                {onTriggerSOS && (
                  <button
                    type="button"
                    className="watch-sos-mini-btn"
                    onClick={() => {
                      sound.playTapSound();
                      onTriggerSOS();
                    }}
                    title="Emergency Satellite Beacon"
                  >
                    <Satellite size={11} />
                    <span>SOS</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Rotating Digital Crown on Right Rail */}
        <div className="watch-crown-housing">
          <button
            type="button"
            className="watch-digital-crown"
            style={{ transform: `rotate(${crownAngle}deg)` }}
            onClick={() => handleRotateCrown(35)}
            onWheel={(e) => {
              e.preventDefault();
              handleRotateCrown(e.deltaY > 0 ? 25 : -25);
            }}
            title="Rotate Crown to cycle VisionOS Environments"
            aria-label="Rotate Digital Crown"
          >
            <div className="crown-fluting" />
          </button>
          <div
            className="watch-side-button"
            onClick={() => handleRotateCrown(-35)}
            title="Side Button"
          />
        </div>
      </div>
    </aside>
  );
}
