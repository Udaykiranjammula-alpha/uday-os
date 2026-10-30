import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  Sun,
  CloudRain,
  Cloud,
  Wind,
  Droplets,
  Eye,
  Compass,
  Thermometer,
  Sparkles,
} from 'lucide-react';
import { sound } from '../services/sound';

interface WeatherCity {
  city: string;
  country: string;
  subtitle: string;
  condition: string;
  weatherType: 'sunny' | 'rain' | 'cloudy';
  temp: number;
  high: number;
  low: number;
  hourly: Array<{ time: string; temp: number; icon: string }>;
  uvIndex: string;
  humidity: number;
  windSpeed: string;
  visibility: string;
  sunset: string;
}

const CITIES: WeatherCity[] = [
  {
    city: 'Vijayawada',
    country: 'India',
    subtitle: 'KL University Campus',
    condition: 'Mostly Sunny',
    weatherType: 'sunny',
    temp: 31,
    high: 34,
    low: 24,
    hourly: [
      { time: 'Now', temp: 31, icon: '☀️' },
      { time: '1 PM', temp: 33, icon: '☀️' },
      { time: '2 PM', temp: 34, icon: '☀️' },
      { time: '3 PM', temp: 33, icon: '⛅' },
      { time: '4 PM', temp: 32, icon: '⛅' },
      { time: '5 PM', temp: 30, icon: '🌤️' },
      { time: '6 PM', temp: 28, icon: '🌙' },
    ],
    uvIndex: '8 (Very High)',
    humidity: 68,
    windSpeed: '12 km/h ENE',
    visibility: '10 km',
    sunset: '6:12 PM',
  },
  {
    city: 'Cupertino',
    country: 'United States',
    subtitle: 'Apple Park HQ',
    condition: 'Clear Sky',
    weatherType: 'sunny',
    temp: 19,
    high: 22,
    low: 11,
    hourly: [
      { time: 'Now', temp: 19, icon: '☀️' },
      { time: '10 AM', temp: 20, icon: '☀️' },
      { time: '11 AM', temp: 21, icon: '☀️' },
      { time: '12 PM', temp: 22, icon: '☀️' },
      { time: '1 PM', temp: 22, icon: '☀️' },
      { time: '2 PM', temp: 21, icon: '🌤️' },
      { time: '3 PM', temp: 20, icon: '☀️' },
    ],
    uvIndex: '5 (Moderate)',
    humidity: 45,
    windSpeed: '9 km/h WNW',
    visibility: '16 km',
    sunset: '7:45 PM',
  },
  {
    city: 'London',
    country: 'United Kingdom',
    subtitle: 'Westminster',
    condition: 'Light Rain',
    weatherType: 'rain',
    temp: 14,
    high: 16,
    low: 9,
    hourly: [
      { time: 'Now', temp: 14, icon: '🌧️' },
      { time: '2 PM', temp: 15, icon: '🌧️' },
      { time: '3 PM', temp: 15, icon: '🌦️' },
      { time: '4 PM', temp: 14, icon: '🌧️' },
      { time: '5 PM', temp: 13, icon: '🌧️' },
      { time: '6 PM', temp: 12, icon: '☁️' },
      { time: '7 PM', temp: 11, icon: '🌙' },
    ],
    uvIndex: '2 (Low)',
    humidity: 82,
    windSpeed: '18 km/h SSW',
    visibility: '8 km',
    sunset: '5:50 PM',
  },
];

const TEN_DAY_FORECAST = [
  { day: 'Today', icon: '☀️', min: 24, max: 34 },
  { day: 'Sat', icon: '☀️', min: 25, max: 35 },
  { day: 'Sun', icon: '⛅', min: 24, max: 33 },
  { day: 'Mon', icon: '🌦️', min: 23, max: 31 },
  { day: 'Tue', icon: '🌧️', min: 22, max: 30 },
  { day: 'Wed', icon: '☀️', min: 24, max: 33 },
  { day: 'Thu', icon: '☀️', min: 25, max: 34 },
];

interface WeatherAppProps {
  onBack: () => void;
  onNavigate?: (route: string) => void;
}

