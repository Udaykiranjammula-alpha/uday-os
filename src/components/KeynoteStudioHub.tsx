import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Cpu,
  Eye,
  Radio,
  Headphones,
  Satellite,
  Columns,
  Watch,
  Wand2,
  Zap,
  MapPin,
  Camera,
  CreditCard,
  Sliders,
  Rotate3d,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { sound } from '../services/sound';

interface KeynoteStudioHubProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTeardown: () => void;
  onOpenSpatial: () => void;
  onOpenNameDrop: () => void;
  onOpenAirPods: () => void;
  onOpenSatellite: () => void;
  onToggleSplitView: () => void;
  onToggleWatch: () => void;
  onOpenWritingTools: () => void;
  onOpenLiveActivities: () => void;
  onOpenMaps: () => void;
  onOpenCameraControl: () => void;
  onOpenApplePay: () => void;
  onOpenActionCarousel: () => void;
  onToggleFlip: () => void;
  isFlipped: boolean;
}

export function KeynoteStudioHub({
  isOpen,
  onClose,
  onOpenTeardown,
  onOpenSpatial,
  onOpenNameDrop,
  onOpenAirPods,
  onOpenSatellite,
  onToggleSplitView,
  onToggleWatch,
  onOpenWritingTools,
  onOpenLiveActivities,
  onOpenMaps,
  onOpenCameraControl,
  onOpenApplePay,
  onOpenActionCarousel,
  onToggleFlip,
  isFlipped,
}: KeynoteStudioHubProps) {
  if (!isOpen) return null;

  const hardwareFeatures = [
    {
      id: 'teardown',
      title: 'A18 Pro Silicon X-Ray',
      subtitle: 'Exploded 3D logic board & N16 Neural Engine',
      icon: <Cpu size={18} className="text-purple-400" />,
      color: '#a855f7',
      action: () => {
        sound.playActionClickSound();
        onClose();
        onOpenTeardown();
      },
    },
    {
      id: 'camera-control',
      title: 'Camera Control HUD',
      subtitle: 'iPhone 16 Pro capacitive zoom & 2-stage shutter',
      icon: <Camera size={18} className="text-amber-400" />,
      color: '#f59e0b',
      action: () => {
        sound.playActionClickSound();
        onClose();
        onOpenCameraControl();
      },
    },
    {
      id: 'action-button',
      title: 'Action Button Carousel',
      subtitle: 'Haptic radial wheel hardware dial',
      icon: <Sliders size={18} className="text-amber-500" />,
      color: '#f59e0b',
      action: () => {
        sound.playActionClickSound();
        onClose();
        onOpenActionCarousel();
      },
    },
    {
      id: 'flip-phone',
      title: isFlipped ? 'Flip to Front Screen' : 'Flip to 3D Titanium Back',
      subtitle: '360° Grade-5 titanium chassis inspection',
      icon: <Rotate3d size={18} className="text-cyan" />,
      color: '#0ea5e9',
      action: () => {
        sound.playTapSound();
        onClose();
        onToggleFlip();
      },
    },
  ];

  const spatialFeatures = [
    {
      id: 'spatial',
      title: 'VisionOS Spatial 3D',
      subtitle: 'Stereoscopic parallax multi-layer holograms',
      icon: <Eye size={18} className="text-cyan" />,
      color: '#06b6d4',
      action: () => {
        sound.playActionClickSound();
        onClose();
        onOpenSpatial();
      },
    },
    {
      id: 'airpods',
      title: 'AirPods Pro Spatial Audio',
      subtitle: '3D gyro head tracking & Dolby Atmos stage',
      icon: <Headphones size={18} className="text-sky-400" />,
      color: '#38bdf8',
      action: () => {
        sound.playActionClickSound();
        onClose();
        onOpenAirPods();
      },
    },
    {
      id: 'namedrop',
      title: 'Apple NameDrop & AirDrop',
      subtitle: 'Ethereal contact sharing particle wave',
      icon: <Radio size={18} className="text-emerald-400" />,
      color: '#10b981',
      action: () => {
        sound.playActionClickSound();
        onClose();
        onOpenNameDrop();
      },
    },
  ];

  const systemsFeatures = [
    {
      id: 'satellite',
      title: 'Emergency SOS via Satellite',
      subtitle: 'Starlink orbital radar tracking & emergency beacon',
      icon: <Satellite size={18} className="text-amber-400" />,
      color: '#f59e0b',
      action: () => {
        sound.playActionClickSound();
        onClose();
        onOpenSatellite();
      },
    },
    {
      id: 'splitview',
      title: 'Stage Manager Split View',
      subtitle: 'Dual app multitasking with draggable glass divider',
      icon: <Columns size={18} className="text-indigo-400" />,
      color: '#6366f1',
      action: () => {
        sound.playActionClickSound();
        onClose();
        onToggleSplitView();
      },
    },
    {
      id: 'watch',
      title: 'Apple Watch Ultra Companion',
      subtitle: 'Titanium chassis, rotating Digital Crown & Find My',
      icon: <Watch size={18} className="text-orange-400" />,
      color: '#ea580c',
      action: () => {
        sound.playActionClickSound();
        onClose();
        onToggleWatch();
      },
    },
    {
      id: 'writingtools',
      title: 'Apple Intelligence Writing Tools',
      subtitle: 'Iridescent edge glow beam & O(N) code refactor',
      icon: <Wand2 size={18} className="text-purple-400" />,
      color: '#a855f7',
      action: () => {
        sound.playActionClickSound();
        onClose();
        onOpenWritingTools();
      },
    },
    {
      id: 'liveactivities',
      title: 'Dynamic Island Live Activities',
      subtitle: 'Real-time flight, match, delivery & SpaceX tracking',
      icon: <Zap size={18} className="text-yellow-400" />,
      color: '#eab308',
      action: () => {
        sound.playActionClickSound();
        onClose();
        onOpenLiveActivities();
      },
    },
    {
      id: 'applepay',
      title: 'Apple Pay · Recruiter Express',
      subtitle: 'Titanium Apple Card & Face ID offer checkout',
      icon: <CreditCard size={18} className="text-white" />,
      color: '#ffffff',
      action: () => {
        sound.playActionClickSound();
        onClose();
        onOpenApplePay();
      },
    },
    {
      id: 'maps',
      title: 'Apple Maps 3D Flyover',
      subtitle: 'KL University & Apple Park isometric campuses',
      icon: <MapPin size={18} className="text-emerald-400" />,
      color: '#10b981',
      action: () => {
        sound.playActionClickSound();
        onClose();
        onOpenMaps();
      },
    },
  ];

  return (
    <AnimatePresence>
      <div className="studio-modal-backdrop" onClick={onClose}>
        <motion.div
          className="keynote-hub-modal"
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="keynote-hub-header">
            <div className="keynote-hub-title-box">
              <span className="keynote-badge">
                <Sparkles size={11} className="text-cyan inline mr-1" />
                 Keynote Studio Showcase
              </span>
              <h3>Explore Apple Ecosystem Hardware & Intelligence</h3>
              <p>Simulated Apple silicon, spatial computing, radar telemetry, and system diagnostics.</p>
            </div>
            <button
              type="button"
              className="keynote-hub-close-btn"
              onClick={onClose}
              aria-label="Close Keynote Studio Hub"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body Sections */}
          <div className="keynote-hub-body">
            {/* Section 1: Silicon & Hardware */}
            <div className="hub-category-group">
              <h4 className="hub-section-label">Hardware & Silicon Architecture</h4>
              <div className="hub-cards-grid">
                {hardwareFeatures.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className="hub-feature-card"
                    onClick={f.action}
                  >
                    <div className="hub-card-icon-wrap" style={{ borderColor: `${f.color}40`, background: `${f.color}15` }}>
                      {f.icon}
                    </div>
                    <div className="hub-card-text">
                      <span className="hub-card-title">{f.title}</span>
                      <small className="hub-card-sub">{f.subtitle}</small>
                    </div>
                    <ChevronRight size={14} className="hub-card-arrow" />
                  </button>
                ))}
              </div>
            </div>

            {/* Section 2: Spatial & Wireless */}
            <div className="hub-category-group">
              <h4 className="hub-section-label">VisionOS Spatial & Wireless</h4>
              <div className="hub-cards-grid">
                {spatialFeatures.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className="hub-feature-card"
                    onClick={f.action}
                  >
                    <div className="hub-card-icon-wrap" style={{ borderColor: `${f.color}40`, background: `${f.color}15` }}>
                      {f.icon}
                    </div>
                    <div className="hub-card-text">
                      <span className="hub-card-title">{f.title}</span>
                      <small className="hub-card-sub">{f.subtitle}</small>
                    </div>
                    <ChevronRight size={14} className="hub-card-arrow" />
                  </button>
                ))}
              </div>
            </div>

            {/* Section 3: Systems & Intelligence */}
            <div className="hub-category-group">
              <h4 className="hub-section-label">Keynote Systems & Intelligence</h4>
              <div className="hub-cards-grid">
                {systemsFeatures.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className="hub-feature-card"
                    onClick={f.action}
                  >
                    <div className="hub-card-icon-wrap" style={{ borderColor: `${f.color}40`, background: `${f.color}15` }}>
                      {f.icon}
                    </div>
                    <div className="hub-card-text">
                      <span className="hub-card-title">{f.title}</span>
                      <small className="hub-card-sub">{f.subtitle}</small>
                    </div>
                    <ChevronRight size={14} className="hub-card-arrow" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
