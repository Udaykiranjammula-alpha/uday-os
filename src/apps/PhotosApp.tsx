import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Folder,
  Search,
  Image as ImageIcon,
  Trash2,
  X,
  Download,
  Share2,
  Heart,
  ZoomIn,
  ZoomOut,
  Info,
  Camera,
  Sparkles,
  Layers,
  Award,
  Sliders,
} from 'lucide-react';
import { sound } from '../services/sound';

export interface GalleryPhoto {
  id: string;
  dataUrl: string;
  title: string;
  category: 'portfolio' | 'capture';
  timestamp: string;
  date: string;
  isFavorite: boolean;
  mode?: string;
  filter?: string;
  exif: {
    lens: string;
    iso: string;
    aperture: string;
    speed: string;
    resolution: string;
  };
}

type TabType = 'All' | 'Favorites' | 'Portfolio' | 'Captures';

// Pre-loaded high-aesthetic portfolio photos for Uday Kiran
function createSvgDataUrl(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

const PRELOADED_PORTFOLIO_PHOTOS: GalleryPhoto[] = [
  {
    id: 'portfolio-arch',
    title: 'UDAY OS · iPhone 17 Pro Architecture',
    category: 'portfolio',
    date: 'Oct 28, 2026',
    timestamp: '11:42 AM',
    isFavorite: true,
    mode: 'FUSION',
    filter: 'standard',
    exif: {
      lens: '24mm Fusion Lens',
      iso: 'ISO 64',
      aperture: 'f/1.78',
      speed: '1/240s',
      resolution: '48MP 8064x6048',
    },
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#090d16"/>
            <stop offset="50%" stop-color="#0f172a"/>
            <stop offset="100%" stop-color="#1e1b4b"/>
          </linearGradient>
          <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#38bdf8"/>
            <stop offset="100%" stop-color="#6366f1"/>
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="30" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <rect width="800" height="1000" fill="url(#bg)"/>
        <circle cx="400" cy="420" r="280" fill="#38bdf8" opacity="0.12" filter="url(#glow)"/>
        <circle cx="600" cy="700" r="200" fill="#a855f7" opacity="0.15" filter="url(#glow)"/>
        
        <rect x="70" y="70" width="660" height="860" rx="28" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="2"/>
        
        <!-- Apple Silicon Architecture Chips -->
        <rect x="120" y="140" width="560" height="360" rx="20" fill="rgba(15,23,42,0.85)" stroke="rgba(56,189,248,0.4)" stroke-width="1.5"/>
        <text x="160" y="200" fill="#38bdf8" font-family="-apple-system, sans-serif" font-weight="800" font-size="22" letter-spacing="2">UDAY OS KERNEL · ARCHITECTURE</text>
        <text x="160" y="240" fill="#ffffff" font-family="-apple-system, sans-serif" font-weight="700" font-size="34">Virtual iPhone 17 Pro Max</text>
        <text x="160" y="285" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="18">TypeScript · React 18 · Three.js WebGL · Web Audio</text>
        
        <!-- Spec Grid -->
        <rect x="160" y="325" width="150" height="130" rx="12" fill="rgba(255,255,255,0.06)"/>
        <text x="180" y="365" fill="#38bdf8" font-family="monospace" font-size="16">60 FPS</text>
        <text x="180" y="395" fill="#ffffff" font-family="-apple-system, sans-serif" font-weight="700" font-size="18">Hardware 3D</text>
        <text x="180" y="425" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="13">WebGL Shaders</text>
        
        <rect x="325" y="325" width="150" height="130" rx="12" fill="rgba(255,255,255,0.06)"/>
        <text x="345" y="365" fill="#fbbf24" font-family="monospace" font-size="16">SPATIAL</text>
        <text x="345" y="395" fill="#ffffff" font-family="-apple-system, sans-serif" font-weight="700" font-size="18">Dolby Atmos</text>
        <text x="345" y="425" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="13">Web Audio Chords</text>
        
        <rect x="490" y="325" width="150" height="130" rx="12" fill="rgba(255,255,255,0.06)"/>
        <text x="510" y="365" fill="#34d399" font-family="monospace" font-size="16">184 LEET</text>
        <text x="510" y="395" fill="#ffffff" font-family="-apple-system, sans-serif" font-weight="700" font-size="18">Algorithms</text>
        <text x="510" y="425" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="13">Clean Architecture</text>
        
        <!-- Bottom Card -->
        <rect x="120" y="530" width="560" height="340" rx="20" fill="rgba(15,23,42,0.85)" stroke="rgba(255,255,255,0.1)" stroke-width="1.5"/>
        <circle cx="180" cy="620" r="40" fill="url(#cyanGrad)"/>
        <text x="180" y="628" fill="#ffffff" font-family="-apple-system, sans-serif" font-weight="900" font-size="24" text-anchor="middle">UK</text>
        <text x="245" y="605" fill="#ffffff" font-family="-apple-system, sans-serif" font-weight="800" font-size="24">Uday Kiran</text>
        <text x="245" y="635" fill="#38bdf8" font-family="-apple-system, sans-serif" font-size="16">Full Stack Software Engineer &amp; Systems Builder</text>
        <text x="245" y="665" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="14">KL University · Ready for High-Impact SDE Roles</text>
        
        <path d="M160 720 L640 720" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
        <text x="160" y="765" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="15">PORTFOLIO HIGHLIGHT · NATIVE CAMERA INTEGRATION</text>
        <text x="160" y="805" fill="#34d399" font-family="monospace" font-size="14">STATUS: PRODUCTION READY · ZERO COMPILER WARNINGS</text>
      </svg>
    `),
  },
  {
    id: 'portfolio-leetcode',
    title: '184 LeetCode Problems Solved',
    category: 'portfolio',
    date: 'Oct 21, 2026',
    timestamp: '04:12 PM',
    isFavorite: true,
    mode: 'PORTRAIT',
    filter: 'vivid',
    exif: {
      lens: '48mm 2x Telephoto',
      iso: 'ISO 100',
      aperture: 'f/2.2',
      speed: '1/500s',
      resolution: '48MP 8064x6048',
    },
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
        <defs>
          <linearGradient id="lcBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#18181b"/>
            <stop offset="100%" stop-color="#09090b"/>
          </linearGradient>
          <linearGradient id="amber" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f59e0b"/>
            <stop offset="100%" stop-color="#d97706"/>
          </linearGradient>
        </defs>
        <rect width="800" height="1000" fill="url(#lcBg)"/>
        <rect x="70" y="70" width="660" height="860" rx="28" fill="none" stroke="rgba(245,158,11,0.25)" stroke-width="2"/>
        
        <circle cx="400" cy="300" r="140" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="20"/>
        <circle cx="400" cy="300" r="140" fill="none" stroke="url(#amber)" stroke-width="20" stroke-dasharray="880" stroke-dashoffset="240" stroke-linecap="round"/>
        
        <text x="400" y="295" fill="#ffffff" font-family="-apple-system, sans-serif" font-weight="900" font-size="72" text-anchor="middle">184</text>
        <text x="400" y="340" fill="#f59e0b" font-family="-apple-system, sans-serif" font-weight="700" font-size="18" text-anchor="middle" letter-spacing="3">PROBLEMS SOLVED</text>
        
        <!-- Breakdown badges -->
        <rect x="140" y="490" width="160" height="110" rx="16" fill="rgba(34,197,94,0.12)" stroke="#22c55e" stroke-width="1.5"/>
        <text x="220" y="540" fill="#22c55e" font-family="-apple-system, sans-serif" font-weight="800" font-size="34" text-anchor="middle">82</text>
        <text x="220" y="575" fill="#86efac" font-family="-apple-system, sans-serif" font-weight="600" font-size="15" text-anchor="middle">Easy</text>
        
        <rect x="320" y="490" width="160" height="110" rx="16" fill="rgba(245,158,11,0.12)" stroke="#f59e0b" stroke-width="1.5"/>
        <text x="400" y="540" fill="#f59e0b" font-family="-apple-system, sans-serif" font-weight="800" font-size="34" text-anchor="middle">88</text>
        <text x="400" y="575" fill="#fcd34d" font-family="-apple-system, sans-serif" font-weight="600" font-size="15" text-anchor="middle">Medium</text>
        
        <rect x="500" y="490" width="160" height="110" rx="16" fill="rgba(239,68,68,0.12)" stroke="#ef4444" stroke-width="1.5"/>
        <text x="580" y="540" fill="#ef4444" font-family="-apple-system, sans-serif" font-weight="800" font-size="34" text-anchor="middle">14</text>
        <text x="580" y="575" fill="#fca5a5" font-family="-apple-system, sans-serif" font-weight="600" font-size="15" text-anchor="middle">Hard</text>
        
        <rect x="140" y="640" width="520" height="230" rx="20" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
        <text x="180" y="690" fill="#ffffff" font-family="-apple-system, sans-serif" font-weight="700" font-size="22">Top Algorithmic Strengths</text>
        <text x="180" y="730" fill="#cbd5e1" font-family="-apple-system, sans-serif" font-size="16">✓ Dynamic Programming &amp; Memoization</text>
        <text x="180" y="765" fill="#cbd5e1" font-family="-apple-system, sans-serif" font-size="16">✓ Graph BFS/DFS, Union-Find &amp; Shortest Paths</text>
        <text x="180" y="800" fill="#cbd5e1" font-family="-apple-system, sans-serif" font-size="16">✓ Trees, Binary Search &amp; Sliding Window Optimization</text>
        <text x="180" y="835" fill="#f59e0b" font-family="monospace" font-size="14">TOP 15% GLOBAL RANKING · DAILY STREAK ACTIVE</text>
      </svg>
    `),
  },
  {
    id: 'portfolio-esp32',
    title: 'ESP32 Dual-Core Embedded Telemetry',
    category: 'portfolio',
    date: 'Sep 15, 2026',
    timestamp: '09:18 PM',
    isFavorite: false,
    mode: 'SPATIAL',
    filter: 'cool',
    exif: {
      lens: '120mm 5x Telephoto',
      iso: 'ISO 250',
      aperture: 'f/2.8',
      speed: '1/160s',
      resolution: '48MP 8064x6048',
    },
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
        <defs>
          <linearGradient id="iotBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#022c22"/>
            <stop offset="50%" stop-color="#064e3b"/>
            <stop offset="100%" stop-color="#042f2e"/>
          </linearGradient>
        </defs>
        <rect width="800" height="1000" fill="url(#iotBg)"/>
        <rect x="70" y="70" width="660" height="860" rx="28" fill="none" stroke="rgba(52,211,153,0.3)" stroke-width="2"/>
        
        <rect x="140" y="140" width="520" height="340" rx="20" fill="rgba(0,0,0,0.5)" stroke="rgba(52,211,153,0.4)" stroke-width="1.5"/>
        <text x="180" y="200" fill="#34d399" font-family="monospace" font-weight="700" font-size="20">ESP32-S3 EMBEDDED SYSTEM</text>
        <text x="180" y="245" fill="#ffffff" font-family="-apple-system, sans-serif" font-weight="800" font-size="32">IoT Sensor Telemetry</text>
        <text x="180" y="285" fill="#a7f3d0" font-family="-apple-system, sans-serif" font-size="16">Dual-Core Xtensa LX7 @ 240MHz · FreeRTOS Tasks</text>
        
        <circle cx="210" cy="350" r="8" fill="#34d399"/>
        <text x="235" y="356" fill="#ffffff" font-family="monospace" font-size="15">WiFi 802.11 b/g/n + BLE 5.0 Mesh</text>
        <circle cx="210" cy="390" r="8" fill="#34d399"/>
        <text x="235" y="396" fill="#ffffff" font-family="monospace" font-size="15">MQTT Telemetry Stream · 12-bit ADC</text>
        <circle cx="210" cy="430" r="8" fill="#34d399"/>
        <text x="235" y="436" fill="#ffffff" font-family="monospace" font-size="15">OTA Firmware Updates &amp; Hardware Encryption</text>
        
        <rect x="140" y="520" width="520" height="360" rx="20" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.1)" stroke-width="1.5"/>
        <text x="180" y="575" fill="#ffffff" font-family="-apple-system, sans-serif" font-weight="700" font-size="22">Embedded Engineering Scope</text>
        <text x="180" y="620" fill="#cbd5e1" font-family="-apple-system, sans-serif" font-size="16">Designed low-power sensing nodes with deep sleep states,</text>
        <text x="180" y="650" fill="#cbd5e1" font-family="-apple-system, sans-serif" font-size="16">interfacing SPI &amp; I2C digital sensors with 99.8% uptime.</text>
        
        <rect x="180" y="690" width="440" height="150" rx="14" fill="rgba(52,211,153,0.08)" stroke="rgba(52,211,153,0.2)"/>
        <text x="205" y="735" fill="#34d399" font-family="monospace" font-weight="700" font-size="16">REAL-TIME PACKET BUFFER</text>
        <text x="205" y="770" fill="#ffffff" font-family="monospace" font-size="14">CORE 0: Protocol Handler &amp; TCP Stack</text>
        <text x="205" y="800" fill="#ffffff" font-family="monospace" font-size="14">CORE 1: Sensor Sampling &amp; DSP Filter</text>
      </svg>
    `),
  },
  {
    id: 'portfolio-shot-night',
    title: 'Shot on iPhone 17 Pro · Nightscape',
    category: 'portfolio',
    date: 'Nov 1, 2026',
    timestamp: '08:45 PM',
    isFavorite: true,
    mode: 'CINEMATIC',
    filter: 'dramatic',
    exif: {
      lens: '24mm Fusion Lens',
      iso: 'ISO 640',
      aperture: 'f/1.78',
      speed: '1.2s Night Mode',
      resolution: '48MP 8064x6048',
    },
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
        <defs>
          <linearGradient id="nightSky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#020617"/>
            <stop offset="60%" stop-color="#0f172a"/>
            <stop offset="100%" stop-color="#1e1b4b"/>
          </linearGradient>
          <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="40%" stop-color="#fef08a" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#fef08a" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="800" height="1000" fill="url(#nightSky)"/>
        <circle cx="620" cy="220" r="90" fill="url(#moonGlow)"/>
        
        <!-- Stars -->
        <circle cx="150" cy="120" r="2.5" fill="#ffffff" opacity="0.8"/>
        <circle cx="280" cy="90" r="3" fill="#ffffff" opacity="0.9"/>
        <circle cx="420" cy="160" r="2" fill="#ffffff" opacity="0.7"/>
        <circle cx="510" cy="80" r="2.5" fill="#ffffff" opacity="0.85"/>
        <circle cx="210" cy="240" r="2" fill="#ffffff" opacity="0.6"/>
        <circle cx="340" cy="290" r="3" fill="#ffffff" opacity="0.9"/>
        
        <!-- City skyline silhouettes -->
        <polygon points="50,1000 50,650 130,650 130,600 190,600 190,700 240,700 240,550 310,550 310,680 370,680 370,520 440,520 440,640 520,640 520,580 590,580 590,670 660,670 660,540 730,540 730,1000" fill="#030712"/>
        
        <!-- Windows illumination -->
        <rect x="255" y="580" width="12" height="16" fill="#fef08a" opacity="0.8"/>
        <rect x="275" y="580" width="12" height="16" fill="#fef08a" opacity="0.8"/>
        <rect x="255" y="610" width="12" height="16" fill="#fef08a" opacity="0.8"/>
        <rect x="385" y="550" width="14" height="20" fill="#38bdf8" opacity="0.8"/>
        <rect x="410" y="550" width="14" height="20" fill="#fef08a" opacity="0.8"/>
        <rect x="675" y="570" width="12" height="16" fill="#fef08a" opacity="0.85"/>
        <rect x="695" y="570" width="12" height="16" fill="#fef08a" opacity="0.85"/>
        
        <!-- Badge -->
        <rect x="180" y="850" width="440" height="64" rx="20" fill="rgba(0,0,0,0.75)" stroke="rgba(255,255,255,0.2)"/>
        <text x="400" y="888" fill="#ffffff" font-family="-apple-system, sans-serif" font-weight="700" font-size="19" text-anchor="middle">Shot on iPhone 17 Pro Max</text>
      </svg>
    `),
  },
];

