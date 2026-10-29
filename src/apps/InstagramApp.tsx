import React, { useState } from 'react';
import {
  ChevronLeft,
  Instagram,
  ExternalLink,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Grid,
  Film,
  UserCheck,
  MoreHorizontal,
  X,
  BadgeCheck,
} from 'lucide-react';
import { profile } from '../data/profile';

interface IgPost {
  id: string;
  title: string;
  caption: string;
  likes: number;
  comments: number;
  tag: string;
  gradient: string;
  date: string;
}

const IG_POSTS: IgPost[] = [
  {
    id: 'ig-1',
    title: 'Hospital Management System',
    caption: 'Architected responsive healthcare dashboard with real-time triage queue and instant client sync. Live on Vercel.',
    likes: 184,
    comments: 14,
    tag: '#HealthcareSPA #React',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #0284c7 100%)',
    date: '2 DAYS AGO',
  },
  {
    id: 'ig-2',
    title: 'ESP32 Dual-Core SPI Telemetry',
    caption: 'Breadboard wiring and logic analyzer packet transport telemetry capturing low-latency sensor synchronization.',
    likes: 142,
    comments: 11,
    tag: '#EmbeddedSystems #FreeRTOS',
    gradient: 'linear-gradient(135deg, #312e81 0%, #7c3aed 100%)',
    date: '1 WEEK AGO',
  },
  {
    id: 'ig-3',
    title: 'Wi-Fi CSI Subcarrier Heatmap',
    caption: 'Spatial attenuation wave movements for passive human presence detection using OFDM signal perturbation analysis.',
    likes: 219,
    comments: 19,
    tag: '#RFResearch #SignalProcessing',
    gradient: 'linear-gradient(135deg, #431407 0%, #ea580c 100%)',
    date: '2 WEEKS AGO',
  },
  {
    id: 'ig-4',
    title: 'UDAY OS Portfolio Engine',
    caption: 'Designing a 1:1 hardware-accurate 3D iPhone 17 Pro interactive experience with WebGL, GLTF physically-based shaders, and iOS 18 apps.',
    likes: 312,
    comments: 28,
    tag: '#Portfolio #WebGL',
    gradient: 'linear-gradient(135deg, #18181b 0%, #3f3f46 100%)',
    date: '3 WEEKS AGO',
  },
  {
    id: 'ig-5',
    title: 'KL University Engineering',
    caption: 'Department of Computer Science & Engineering research lab. Exploring autonomous agent workflows and edge intelligence.',
    likes: 198,
    comments: 16,
    tag: '#KLUniversity #CS',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)',
    date: 'OCTOBER 2026',
  },
  {
    id: 'ig-6',
    title: 'Algorithmic Problem Solving',
    caption: 'Implementing optimized data structure pipelines in C & Python with rigorous time-complexity benchmarks.',
    likes: 165,
    comments: 9,
    tag: '#DataStructures #Python',
    gradient: 'linear-gradient(135deg, #064e3b 0%, #10b981 100%)',
    date: 'SEPTEMBER 2026',
  },
];

interface InstagramAppProps {
  onBack?: () => void;
}

