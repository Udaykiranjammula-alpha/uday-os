import { mathEvaluator } from './mathEvaluator';
import { projects } from '../data/projects';
import { skillCategories } from '../data/skills';

export interface SpotlightItem {
  id: string;
  type: 'math' | 'conversion' | 'action' | 'app' | 'project' | 'skill';
  title: string;
  subtitle: string;
  route?: string;
  actionPayload?: string;
  category?: string;
}

export const spotlightAppsList: Array<{ id: string; name: string; subtitle: string; route: string; keywords: string[] }> = [
  { id: 'app-xcode', name: 'Xcode Cloud', subtitle: 'In-Phone Compiler & LeetCode IDE', route: 'xcode', keywords: ['compiler', 'code', 'ide', 'python', 'algorithm'] },
  { id: 'app-leetcode', name: 'LeetCode', subtitle: '184+ Optimized DSA Solutions', route: 'leetcode', keywords: ['dsa', 'algorithms', 'two sum', 'lru cache'] },
  { id: 'app-fitness', name: 'Fitness', subtitle: '3D Activity Rings & Gyro Telemetry', route: 'fitness', keywords: ['activity', 'rings', 'workout', 'health', 'medals'] },
  { id: 'app-embedded', name: 'Embedded Systems Lab', subtitle: 'ESP32 Dual-Core FreeRTOS & Oscilloscope', route: 'embedded-lab', keywords: ['esp32', 'freertos', 'oscilloscope', 'spi', 'crc', 'systems'] },
  { id: 'app-genmoji', name: 'Genmoji Studio', subtitle: 'iOS 18 Image Playground & AI Stickers', route: 'genmoji', keywords: ['genmoji', 'ai', 'stickers', 'diffusion', 'apple intelligence'] },
  { id: 'app-camera', name: 'Camera', subtitle: '48MP Fusion Pro Camera & Controls', route: 'camera', keywords: ['camera', 'photo', 'video', 'lens'] },
  { id: 'app-photos', name: 'Photos', subtitle: 'Gallery & Architecture Wallpapers', route: 'photos', keywords: ['photos', 'gallery', 'wallpaper', 'media'] },
  { id: 'app-clock', name: 'Clock', subtitle: 'World Clock, Stopwatch & Timer', route: 'clock', keywords: ['stopwatch', 'timer', 'alarm', 'time'] },
  { id: 'app-weather', name: 'Weather', subtitle: 'Atmospheric Physics & Weather Strip', route: 'weather', keywords: ['weather', 'forecast', 'rain', 'temperature'] },
  { id: 'app-calculator', name: 'Calculator', subtitle: 'Scientific & Tech Unit Converter', route: 'calculator', keywords: ['calculator', 'calc', 'math', 'convert'] },
  { id: 'app-notes', name: 'Notes', subtitle: 'Engineering Notes & CRUD Storage', route: 'notes', keywords: ['notes', 'memo', 'text', 'markdown'] },
  { id: 'app-terminal', name: 'Terminal', subtitle: 'Zsh Unix Shell & Live CLI Tools', route: 'terminal', keywords: ['cli', 'bash', 'zsh', 'shell', 'git'] },
  { id: 'app-music', name: 'Music', subtitle: 'Apple Music & Ambient Lo-Fi Beats', route: 'music', keywords: ['audio', 'music', 'lo-fi', 'beats', 'soundtrack'] },
  { id: 'app-messages', name: 'Messages', subtitle: 'iMessage Chat Stream & Genmoji Stickers', route: 'messages', keywords: ['chat', 'imessage', 'sms', 'text'] },
  { id: 'app-maps', name: 'Maps', subtitle: 'Interactive Global Navigation Map', route: 'maps', keywords: ['map', 'location', 'gps', 'navigation'] },
  { id: 'app-settings', name: 'Settings', subtitle: 'iOS 18 Titanium Finishes & System Config', route: 'settings', keywords: ['settings', 'preferences', 'chassis', 'appearance'] },
  { id: 'app-appstore', name: 'App Store', subtitle: 'Curated Software Portfolio Catalog', route: 'appstore', keywords: ['store', 'download', 'catalog', 'apps'] },
];

export class SpotlightIndex {
  public search(query: string): SpotlightItem[] {
    if (!query) return [];
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results: SpotlightItem[] = [];

    // 1. Math calculation
    const mathRes = mathEvaluator.evaluateMath(query);
    if (mathRes) {
      results.push({
        id: 'math-eval',
        type: 'math',
        title: mathRes.result,
        subtitle: `= ${mathRes.expression} (Tap to copy)`,
        actionPayload: mathRes.result,
      });
    }

    // 2. Unit conversion
    const convRes = mathEvaluator.evaluateConversion(query);
    if (convRes) {
      results.push({
        id: 'conv-eval',
        type: 'conversion',
        title: convRes.result,
        subtitle: convRes.title,
        actionPayload: convRes.result,
      });
    }

    // 3. Direct Action Shortcut
    const actionRes = mathEvaluator.evaluateActionShortcuts(query);
    if (actionRes) {
      results.push(actionRes);
    }

    // 4. Apps Matching
    spotlightAppsList.forEach((app) => {
      if (
        app.name.toLowerCase().includes(q) ||
        app.subtitle.toLowerCase().includes(q) ||
        app.keywords.some((k) => k.toLowerCase().includes(q))
      ) {
        results.push({
          id: app.id,
          type: 'app',
          title: app.name,
          subtitle: app.subtitle,
          route: app.route,
        });
      }
    });

    // 5. Projects Search
    projects.forEach((p) => {
      if (
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.stack.some((s) => s.toLowerCase().includes(q))
      ) {
        results.push({
          id: `proj-${p.id}`,
          type: 'project',
          title: p.title,
          subtitle: p.summary,
          route: `projects/${p.id}`,
        });
      }
    });

    // 6. Skills Search
    skillCategories.forEach((cat) => {
      cat.items.forEach((item) => {
        if (
          item.name.toLowerCase().includes(q) ||
          item.context.toLowerCase().includes(q)
        ) {
          results.push({
            id: `skill-${item.name}`,
            type: 'skill',
            title: item.name,
            subtitle: `${cat.category} · ${item.level}`,
            route: 'skills',
          });
        }
      });
    });

    return results;
  }
}

export const spotlightIndex = new SpotlightIndex();