export function PhotosApp({
  onBack,
  onOpenCamera,
}: {
  onBack: () => void;
  onOpenCamera?: () => void;
}) {
  const [activeTab, setActiveTab] = useState<TabType>('All');
  const [userPhotos, setUserPhotos] = useState<GalleryPhoto[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [zoomScale, setZoomScale] = useState(1);
  const [showExifModal, setShowExifModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [shareToast, setShareToast] = useState<string | null>(null);

  // Load photos from localStorage (ios_user_photos)
  const loadPhotos = useCallback(() => {
    try {
      const stored = localStorage.getItem('ios_user_photos') || localStorage.getItem('uday-os-user-photos');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const formatted: GalleryPhoto[] = parsed.map((item: any, idx: number) => ({
            id: item.id || `capture-${idx}`,
            dataUrl: item.dataUrl || item.url || '',
            title: item.label || `${item.mode || 'Camera'} Capture`,
            category: 'capture',
            timestamp: item.timestamp || 'Just now',
            date: item.date || 'Today',
            isFavorite: item.isFavorite || false,
            mode: item.mode || 'PHOTO',
            filter: item.filter || 'standard',
            exif: item.exif || {
              lens: '24mm Fusion Lens',
              iso: 'ISO 64',
              aperture: 'f/1.78',
              speed: '1/120s',
              resolution: '48MP 8064x6048',
            },
          }));
          setUserPhotos(formatted.reverse()); // latest first
        }
      }
    } catch {
      setUserPhotos([]);
    }

    try {
      const favs = localStorage.getItem('ios_favorite_photos');
      if (favs) {
        setFavoriteIds(JSON.parse(favs));
      }
    } catch {
      // Ignore
    }
  }, []);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  // Combined full photo library
  const allPhotos = useMemo(() => {
    const list = [...userPhotos, ...PRELOADED_PORTFOLIO_PHOTOS];
    return list.map((p) => ({
      ...p,
      isFavorite: favoriteIds.includes(p.id) || p.isFavorite,
    }));
  }, [userPhotos, favoriteIds]);

  // Tab filtering
  const displayedPhotos = useMemo(() => {
    let list = allPhotos;
    if (activeTab === 'Favorites') {
      list = allPhotos.filter((p) => p.isFavorite);
    } else if (activeTab === 'Portfolio') {
      list = allPhotos.filter((p) => p.category === 'portfolio');
    } else if (activeTab === 'Captures') {
      list = allPhotos.filter((p) => p.category === 'capture');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.date.toLowerCase().includes(q) ||
          p.timestamp.toLowerCase().includes(q) ||
          (p.mode && p.mode.toLowerCase().includes(q))
      );
    }

    return list;
  }, [allPhotos, activeTab, searchQuery]);

  // Toggle Favorite
  const handleToggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sound.playTapSound();
    setFavoriteIds((prev) => {
      const isFav = prev.includes(id);
      const next = isFav ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('ios_favorite_photos', JSON.stringify(next));
      } catch {}
      return next;
    });

    if (selectedPhoto && selectedPhoto.id === id) {
      setSelectedPhoto((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
  };

  // Delete photo
  const handleDeletePhoto = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sound.playTapSound();

    // Remove from user captures in state & localStorage
    const updatedUserPhotos = userPhotos.filter((p) => p.id !== id);
    setUserPhotos(updatedUserPhotos);

    try {
      localStorage.setItem('ios_user_photos', JSON.stringify(updatedUserPhotos));
      localStorage.setItem('uday-os-user-photos', JSON.stringify(updatedUserPhotos));
    } catch {}

    // Advance or close lightbox
    if (selectedPhoto?.id === id) {
      const currentIndex = displayedPhotos.findIndex((p) => p.id === id);
      if (displayedPhotos.length > 1) {
        const nextIndex = currentIndex < displayedPhotos.length - 1 ? currentIndex + 1 : currentIndex - 1;
        setSelectedPhoto(displayedPhotos[nextIndex] || null);
      } else {
        setSelectedPhoto(null);
      }
    }
  };

  // Share CTA
  const handleSharePhoto = async (photo: GalleryPhoto, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sound.playActionClickSound();

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: photo.title,
          text: `Check out "${photo.title}" from Uday's iPhone 17 Pro Max portfolio!`,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    // Fallback: Copy link/title to clipboard and show toast
    try {
      await navigator.clipboard.writeText(
        `Uday Kiran Portfolio Photo: ${photo.title} (${photo.date})`
      );
      setShareToast('Link copied to clipboard!');
    } catch {
      setShareToast('Ready to share photo!');
    }

    setTimeout(() => {
      setShareToast(null);
    }, 2500);
  };

  // Lightbox navigation next/prev
  const navigateLightbox = (direction: 'next' | 'prev') => {
    sound.playTapSound();
    if (!selectedPhoto) return;
    const currentIndex = displayedPhotos.findIndex((p) => p.id === selectedPhoto.id);
    if (currentIndex === -1) return;

    setZoomScale(1); // reset zoom on navigation
    if (direction === 'next') {
      const nextIndex = (currentIndex + 1) % displayedPhotos.length;
      setSelectedPhoto(displayedPhotos[nextIndex]);
    } else {
      const prevIndex = (currentIndex - 1 + displayedPhotos.length) % displayedPhotos.length;
      setSelectedPhoto(displayedPhotos[prevIndex]);
    }
  };

  return (
    <div className="native-photos">
      {/* Toast Notification */}
      {shareToast && <div className="photos-share-toast">{shareToast}</div>}

      {/* Top Header matching iOS Photos */}
      <header className="media-header">
        <button
          type="button"
          className="mail-nav-back-pill"
          onClick={onBack}
          aria-label="Back to Home Screen"
        >
          <ChevronLeft size={18} />
          <span>Home</span>
        </button>

        <div className="media-header-title">
          <h1>{activeTab}</h1>
          <small>
            {displayedPhotos.length} {displayedPhotos.length === 1 ? 'Photo' : 'Photos'}
          </small>
        </div>

        {onOpenCamera && (
          <button
            type="button"
            className="photos-header-cam-btn"
            onClick={onOpenCamera}
            title="Open Camera"
            aria-label="Open Camera"
          >
            <Camera size={18} />
          </button>
        )}
      </header>

      {/* Search Input Bar */}
      <div className="photos-search-bar-wrap">
        <div className="media-search">
          <Search size={15} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dates, modes, or projects..."
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchQuery('')}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Main Grid Scroll Area */}
      {displayedPhotos.length === 0 ? (
        /* Empty State */
        <div className="media-empty">
          <div className="media-empty-icon-circle">
            <ImageIcon size={42} strokeWidth={1.5} />
          </div>
          <h2>No Photos in {activeTab}</h2>
          <p>
            {activeTab === 'Favorites'
              ? 'Tap the heart icon on any photo to add it to your Favorites.'
              : activeTab === 'Captures'
              ? 'Open the Camera app to take photos with 0.5x, 1x, 2x, 5x telephoto lenses.'
              : 'No photos match your current search query.'}
          </p>
          {onOpenCamera && (
            <button
              type="button"
              className="photos-open-cam-btn"
              onClick={onOpenCamera}
            >
              <Camera size={15} />
              <span>Launch Camera</span>
            </button>
          )}
        </div>
      ) : (
        /* 3-Column Apple Photos Grid with badges */
        <div className="photos-gallery-scroll">
          <div className="photos-grid-3col">
            {displayedPhotos.map((photo) => (
              <div
                key={photo.id}
                className="photo-grid-cell"
                onClick={() => {
                  sound.playTapSound();
                  setZoomScale(1);
                  setSelectedPhoto(photo);
                }}
              >
                <img
                  src={photo.dataUrl}
                  alt={photo.title}
                  className="photo-grid-img"
                  loading="lazy"
                />

                {/* Favorite Heart Tag */}
                {photo.isFavorite && (
                  <span className="photo-fav-badge">
                    <Heart size={11} fill="#ef4444" color="#ef4444" />
                  </span>
                )}

                {/* Category Pill Tag */}
                {photo.category === 'portfolio' ? (
                  <span className="photo-type-badge portfolio">PORTFOLIO</span>
                ) : (
                  <span className="photo-type-badge capture">{photo.mode || 'SHOT'}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Photo Lightbox Modal with Zoom, Delete & Share */}
      {selectedPhoto && (
        <div className="photo-lightbox-backdrop" onClick={() => setSelectedPhoto(null)}>
          <div className="photo-lightbox-card" onClick={(e) => e.stopPropagation()}>
            {/* Lightbox Header */}
            <header className="lightbox-header">
              <div className="lightbox-meta">
                <strong>{selectedPhoto.title}</strong>
                <span>
                  {selectedPhoto.date} &middot; {selectedPhoto.timestamp}
                </span>
              </div>
              <div className="lightbox-actions">
                {/* Favorite Button */}
                <button
                  type="button"
                  className={`lightbox-action-btn ${selectedPhoto.isFavorite ? 'active-heart' : ''}`}
                  onClick={(e) => handleToggleFavorite(selectedPhoto.id, e)}
                  aria-label={selectedPhoto.isFavorite ? 'Unfavorite' : 'Favorite'}
                  title="Favorite"
                >
                  <Heart
                    size={16}
                    fill={selectedPhoto.isFavorite ? '#ef4444' : 'none'}
                    color={selectedPhoto.isFavorite ? '#ef4444' : '#ffffff'}
                  />
                </button>

                {/* EXIF Info Button */}
                <button
                  type="button"
                  className="lightbox-action-btn"
                  onClick={() => {
                    sound.playTapSound();
                    setShowExifModal(!showExifModal);
                  }}
                  aria-label="Photo Info"
                  title="Photo Information"
                >
                  <Info size={16} />
                </button>

                {/* Share CTA */}
                <button
                  type="button"
                  className="lightbox-action-btn"
                  onClick={(e) => handleSharePhoto(selectedPhoto, e)}
                  aria-label="Share Photo"
                  title="Share Photo"
                >
                  <Share2 size={16} />
                </button>

                {/* Delete Button */}
                <button
                  type="button"
                  className="lightbox-action-btn delete"
                  onClick={(e) => handleDeletePhoto(selectedPhoto.id, e)}
                  aria-label="Delete Photo"
                  title="Delete Photo"
                >
                  <Trash2 size={16} />
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  className="lightbox-action-btn"
                  onClick={() => setSelectedPhoto(null)}
                  aria-label="Close Preview"
                  title="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </header>

            {/* EXIF Information Drawer */}
            {showExifModal && (
              <div className="lightbox-exif-drawer">
                <div className="exif-row">
                  <span>Camera:</span>
                  <strong>Apple iPhone 17 Pro Max</strong>
                </div>
                <div className="exif-row">
                  <span>Lens:</span>
                  <strong>{selectedPhoto.exif.lens}</strong>
                </div>
                <div className="exif-row">
                  <span>Aperture:</span>
                  <strong>{selectedPhoto.exif.aperture}</strong>
                </div>
                <div className="exif-row">
                  <span>Exposure:</span>
                  <strong>{selectedPhoto.exif.speed} &middot; {selectedPhoto.exif.iso}</strong>
                </div>
                <div className="exif-row">
                  <span>Resolution:</span>
                  <strong>{selectedPhoto.exif.resolution}</strong>
                </div>
              </div>
            )}

            {/* Image Preview Canvas with Zoom Support */}
            <div className="lightbox-img-wrap">
              {/* Prev Arrow */}
              {displayedPhotos.length > 1 && (
                <button
                  type="button"
                  className="lightbox-nav-btn prev"
                  onClick={() => navigateLightbox('prev')}
                  aria-label="Previous photo"
                >
                  <ChevronLeft size={24} />
                </button>
              )}

              <div
                className="lightbox-zoom-container"
                style={{
                  transform: `scale(${zoomScale})`,
                  transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <img
                  src={selectedPhoto.dataUrl}
                  alt={selectedPhoto.title}
                  className="lightbox-img"
                  onDoubleClick={() => {
                    sound.playTapSound();
                    setZoomScale((prev) => (prev > 1 ? 1 : 2));
                  }}
                />
              </div>

              {/* Next Arrow */}
              {displayedPhotos.length > 1 && (
                <button
                  type="button"
                  className="lightbox-nav-btn next"
                  onClick={() => navigateLightbox('next')}
                  aria-label="Next photo"
                >
                  <ChevronRight size={24} />
                </button>
              )}
            </div>

            {/* Footer with Zoom Controls & Save to Device CTA */}
            <footer className="lightbox-footer">
              <div className="lightbox-zoom-bar">
                <button
                  type="button"
                  className="zoom-ctrl-btn"
                  onClick={() => {
                    sound.playTapSound();
                    setZoomScale((z) => Math.max(1, z - 0.5));
                  }}
                  disabled={zoomScale <= 1}
                  aria-label="Zoom Out"
                >
                  <ZoomOut size={16} />
                </button>
                <span className="zoom-value-label">{zoomScale.toFixed(1)}x</span>
                <button
                  type="button"
                  className="zoom-ctrl-btn"
                  onClick={() => {
                    sound.playTapSound();
                    setZoomScale((z) => Math.min(3, z + 0.5));
                  }}
                  disabled={zoomScale >= 3}
                  aria-label="Zoom In"
                >
                  <ZoomIn size={16} />
                </button>
              </div>

              <a
                href={selectedPhoto.dataUrl}
                download={`UDAY-OS-${selectedPhoto.id}.jpg`}
                className="lightbox-download-link"
              >
                <Download size={15} />
                <span>Save to Device</span>
              </a>
            </footer>
          </div>
        </div>
      )}

      {/* Floating Bottom Media Tabs Navigation Capsule: All | Favorites | Portfolio | Captures */}
      <nav className="media-tabs photos-tabs-4" aria-label="Photos navigation">
        {(['All', 'Favorites', 'Portfolio', 'Captures'] as TabType[]).map((tab) => (
          <button
            key={tab}
            type="button"
            className={activeTab === tab ? 'active-tab' : ''}
            aria-pressed={activeTab === tab}
            onClick={() => {
              sound.playTapSound();
              setActiveTab(tab);
            }}
          >
            {tab === 'All' && <Folder size={15} />}
            {tab === 'Favorites' && <Heart size={15} />}
            {tab === 'Portfolio' && <Layers size={15} />}
            {tab === 'Captures' && <Camera size={15} />}
            <span>{tab}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
