import React, { useState, useEffect } from 'react';
import { ChevronLeft, Folder, Search, Image as ImageIcon, Trash2, X, Download, Share2 } from 'lucide-react';
import { sound } from '../services/sound';

interface UserPhoto {
  id: string;
  dataUrl: string;
  timestamp: string;
  date: string;
}

export function PhotosApp({ onBack, onOpenCamera }: { onBack: () => void; onOpenCamera?: () => void }) {
  const [activeTab, setActiveTab] = useState<'Library' | 'Collections' | 'Search'>('Library');
  const [photos, setPhotos] = useState<UserPhoto[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<UserPhoto | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load photos from localStorage
  const loadPhotos = () => {
    try {
      const stored = localStorage.getItem('uday-os-user-photos');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setPhotos(parsed);
        }
      }
    } catch {
      setPhotos([]);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  const handleDeletePhoto = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sound.playTapSound();
    const updated = photos.filter((p) => p.id !== id);
    setPhotos(updated);
    try {
      localStorage.setItem('uday-os-user-photos', JSON.stringify(updated));
    } catch {
      // Ignore
    }
    if (selectedPhoto?.id === id) {
      setSelectedPhoto(null);
    }
  };

  const filteredPhotos = photos.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return p.date.toLowerCase().includes(q) || p.timestamp.toLowerCase().includes(q);
  });

  return (
    <div className="native-photos">
      {/* Top Header matching Apple Photos */}
      <header className="media-header">
        <button
          type="button"
          className="mail-nav-back-pill"
          onClick={onBack}
          aria-label="Back to Home Screen"
        >
          <ChevronLeft size={18} />
        </button>
        <div>
          <h1>{activeTab === 'Library' ? 'Library' : activeTab === 'Collections' ? 'Collections' : 'Search'}</h1>
          <small>{photos.length} {photos.length === 1 ? 'Item' : 'Items'}</small>
        </div>
      </header>

      {/* Search Bar */}
      {activeTab === 'Search' && (
        <div className="media-search">
          <Search size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dates or times..."
            autoFocus
          />
        </div>
      )}

      {/* Main Content Area */}
      {photos.length === 0 ? (
        /* Empty Gallery State */
        <div className="media-empty">
          <div className="media-empty-icon-circle">
            <ImageIcon size={42} strokeWidth={1.5} />
          </div>
          <h2>No Photos or Videos</h2>
          <p>Your Photo Library is empty. Open the Camera app to take photos and view them here.</p>
          {onOpenCamera && (
            <button
              type="button"
              className="photos-open-cam-btn"
              onClick={onOpenCamera}
            >
              Open Camera
            </button>
          )}
        </div>
      ) : (
        /* 3-Column Apple Photos Grid */
        <div className="photos-gallery-scroll">
          <div className="photos-grid-3col">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                className="photo-grid-cell"
                onClick={() => {
                  sound.playTapSound();
                  setSelectedPhoto(photo);
                }}
              >
                <img src={photo.dataUrl} alt={`Taken on ${photo.date}`} className="photo-grid-img" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Photo Lightbox Modal */}
      {selectedPhoto && (
        <div className="photo-lightbox-backdrop" onClick={() => setSelectedPhoto(null)}>
          <div className="photo-lightbox-card" onClick={(e) => e.stopPropagation()}>
            <header className="lightbox-header">
              <div className="lightbox-meta">
                <strong>{selectedPhoto.date}</strong>
                <span>{selectedPhoto.timestamp}</span>
              </div>
              <div className="lightbox-actions">
                <button
                  type="button"
                  className="lightbox-action-btn delete"
                  onClick={(e) => handleDeletePhoto(selectedPhoto.id, e)}
                  aria-label="Delete Photo"
                >
                  <Trash2 size={16} />
                </button>
                <button
                  type="button"
                  className="lightbox-action-btn"
                  onClick={() => setSelectedPhoto(null)}
                  aria-label="Close Preview"
                >
                  <X size={18} />
                </button>
              </div>
            </header>

            <div className="lightbox-img-wrap">
              <img src={selectedPhoto.dataUrl} alt="Photo full preview" className="lightbox-img" />
            </div>

            <footer className="lightbox-footer">
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

      {/* Floating Bottom Media Tabs Navigation Capsule */}
      <nav className="media-tabs" aria-label="Photos navigation">
        <button
          type="button"
          aria-pressed={activeTab === 'Library'}
          onClick={() => {
            sound.playTapSound();
            setActiveTab('Library');
          }}
        >
          <Folder size={16} />
          Library
        </button>
        <button
          type="button"
          aria-pressed={activeTab === 'Collections'}
          onClick={() => {
            sound.playTapSound();
            setActiveTab('Collections');
          }}
        >
          <ImageIcon size={16} />
          Collections
        </button>
        <button
          type="button"
          aria-pressed={activeTab === 'Search'}
          onClick={() => {
            sound.playTapSound();
            setActiveTab('Search');
          }}
        >
          <Search size={16} />
          Search
        </button>
      </nav>
    </div>
  );
}
