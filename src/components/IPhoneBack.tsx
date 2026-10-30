import React from 'react';
import { AppleLogoIcon } from './IosIcons';

interface IPhoneBackProps {
  color: 'plum' | 'desert' | 'natural' | 'black';
  onFlip: () => void;
}

export function IPhoneBack({ color, onFlip }: IPhoneBackProps) {
  return (
    <div
      className={`iphone-back-chassis ${color}`}
      onClick={onFlip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onFlip();
      }}
      aria-label="Back of iPhone 17 Pro. Click to flip to screen."
    >
      {/* Side Hardware Buttons Visible on the Edge */}
      <div className="hardware-pill-btn action-button" aria-hidden="true" />
      <div className="hardware-pill-btn vol-up" aria-hidden="true" />
      <div className="hardware-pill-btn vol-down" aria-hidden="true" />
      <div className="hardware-pill-btn side-power" aria-hidden="true" />

      {/* Main Chassis Shell */}
      <div className="iphone-chassis-shell">
        {/* Top Wide Horizontal Camera Visor Plateau (iPhone 17/18 Pro Signature Design) */}
        <div className="camera-visor-plateau">
          <div className="visor-bevel-rim">
            <div className="visor-gloss-plate">
              {/* Left Column: 2 Stacked Sapphire Lenses */}
              <div className="visor-lens-column-left">
                <div className="sapphire-lens-assembly">
                  <div className="lens-titanium-ring">
                    <div className="lens-aperture-core">
                      <span className="lens-concentric-groove" />
                      <span className="lens-reflection-highlight" />
                      <span className="lens-pupil-depth" />
                    </div>
                  </div>
                </div>

                <div className="sapphire-lens-assembly">
                  <div className="lens-titanium-ring">
                    <div className="lens-aperture-core">
                      <span className="lens-concentric-groove" />
                      <span className="lens-reflection-highlight" />
                      <span className="lens-pupil-depth" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Center: 1 Large Sapphire Telephoto Lens */}
              <div className="visor-lens-center">
                <div className="sapphire-lens-assembly lens-center-large">
                  <div className="lens-titanium-ring">
                    <div className="lens-aperture-core">
                      <span className="lens-concentric-groove" />
                      <span className="lens-reflection-highlight" />
                      <span className="lens-pupil-depth" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: True Tone Flash, LiDAR Scanner & Mic */}
              <div className="visor-modules-right">
                <div className="truetone-flash-disc">
                  <div className="flash-amber-diode" />
                  <div className="flash-cool-diode" />
                </div>

                <div className="mic-pinhole-dot" />

                <div className="lidar-scanner-lens">
                  <div className="lidar-depth-optic" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Two-Tone Satin Frosted Glass Panel */}
        <div className="lower-matte-glass-panel">
          {/* Centered Subtle Apple Logo */}
          <div className="apple-logo-badge">
            <AppleLogoIcon size={52} className="apple-logo-svg" />
          </div>

          <div className="flip-back-hint">
            <span>Click to flip to screen</span>
          </div>
        </div>

        {/* Antenna Slit Bands at Bottom Corners */}
        <div className="antenna-slit-band slit-left" aria-hidden="true" />
        <div className="antenna-slit-band slit-right" aria-hidden="true" />
      </div>
    </div>
  );
}
