import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface BootScreenProps {
  onComplete: () => void;
  reducedMotion: boolean;
}

export function BootScreen({ onComplete, reducedMotion }: BootScreenProps) {
  useEffect(() => {
    const delay = reducedMotion ? 200 : 1600;
    const timer = setTimeout(onComplete, delay);
    return () => clearTimeout(timer);
  }, [onComplete, reducedMotion]);

  return (
    <motion.div
      className="boot-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onComplete}
      role="region"
      aria-label="UDAY OS Initializing Screen"
    >
      <div className="boot-glow" aria-hidden="true" />
      <motion.div
        className="boot-monogram-box"
        initial={reducedMotion ? false : { scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="boot-monogram">
          UK<span>.</span>
        </div>
      </motion.div>

      <div className="boot-tagline-container">
        <p className="boot-title">UDAY OS</p>
        <p className="boot-subtitle">One device. My entire world.</p>
      </div>

      <div className="boot-progress-track" aria-hidden="true">
        <motion.div
          className="boot-progress-bar"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            duration: reducedMotion ? 0.2 : 1.4,
            repeat: reducedMotion ? 0 : Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="boot-actions">
        <button
          type="button"
          className="boot-skip-btn"
          onClick={(e) => {
            e.stopPropagation();
            onComplete();
          }}
          aria-label="Skip boot sequence"
        >
          <Sparkles size={12} /> Skip animation
        </button>
      </div>
    </motion.div>
  );
}
