import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, Flame, Battery, GraduationCap, Flashlight, Camera, MessageSquare, ChevronUp } from 'lucide-react';
import { useClock } from '../hooks/useClock';
import { sound } from '../services/sound';

interface LockScreenProps {
  onUnlock: (targetRoute?: string) => void;
  flashlightOn?: boolean;
  onToggleFlashlight?: () => void;
  color?: 'plum' | 'desert';
  time?: Date;
  reducedMotion?: boolean;
}

export function LockScreen({
  onUnlock,
  flashlightOn = false,
  onToggleFlashlight,
  color = 'plum',
  time: propTime,
}: LockScreenProps) {
  const clockTime = useClock();
  const time = propTime || clockTime;
  const [isUnlockedState, setIsUnlockedState] = useState(false);
  const [isAOD, setIsAOD] = useState(false);

  // Auto AOD dim after 18s idle
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAOD(true);
    }, 18000);

    const resetTimer = () => {
      setIsAOD(false);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('touchstart', resetTimer);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
    };
  }, []);

  const handleUnlockSequence = (targetRoute = 'home') => {
    if (isAOD) {
      setIsAOD(false);
      return;
    }
    sound.playUnlockSound();
    setIsUnlockedState(true);
    setTimeout(() => {
      onUnlock(targetRoute);
    }, 280);
  };

  const formattedHours = time.getHours().toString().padStart(2, '0');
  const formattedMinutes = time.getMinutes().toString().padStart(2, '0');
  const formattedDate = time.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div
      className={`ios-lockscreen-root ${isAOD ? 'lockscreen-aod' : ''} wallpaper-${color}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -60 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => {
        if (isAOD) setIsAOD(false);
      }}
    >
      {/* Top Face ID Lock Indicator */}
      <header className="lockscreen-faceid-bar">
        <div className={`faceid-padlock-wrap ${isUnlockedState ? 'unlocked' : ''}`}>
          {isUnlockedState ? (
            <Unlock size={17} className="text-cyan animate-pulse" />
          ) : (
            <Lock size={17} />
          )}
        </div>
      </header>

      {/* Date & Large Depth Clock */}
      <div className="lockscreen-clock-container">
        <span className="lockscreen-date-label">{formattedDate}</span>
        <h1 className="lockscreen-giant-clock">
          <span>{formattedHours}</span>
          <span className="clock-colon">:</span>
          <span>{formattedMinutes}</span>
        </h1>
      </div>

      {/* Lock Screen iOS 18 Widgets Row */}
      <div className="lockscreen-widgets-strip">
        {/* LeetCode Streak Widget */}
        <div className="ls-widget-pill" title="LeetCode 128 Day Streak">
          <Flame size={14} className="text-amber" />
          <span>128 Days</span>
        </div>

        {/* Battery Widget */}
        <div className="ls-widget-pill" title="Battery 98% Optimized">
          <Battery size={14} className="text-emerald" />
          <span>98%</span>
        </div>

        {/* KL University Widget */}
        <div className="ls-widget-pill" title="KL University CSE Schedule">
          <GraduationCap size={14} className="text-blue" />
          <span>CSE Lab</span>
        </div>
      </div>

      {/* Notification Preview: Tech Recruiter Message */}
      {!isAOD && (
        <motion.div
          className="lockscreen-notification-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={(e) => {
            e.stopPropagation();
            handleUnlockSequence('messages');
          }}
          role="button"
          tabIndex={0}
          aria-label="New Message notification from Recruiter"
        >
          <div className="ls-notif-header">
            <div className="ls-notif-app-info">
              <div className="ls-notif-app-icon">
                <MessageSquare size={12} />
              </div>
              <strong>MESSAGES</strong>
            </div>
            <span className="ls-notif-time">2m ago</span>
          </div>
          <div className="ls-notif-body">
            <h4>Tech Recruiter · Silicon Valley & Bangalore</h4>
            <p>Hi Uday, reviewed your KL University projects & GitHub. Would love to connect for an SWE opportunity!</p>
          </div>
        </motion.div>
      )}

      {/* Bottom Action Shortcuts: Torch & Camera */}
      <footer className="lockscreen-bottom-bar">
        {/* Flashlight Button */}
        <button
          type="button"
          className={`ls-quick-btn ${flashlightOn ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            sound.playTapSound();
            onToggleFlashlight?.();
          }}
          aria-label="Toggle Flashlight"
        >
          <Flashlight size={19} />
        </button>

        {/* Unlock Swipe/Tap Hint */}
        <div
          className="ls-unlock-swipe-hint"
          onClick={(e) => {
            e.stopPropagation();
            handleUnlockSequence('home');
          }}
          role="button"
          tabIndex={0}
        >
          <ChevronUp size={16} className="swipe-bounce-icon" />
          <span>Swipe up or tap to unlock</span>
          <div className="ls-home-swipe-line" />
        </div>

        {/* Camera Shortcut Button */}
        <button
          type="button"
          className="ls-quick-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleUnlockSequence('camera');
          }}
          aria-label="Launch Camera"
        >
          <Camera size={19} />
        </button>
      </footer>
    </motion.div>
  );
}
