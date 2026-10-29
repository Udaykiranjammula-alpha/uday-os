export type AppId =
  | 'about'
  | 'projects'
  | 'github'
  | 'linkedin'
  | 'instagram'
  | 'skills'
  | 'resume'
  | 'contact'
  | 'education'
  | 'achievements'
  | 'terminal'
  | 'settings';

export type Project = {
  id: string;
  title: string;
  category: string;
  summary: string;
  detail: string;
  stack: string[];
  repo: string;
  demo?: string;
  accent: string;
  features: string[];
  architecture: string[];
  screenshots: string[];
};

export const profile = {
  name: 'Uday Kiran Jammula',
  role: 'B.Tech student · Developer',
  tagline: 'One device. My entire world.',
  bio: 'I build thoughtful software at the intersection of web experiences, intelligent systems, and connected devices.',
  location: 'India',
  university: 'KL University',
  github: 'https://github.com/Udaykiranjammula-alpha',
  linkedin: 'https://www.linkedin.com/in/uday-kiran-jammula-a79982376/',
  instagram: 'https://www.instagram.com/udaykiran.jammula?xtok=MTA2b2I5eWczaDN0Mw==',
  email: 'jammulaudaykiran12@gmail.com',
  resumeUrl: '',
};

export const projects: Project[] = [
  {
    id: 'hospital-management',
    title: 'Hospital Management System',
    category: 'Web Development',
    summary: 'A focused web application for organizing hospital workflows.',
    detail: 'A configurable hospital operations experience with room to expand into richer patient, staff, and appointment workflows.',
    stack: ['React', 'TypeScript', 'Web'],
    repo: 'https://github.com/Udaykiranjammula-alpha/hospital-management-system',
    demo: 'https://hospital-management-system-msz2.vercel.app/',
    accent: '#21d4fd',
    features: ['Workflow-first interface', 'Responsive dashboard surfaces', 'Deployable web experience'],
    architecture: ['Client UI', 'Workflow state', 'Deployable web app'],
    screenshots: [],
  },
  {
    id: 'esp32-ml',
    title: 'ESP32 Distributed ML Accelerator',
    category: 'Embedded Systems',
    summary: 'Exploration of distributed inference across connected microcontrollers.',
    detail: 'A hardware-oriented project exploring how two ESP32 nodes can coordinate machine-learning workloads while keeping communication costs visible.',
    stack: ['ESP32', 'C/C++', 'Machine Learning'],
    repo: 'https://github.com/Udaykiranjammula-alpha/esp32-distributed-ml-accelerator',
    accent: '#a78bfa',
    features: ['Two-node architecture', 'Embedded inference experiments', 'Communication-aware design'],
    architecture: ['ESP32 node A', 'Wireless transport', 'ESP32 node B'],
    screenshots: [],
  },
  {
    id: 'nexus-presence',
    title: 'NEXUS-PRESENCE',
    category: 'Embedded Systems',
    summary: 'Wi-Fi-based presence and movement visualization concept.',
    detail: 'A multi-node connected-device project focused on turning presence signals into an understandable visual experience.',
    stack: ['ESP32', 'Wi-Fi', 'Visualization'],
    repo: 'https://github.com/Udaykiranjammula-alpha/NEXUS-PRESENCE',
    accent: '#f97316',
    features: ['Multi-node sensing', 'Live visualization direction', 'Clear technical limitations'],
    architecture: ['Presence sensors', 'Wi-Fi messages', 'Visualization layer'],
    screenshots: [],
  },
];

export const skills = [
  ['Languages', 'Python', 'C / C++', 'JavaScript', 'TypeScript'],
  ['Frontend', 'React', 'Responsive UI', 'Accessibility', 'Motion design'],
  ['Systems', 'ESP32', 'Wi-Fi devices', 'Git', 'GitHub'],
  ['Exploring', 'AI / ML', 'Android', 'Developer tools', 'Rust'],
];

export const education = [
  { title: 'B.Tech', institution: 'KL University', detail: 'Configured education record' },
];

export const achievements: Array<{ title: string; detail: string }> = [];

export const curatedPosts = [
  { title: 'Systems thinking', detail: 'Exploring how software, hardware, and interfaces can make technical ideas feel human.' },
  { title: 'Build in public', detail: 'Selected creative work is curated here instead of being scraped from social platforms.' },
];

export const appMeta: Record<AppId, { label: string; short: string; color: string }> = {
  about: { label: 'About Me', short: 'ME', color: '#21d4fd' },
  projects: { label: 'Projects', short: 'PR', color: '#8b5cf6' },
  github: { label: 'GitHub', short: 'GH', color: '#24292f' },
  linkedin: { label: 'LinkedIn', short: 'in', color: '#0a66c2' },
  instagram: { label: 'Instagram', short: 'IG', color: '#e1306c' },
  skills: { label: 'Skills', short: 'SK', color: '#f59e0b' },
  resume: { label: 'Resume', short: 'CV', color: '#ef4444' },
  contact: { label: 'Contact', short: '@', color: '#10b981' },
  education: { label: 'Education', short: 'ED', color: '#14b8a6' },
  achievements: { label: 'Achievements', short: '★', color: '#eab308' },
  terminal: { label: 'Terminal', short: '>_', color: '#111827' },
  settings: { label: 'Settings', short: '⚙', color: '#64748b' },
};
