import type { GitHubRepo } from '../types';

const CACHE_KEY = 'uday-os-github-cache-v2';
const CACHE_TIME_KEY = 'uday-os-github-cache-time';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes cache

export type GitHubFetchResult = {
  repos: GitHubRepo[];
  source: 'network' | 'cache';
  error?: string;
  isRateLimited?: boolean;
};

// High-quality fallback data in case GitHub rate limits unauthenticated requests
export const fallbackRepos: GitHubRepo[] = [
  {
    name: 'hospital-management-system',
    description: 'A focused, responsive web application for managing clinic triage, patient queues, and appointments.',
    language: 'TypeScript',
    stargazers_count: 5,
    forks_count: 2,
    html_url: 'https://github.com/Udaykiranjammula-alpha/hospital-management-system',
    updated_at: '2026-10-15T10:00:00Z',
  },
  {
    name: 'esp32-distributed-ml-accelerator',
    description: 'Two-node ESP32 pipeline exploring distributed micro-inference with low-latency SPI/Wi-Fi transport.',
    language: 'C++',
    stargazers_count: 8,
    forks_count: 3,
    html_url: 'https://github.com/Udaykiranjammula-alpha/esp32-distributed-ml-accelerator',
    updated_at: '2026-09-28T14:30:00Z',
  },
  {
    name: 'NEXUS-PRESENCE',
    description: 'Wi-Fi CSI/RSSI human presence detection and real-time spatial movement visualization.',
    language: 'C++',
    stargazers_count: 6,
    forks_count: 1,
    html_url: 'https://github.com/Udaykiranjammula-alpha/NEXUS-PRESENCE',
    updated_at: '2026-09-12T09:15:00Z',
  },
  {
    name: 'uday-os',
    description: 'Interactive virtual smartphone developer portfolio and digital operating system.',
    language: 'TypeScript',
    stargazers_count: 12,
    forks_count: 4,
    html_url: 'https://github.com/Udaykiranjammula-alpha',
    updated_at: '2026-10-29T12:00:00Z',
  },
];

export async function fetchUserRepos(username: string = 'Udaykiranjammula-alpha', forceRefresh: boolean = false): Promise<GitHubFetchResult> {
  if (!forceRefresh) {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
      if (cached && cachedTime) {
        const age = Date.now() - parseInt(cachedTime, 10);
        if (age < CACHE_TTL_MS) {
          const parsed = JSON.parse(cached) as GitHubRepo[];
          if (Array.isArray(parsed) && parsed.length > 0) {
            return { repos: parsed, source: 'cache' };
          }
        }
      }
    } catch {
      // Local storage read error; fall through to network
    }
  }

  try {
    const url = `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=10`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    }).finally(() => {
      clearTimeout(timer);
    });

    if (response.status === 403 || response.status === 429) {
      // Rate limited
      const cached = localStorage.getItem(CACHE_KEY);
      const parsed = cached ? (JSON.parse(cached) as GitHubRepo[]) : fallbackRepos;
      return {
        repos: parsed,
        source: 'cache',
        isRateLimited: true,
        error: 'GitHub unauthenticated API rate limit reached. Displaying cached repository data.',
      };
    }

    if (!response.ok) {
      throw new Error(`GitHub API returned status ${response.status}`);
    }

    const data = await response.json() as GitHubRepo[];
    const sanitized = data.map((r) => ({
      name: r.name,
      description: r.description || null,
      language: r.language || null,
      stargazers_count: r.stargazers_count || 0,
      forks_count: r.forks_count || 0,
      html_url: r.html_url,
      updated_at: r.updated_at,
    }));

    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(sanitized));
      localStorage.setItem(CACHE_TIME_KEY, String(Date.now()));
    } catch {
      // Ignore quota error
    }

    return { repos: sanitized, source: 'network' };
  } catch (err) {
    const cached = localStorage.getItem(CACHE_KEY);
    const parsed = cached ? (JSON.parse(cached) as GitHubRepo[]) : fallbackRepos;
    return {
      repos: parsed,
      source: 'cache',
      error: err instanceof Error ? err.message : 'Network error fetching repositories.',
    };
  }
}
