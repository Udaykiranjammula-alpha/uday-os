import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  Sun,
  CloudRain,
  Cloud,
  Wind,
  Droplets,
  Eye,
  Thermometer,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { sound } from '../services/sound';

interface HourlyForecast {
  time: string;
  temp: number;
  icon: string;
}

interface DailyForecast {
  day: string;
  icon: string;
  min: number;
  max: number;
}

interface WeatherCity {
  city: string;
  country: string;
  subtitle: string;
  condition: string;
  weatherType: 'sunny' | 'rain' | 'cloudy';
  temp: number;
  high: number;
  low: number;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  uvIndex: string;
  humidity: number;
  windSpeed: string;
  visibility: string;
  dewPoint: string;
  airQuality: string;
}

const CITIES: WeatherCity[] = [
  {
    city: 'Vijayawada',
    country: 'India',
    subtitle: 'KL University Campus',
    condition: 'Sunny & Warm',
    weatherType: 'sunny',
    temp: 32,
    high: 35,
    low: 24,
    hourly: [
      { time: 'Now', temp: 32, icon: '☀️' },
      { time: '12 PM', temp: 33, icon: '☀️' },
      { time: '1 PM', temp: 34, icon: '☀️' },
      { time: '2 PM', temp: 35, icon: '☀️' },
      { time: '3 PM', temp: 34, icon: '⛅' },
      { time: '4 PM', temp: 33, icon: '🌤️' },
      { time: '5 PM', temp: 31, icon: '🌤️' },
      { time: '6 PM', temp: 29, icon: '🌙' },
      { time: '7 PM', temp: 28, icon: '🌙' },
      { time: '8 PM', temp: 27, icon: '🌙' },
    ],
    daily: [
      { day: 'Today', icon: '☀️', min: 24, max: 35 },
      { day: 'Mon', icon: '☀️', min: 25, max: 36 },
      { day: 'Tue', icon: '⛅', min: 25, max: 34 },
      { day: 'Wed', icon: '🌤️', min: 24, max: 33 },
      { day: 'Thu', icon: '☀️', min: 24, max: 34 },
      { day: 'Fri', icon: '☀️', min: 25, max: 35 },
      { day: 'Sat', icon: '⛅', min: 24, max: 34 },
      { day: 'Sun', icon: '🌤️', min: 23, max: 33 },
      { day: 'Mon', icon: '☀️', min: 24, max: 35 },
      { day: 'Tue', icon: '☀️', min: 25, max: 36 },
    ],
    uvIndex: '9 (Very High)',
    humidity: 62,
    windSpeed: '14 km/h ENE',
    visibility: '10 km',
    dewPoint: '22°C',
    airQuality: '48 (Good)',
  },
  {
    city: 'Cupertino',
    country: 'United States',
    subtitle: 'Apple Park HQ',
    condition: 'Clear Sky',
    weatherType: 'sunny',
    temp: 20,
    high: 23,
    low: 11,
    hourly: [
      { time: 'Now', temp: 20, icon: '☀️' },
      { time: '11 AM', temp: 21, icon: '☀️' },
      { time: '12 PM', temp: 22, icon: '☀️' },
      { time: '1 PM', temp: 23, icon: '☀️' },
      { time: '2 PM', temp: 23, icon: '☀️' },
      { time: '3 PM', temp: 22, icon: '🌤️' },
      { time: '4 PM', temp: 21, icon: '🌤️' },
      { time: '5 PM', temp: 19, icon: '☀️' },
      { time: '6 PM', temp: 17, icon: '🌙' },
      { time: '7 PM', temp: 15, icon: '🌙' },
    ],
    daily: [
      { day: 'Today', icon: '☀️', min: 11, max: 23 },
      { day: 'Mon', icon: '☀️', min: 12, max: 24 },
      { day: 'Tue', icon: '🌤️', min: 11, max: 22 },
      { day: 'Wed', icon: '☀️', min: 10, max: 21 },
      { day: 'Thu', icon: '⛅', min: 12, max: 22 },
      { day: 'Fri', icon: '☀️', min: 11, max: 23 },
      { day: 'Sat', icon: '☀️', min: 13, max: 25 },
      { day: 'Sun', icon: '🌤️', min: 12, max: 24 },
      { day: 'Mon', icon: '☀️', min: 11, max: 23 },
      { day: 'Tue', icon: '☀️', min: 12, max: 24 },
    ],
    uvIndex: '5 (Moderate)',
    humidity: 44,
    windSpeed: '9 km/h WNW',
    visibility: '16 km',
    dewPoint: '8°C',
    airQuality: '28 (Excellent)',
  },
  {
    city: 'London',
    country: 'United Kingdom',
    subtitle: 'Westminster & Thames',
    condition: 'Light Rain Showers',
    weatherType: 'rain',
    temp: 14,
    high: 16,
    low: 9,
    hourly: [
      { time: 'Now', temp: 14, icon: '🌧️' },
      { time: '1 PM', temp: 15, icon: '🌧️' },
      { time: '2 PM', temp: 15, icon: '🌧️' },
      { time: '3 PM', temp: 16, icon: '🌦️' },
      { time: '4 PM', temp: 15, icon: '🌧️' },
      { time: '5 PM', temp: 14, icon: '🌧️' },
      { time: '6 PM', temp: 13, icon: '☁️' },
      { time: '7 PM', temp: 12, icon: '☁️' },
      { time: '8 PM', temp: 11, icon: '🌙' },
      { time: '9 PM', temp: 10, icon: '🌙' },
    ],
    daily: [
      { day: 'Today', icon: '🌧️', min: 9, max: 16 },
      { day: 'Mon', icon: '🌧️', min: 8, max: 15 },
      { day: 'Tue', icon: '🌦️', min: 9, max: 16 },
      { day: 'Wed', icon: '☁️', min: 10, max: 17 },
      { day: 'Thu', icon: '🌧️', min: 8, max: 14 },
      { day: 'Fri', icon: '🌦️', min: 7, max: 13 },
      { day: 'Sat', icon: '⛅', min: 8, max: 15 },
      { day: 'Sun', icon: '☁️', min: 9, max: 16 },
      { day: 'Mon', icon: '🌧️', min: 8, max: 15 },
      { day: 'Tue', icon: '🌧️', min: 9, max: 15 },
    ],
    uvIndex: '2 (Low)',
    humidity: 84,
    windSpeed: '22 km/h SW',
    visibility: '7 km',
    dewPoint: '11°C',
    airQuality: '35 (Good)',
  },
  {
    city: 'Tokyo',
    country: 'Japan',
    subtitle: 'Shibuya & Minato',
    condition: 'Overcast & Breezy',
    weatherType: 'cloudy',
    temp: 17,
    high: 20,
    low: 13,
    hourly: [
      { time: 'Now', temp: 17, icon: '☁️' },
      { time: '6 PM', temp: 17, icon: '☁️' },
      { time: '7 PM', temp: 16, icon: '☁️' },
      { time: '8 PM', temp: 15, icon: '⛅' },
      { time: '9 PM', temp: 15, icon: '🌙' },
      { time: '10 PM', temp: 14, icon: '🌙' },
      { time: '11 PM', temp: 14, icon: '🌙' },
      { time: '12 AM', temp: 13, icon: '🌙' },
      { time: '1 AM', temp: 13, icon: '🌙' },
      { time: '2 AM', temp: 12, icon: '🌙' },
    ],
    daily: [
      { day: 'Today', icon: '☁️', min: 13, max: 20 },
      { day: 'Mon', icon: '⛅', min: 14, max: 21 },
      { day: 'Tue', icon: '🌤️', min: 13, max: 22 },
      { day: 'Wed', icon: '☀️', min: 15, max: 23 },
      { day: 'Thu', icon: '⛅', min: 14, max: 20 },
      { day: 'Fri', icon: '🌧️', min: 12, max: 18 },
      { day: 'Sat', icon: '🌦️', min: 13, max: 19 },
      { day: 'Sun', icon: '☁️', min: 14, max: 21 },
      { day: 'Mon', icon: '☀️', min: 15, max: 22 },
      { day: 'Tue', icon: '☀️', min: 14, max: 23 },
    ],
    uvIndex: '3 (Low)',
    humidity: 58,
    windSpeed: '15 km/h NNE',
    visibility: '12 km',
    dewPoint: '9°C',
    airQuality: '24 (Excellent)',
  },
  {
    city: 'San Francisco',
    country: 'United States',
    subtitle: 'Silicon Valley & Bay',
    condition: 'Partly Cloudy & Fog',
    weatherType: 'cloudy',
    temp: 16,
    high: 18,
    low: 11,
    hourly: [
      { time: 'Now', temp: 16, icon: '⛅' },
      { time: '11 AM', temp: 17, icon: '⛅' },
      { time: '12 PM', temp: 18, icon: '🌤️' },
      { time: '1 PM', temp: 18, icon: '🌤️' },
      { time: '2 PM', temp: 18, icon: '⛅' },
      { time: '3 PM', temp: 17, icon: '⛅' },
      { time: '4 PM', temp: 16, icon: '🌫️' },
      { time: '5 PM', temp: 15, icon: '🌫️' },
      { time: '6 PM', temp: 14, icon: '🌙' },
      { time: '7 PM', temp: 13, icon: '🌙' },
    ],
    daily: [
      { day: 'Today', icon: '⛅', min: 11, max: 18 },
      { day: 'Mon', icon: '🌤️', min: 12, max: 19 },
      { day: 'Tue', icon: '⛅', min: 11, max: 18 },
      { day: 'Wed', icon: '🌫️', min: 10, max: 17 },
      { day: 'Thu', icon: '🌤️', min: 12, max: 19 },
      { day: 'Fri', icon: '☀️', min: 12, max: 20 },
      { day: 'Sat', icon: '🌤️', min: 13, max: 21 },
      { day: 'Sun', icon: '⛅', min: 12, max: 18 },
      { day: 'Mon', icon: '🌫️', min: 11, max: 17 },
      { day: 'Tue', icon: '🌤️', min: 12, max: 19 },
    ],
    uvIndex: '4 (Moderate)',
    humidity: 72,
    windSpeed: '19 km/h W',
    visibility: '14 km',
    dewPoint: '10°C',
    airQuality: '32 (Good)',
  },
];

