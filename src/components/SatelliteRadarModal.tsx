import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Radio,
  Satellite,
  Compass,
  CheckCircle2,
  Send,
  AlertTriangle,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import { sound } from '../services/sound';
import { profile } from '../data/profile';

interface SatelliteRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (route: string) => void;
}

export function SatelliteRadarModal({
  isOpen,
  onClose,
  onNavigate,
}: SatelliteRadarModalProps) {
  const [deviceAngle, setDeviceAngle] = useState(0); // -90 to +90 deg
  const [satelliteAngle, setSatelliteAngle] = useState(15);
  const [isLocked, setIsLocked] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmitted, setTransmitted] = useState(false);
  const [txProgress, setTxProgress] = useState(0);
  const lastLockRef = useRef(false);

  // Satellite orbit orbital simulation
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSatelliteAngle((prev) => {
        const next = prev + 0.35;
        return next > 75 ? -75 : next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Track cursor position for alignment
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isOpen) return;
      const center = window.innerWidth / 2;
      const diff = (e.clientX - center) / (window.innerWidth / 2);
      const angle = Math.round(diff * 60);
      setDeviceAngle(angle);

      // Check lock
      const delta = Math.abs(angle - satelliteAngle);
      const locked = delta < 12;
      setIsLocked(locked);

      if (locked && !lastLockRef.current) {
        sound.playSatelliteBeaconSound();
      }
      lastLockRef.current = locked;
    };

    if (isOpen) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isOpen, satelliteAngle]);

  const handleTransmit = () => {
    sound.playSatelliteBeaconSound();
    setIsTransmitting(true);
    setTxProgress(0);

    const timer = setInterval(() => {
      setTxProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          sound.playApplePayChime();
          setIsTransmitting(false);
          setTransmitted(true);
          return 100;
        }
        return p + 10;
      });
    }, 120);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="satellite-radar-modal"
          className="satellite-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="satellite-card"
            initial={{ scale: 0.92, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Navigation */}
            <header className="satellite-header">
              <div className="satellite-title-box">
                <Satellite size={20} className={isLocked ? 'text-green' : 'text-amber-400'} />
                <div>
                  <h3 className="satellite-title">Emergency SOS via Satellite</h3>
                  <p className="satellite-status">
                    {isLocked ? 'Connected to Orbital LEO-429' : 'Turn phone to align with satellite'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="satellite-close-btn"
                onClick={onClose}
                aria-label="Close Satellite SOS"
              >
                <X size={16} />
              </button>
            </header>

            {/* Radar Circular Stage */}
            <div className={`satellite-radar-stage ${isLocked ? 'locked' : ''}`}>
              {/* Polar Grid Rings */}
              <div className="radar-grid-ring ring-3" />
              <div className="radar-grid-ring ring-2" />
              <div className="radar-grid-ring ring-1" />
              <div className="radar-cross-h" />
              <div className="radar-cross-v" />

              {/* Orbital Satellite Node */}
              <div
                className="radar-satellite-node"
                style={{
                  transform: `rotate(${satelliteAngle}deg) translateY(-85px) rotate(-${satelliteAngle}deg)`,
                }}
              >
                <div className="satellite-glyph-box">
                  <Satellite size={14} />
                </div>
                <span className="sat-label">LEO-429</span>
              </div>

              {/* User Directional Beam */}
              <div
                className={`radar-user-beam ${isLocked ? 'locked' : ''}`}
                style={{ transform: `rotate(${deviceAngle}deg)` }}
              >
                <div className="beam-cone" />
                <div className="beam-needle" />
              </div>

              {/* Center User Dot */}
              <div className="radar-center-dot">
                <div className="user-icon-pulse" />
              </div>

              {/* Lock-on Badge */}
              <div className={`radar-lock-badge ${isLocked ? 'visible' : ''}`}>
                <CheckCircle2 size={14} />
                <span>SATELLITE LOCKED</span>
              </div>
            </div>

            {/* Orbital Telemetry Card */}
            <div className="satellite-telemetry-grid">
              <div className="telem-item">
                <span className="telem-label">Orbit Altitude</span>
                <span className="telem-val">548 km</span>
              </div>
              <div className="telem-item">
                <span className="telem-label">Signal Uplink</span>
                <span className={`telem-val ${isLocked ? 'text-green' : 'text-amber'}`}>
                  {isLocked ? '-82 dBm' : '-104 dBm'}
                </span>
              </div>
              <div className="telem-item">
                <span className="telem-label">Orbital Velocity</span>
                <span className="telem-val">7.6 km/s</span>
              </div>
              <div className="telem-item">
                <span className="telem-label">Protocol</span>
                <span className="telem-val">S-Band 2.4 kbps</span>
              </div>
            </div>

            {/* Emergency Recruiter Action */}
            <div className="satellite-action-box">
              {transmitted ? (
                <div className="satellite-success-card">
                  <CheckCircle2 size={24} className="text-green" />
                  <div>
                    <h4>Priority Satellite Packet Transmitted!</h4>
                    <p>
                      Emergency candidate dispatch routed to <strong>{profile.email}</strong>. Transmission Hash: <code>TX-SAT-0x9F42A</code>.
                    </p>
                  </div>
                </div>
              ) : isTransmitting ? (
                <div className="satellite-transmitting-card">
                  <div className="tx-header">
                    <span>Uplinking Packet via Satellite...</span>
                    <span>{txProgress}%</span>
                  </div>
                  <div className="tx-track">
                    <div className="tx-fill" style={{ width: `${txProgress}%` }} />
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className={`satellite-transmit-btn ${isLocked ? 'ready' : 'disabled'}`}
                  disabled={!isLocked}
                  onClick={handleTransmit}
                >
                  <Send size={15} />
                  <span>
                    {isLocked
                      ? 'Beam Emergency Recruiter Offer via Satellite'
                      : 'Align with Satellite to Beam Transmission'}
                  </span>
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
