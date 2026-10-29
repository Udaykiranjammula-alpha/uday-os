import type { AppId, AppMeta } from '../types';

export const appMeta: Record<AppId, AppMeta> = {
  about: { label: 'About Me', short: 'ME', color: '#21d4fd' },
  projects: { label: 'Projects', short: 'PR', color: '#8b5cf6', badge: '4' },
  github: { label: 'GitHub', short: 'GH', color: '#24292f' },
  linkedin: { label: 'LinkedIn', short: 'in', color: '#0a66c2' },
  instagram: { label: 'Gallery', short: 'IG', color: '#e1306c' },
  skills: { label: 'Skills', short: 'SK', color: '#f59e0b' },
  resume: { label: 'Resume', short: 'CV', color: '#ef4444' },
  contact: { label: 'Contact', short: '@', color: '#10b981', badge: '1' },
  education: { label: 'Education', short: 'ED', color: '#14b8a6' },
  achievements: { label: 'Milestones', short: '★', color: '#eab308' },
  notes: { label: 'Notes', short: 'NT', color: '#ec4899', badge: '3' },
  terminal: { label: 'Terminal', short: '>_', color: '#111827' },
  settings: { label: 'Settings', short: '⚙', color: '#64748b' },
};
