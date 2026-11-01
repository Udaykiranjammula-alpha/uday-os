import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  X,
  Check,
  Copy,
  Wand2,
  FileText,
  Code2,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { sound } from '../services/sound';

interface WritingToolsHUDProps {
  isOpen: boolean;
  onClose: () => void;
}

type ToolMode = 'proofread' | 'architecture' | 'algorithmic';

export function WritingToolsHUD({ isOpen, onClose }: WritingToolsHUDProps) {
  const [activeMode, setActiveMode] = useState<ToolMode>('proofread');
  const [isScanning, setIsScanning] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSelectMode = (mode: ToolMode) => {
    sound.playTapSound();
    setActiveMode(mode);
    setIsScanning(true);
    setTimeout(() => {
      sound.playApplePayChime();
      setIsScanning(false);
    }, 500);
  };

  const handleCopyResult = (text: string) => {
    sound.playTapSound();
    if (navigator.clipboard) {
      void navigator.clipboard.writeText(text);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="writing-tools-overlay"
          className="writing-tools-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="writing-tools-card"
            initial={{ scale: 0.94, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.94, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Apple Intelligence Glowing Ribbon Border */}
            <div className="writing-tools-halo" />

            {/* Header */}
            <header className="writing-tools-header">
              <div className="tools-title-group">
                <Sparkles size={18} className="text-ai-rainbow animate-pulse" />
                <div>
                  <h3 className="tools-title">Apple Intelligence &middot; Writing Tools</h3>
                  <p className="tools-subtitle">Language, Architecture &amp; Algorithmic Refactor</p>
                </div>
              </div>

              <button
                type="button"
                className="tools-close-btn"
                onClick={onClose}
                aria-label="Close Writing Tools"
              >
                <X size={15} />
              </button>
            </header>

            {/* Tool Mode Chips */}
            <div className="tools-mode-tabs">
              <button
                type="button"
                className={`mode-tab ${activeMode === 'proofread' ? 'active' : ''}`}
                onClick={() => handleSelectMode('proofread')}
              >
                <FileText size={13} />
                <span>Executive Polish</span>
              </button>

              <button
                type="button"
                className={`mode-tab ${activeMode === 'architecture' ? 'active' : ''}`}
                onClick={() => handleSelectMode('architecture')}
              >
                <Wand2 size={13} />
                <span>Explain Architecture</span>
              </button>

              <button
                type="button"
                className={`mode-tab ${activeMode === 'algorithmic' ? 'active' : ''}`}
                onClick={() => handleSelectMode('algorithmic')}
              >
                <Code2 size={13} />
                <span>O(N) Code Refactor</span>
              </button>
            </div>

            {/* Main Interactive Stage with Scanning Ribbon */}
            <div className={`tools-stage-box ${isScanning ? 'scanning' : ''}`}>
              {isScanning && <div className="scanning-beam-ribbon" />}

              {activeMode === 'proofread' && (
                <div className="mode-result-body">
                  <div className="text-before-box">
                    <span className="diff-label before">Original Draft:</span>
                    <p className="draft-text">
                      "hey uday, we have a job opening in our backend team, u free to chat?"
                    </p>
                  </div>

                  <div className="text-arrow-divider">
                    <ArrowRight size={14} className="text-cyan" />
                    <span>Apple Intelligence Executive Polish</span>
                  </div>

                  <div className="text-after-box">
                    <span className="diff-label after">Refined Output:</span>
                    <p className="polished-text">
                      "Dear Uday, our engineering team was exceptionally impressed by your verified systems architecture, real-time WebGL engine, and 184+ LeetCode algorithmic solutions. We would be delighted to schedule an executive technical discussion regarding our Core Software Engineer role."
                    </p>
                  </div>
                </div>
              )}

              {activeMode === 'architecture' && (
                <div className="mode-result-body">
                  <div className="arch-breakdown-card">
                    <h4>UDAY OS &middot; Full-Stack Microkernel Architecture</h4>
                    <ul className="arch-bullets">
                      <li>
                        <strong>Presentation Layer:</strong> React 18 Concurrent Mode, Three.js WebGL shaders, 120Hz ProMotion spring animations.
                      </li>
                      <li>
                        <strong>Audio DSP Engine:</strong> Web Audio API, Biquad low-pass filter (ANC), StereoPannerNode 3D head-tracking.
                      </li>
                      <li>
                        <strong>Storage &amp; Edge Fallback:</strong> Multi-tiered quota-safe caching with instant zero-exception fallbacks.
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {activeMode === 'algorithmic' && (
                <div className="mode-result-body">
                  <div className="code-diff-wrapper">
                    <div className="code-side before">
                      <span className="diff-tag old">Naive: O(N²) Time</span>
                      <pre>
{`// Two sum nested loops
for (let i = 0; i < nums.length; i++) {
  for (let j = i + 1; j < nums.length; j++) {
    if (nums[i] + nums[j] === target) return [i, j];
  }
}`}
                      </pre>
                    </div>

                    <div className="code-side after">
                      <span className="diff-tag optimal">Optimal: O(N) Time · O(N) Space</span>
                      <pre>
{`// Hash Map single-pass
const map = new Map<number, number>();
for (let i = 0; i < nums.length; i++) {
  const complement = target - nums[i];
  if (map.has(complement)) return [map.get(complement)!, i];
  map.set(nums[i], i);
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <footer className="writing-tools-footer">
              <button
                type="button"
                className="copy-polished-btn"
                onClick={() =>
                  handleCopyResult(
                    activeMode === 'proofread'
                      ? 'Dear Uday, our engineering team was exceptionally impressed by your verified systems architecture...'
                      : activeMode === 'architecture'
                      ? 'UDAY OS Architecture: React 18, Three.js, Web Audio DSP, Multi-tier cache...'
                      : 'Optimal Two-Sum: O(N) single-pass with Map.'
                  )
                }
              >
                {copied ? <Check size={14} className="text-green" /> : <Copy size={14} />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy Output'}</span>
              </button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
