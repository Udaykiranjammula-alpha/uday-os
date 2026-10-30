import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Sparkles } from 'lucide-react';

interface AppleIntelligenceGlowProps {
  isActive: boolean;
  statusText?: string;
  isListening?: boolean;
  onDismiss?: () => void;
}

export function AppleIntelligenceGlow({
  isActive,
  statusText = 'Apple Intelligence listening...',
  isListening = false,
  onDismiss,
}: AppleIntelligenceGlowProps) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          key="apple-intelligence-glow-overlay"
          className="apple-intelligence-glow-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          onClick={onDismiss}
        >
          {/* Outer Breathing Iridescent Bezel Ribbon */}
          <div className="ai-edge-ribbon outer-bloom" />
          <div className="ai-edge-ribbon inner-core" />
          <div className="ai-corner-flare top-left" />
          <div className="ai-corner-flare top-right" />
          <div className="ai-corner-flare bottom-left" />
          <div className="ai-corner-flare bottom-right" />

          {/* Floating Apple Intelligence HUD Status Pill */}
          <motion.div
            className="ai-hud-floating-capsule"
            initial={{ y: 20, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 15, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ai-hud-glow-icon">
              <Sparkles size={14} className="text-cyan animate-pulse" />
            </div>

            <div className="ai-hud-info">
              <span className="ai-hud-title">Apple Intelligence</span>
              <span className="ai-hud-status">{statusText}</span>
            </div>

            {isListening && (
              <div className="ai-hud-wave">
                <span className="ai-wave-bar w1" />
                <span className="ai-wave-bar w2" />
                <span className="ai-wave-bar w3" />
                <span className="ai-wave-bar w4" />
                <span className="ai-wave-bar w5" />
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