interface WeatherAppProps {
  onBack: () => void;
  onNavigate?: (route: string) => void;
}

export function WeatherApp({ onBack }: WeatherAppProps) {
  const [cityIndex, setCityIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const city = CITIES[cityIndex] || CITIES[0];

  const handleCitySelect = (index: number) => {
    sound.playTapSound();
    setCityIndex(index);
  };

  const handleNextCity = () => {
    sound.playTapSound();
    setCityIndex((prev) => (prev + 1) % CITIES.length);
  };

  // High performance, 60fps canvas particle simulation (Rain, Sunbeams, Clouds)
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Internal resolution matching container
    const width = 360;
    const height = 700;
    canvas.width = width;
    canvas.height = height;

    // Rain simulation structures
    interface Drop {
      x: number;
      y: number;
      speed: number;
      length: number;
      opacity: number;
    }
    interface Splash {
      x: number;
      y: number;
      r: number;
      maxR: number;
      opacity: number;
    }

    const raindrops: Drop[] = [];
    for (let i = 0; i < 75; i++) {
      raindrops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 8 + Math.random() * 9,
        length: 12 + Math.random() * 18,
        opacity: 0.35 + Math.random() * 0.45,
      });
    }

    const splashes: Splash[] = [];

    // Sun simulation structures
    let sunRotation = 0;
    interface DustMote {
      x: number;
      y: number;
      r: number;
      vy: number;
      vx: number;
      opacity: number;
      phase: number;
    }
    const motes: DustMote[] = [];
    for (let i = 0; i < 28; i++) {
      motes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 1.2 + Math.random() * 2.2,
        vy: -0.2 - Math.random() * 0.4,
        vx: (Math.random() - 0.5) * 0.3,
        opacity: 0.2 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Cloud simulation structures
    interface CloudPuff {
      x: number;
      y: number;
      radiusX: number;
      radiusY: number;
      speed: number;
      opacity: number;
    }
    const clouds: CloudPuff[] = [
      { x: 30, y: 70, radiusX: 110, radiusY: 48, speed: 0.22, opacity: 0.16 },
      { x: 220, y: 110, radiusX: 130, radiusY: 55, speed: 0.16, opacity: 0.2 },
      { x: -50, y: 150, radiusX: 140, radiusY: 60, speed: 0.28, opacity: 0.18 },
      { x: 140, y: 200, radiusX: 120, radiusY: 50, speed: 0.19, opacity: 0.14 },
    ];

    let lastTime = performance.now();

    const render = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      if (city.weatherType === 'rain') {
        // Falling raindrops
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        for (const drop of raindrops) {
          ctx.strokeStyle = `rgba(186, 230, 253, ${drop.opacity})`;
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x - 1.5, drop.y + drop.length);
          ctx.stroke();

          drop.y += drop.speed * (delta * 60);
          drop.x -= 1.2 * (delta * 60);

          if (drop.y > height - 10) {
            // Spawn bottom splash ripple
            if (splashes.length < 24) {
              splashes.push({
                x: drop.x,
                y: height - 10 + Math.random() * 8,
                r: 1,
                maxR: 5 + Math.random() * 4,
                opacity: 0.6,
              });
            }
            drop.y = -15;
            drop.x = Math.random() * (width + 50);
          }
        }

        // Draw animated splashes
        for (let i = splashes.length - 1; i >= 0; i--) {
          const sp = splashes[i];
          ctx.strokeStyle = `rgba(186, 230, 253, ${sp.opacity})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.ellipse(sp.x, sp.y, sp.r, sp.r * 0.45, 0, 0, Math.PI * 2);
          ctx.stroke();

          sp.r += 0.35 * (delta * 60);
          sp.opacity -= 0.04 * (delta * 60);
          if (sp.opacity <= 0 || sp.r >= sp.maxR) {
            splashes.splice(i, 1);
          }
        }
      } else if (city.weatherType === 'sunny') {
        // Rotating Radiant Sunbeams from top-right corner
        sunRotation += 0.0025 * (delta * 60);
        const originX = width - 25;
        const originY = 35;

        // Radiant sun core bloom
        const sunGlow = ctx.createRadialGradient(originX, originY, 15, originX, originY, 160);
        sunGlow.addColorStop(0, 'rgba(254, 240, 138, 0.22)');
        sunGlow.addColorStop(0.5, 'rgba(251, 191, 36, 0.09)');
        sunGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
        ctx.fillStyle = sunGlow;
        ctx.beginPath();
        ctx.arc(originX, originY, 160, 0, Math.PI * 2);
        ctx.fill();

        // Radiating sun rays
        const rayCount = 12;
        for (let i = 0; i < rayCount; i++) {
          const angle = sunRotation + (i * Math.PI * 2) / rayCount;
          const r1 = 30;
          const r2 = 260;
          const x1 = originX + Math.cos(angle) * r1;
          const y1 = originY + Math.sin(angle) * r1;
          const x2 = originX + Math.cos(angle) * r2;
          const y2 = originY + Math.sin(angle) * r2;

          ctx.strokeStyle = 'rgba(254, 240, 138, 0.045)';
          ctx.lineWidth = 14;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }

        // Shimmering warm golden dust motes
        for (const m of motes) {
          m.phase += 0.03 * (delta * 60);
          m.y += m.vy * (delta * 60);
          m.x += (m.vx + Math.sin(m.phase) * 0.2) * (delta * 60);

          if (m.y < -10) {
            m.y = height + 10;
            m.x = Math.random() * width;
          }
          if (m.x < -10) m.x = width + 10;
          if (m.x > width + 10) m.x = -10;

          const shimmer = m.opacity * (0.7 + 0.3 * Math.sin(m.phase * 2));
          ctx.fillStyle = `rgba(254, 240, 138, ${shimmer})`;
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (city.weatherType === 'cloudy') {
        // Volumetric drifting clouds across the sky
        for (const c of clouds) {
          c.x += c.speed * (delta * 60);
          if (c.x - c.radiusX > width) {
            c.x = -c.radiusX;
            c.y = 50 + Math.random() * 180;
          }

          const grad = ctx.createRadialGradient(
            c.x,
            c.y,
            c.radiusY * 0.2,
            c.x,
            c.y,
            c.radiusX
          );
          grad.addColorStop(0, `rgba(255, 255, 255, ${c.opacity})`);
          grad.addColorStop(0.6, `rgba(240, 244, 248, ${c.opacity * 0.7})`);
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.ellipse(c.x, c.y, c.radiusX, c.radiusY, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animId);
    };
  }, [city.weatherType]);

  return (
    <div className={`ios-weather-page ${city.weatherType}`}>
      {/* 60fps Canvas Atmospheric Background */}
      <canvas ref={canvasRef} className="weather-canvas-bg" />

      {/* Weather Header Navigation */}
      <header className="weather-nav">
        <button
          type="button"
          className="weather-back-btn"
          onClick={() => {
            sound.playTapSound();
            onBack();
          }}
          aria-label="Back to Home Screen"
        >
          <ChevronLeft size={18} />
          <span>Home</span>
        </button>

        {/* 5-City Switcher Pills */}
        <div className="weather-city-pills" role="tablist">
          {CITIES.map((c, idx) => (
            <button
              type="button"
              key={c.city}
              className={`city-pill-btn ${idx === cityIndex ? 'active' : ''}`}
              onClick={() => handleCitySelect(idx)}
              title={`${c.city}, ${c.country}`}
            >
              {c.city.slice(0, 3).toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      {/* Main Scrollable Weather Body */}
      <div className="weather-scrollable">
        {/* Weather Hero Card */}
        <div className="weather-hero" onClick={handleNextCity} style={{ cursor: 'pointer' }}>
          <span className="weather-hero-sub">{city.subtitle}</span>
          <h1 style={{ fontSize: '28px', fontWeight: 600, margin: '2px 0' }}>{city.city}</h1>
          <div className="weather-temp-hero">{city.temp}°</div>
          <div className="weather-condition-hero">{city.condition}</div>
          <div className="weather-highlow-hero">
            H: {city.high}° · L: {city.low}°
          </div>
        </div>

        {/* 24-Hour Forecast Horizontal Strip */}
        <div className="weather-card-glass">
          <div className="weather-card-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sun size={12} />
            <span>HOURLY FORECAST</span>
          </div>
          <div className="weather-hourly-row">
            {city.hourly.map((h, i) => (
              <div key={i} className="hourly-item">
                <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)' }}>{h.time}</span>
                <span style={{ fontSize: '18px', margin: '2px 0' }}>{h.icon}</span>
                <strong style={{ fontSize: '13px', color: '#ffffff' }}>{h.temp}°</strong>
              </div>
            ))}
          </div>
        </div>

        {/* 10-Day Forecast Table */}
        <div className="weather-card-glass">
          <div className="weather-card-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Calendar size={12} />
            <span>10-DAY FORECAST</span>
          </div>
          <div className="weather-tenday-list">
            {city.daily.map((d, i) => {
              // Calculate relative bar position based on min/max of the 10 days
              const minPossible = 5;
              const maxPossible = 40;
              const leftPercent = Math.max(0, Math.min(100, ((d.min - minPossible) / (maxPossible - minPossible)) * 100));
              const widthPercent = Math.max(15, Math.min(85, ((d.max - d.min) / (maxPossible - minPossible)) * 100));

              return (
                <div key={i} className="weather-tenday-row">
                  <span className="tenday-day">{d.day}</span>
                  <span className="tenday-icon">{d.icon}</span>
                  <span className="tenday-min">{d.min}°</span>
                  <div className="tenday-bar-wrap">
                    <div
                      className="tenday-bar-fill"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                    />
                  </div>
                  <span className="tenday-max">{d.max}°</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2x2 Weather Metrics Grid */}
        <div className="weather-metrics-grid">
          <div className="weather-metric-box">
            <div className="metric-box-title">
              <Sun size={12} />
              <span>UV INDEX</span>
            </div>
            <div className="metric-box-val">{city.uvIndex.split(' ')[0]}</div>
            <div className="metric-box-sub">{city.uvIndex.split(' ').slice(1).join(' ') || 'Moderate'}</div>
          </div>

          <div className="weather-metric-box">
            <div className="metric-box-title">
              <Wind size={12} />
              <span>WIND</span>
            </div>
            <div className="metric-box-val">{city.windSpeed.split(' ')[0]}</div>
            <div className="metric-box-sub">{city.windSpeed.split(' ').slice(1).join(' ')}</div>
          </div>

          <div className="weather-metric-box">
            <div className="metric-box-title">
              <Droplets size={12} />
              <span>HUMIDITY</span>
            </div>
            <div className="metric-box-val">{city.humidity}%</div>
            <div className="metric-box-sub">Dew point: {city.dewPoint}</div>
          </div>

          <div className="weather-metric-box">
            <div className="metric-box-title">
              <Eye size={12} />
              <span>VISIBILITY</span>
            </div>
            <div className="metric-box-val">{city.visibility}</div>
            <div className="metric-box-sub">Air: {city.airQuality}</div>
          </div>
        </div>
      </div>
    </div>
  );
}