import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  Globe,
  Timer as StopwatchIcon,
  Bell,
  Play,
  Pause,
  RotateCcw,
  Flag,
  Hourglass,
} from 'lucide-react';
import { sound } from '../services/sound';
import { liveActivity } from '../services/liveActivity';

interface ClockAppProps {
  onBack: () => void;
  onNavigate?: (route: string) => void;
}

interface WorldCity {
  city: string;
  country: string;
  timeZone: string;
  offsetHours: number;
}

const CITIES: WorldCity[] = [
  { city: 'Vijayawada', country: 'India (Uday / KL University)', timeZone: 'Asia/Kolkata', offsetHours: 5.5 },
  { city: 'Cupertino', country: 'United States (Apple Park)', timeZone: 'America/Los_Angeles', offsetHours: -7 },
  { city: 'London', country: 'United Kingdom (Westminster)', timeZone: 'Europe/London', offsetHours: 1 },
  { city: 'Tokyo', country: 'Japan (Shibuya)', timeZone: 'Asia/Tokyo', offsetHours: 9 },
];

const TIMER_PRESETS = [
  { label: '1m', seconds: 60 },
  { label: '5m', seconds: 300 },
  { label: '15m', seconds: 900 },
  { label: '30m', seconds: 1800 },
];

export function ClockApp({ onBack }: ClockAppProps) {
  const initialClock = liveActivity.getClock();
  const [activeTab, setActiveTab] = useState<'world' | 'stopwatch' | 'timer'>('world');
  const [now, setNow] = useState(new Date());

  // ================= Stopwatch State =================
  const [stopwatchRunning, setStopwatchRunning] = useState(
    initialClock.type === 'stopwatch' && initialClock.isActive && !initialClock.isPaused
  );
  const [stopwatchTime, setStopwatchTime] = useState(
    initialClock.type === 'stopwatch' ? initialClock.remainingMs : 0
  );
  const [laps, setLaps] = useState<number[]>(initialClock.laps || []);

  // ================= Timer State =================
  const [timerDuration, setTimerDuration] = useState(
    initialClock.totalDurationSeconds || 300
  );
  const [timerRemaining, setTimerRemaining] = useState(
    initialClock.type === 'timer' && initialClock.isActive
      ? initialClock.remainingSeconds
      : initialClock.totalDurationSeconds || 300
  );
  const [timerRunning, setTimerRunning] = useState(
    initialClock.type === 'timer' && initialClock.isActive && !initialClock.isPaused
  );
  const [timerCompleted, setTimerCompleted] = useState(false);

  // Live Clock Ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync with liveActivity coordinator
  useEffect(() => {
    const unsubscribe = liveActivity.subscribe((state) => {
      if (state.clock.type === 'timer') {
        if (state.clock.isActive) {
          setTimerRemaining(state.clock.remainingSeconds);
          setTimerDuration(state.clock.totalDurationSeconds || 300);
          setTimerRunning(!state.clock.isPaused);
          setTimerCompleted(false);
        } else {
          setTimerRunning(false);
        }
      } else if (state.clock.type === 'stopwatch') {
        if (state.clock.isActive) {
          setStopwatchTime(state.clock.remainingMs);
          setStopwatchRunning(!state.clock.isPaused);
          setLaps(state.clock.laps || []);
        } else {
          setStopwatchRunning(false);
          setStopwatchTime(0);
          setLaps([]);
        }
      }
    });
    return unsubscribe;
  }, []);

  const handleStartStopStopwatch = () => {
    sound.playTapSound();
    liveActivity.toggleStopwatchRunning();
  };

  const handleLapResetStopwatch = () => {
    sound.playTapSound();
    if (stopwatchRunning) {
      liveActivity.recordLap();
    } else {
      liveActivity.resetStopwatch();
    }
  };

  const formatStopwatchTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return {
      main: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
      sub: centiseconds.toString().padStart(2, '0'),
    };
  };

  // ================= Timer Logic =================
  const handleSelectPreset = (seconds: number) => {
    sound.playTapSound();
    setTimerDuration(seconds);
    setTimerRemaining(seconds);
    setTimerCompleted(false);
    liveActivity.startTimer(seconds);
  };

  const handleStartPauseTimer = () => {
    sound.playTapSound();
    if (timerCompleted || (!timerRunning && timerRemaining <= 0)) {
      setTimerCompleted(false);
      liveActivity.startTimer(timerDuration);
    } else if (!timerRunning && timerRemaining === timerDuration) {
      liveActivity.startTimer(timerDuration);
    } else {
      liveActivity.toggleTimerRunning();
    }
  };

  const handleResetTimer = () => {
    sound.playTapSound();
    liveActivity.resetTimer();
    setTimerRunning(false);
    setTimerCompleted(false);
    setTimerRemaining(timerDuration);
  };

  const formatTimerDigits = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Helper for timezone times
  const getCityTime = (timeZone: string) => {
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      const parts = formatter.formatToParts(now);
      const hour = parts.find((p) => p.type === 'hour')?.value || '12';
      const minute = parts.find((p) => p.type === 'minute')?.value || '00';
      const second = parts.find((p) => p.type === 'second')?.value || '00';
      const dayPeriod = parts.find((p) => p.type === 'dayPeriod')?.value || 'AM';
      return { hour, minute, second, dayPeriod, timeStr: `${hour}:${minute}` };
    } catch {
      return { hour: '12', minute: '00', second: '00', dayPeriod: 'AM', timeStr: '12:00' };
    }
  };

  const { main: swMain, sub: swSub } = formatStopwatchTime(stopwatchTime);

  // Calculate fastest and slowest laps
  let fastestLapIdx = -1;
  let slowestLapIdx = -1;
  if (laps.length >= 2) {
    const splits = laps.map((lap, i) => lap - (laps[i + 1] || 0));
    let minSplit = Infinity;
    let maxSplit = -Infinity;
    splits.forEach((split, idx) => {
      if (split < minSplit) {
        minSplit = split;
        fastestLapIdx = idx;
      }
      if (split > maxSplit) {
        maxSplit = split;
        slowestLapIdx = idx;
      }
    });
  }

  // Timer SVG ring computation
  const ringRadius = 92;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const progressRatio = timerDuration > 0 ? timerRemaining / timerDuration : 0;
  const strokeDashoffset = ringCircumference * (1 - progressRatio);

  return (
    <div className="ios-clock-page">
      {/* Clock Top Header */}
      <header className="clock-header">
        <button
          type="button"
          className="calc-nav-btn"
          onClick={() => {
            sound.playTapSound();
            onBack();
          }}
          aria-label="Back to Home Screen"
        >
          <ChevronLeft size={18} />
          <span>Home</span>
        </button>

        <h1 className="clock-page-title">
          {activeTab === 'world'
            ? 'World Clock'
            : activeTab === 'stopwatch'
            ? 'Stopwatch'
            : 'Timer'}
        </h1>

        <div style={{ width: 44 }} />
      </header>

      {/* Main Content Body */}
      <div className="clock-body-content">
        {activeTab === 'world' && (
          <div className="world-clock-list">
            {CITIES.map((city) => {
              const { hour, minute, second, dayPeriod, timeStr } = getCityTime(city.timeZone);
              const numH = parseInt(hour, 10);
              const numM = parseInt(minute, 10);
              const numS = parseInt(second, 10);

              const hourDeg = (numH % 12) * 30 + numM * 0.5 + numS * (0.5 / 60);
              const minDeg = numM * 6 + numS * 0.1;
              const secDeg = numS * 6;

              return (
                <div key={city.city} className="world-clock-card">
                  <div className="city-info-group">
                    <span className="city-diff-label">
                      {city.country} · {city.offsetHours >= 0 ? `+${city.offsetHours}` : city.offsetHours}HRS
                    </span>
                    <strong className="city-name-text">{city.city}</strong>
                  </div>

                  <div className="city-clock-right">
                    {/* Analog Clock Face */}
                    <div className="mini-analog-clock">
                      <div
                        className="clock-hand hour"
                        style={{ transform: `rotate(${hourDeg}deg)` }}
                      />
                      <div
                        className="clock-hand minute"
                        style={{ transform: `rotate(${minDeg}deg)` }}
                      />
                      <div
                        className="clock-hand second"
                        style={{ transform: `rotate(${secDeg}deg)` }}
                      />
                      <div className="clock-center-dot" />
                    </div>

                    {/* Digital Readout */}
                    <div className="city-digital-time">
                      <span className="time-numbers">{timeStr}</span>
                      <small className="time-period">{dayPeriod}</small>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'stopwatch' && (
          <div className="stopwatch-container">
            {/* Big Stopwatch Display */}
            <div className="stopwatch-display-hero">
              <span className="sw-main-digits">{swMain}</span>
              <span className="sw-sub-digits">.{swSub}</span>
            </div>

            {/* Action Buttons */}
            <div className="stopwatch-buttons-row">
              <button
                type="button"
                className="sw-circle-btn reset"
                onClick={handleLapResetStopwatch}
                disabled={stopwatchTime === 0 && !stopwatchRunning}
                style={{ opacity: stopwatchTime === 0 && !stopwatchRunning ? 0.45 : 1 }}
              >
                {stopwatchRunning ? 'Lap' : 'Reset'}
              </button>

              <button
                type="button"
                className={`sw-circle-btn start-stop ${stopwatchRunning ? 'stop' : 'start'}`}
                onClick={handleStartStopStopwatch}
              >
                {stopwatchRunning ? 'Stop' : 'Start'}
              </button>
            </div>

            {/* Laps List */}
            <div className="stopwatch-laps-table">
              {laps.map((lapMs, idx) => {
                const lapNum = laps.length - idx;
                const prevLap = laps[idx + 1] || 0;
                const delta = lapMs - prevLap;
                const { main: lMain, sub: lSub } = formatStopwatchTime(delta);
                const { main: totalMain, sub: totalSub } = formatStopwatchTime(lapMs);

                const isFastest = idx === fastestLapIdx;
                const isSlowest = idx === slowestLapIdx;

                return (
                  <div
                    key={lapMs}
                    className={`stopwatch-lap-row ${isFastest ? 'fastest' : ''} ${
                      isSlowest ? 'slowest' : ''
                    }`}
                  >
                    <span className="lap-label">Lap {lapNum}</span>
                    <span className="lap-split">
                      {lMain}.{lSub}
                    </span>
                    <span className="lap-total">
                      {totalMain}.{totalSub}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'timer' && (
          <div className="timer-container">
            {/* Completion Banner */}
            {timerCompleted && (
              <div className="timer-alert-banner">
                🔔 Timer Done! Alert chime ringing.
              </div>
            )}

            {/* SVG Progress Ring */}
            <div className="timer-ring-wrapper">
              <svg className="timer-svg" width="220" height="220" viewBox="0 0 220 220">
                <circle
                  className="timer-circle-bg"
                  cx="110"
                  cy="110"
                  r={ringRadius}
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  className="timer-circle-fg"
                  cx="110"
                  cy="110"
                  r={ringRadius}
                  strokeWidth="8"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>

              <div className="timer-center-content">
                <div className="timer-digits-hero">
                  {formatTimerDigits(timerRemaining)}
                </div>
                <div className="timer-label-sub">
                  {timerCompleted ? 'COMPLETED' : timerRunning ? 'REMAINING' : 'READY'}
                </div>
              </div>
            </div>

            {/* Preset Intervals: 1m, 5m, 15m, 30m */}
            <div className="timer-presets-strip">
              {TIMER_PRESETS.map((p) => (
                <button
                  key={p.seconds}
                  type="button"
                  className={`timer-preset-chip ${timerDuration === p.seconds ? 'active' : ''}`}
                  onClick={() => handleSelectPreset(p.seconds)}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Timer Buttons Row */}
            <div className="stopwatch-buttons-row">
              <button
                type="button"
                className="sw-circle-btn reset"
                onClick={handleResetTimer}
                disabled={timerRemaining === timerDuration && !timerRunning && !timerCompleted}
                style={{
                  opacity:
                    timerRemaining === timerDuration && !timerRunning && !timerCompleted ? 0.45 : 1,
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                className={`sw-circle-btn start-stop ${timerRunning ? 'stop' : 'start'}`}
                onClick={handleStartPauseTimer}
              >
                {timerRunning ? 'Pause' : timerRemaining < timerDuration && !timerCompleted ? 'Resume' : 'Start'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Tabs matching iOS Clock */}
      <nav className="clock-bottom-nav">
        <button
          type="button"
          className={`clock-tab-btn ${activeTab === 'world' ? 'active' : ''}`}
          onClick={() => {
            sound.playTapSound();
            setActiveTab('world');
          }}
        >
          <Globe size={22} />
          <span>World Clock</span>
        </button>

        <button
          type="button"
          className={`clock-tab-btn ${activeTab === 'stopwatch' ? 'active' : ''}`}
          onClick={() => {
            sound.playTapSound();
            setActiveTab('stopwatch');
          }}
        >
          <StopwatchIcon size={22} />
          <span>Stopwatch</span>
        </button>

        <button
          type="button"
          className={`clock-tab-btn ${activeTab === 'timer' ? 'active' : ''}`}
          onClick={() => {
            sound.playTapSound();
            setActiveTab('timer');
          }}
        >
          <Hourglass size={22} />
          <span>Timer</span>
        </button>
      </nav>
    </div>
  );
}