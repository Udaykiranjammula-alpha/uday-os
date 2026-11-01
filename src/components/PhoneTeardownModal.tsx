import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  ShieldCheck,
  Eye,
  Sliders,
  ChevronRight,
} from 'lucide-react';
import { sound } from '../services/sound';

interface PhoneTeardownModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (route: string) => void;
}

interface ComponentSpec {
  id: string;
  name: string;
  headline: string;
  metric: string;
  description: string;
  color: string;
  chipLabel: string;
}

const COMPONENTS: ComponentSpec[] = [
  {
    id: 'a18pro',
    name: 'Apple A18 Pro Bionic Silicon',
    headline: '3nm Computational Engine · Uday OS Architecture',
    metric: '184+ Solved Algorithms',
    description:
      '6-core CPU paired with a 16-core Neural Engine. Powers instantaneous client-side WebGL Three.js shaders and algorithmic problem solving with zero memory leaks.',
    color: '#a855f7',
    chipLabel: ' A18 PRO',
  },
  {
    id: 'ceramic-shield',
    name: 'Ceramic Shield Glass',
    headline: 'Front Optical Display Assembly',
    metric: 'Super Retina XDR 120Hz',
    description:
      'Toughest smartphone glass with nanometer-scale ceramic crystals, dynamic 120Hz ProMotion spring animations, and native touch sampling.',
    color: '#38bdf8',
    chipLabel: 'CERAMIC SHIELD',
  },
  {
    id: 'titanium-band',
    name: 'Grade 5 Aerospace Titanium',
    headline: 'PVD Coated Chassis & Micro-Blasted Finish',
    metric: 'Ultra-Lightweight 221g',
    description:
      'Precision machined alloy bonding titanium to an aluminum substructure for optimal thermal dissipation and high mechanical rigidity.',
    color: '#f59e0b',
    chipLabel: 'TITANIUM ALLOY',
  },
  {
    id: 'thermal-vapor',
    name: 'Graphene & Copper Vapor Chamber',
    headline: 'Sustained Full-Stack Throughput',
    metric: '100% Uptime Architecture',
    description:
      'Laser-welded thermal dissipation grid ensuring zero throttling under heavy algorithmic compute and 3D WebGL rendering cycles.',
    color: '#10b981',
    chipLabel: 'THERMAL CORE',
  },
  {
    id: 'camera-lidar',
    name: '48MP Fusion Triple Camera & LiDAR',
    headline: 'Computational Photography Sensor',
    metric: 'ProRAW & 4K 24fps',
    description:
      'Quad-pixel sensor with 2nd-generation sensor-shift optical image stabilization and time-of-flight LiDAR depth mapping for Augmented Reality.',
    color: '#ec4899',
    chipLabel: 'PHOTONIC ENGINE',
  },
];