export function WeatherApp({ onBack, onNavigate }: WeatherAppProps) {
  const [cityIndex, setCityIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const city = CITIES[cityIndex] || CITIES[0];

  const handleNextCity = () => {
    sound.playTapSound();
    setCityIndex((prev) => (prev + 1) % CITIES.length);
  };

  // Live Canvas Atmospheric Particle Simulation
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Rain particles
    const raindrops: Array<{ x: number; y: number; speed: number; length: number }> = [];
    for (let i = 0; i < 50; i++) {
      raindrops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 6 + Math.random() * 8,
        length: 10 + Math.random() * 15,
      });
    }

    // Sunny sunbeams angle
    let sunAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (city.weatherType === 'rain') {
        // Draw falling raindrops
        ctx.strokeStyle = 'rgba(186, 230, 253, 0.65)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        for (const drop of raindrops) {
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x - 2, drop.y + drop.length);
          drop.y += drop.speed;
          drop.x -= 1;
          if (drop.y > canvas.height) {
            drop.y = -10;
            drop.x = Math.random() * canvas.width;
          }
        }
        ctx.stroke();
      } else if (city.weatherType === 'sunny') {
        // Draw radiant rotating sun rays in the background
        sunAngle += 0.003;
        const centerX = canvas.width - 20;
        const centerY = 30;

        for (let i = 0; i < 12; i++) {
          const angle = sunAngle + (i * Math.PI) / 6;
          const r1 = 30;
          const r2 = 180;
          const x1 = centerX + Math.cos(angle) * r1;
          const y1 = centerY + Math.sin(angle) * r1;
          const x2 = centerX + Math.cos(angle) * r2;
          const y2 = centerY + Math.sin(angle) * r2;

          ctx.strokeStyle = 'rgba(251, 191, 36, 0.06)';
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [city.weatherType]);

  return (
    <div className={`ios-weather-page ${city.weatherType}`}>
      {/* Background Canvas Particles */}
      <canvas
        ref={canvasRef}
        width={340}
        height={400}
        className="weather-particle-canvas"
      />

      {/* Top Header */}
      <header className="weather-header">
        <button
          type="button"
          className="mail-nav-back-pill"
          onClick={onBack}
          aria-label="Back to Home"
        >
          <ChevronLeft size={18} />
          <span>Home</span>
        </button>

        <button
          type="button"
          className="weather-city-switcher-pill"
          onClick={handleNextCity}
          title="Tap to switch cities"
        >
          <span>{city.city} ({cityIndex + 1}/{CITIES.length})</span>
        </button>

        <div style={{ width: 44 }} />
      </header>

      {/* Main Weather Hero */}
      <div className="weather-main-scroll">
        <div className="weather-hero-card">
          <span className="weather-campus-sub">{city.subtitle}</span>
          <h1 className="weather-city-title">{city.city}</h1>
          <div className="weather-big-temp">{city.temp}°</div>
          <span className="weather-condition-label">{city.condition}</span>
          <div className="weather-hi-lo">
            H: {city.high}° · L: {city.low}°
          </div>
        </div>

        {/* 24-Hour Forecast Card */}
        <div className="weather-card-container hourly">
          <div className="card-kicker-row">
            <Sun size={12} />
            <span>HOURLY FORECAST</span>
          </div>
          <div className="hourly-forecast-strip">
            {city.hourly.map((h) => (
              <div key={h.time} className="hourly-column-item">
                <span className="hour-time">{h.time}</span>
                <span className="hour-icon">{h.icon}</span>
                <strong className="hour-temp">{h.temp}°</strong>
              </div>
            ))}
          </div>
        </div>

        {/* 10-Day Forecast Table */}
        <div className="weather-card-container ten-day">
          <div className="card-kicker-row">
            <span>📅 10-DAY FORECAST</span>
          </div>
          <div className="ten-day-list">
            {TEN_DAY_FORECAST.map((d) => (
              <div key={d.day} className="ten-day-row">
                <span className="ten-day-name">{d.day}</span>
                <span className="ten-day-icon">{d.icon}</span>
                <span className="ten-day-min">{d.min}°</span>
                <div className="temp-range-bar">
                  <div className="temp-range-fill" />
                </div>
                <span className="ten-day-max">{d.max}°</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2x2 Metrics Grid */}
        <div className="weather-metrics-grid">
          <div className="weather-metric-cell">
            <div className="metric-header-kicker">
              <Sun size={12} />
              <span>UV INDEX</span>
            </div>
            <strong className="metric-primary-val">{city.uvIndex.split(' ')[0]}</strong>
            <small className="metric-sub-detail">{city.uvIndex.split(' ')[1] || 'Moderate'}</small>
          </div>

          <div className="weather-metric-cell">
            <div className="metric-header-kicker">
              <Wind size={12} />
              <span>WIND</span>
            </div>
            <strong className="metric-primary-val">{city.windSpeed.split(' ')[0]}</strong>
            <small className="metric-sub-detail">{city.windSpeed.split(' ').slice(1).join(' ')}</small>
          </div>

          <div className="weather-metric-cell">
            <div className="metric-header-kicker">
              <Droplets size={12} />
              <span>HUMIDITY</span>
            </div>
            <strong className="metric-primary-val">{city.humidity}%</strong>
            <small className="metric-sub-detail">The dew point is 21°.</small>
          </div>

          <div className="weather-metric-cell">
            <div className="metric-header-kicker">
              <Eye size={12} />
              <span>VISIBILITY</span>
            </div>
            <strong className="metric-primary-val">{city.visibility}</strong>
            <small className="metric-sub-detail">Clear view</small>
          </div>
        </div>
      </div>
    </div>
  );
}
