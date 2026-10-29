import React from 'react';
import { motion } from 'framer-motion';
import {
  CircleUserRound,
  BriefcaseBusiness,
  Github,
  Linkedin,
  Zap,
  BookOpen,
  Mail,
  Sparkles,
  Terminal as TerminalIcon,
  Settings,
  Image as ImageIcon,
  StickyNote,
  type LucideIcon,
} from 'lucide-react';
import type { AppId } from '../types';
import { appMeta } from '../data/appMeta';

const iconComponentMap: Record<AppId, LucideIcon> = {
  about: CircleUserRound,
  projects: BriefcaseBusiness,
  github: Github,
  linkedin: Linkedin,
  instagram: ImageIcon,
  skills: Zap,
  resume: BookOpen,
  contact: Mail,
  education: BookOpen,
  achievements: Sparkles,
  notes: StickyNote,
  terminal: TerminalIcon,
  settings: Settings,
};

interface AppIconProps {
  id: AppId;
  onOpen: (id: AppId) => void;
  isDock?: boolean;
}

export function AppIcon({ id, onOpen, isDock = false }: AppIconProps) {
  const meta = appMeta[id];
  const Icon = iconComponentMap[id] || CircleUserRound;

  return (
    <motion.button
      type="button"
      className={`app-icon-button ${isDock ? 'dock-icon' : ''}`}
      onClick={() => onOpen(id)}
      whileHover={{ scale: 1.08, y: -4 }}
      whileTap={{ scale: 0.92 }}
      aria-label={`Open ${meta.label}${meta.badge ? ` (${meta.badge} notifications)` : ''}`}
    >
      <div className="icon-tile" style={{ background: meta.color }}>
        <Icon size={isDock ? 22 : 25} strokeWidth={1.9} />
        {meta.badge && !isDock && (
          <span className="icon-badge" aria-label={`${meta.badge} items`}>
            {meta.badge}
          </span>
        )}
      </div>
      {!isDock && <span className="icon-label">{meta.label}</span>}
    </motion.button>
  );
}
