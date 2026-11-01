import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plane,
  Trophy,
  Coffee,
  Rocket,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { sound } from '../services/sound';

interface LiveActivitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (route: string) => void;
}

export function LiveActivitiesModal({
  isOpen,
  onClose,
  onNavigate,
}: LiveActivitiesModalProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'flight' | 'sports' | 'delivery' | 'launch'>('all');
  const [flightProgress, setFlightProgress] = useState(72);
  const [tMinus, setTMinus] = useState(248); // seconds

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setFlightProgress((p) => (p >= 100 ? 0 : p + 1));
      setTMinus((t) => (t <= 0 ? 300 : t - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const formatTMinus = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `T-00:${m}:${s}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="live-activities-overlay"
          className="live-act-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="live-act-island-card"
            initial={{ scale: 0.92, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <header className="live-act-header">
              <div className="act-header-left">
                <span className="live-dot-pulse" />
                <h3 className="act-header-title">Dynamic Island &middot; Live Activities</h3>
              </div>
              <button
                type="button"
                className="act-close-btn"
                onClick={onClose}
                aria-label="Close Live Activities"
              >
                <X size={15} />
              </button>
            </header>

            {/* Activities List */}
            <div className="live-act-cards-list">
              {/* 1. United Flight Tracker */}
              {(activeTab === 'all' || activeTab === 'flight') && (
                <div
                  className="live-activity-card flight"
                  onClick={() => sound.playTapSound()}
                >
                  <div className="card-top-row">
                    <div className="flight-airline">
                      <Plane size={15} className="text-cyan" />
                      <span>United UA-842 &middot; SFO &rarr; HYD</span>
                    </div>
                    <span className="badge-live-green">On Schedule</span>
                  </div>

                  <div className="flight-route-track">
                    <span className="airport-code">SFO</span>
                    <div className="route-bar">
                      <div className="route-progress" style={{ width: `${flightProgress}%` }} />
                      <div className="plane-marker" style={{ left: `${flightProgress}%` }}>
                        <Plane size={12} className="rotate-90 text-cyan" />
                      </div>
                    </div>
                    <span className="airport-code">HYD</span>
                  </div>

                  <div className="flight-telemetry-row">
                    <span>Altitude: 38,000 ft</span>
                    <span>Speed: 540 kts (Mach 0.84)</span>
                    <span className="text-cyan">ETA: 1h 42m</span>
                  </div>
                </div>
              )}

              {/* 2. Apple Sports Live Match */}
              {(activeTab === 'all' || activeTab === 'sports') && (
                <div
                  className="live-activity-card sports"
                  onClick={() => sound.playTapSound()}
                >
                  <div className="card-top-row">
                    <div className="sports-league">
                      <Trophy size={14} className="text-amber-400" />
                      <span>Premier League &middot; Final Round</span>
                    </div>
                    <span className="badge-live-red">LIVE 88'</span>
                  </div>

                  <div className="match-scoreboard-row">
                    <div className="team-col">
                      <span className="team-logo"></span>
                      <span className="team-name">UDAY OS</span>
                    </div>
                    <div className="match-score">
                      <span className="score-num highlight">4</span>
                      <span className="score-divider">&ndash;</span>
                      <span className="score-num">0</span>
                    </div>
                    <div className="team-col">
                      <span className="team-logo">👾</span>
                      <span className="team-name">SYNTAX BUGS</span>
                    </div>
                  </div>

                  <div className="sports-stats-footer">
                    <span>Possession: 74%</span>
                    <span>184 Algorithms Solved</span>
                    <span className="text-green">Zero Memory Leaks</span>
                  </div>
                </div>
              )}

              {/* 3. DoorDash Cold-Brew Courier */}
              {(activeTab === 'all' || activeTab === 'delivery') && (
                <div
                  className="live-activity-card delivery"
                  onClick={() => sound.playTapSound()}
                >
                  <div className="card-top-row">
                    <div className="delivery-store">
                      <Coffee size={14} className="text-emerald-400" />
                      <span>DoorDash &middot; Developer Fuel Delivery</span>
                    </div>
                    <span className="text-emerald-400 text-xs font-semibold">Arriving in 3m</span>
                  </div>

                  <div className="delivery-status-row">
                    <p className="order-items">1x Triple Nitro Cold Brew &middot; 1x Macadamia Cookie</p>
                    <p className="courier-note">Courier Alex is 2 blocks away on electric bike</p>
                  </div>

                  <div className="delivery-track-bar">
                    <div className="delivery-fill" style={{ width: '85%' }} />
                  </div>
                </div>
              )}

              {/* 4. SpaceX Falcon Rocket Launch Countdown */}
              {(activeTab === 'all' || activeTab === 'launch') && (
                <div
                  className="live-activity-card launch"
                  onClick={() => sound.playApplePayChime()}
                >
                  <div className="card-top-row">
                    <div className="launch-mission">
                      <Rocket size={14} className="text-purple-400" />
                      <span>SpaceX Falcon &middot; Starlink Constellation</span>
                    </div>
                    <span className="text-purple-400 text-xs font-mono font-bold">
                      {formatTMinus(tMinus)}
                    </span>
                  </div>

                  <div className="launch-telemetry-row">
                    <span>Propellant: 98% Cryo LOX</span>
                    <span>Max-Q: 1,420 km/h</span>
                    <span className="text-purple-300">Stage 1 GO</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
