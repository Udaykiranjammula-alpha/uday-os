import React, { useState } from 'react';
import {
  ChevronLeft,
  Search,
  Navigation,
  Compass,
  Layers,
  MapPin,
  Building2,
  Car,
  Footprints,
  Train,
  Share2,
} from 'lucide-react';
import { sound } from '../services/sound';

interface MapsAppProps {
  onBack: () => void;
  onNavigate?: (route: string) => void;
}

interface MapLocation {
  id: string;
  name: string;
  tag: string;
  coords: string;
  city: string;
  etaDrive: string;
  etaTransit: string;
  description: string;
  color: string;
}

const LOCATIONS: MapLocation[] = [
  {
    id: 'klu',
    name: 'KL University Innovation Labs',
    tag: 'Academic & R&D Campus',
    coords: '16.4422° N, 80.6226° E',
    city: 'Vijayawada, India',
    etaDrive: '12 min',
    etaTransit: '24 min',
    description: 'High-performance computing cluster, embedded IoT micro-bench, and software development center.',
    color: '#38bdf8',
  },
  {
    id: 'apple-park',
    name: 'Apple Park & Steve Jobs Theater',
    tag: 'Silicon Engineering HQ',
    coords: '37.3349° N, 122.0090° W',
    city: 'Cupertino, CA',
    etaDrive: '18 min',
    etaTransit: '35 min',
    description: 'Home of Apple Silicon A18 Pro architecture, Swift compiler team, and Keynote stage.',
    color: '#a855f7',
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru Silicon Corridor',
    tag: 'Cloud & Systems Hub',
    coords: '12.9716° N, 77.5946° E',
    city: 'Bengaluru, India',
    etaDrive: '25 min',
    etaTransit: '40 min',
    description: 'Tier-1 technology engineering centers, distributed micro-inference systems, and high-frequency cloud pipelines.',
    color: '#10b981',
  },
];

export function MapsApp({ onBack }: MapsAppProps) {
  const [selectedLoc, setSelectedLoc] = useState<MapLocation>(LOCATIONS[0]);
  const [is3DMode, setIs3DMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectLocation = (loc: MapLocation) => {
    sound.playTapSound();
    setSelectedLoc(loc);
  };

  const handleToggle3D = () => {
    sound.playActionClickSound();
    setIs3DMode(!is3DMode);
  };

  return (
    <div className="maps-page">
      {/* Top Floating Search Pill */}
      <div className="maps-search-bar">
        <button
          type="button"
          className="maps-back-btn"
          onClick={onBack}
          aria-label="Back to Home"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="maps-input-shell">
          <Search size={15} className="text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Apple Maps or verified locations"
            className="maps-input"
          />
        </div>

        <button
          type="button"
          className={`maps-3d-toggle-btn ${is3DMode ? 'active' : ''}`}
          onClick={handleToggle3D}
          title="Toggle 3D Flyover Mode"
        >
          <span>3D</span>
        </button>
      </div>

      {/* Main Vector Map Stage */}
      <div className={`maps-canvas-stage ${is3DMode ? 'flyover-3d' : 'flat-2d'}`}>
        <div className="maps-grid-lines" />

        {/* 3D Isometric Buildings Representation */}
        <div className="maps-3d-buildings">
          <div className="building b1" />
          <div className="building b2" />
          <div className="building b3 ring-building" />
        </div>

        {/* Selected Location Pin */}
        <div className="maps-active-pin" style={{ borderColor: selectedLoc.color }}>
          <div className="pin-head" style={{ background: selectedLoc.color }}>
            <MapPin size={16} className="text-white" />
          </div>
          <div className="pin-pulse" style={{ borderColor: selectedLoc.color }} />
          <span className="pin-label">{selectedLoc.name}</span>
        </div>

        {/* Floating Compass Rose */}
        <div className="maps-compass-dial">
          <Compass size={18} className="text-rose-500" />
        </div>
      </div>

      {/* Location Selector Chips */}
      <div className="maps-location-chips-row">
        {LOCATIONS.map((loc) => (
          <button
            key={loc.id}
            type="button"
            className={`maps-loc-chip ${selectedLoc.id === loc.id ? 'active' : ''}`}
            onClick={() => handleSelectLocation(loc)}
          >
            <span className="loc-bullet" style={{ background: loc.color }} />
            <span className="loc-chip-name">{loc.name}</span>
          </button>
        ))}
      </div>

      {/* Bottom Apple Maps Card Sheet */}
      <div className="maps-sheet-card">
        <div className="sheet-drag-pill" />

        <div className="sheet-content">
          <div className="sheet-header">
            <div>
              <h3 className="sheet-title">{selectedLoc.name}</h3>
              <p className="sheet-tag">{selectedLoc.tag} &middot; {selectedLoc.city}</p>
            </div>
            <button
              type="button"
              className="directions-btn"
              onClick={() => sound.playApplePayChime()}
            >
              <Navigation size={14} />
              <span>Navigate</span>
            </button>
          </div>

          <div className="sheet-coords-row">
            <span className="coords-text">Coordinates: {selectedLoc.coords}</span>
          </div>

          <p className="sheet-desc">{selectedLoc.description}</p>

          {/* Transit Estimates */}
          <div className="transit-options-row">
            <div className="transit-chip active">
              <Car size={13} />
              <span>{selectedLoc.etaDrive} Drive</span>
            </div>
            <div className="transit-chip">
              <Train size={13} />
              <span>{selectedLoc.etaTransit} Transit</span>
            </div>
            <div className="transit-chip">
              <Footprints size={13} />
              <span>Fast Walk</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
