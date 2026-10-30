import React from 'react';
import { motion } from 'framer-motion';
import { IPhoneBack } from './IPhoneBack';
import { IPhoneScreenContent } from './IPhoneScreenContent';
import type { Project } from '../types';

interface IPhone3DProps {
  color: 'plum' | 'desert' | 'natural' | 'black';
  setColor: (c: 'plum' | 'desert' | 'natural' | 'black') => void;
  isFlipped: boolean;
  onFlip: () => void;
  currentRoute: string;
  onNavigate: (route: string) => void;
  activeProject: Project | null;
  setActiveProject: (p: Project | null) => void;
  isDemoOpen: boolean;
  setIsDemoOpen: (open: boolean) => void;
  time?: Date;
  onOpenSearch: () => void;
}

export function IPhone3D({
  color,
  setColor,
  isFlipped,
  onFlip,
  currentRoute,
  onNavigate,
  activeProject,
  setActiveProject,
  isDemoOpen,
  setIsDemoOpen,
  time,
  onOpenSearch,
}: IPhone3DProps) {
  return (
    <div className={`iphone-3d-scene ${color} ${isFlipped ? 'is-flipped' : ''}`}>
      {/* 3D Rotator Box */}
      <motion.div
        className="iphone-3d-object"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 26 }}
      >
        {/* ================= FRONT SIDE (SCREEN) ================= */}
        <div className="iphone-face iphone-face-front">
          {/* Titanium Hardware Rim */}
          <div className="iphone-bezel-rim">
            {/* Side Hardware Buttons */}
            <div className="hardware-pill-btn action-button" aria-hidden="true" />
            <div className="hardware-pill-btn vol-up" aria-hidden="true" />
            <div className="hardware-pill-btn vol-down" aria-hidden="true" />
            <div className="hardware-pill-btn side-power" aria-hidden="true" />

            {/* Inner AMOLED Screen Display */}
            <IPhoneScreenContent
              color={color}
              setColor={setColor}
              currentRoute={currentRoute}
              onNavigate={onNavigate}
              activeProject={activeProject}
              setActiveProject={setActiveProject}
              isDemoOpen={isDemoOpen}
              setIsDemoOpen={setIsDemoOpen}
              time={time}
              onOpenSearch={onOpenSearch}
            />
          </div>
        </div>

        {/* ================= BACK SIDE (TRIPLE CAMERA) ================= */}
        <div className="iphone-face iphone-face-back">
          <IPhoneBack color={color} onFlip={onFlip} />
        </div>
      </motion.div>
    </div>
  );
}
