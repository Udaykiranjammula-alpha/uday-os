import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Flashlight,
  Camera,
  Mic,
  Moon,
  Calculator,
  Flame,
  Gamepad2,
  Cpu,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react';
import { sound } from '../services/sound';

export interface ActionOption {
  id: string;
  name: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  action: () => void;
}

interface ActionButtonCarouselProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleFlashlight: () => void;
  flashlightOn: boolean;
  onNavigate: (route: string) => void;
  onOpenTeardown: () => void;
}

export function ActionButtonCarousel({
  isOpen,
  onClose,
  onToggleFlashlight,
  flashlightOn,
  onNavigate,
  onOpenTeardown,
}: ActionButtonCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const actions: ActionOption[] = [
    {
      id: 'flashlight',
      name: 'Flashlight',
      subtitle: flashlightOn ? 'Turn off rear 3D torch' : 'Turn on rear 3D torch',
      icon: <Flashlight size={28} />,
      color: '#ffd60a',
      action: () => {
        onToggleFlashlight();
        onClose();
      },
    },
    {
      id: 'camera',
      name: 'Camera',
      subtitle: 'Open 48MP Fusion Camera Viewfinder',
      icon: <Camera size={28} />,
      color: '#007aff',
      action: () => {
        onNavigate('camera');
        onClose();
      },
    },
    {
      id: 'ai',
      name: 'Apple Intelligence',
      subtitle: 'Voice Assistant & Siri 2.0',
      icon: <Mic size={28} />,
      color: '#ec4899',
      action: () => {
        onNavigate('ai');
        onClose();
      },
    },
    {
      id: 'teardown',
      name: 'A18 Pro Teardown',
      subtitle: '3D X-Ray Silicon Logic Board Inspection',
      icon: <Cpu size={28} />,
      color: '#a855f7',
      action: () => {
        onClose();
        onOpenTeardown();
      },
    },
    {
      id: 'fitness',
      name: 'Activity Rings',
      subtitle: 'Review Code Velocity & Daily Streak',
      icon: <Flame size={28} />,
      color: '#ff2d55',
      action: () => {
        onNavigate('fitness');
        onClose();
      },
    },
    {
      id: 'calculator',
      name: 'Calculator',
      subtitle: 'Math & Tech Unit Converter',
      icon: <Calculator size={28} />,
      color: '#ff9f0a',
      action: () => {
        onNavigate('calculator');
        onClose();
      },
    },
    {
      id: 'arcade',
      name: 'Arcade Dev Dash',
      subtitle: 'Play 8-Bit Retro Byte Runner',
      icon: <Gamepad2 size={28} />,
      color: '#30d158',
      action: () => {
        onNavigate('arcade');
        onClose();
      },
    },
  ];

  const current = actions[selectedIndex] || actions[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playActionClickSound();
    setSelectedIndex((prev) => (prev === 0 ? actions.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playActionClickSound();
    setSelectedIndex((prev) => (prev === actions.length - 1 ? 0 : prev + 1));
  };

  const handleExecute = () => {
    sound.playTapSound();
    current.action();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="action-button-modal"
          className="action-button-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="action-button-card"
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="action-button-top-bar">
              <span className="action-hardware-label">Action Button</span>
              <button
                type="button"
                className="action-close-btn"
                onClick={onClose}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Circular Carousel Dial */}
            <div className="action-dial-container">
              <button
                type="button"
                className="action-nav-arrow left"
                onClick={handlePrev}
                aria-label="Previous action"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="action-center-disc" style={{ borderColor: current.color }}>
                <div
                  className="action-icon-large"
                  style={{ color: current.color }}
                >
                  {current.icon}
                </div>
              </div>

              <button
                type="button"
                className="action-nav-arrow right"
                onClick={handleNext}
                aria-label="Next action"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Action Details */}
            <div className="action-meta-info">
              <h2 className="action-name" style={{ color: current.color }}>
                {current.name}
              </h2>
              <p className="action-desc">{current.subtitle}</p>
            </div>

            {/* Dots Pagination */}
            <div className="action-dots-row">
              {actions.map((act, idx) => (
                <button
                  key={act.id}
                  type="button"
                  className={`action-dot ${selectedIndex === idx ? 'active' : ''}`}
                  style={{
                    backgroundColor: selectedIndex === idx ? current.color : undefined,
                  }}
                  onClick={() => {
                    sound.playActionClickSound();
                    setSelectedIndex(idx);
                  }}
                  aria-label={act.name}
                />
              ))}
            </div>

            {/* Execute / Assign Button */}
            <button
              type="button"
              className="action-trigger-btn"
              onClick={handleExecute}
              style={{
                background: `linear-gradient(135deg, ${current.color} 0%, #000000 140%)`,
              }}
            >
              <span>Trigger {current.name}</span>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
