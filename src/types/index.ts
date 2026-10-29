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
  | 'settings'
  | 'notes';

export type ProjectCategory =
  | 'All'
  | 'Web Development'
  | 'Artificial Intelligence'
  | 'Embedded Systems'
  | 'Developer Tools';

export type ProjectArchitectureStep = {
  step: string;
  detail: string;
};

export type ProjectVisual = {
  title: string;
  type: 'diagram' | 'code' | 'metric';
  content: string;
  caption: string;
};

export type Project = {
  id: string;
  title: string;
  category: 'Web Development' | 'Artificial Intelligence' | 'Embedded Systems' | 'Developer Tools';
  summary: string;
  problem: string;
  solution: string;
  features: string[];
  stack: string[];
  repo: string;
  demo?: string;
  accent: string;
  status: string;
  architecture: ProjectArchitectureStep[];
  contributions: string[];
  challenges: string;
  visuals: ProjectVisual[];
};

export type Profile = {
  name: string;
  role: string;
  headline: string;
  tagline: string;
  bio: string;
  degree: string;
  university: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  instagram: string;
  resumeUrl: string;
  interests: string[];
  careerGoals: string;
  specializations: string[];
  values: string[];
};

export type SkillLevel = 'Proficient' | 'Project Experience' | 'Practicing' | 'Exploring';

export type SkillItem = {
  name: string;
  level: SkillLevel;
  context: string;
};

export type SkillCategory = {
  category: string;
  description: string;
  items: SkillItem[];
};

export type EducationEntry = {
  degree: string;
  institution: string;
  duration: string;
  detail: string;
  relevantCoursework: string[];
  projectsSummary: string;
};

export type AchievementEntry = {
  title: string;
  category: 'Hardware' | 'Software' | 'Milestone' | 'Academic';
  date: string;
  detail: string;
  verificationBadge: string;
};

export type NoteEntry = {
  id: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string[];
};

export type CuratedPost = {
  id: string;
  title: string;
  tag: string;
  date: string;
  detail: string;
  stats?: { likes: number; comments: number };
};

export type AppMeta = {
  label: string;
  short: string;
  color: string;
  badge?: string | number;
};

export type Screen =
  | { kind: 'home' }
  | { kind: 'app'; app: AppId }
  | { kind: 'project'; project: Project }
  | { kind: 'demo'; project: Project }
  | { kind: 'note'; note: NoteEntry };

export type BootPhase = 'boot' | 'locked' | 'ready';
export type ThemeMode = 'dark' | 'light';
export type WallpaperStyle = 'graphite' | 'violet' | 'cyan';

export type GitHubRepo = {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  updated_at: string;
};
