import React, { useState } from 'react';
import { motion, useDragControls } from 'framer-motion';
import {
  Flashlight,
  Camera,
  ChevronUp,
  Sparkles,
  Github,
  BriefcaseBusiness,
  ShieldCheck,
} from 'lucide-react';
import { profile } from '../data/profile';

interface LockScreenProps {
  time: Date;
  onUnlock: () => void;
  reducedMotion: boolean;
}

export function LockScreen({ time, onUnlock, reducedMotion }: LockScreenProps) {
  const [flashlightOn, setFlashlightOn] = useState(false);
  const dragControls = useDragControls();

  const formattedHours = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = time.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div
      className={`lock-screen ${flashlightOn ? 'flashlight-active' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ y: -600, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      drag="y"
      dragControls={dragControls}
      dragConstraints={{ top: -300, bottom: 0 }}
      dragElastic={0.4}
      onDragEnd={(_, info) => {
        if (info.offset.y < -70 || info.velocity.y < -300) {
          onUnlock();
        }
      }}
      role="region"
      aria-label="UDAY OS Lock Screen. Swipe up, click, or press Enter to unlock."
    >
      {/* Subtle screen flashlight effect */}
      {flashlightOn && <div className="screen-flashlight-beam" aria-hidden="true" />}

      <div className="lock-header">
        <div className="lock-identity">
          <ShieldCheck size={14} className="lock-shield-icon" />
          <span>UDAY OS</span>
        </div>
        <span className="owner-status">{profile.name}</span>
      </div>

      <div className="lock-clock-section">
        <h1 className="lock-time">{formattedHours}</h1>
        <p className="lock-date">{formattedDate}</p>
      </div>

      {/* Lockscreen Notifications */}
      <div className="lock-notifications">
        <div className="lock-card">
          <div className="lock-card-icon github-badge">
            <Github size={15} />
          </div>
          <div className="lock-card-content">
            <div className="lock-card-top">
              <strong>GitHub Activity</strong>
              <span>Just now</span>
            </div>
            <p>4 public repositories verified and ready to inspect.</p>
          </div>
        </div>

        <div className="lock-card">
          <div className="lock-card-icon project-badge">
            <BriefcaseBusiness size={15} />
          </div>
          <div className="lock-card-content">
            <div className="lock-card-top">
              <strong>Hospital Management</strong>
              <span>Live Demo</span>
            </div>
            <p>Deployed on Vercel · Interactive clinical triage dashboard.</p>
          </div>
        </div>
      </div>

      {/* Lockscreen Actions & Footer */}
      <div className="lock-footer">
        <div className="quick-actions">
          <button
            type="button"
            className={`quick-circle-btn ${flashlightOn ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setFlashlightOn(!flashlightOn);
            }}
            aria-label={flashlightOn ? 'Turn off screen flashlight' : 'Turn on screen flashlight'}
          >
            <Flashlight size={18} />
          </button>

          <button
            type="button"
            className="quick-circle-btn"
            onClick={(e) => {
              e.stopPropagation();
              onUnlock();
            }}
            aria-label="Quick unlock"
          >
            <Camera size={18} />
          </button>
        </div>

        <button
          type="button"
          className="unlock-cta"
          onClick={onUnlock}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onUnlock();
            }
          }}
          aria-label="Unlock UDAY OS to access apps"
        >
          <motion.div
            animate={reducedMotion ? false : { y: [-2, -6, -2] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          >
            <ChevronUp size={18} />
          </motion.div>
          <span>Swipe up or click to enter</span>
        </button>

        <div className="lock-bottom-bar" aria-hidden="true" />
      </div>
    </motion.div>
  );
}
