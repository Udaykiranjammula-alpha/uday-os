import React, { useState, useEffect } from 'react';
import {
  X,
  Moon,
  Sun,
  Calendar,
  CloudSun,
  Github,
  Clock as ClockIcon,
  Sparkles,
} from 'lucide-react';
import { sound } from '../services/sound';

interface StandByAppProps {
  onClose: () => void;
  onNavigate?: (route: string) => void;
}

export function StandByApp({ onClose, onNavigate }: StandByAppProps) {
  const [time, setTime] = useState(new Date());
  const [isNightMode, setIsNightMode] = useState(false);
  const [leftWidget, setLeftWidget] = useState<'analog' | 'digital'>('analog');
  const [rightWidget, setRightWidget] = useState<'calendar' | 'weather' | 'github'>('calendar');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const secDeg = (seconds / 60) * 360;
  const minDeg = ((minutes + seconds / 60) / 60) * 360;
  const hrDeg = (((hours % 12) + minutes / 60) / 12) * 360;

  const dateStr = time.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const toggleNightMode = () => {
    sound.playTapSound();
    setIsNightMode(!isNightMode);
  };

  return (
    <div className={`ios-standby-screen ${isNightMode ? 'night-mode-red' : ''}`}>
      {/* Top HUD Controls */}
      <div className="standby-hud-bar">
        <div className="standby-status-pill">
          <span className="standby-pulse-dot" />
          <span>iOS 18 StandBy</span>
        </div>

        <div className="standby-actions-group">
          <button
            type="button"
            className={`standby-night-btn ${isNightMode ? 'active' : ''}`}
            onClick={toggleNightMode}
            title={isNightMode ? 'Disable Red Night Mode' : 'Enable Red Night Mode'}
          >
            <Moon size={15} />
            <span>Night Mode</span>
          </button>

          <button
            type="button"
            className="standby-close-btn"
            onClick={() => {
              sound.playTapSound();
              onClose();
            }}
            aria-label="Exit StandBy"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Main Dual-Widget Split Deck */}
      <div className="standby-dual-deck">
        {/* Left Widget: Analog or Digital Clock */}
        <div
          className="standby-widget-half left"
          onClick={() => {
            sound.playTapSound();
            setLeftWidget((prev) => (prev === 'analog' ? 'digital' : 'analog'));
          }}
          title="Click to toggle clock style"
        >
          {leftWidget === 'analog' ? (
            <div className="standby-analog-clock">
              <div className="standby-dial">
                {/* 12 Hour Marks */}
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className={`standby-hour-tick ${i % 3 === 0 ? 'major' : ''}`}
                    style={{ transform: `rotate(${i * 30}deg)` }}
                  />
                ))}

                {/* Hands */}
                <div
                  className="standby-hand hour-hand"
                  style={{ transform: `rotate(${hrDeg}deg)` }}
                />
                <div
                  className="standby-hand minute-hand"
                  style={{ transform: `rotate(${minDeg}deg)` }}
                />
                <div
                  className="standby-hand second-hand"
                  style={{ transform: `rotate(${secDeg}deg)` }}
                />
                <div className="standby-hand-pivot" />
              </div>
              <span className="standby-dial-sub">CUPERTINO &middot; VJA</span>
            </div>
          ) : (
            <div className="standby-digital-clock">
              <div className="standby-digital-time">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
              </div>
              <div className="standby-digital-seconds">:{seconds < 10 ? `0${seconds}` : seconds}</div>
              <div className="standby-digital-date">{dateStr}</div>
            </div>
          )}
        </div>

        {/* Right Widget: Calendar / Weather / GitHub */}
        <div
          className="standby-widget-half right"
          onClick={() => {
            sound.playTapSound();
            setRightWidget((prev) =>
              prev === 'calendar' ? 'weather' : prev === 'weather' ? 'github' : 'calendar'
            );
          }}
          title="Click to flip widget"
        >
          {rightWidget === 'calendar' && (
            <div className="standby-calendar-widget">
              <div className="standby-cal-header">
                <Calendar size={15} />
                <span>UPCOMING SCHEDULE</span>
              </div>
              <div className="standby-cal-event featured">
                <div className="event-time">10:00 AM</div>
                <div className="event-details">
                  <strong>Technical Interview · Full-Stack</strong>
                  <small>React, TypeScript, Three.js Architecture</small>
                </div>
              </div>
              <div className="standby-cal-event">
                <div className="event-time">2:30 PM</div>
                <div className="event-details">
                  <strong>System Design Review</strong>
                  <small>High Throughput Distributed Services</small>
                </div>
              </div>
            </div>
          )}

          {rightWidget === 'weather' && (
            <div className="standby-weather-widget">
              <div className="standby-weather-header">
                <CloudSun size={15} />
                <span>VIJAYAWADA &middot; 31&deg;C</span>
              </div>
              <div className="standby-weather-temp">31&deg;</div>
              <div className="standby-weather-cond">Mostly Sunny &middot; KL University</div>
              <div className="standby-weather-highlow">H: 34&deg; &nbsp; L: 24&deg; &nbsp; UV: 8</div>
            </div>
          )}

          {rightWidget === 'github' && (
            <div className="standby-github-widget">
              <div className="standby-github-header">
                <Github size={15} />
                <span>GIT COMMIT STREAK</span>
              </div>
              <div className="standby-streak-stat">
                <strong>365 Days</strong>
                <span>Continuous Engineering</span>
              </div>
              <div className="standby-mini-heatmap">
                {[...Array(28)].map((_, i) => (
                  <span
                    key={i}
                    className="heatmap-cell"
                    style={{
                      opacity: 0.35 + (i % 5) * 0.15,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="standby-bottom-bar">
        <span>Tap widgets to cycle &middot; Click exit to return</span>
      </div>
    </div>
  );
}