export function PhoneTeardownModal({
  isOpen,
  onClose,
  onNavigate,
}: PhoneTeardownModalProps) {
  const [explosionLevel, setExplosionLevel] = useState(70); // 0 to 100%
  const [activeComponent, setActiveComponent] = useState<ComponentSpec>(COMPONENTS[0]);

  const handleSelectComponent = (comp: ComponentSpec) => {
    sound.playActionClickSound();
    setActiveComponent(comp);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="teardown-modal-backdrop"
          className="teardown-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="teardown-content-card"
            initial={{ scale: 0.92, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="teardown-header">
              <div className="teardown-title-group">
                <span className="teardown-badge">Keynote Teardown & X-Ray</span>
                <h2>Apple A18 Pro &amp; Internal Architecture</h2>
              </div>
              <button
                type="button"
                className="teardown-close-btn"
                onClick={onClose}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* 3D Exploded Perspective Viewport */}
            <div className="teardown-viewport-container">
              <div
                className="teardown-exploded-stage"
                style={{
                  perspective: '900px',
                }}
              >
                {/* Layer 1: Front Ceramic Glass */}
                <div
                  className="teardown-layer layer-glass"
                  style={{
                    transform: `translateZ(${(explosionLevel * 1.2).toFixed(1)}px) translateY(${(-explosionLevel * 0.4).toFixed(1)}px) rotateX(25deg) rotateY(-18deg)`,
                  }}
                  onClick={() => handleSelectComponent(COMPONENTS[1])}
                >
                  <div className="layer-glass-notch" />
                  <span className="layer-tag">1. Ceramic Shield</span>
                </div>

                {/* Layer 2: Titanium Band Chassis */}
                <div
                  className="teardown-layer layer-chassis"
                  style={{
                    transform: `translateZ(${(explosionLevel * 0.7).toFixed(1)}px) translateY(${(-explosionLevel * 0.15).toFixed(1)}px) rotateX(25deg) rotateY(-18deg)`,
                  }}
                  onClick={() => handleSelectComponent(COMPONENTS[2])}
                >
                  <span className="layer-tag">2. Titanium Rim</span>
                </div>

                {/* Layer 3: Motherboard & Apple A18 Pro Core (Center) */}
                <div
                  className="teardown-layer layer-logicboard is-core"
                  style={{
                    transform: `translateZ(0px) rotateX(25deg) rotateY(-18deg)`,
                  }}
                  onClick={() => handleSelectComponent(COMPONENTS[0])}
                >
                  {/* Glowing A18 Pro Chip in Center */}
                  <div className="a18-silicon-chip">
                    <div className="a18-pulse-glow" />
                    <Cpu size={22} className="text-purple-400" />
                    <span className="chip-name">A18 Pro</span>
                    <span className="chip-tech">3nm Bionic</span>
                  </div>
                  <span className="layer-tag">3. Logic Board</span>
                </div>

                {/* Layer 4: Copper Vapor Chamber & Battery */}
                <div
                  className="teardown-layer layer-thermal"
                  style={{
                    transform: `translateZ(${(-explosionLevel * 0.6).toFixed(1)}px) translateY(${(explosionLevel * 0.2).toFixed(1)}px) rotateX(25deg) rotateY(-18deg)`,
                  }}
                  onClick={() => handleSelectComponent(COMPONENTS[3])}
                >
                  <span className="layer-tag">4. Vapor Chamber</span>
                </div>

                {/* Layer 5: MagSafe Ring & Triple Camera Sensor */}
                <div
                  className="teardown-layer layer-backglass"
                  style={{
                    transform: `translateZ(${(-explosionLevel * 1.2).toFixed(1)}px) translateY(${(explosionLevel * 0.45).toFixed(1)}px) rotateX(25deg) rotateY(-18deg)`,
                  }}
                  onClick={() => handleSelectComponent(COMPONENTS[4])}
                >
                  <div className="magsafe-wire-ring" />
                  <span className="layer-tag">5. Triple Camera &amp; MagSafe</span>
                </div>
              </div>

              {/* Explosion Slider Control */}
              <div className="teardown-slider-bar">
                <span className="slider-label">Explode View</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={explosionLevel}
                  onChange={(e) => setExplosionLevel(Number(e.target.value))}
                  className="teardown-range-input"
                />
                <span className="slider-pct">{explosionLevel}%</span>
              </div>
            </div>

            {/* Selected Component Inspection Pane */}
            <div
              className="teardown-spec-card"
              style={{ borderLeftColor: activeComponent.color }}
            >
              <div className="spec-header-row">
                <div>
                  <span
                    className="spec-chip-pill"
                    style={{
                      backgroundColor: `${activeComponent.color}22`,
                      color: activeComponent.color,
                      borderColor: activeComponent.color,
                    }}
                  >
                    {activeComponent.chipLabel}
                  </span>
                  <h3 className="spec-title">{activeComponent.name}</h3>
                </div>
                <div className="spec-metric-box">
                  <span className="spec-metric-val" style={{ color: activeComponent.color }}>
                    {activeComponent.metric}
                  </span>
                </div>
              </div>

              <p className="spec-description">{activeComponent.description}</p>

              {/* Component Selector Chips */}
              <div className="component-selector-row">
                {COMPONENTS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`comp-chip-btn ${activeComponent.id === c.id ? 'active' : ''}`}
                    onClick={() => handleSelectComponent(c)}
                    style={{
                      borderColor: activeComponent.id === c.id ? c.color : undefined,
                    }}
                  >
                    {c.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
