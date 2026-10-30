import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  Globe,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Flag,
} from 'lucide-react';

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
  { city: 'Vijayawada', country: 'India (Uday)', timeZone: 'Asia/Kolkata', offsetHours: 5.5 },
  { city: 'Cupertino', country: 'Apple HQ (PST)', timeZone: 'America/Los_Angeles', offsetHours: -7 },
  { city: 'London', country: 'United Kingdom (GMT)', timeZone: 'Europe/London', offsetHours: 1 },
  { city: 'New York', country: 'United States (EST)', timeZone: 'America/New_York', offsetHours: -4 },
];

export function ClockApp({ onBack }: ClockAppProps) {
  const [activeTab, setActiveTab] = useState<'world' | 'stopwatch'>('world');
  const [now, setNow] = useState(new Date());

  // Stopwatch State
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [stopwatchTime, setStopwatchTime] = useState(0); // in milliseconds
  const [laps, setLaps] = useState<number[]>([]);
  const stopwatchIntervalRef = useRef<number | null>(null);

  // Live Clock Ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Stopwatch Interval
  useEffect(() => {
    if (stopwatchRunning) {
      const startTime = Date.now() - stopwatchTime;
      stopwatchIntervalRef.current = window.setInterval(() => {
        setStopwatchTime(Date.now() - startTime);
      }, 30);
    } else if (stopwatchIntervalRef.current) {
      clearInterval(stopwatchIntervalRef.current);
    }
    return () => {
      if (stopwatchIntervalRef.current) clearInterval(stopwatchIntervalRef.current);
    };
  }, [stopwatchRunning]);

  const handleStartStop = () => {
    setStopwatchRunning(!stopwatchRunning);
  };

  const handleLapReset = () => {
    if (stopwatchRunning) {
      // Record Lap
      setLaps((prev) => [stopwatchTime, ...prev]);
    } else {
      // Reset
      setStopwatchTime(0);
      setLaps([]);
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

  return (
    <div className="ios-clock-page">
      {/* Clock Top Header */}
      <header className="clock-header">
        <button
          type="button"
          className="mail-nav-back-pill"
          onClick={onBack}
          aria-label="Back to Home"
        >
          <ChevronLeft size={18} />
          <span>Home</span>
        </button>

        <h1 className="clock-page-title">
          {activeTab === 'world' ? 'World Clock' : 'Stopwatch'}
        </h1>

        <div style={{ width: 44 }} />
      </header>

      {/* Main Content Area */}
      <div className="clock-body-content">
        {activeTab === 'world' ? (
          <div className="world-clock-list">
            {CITIES.map((city) => {
              const { hour, minute, second, dayPeriod, timeStr } = getCityTime(city.timeZone);
              const numH = parseInt(hour, 10);
              const numM = parseInt(minute, 10);
              const numS = parseInt(second, 10);

              const hourDeg = (numH % 12) * 30 + numM * 0.5;
              const minDeg = numM * 6;
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

                    {/* Digital readout */}
                    <div className="city-digital-time">
                      <span className="time-numbers">{timeStr}</span>
                      <small className="time-period">{dayPeriod}</small>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
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
                onClick={handleLapReset}
                disabled={stopwatchTime === 0}
              >
                {stopwatchRunning ? 'Lap' : 'Reset'}
              </button>

              <button
                type="button"
                className={`sw-circle-btn start-stop ${stopwatchRunning ? 'stop' : 'start'}`}
                onClick={handleStartStop}
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

                return (
                  <div key={lapMs} className="stopwatch-lap-row">
                    <span className="lap-label">Lap {lapNum}</span>
                    <span className="lap-split">{lMain}.{lSub}</span>
                    <span className="lap-total">{totalMain}.{totalSub}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Tabs matching iOS Clock */}
      <nav className="clock-bottom-nav">
        <button
          type="button"
          className={`clock-tab-btn ${activeTab === 'world' ? 'active' : ''}`}
          onClick={() => setActiveTab('world')}
        >
          <Globe size={22} />
          <span>World Clock</span>
        </button>

        <button
          type="button"
          className={`clock-tab-btn ${activeTab === 'stopwatch' ? 'active' : ''}`}
          onClick={() => setActiveTab('stopwatch')}
        >
          <Timer size={22} />
          <span>Stopwatch</span>
        </button>
      </nav>
    </div>
  );
}
