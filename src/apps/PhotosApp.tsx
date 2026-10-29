import React, { useState } from 'react';
import { ChevronLeft, Folder, Search, Image as ImageIcon } from 'lucide-react';

export function PhotosApp({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'Library' | 'Collections' | 'Search'>('Library');
  const [searchQuery, setSearchQuery] = useState('');

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
          <small>0 Items</small>
        </div>
      </header>

      {/* Search Input when Search Tab is Active */}
      {activeTab === 'Search' && (
        <div className="media-search">
          <Search size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search photos, titles, and categories"
            autoFocus
          />
        </div>
      )}

      {/* Authentic Empty Gallery State (All images removed as requested) */}
      <div className="media-empty">
        <div className="media-empty-icon-circle">
          <ImageIcon size={42} strokeWidth={1.5} />
        </div>
        <h2>No Photos or Videos</h2>
        <p>Your Photo Library is empty. Photos and screenshots you take will appear here.</p>
      </div>

      {/* Floating Bottom Media Tabs Navigation Capsule */}
      <nav className="media-tabs" aria-label="Photos navigation">
        <button
          type="button"
          aria-pressed={activeTab === 'Library'}
          onClick={() => setActiveTab('Library')}
        >
          <Folder size={16} />
          Library
        </button>
        <button
          type="button"
          aria-pressed={activeTab === 'Collections'}
          onClick={() => setActiveTab('Collections')}
        >
          <ImageIcon size={16} />
          Collections
        </button>
        <button
          type="button"
          aria-pressed={activeTab === 'Search'}
          onClick={() => setActiveTab('Search')}
        >
          <Search size={16} />
          Search
        </button>
      </nav>
    </div>
  );
}