export function InstagramApp({ onBack }: InstagramAppProps) {
  const [activeTab, setActiveTab] = useState<'grid' | 'reels' | 'tagged'>('grid');
  const [selectedPost, setSelectedPost] = useState<IgPost | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <div className="instagram-container">
      {/* iOS Instagram Top Navigation Bar */}
      <header className="ig-top-header">
        <button
          type="button"
          className="ig-back-btn"
          onClick={onBack}
          aria-label="Back to Home Screen"
        >
          <ChevronLeft size={22} />
          <span>Home</span>
        </button>

        <div className="ig-header-user">
          <span className="ig-username">udaykiran.jammula</span>
          <BadgeCheck size={14} className="ig-verified-badge" />
        </div>

        <a
          href={profile.instagram}
          target="_blank"
          rel="noreferrer"
          className="ig-header-action"
          aria-label="Open Instagram in browser"
          title="Open in Instagram"
        >
          <ExternalLink size={16} />
        </a>
      </header>

      {/* Profile Header & Bio */}
      <div className="ig-profile-scroll">
        <section className="ig-profile-card">
          <div className="ig-profile-top-row">
            {/* Rainbow Gradient Story Ring Avatar */}
            <div className="ig-avatar-ring">
              <div className="ig-avatar-inner">
                <img
                  src="/uday_avatar.png"
                  alt={profile.name}
                  className="ig-avatar-photo"
                />
              </div>
            </div>

            {/* Profile Statistics */}
            <div className="ig-stats-group">
              <div className="ig-stat-unit">
                <strong>6</strong>
                <span>Posts</span>
              </div>
              <div className="ig-stat-unit">
                <strong>500+</strong>
                <span>Followers</span>
              </div>
              <div className="ig-stat-unit">
                <strong>180</strong>
                <span>Following</span>
              </div>
            </div>
          </div>

          {/* Bio Text */}
          <div className="ig-bio-block">
            <h1 className="ig-fullname">{profile.name}</h1>
            <span className="ig-category-sub">Software Developer & Systems Architect</span>
            <p className="ig-bio-text">
              Student @ KL University | Python, Data Structures, C
              <br />
              ⚡ Turning Ideas Into Impact
            </p>
            <a
              href={`mailto:${profile.email}`}
              className="ig-link-row"
            >
              ✉️ {profile.email}
            </a>
          </div>

          {/* Direct CTA Action Button */}
          <div className="ig-actions-row">
            <a
              href={profile.instagram}
              target="_blank"
              rel="noreferrer"
              className="ig-cta-btn"
            >
              <Instagram size={15} />
              <span>Open on Instagram</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </section>

        {/* Media Type Tabs */}
        <div className="ig-tabs-row" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'grid'}
            className={`ig-tab-btn ${activeTab === 'grid' ? 'active' : ''}`}
            onClick={() => setActiveTab('grid')}
          >
            <Grid size={18} />
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'reels'}
            className={`ig-tab-btn ${activeTab === 'reels' ? 'active' : ''}`}
            onClick={() => setActiveTab('reels')}
          >
            <Film size={18} />
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'tagged'}
            className={`ig-tab-btn ${activeTab === 'tagged' ? 'active' : ''}`}
            onClick={() => setActiveTab('tagged')}
          >
            <UserCheck size={18} />
          </button>
        </div>

        {/* 3-Column Instagram Photo Grid */}
        <div className="ig-media-grid">
          {IG_POSTS.map((post) => {
            const isLiked = !!likedPosts[post.id];
            const displayLikes = post.likes + (isLiked ? 1 : 0);

            return (
              <button
                key={post.id}
                type="button"
                className="ig-grid-tile"
                style={{ background: post.gradient }}
                onClick={() => setSelectedPost(post)}
                aria-label={`View post: ${post.title}`}
              >
                <div className="ig-tile-content">
                  <span className="ig-tile-tag">{post.tag.split(' ')[0]}</span>
                  <strong className="ig-tile-title">{post.title}</strong>
                </div>

                <div className="ig-tile-overlay">
                  <div className="ig-tile-meta">
                    <Heart size={14} fill={isLiked ? '#ef4444' : 'currentColor'} />
                    <span>{displayLikes}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Post Detail Lightbox Modal */}
      {selectedPost && (
        <div className="ig-modal-backdrop" onClick={() => setSelectedPost(null)}>
          <div className="ig-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="ig-modal-header">
              <div className="ig-modal-user">
                <img
                  src="/uday_avatar.png"
                  alt={profile.name}
                  className="ig-modal-avatar"
                />
                <div>
                  <strong>udaykiran.jammula</strong>
                  <small>{selectedPost.tag.split(' ')[0]}</small>
                </div>
              </div>
              <button
                type="button"
                className="ig-modal-close"
                onClick={() => setSelectedPost(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div
              className="ig-modal-visual"
              style={{ background: selectedPost.gradient }}
            >
              <div className="ig-modal-hero-title">
                <span>PROJECT SPOTLIGHT</span>
                <h3>{selectedPost.title}</h3>
              </div>
            </div>

            <div className="ig-modal-actions">
              <div className="ig-actions-left">
                <button
                  type="button"
                  className="ig-action-icon-btn"
                  onClick={() => toggleLike(selectedPost.id)}
                >
                  <Heart
                    size={20}
                    color={likedPosts[selectedPost.id] ? '#ef4444' : 'currentColor'}
                    fill={likedPosts[selectedPost.id] ? '#ef4444' : 'none'}
                  />
                </button>
                <button type="button" className="ig-action-icon-btn">
                  <MessageCircle size={20} />
                </button>
                <button type="button" className="ig-action-icon-btn">
                  <Share2 size={20} />
                </button>
              </div>
              <button type="button" className="ig-action-icon-btn">
                <Bookmark size={20} />
              </button>
            </div>

            <div className="ig-modal-info">
              <strong>
                {selectedPost.likes + (likedPosts[selectedPost.id] ? 1 : 0)} likes
              </strong>
              <p>
                <b>udaykiran.jammula</b> {selectedPost.caption}
              </p>
              <span className="ig-modal-tags">{selectedPost.tag}</span>
              <time className="ig-modal-time">{selectedPost.date}</time>

              <a
                href={profile.instagram}
                target="_blank"
                rel="noreferrer"
                className="ig-modal-external-link"
              >
                <Instagram size={14} />
                <span>View Full Post on Instagram</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
