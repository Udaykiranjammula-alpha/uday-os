import React, { useState } from 'react';
import { ArrowLeft, ExternalLink, Globe, RotateCw, ShieldAlert } from 'lucide-react';
import type { Project } from '../types';

interface DemoPreviewAppProps {
  project: Project;
  onBack: () => void;
}

export function DemoPreviewApp({ project, onBack }: DemoPreviewAppProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [key, setKey] = useState(0);

  const handleRefresh = () => {
    setIframeLoaded(false);
    setKey((prev) => prev + 1);
  };

  return (
    <div className="phone-screen-content demo-preview-layout">
      {/* Back button */}
      <button type="button" className="inline-back-btn" onClick={onBack}>
        <ArrowLeft size={14} />
        <span>Back to {project.title}</span>
      </button>

      {/* Simulated Browser Address Bar */}
      <div className="browser-address-bar">
        <Globe size={13} className="browser-icon" />
        <span className="browser-url">{project.demo || 'No demo URL configured'}</span>
        <button
          type="button"
          className="browser-refresh-btn"
          onClick={handleRefresh}
          aria-label="Reload preview"
        >
          <RotateCw size={12} />
        </button>
      </div>

      {/* Iframe Viewport Container */}
      <div className="demo-iframe-container">
        {project.demo ? (
          <>
            <iframe
              key={key}
              src={project.demo}
              title={`${project.title} live demo preview`}
              className="embedded-demo-iframe"
              sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
              onLoad={() => setIframeLoaded(true)}
            />

            {!iframeLoaded && (
              <div className="demo-loading-overlay">
                <div className="loading-spinner" />
                <p>Loading in-phone preview...</p>
                <small className="muted-text">
                  Fetching live Vercel deployment.
                </small>
              </div>
            )}
          </>
        ) : (
          <div className="no-demo-notice">
            <ShieldAlert size={28} className="text-amber" />
            <p>No live demo URL configured for this project.</p>
          </div>
        )}
      </div>

      {/* Notice & Direct External Action */}
      <div className="demo-fallback-box">
        <p className="notice-text">
          Some modern hosts block embedding via <code>X-Frame-Options</code>. If the preview displays blank, launch the verified live website directly:
        </p>

        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="phone-primary-action external-launch"
          >
            <span>Open Verified Live Demo in New Tab</span>
            <ExternalLink size={15} />
          </a>
        )}
      </div>
    </div>
  );
}
