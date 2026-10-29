import { describe, it, expect } from 'vitest';
import { profile } from '../data/profile';
import { projects } from '../data/projects';
import { skillCategories } from '../data/skills';
import { educationList } from '../data/education';
import { achievementsList } from '../data/achievements';
import { appMeta } from '../data/appMeta';
import { fallbackRepos, fetchUserRepos } from '../services/github';

describe('UDAY OS Data Integrity & Schema Validation', () => {
  it('profile contains essential verified identity properties', () => {
    expect(profile.name).toBe('Uday Kiran Jammula');
    expect(profile.university).toBe('KL University');
    expect(profile.role).toContain('Developer');
    expect(profile.github).toMatch(/^https:\/\/github\.com\//);
    expect(profile.specializations.length).toBeGreaterThan(0);
    expect(profile.interests.length).toBeGreaterThan(0);
  });

  it('all projects have complete architectures, problem/solution, and valid repositories', () => {
    expect(projects.length).toBeGreaterThanOrEqual(3);
    projects.forEach((proj) => {
      expect(proj.title).toBeTruthy();
      expect(proj.category).toBeTruthy();
      expect(proj.summary).toBeTruthy();
      expect(proj.problem).toBeTruthy();
      expect(proj.solution).toBeTruthy();
      expect(proj.features.length).toBeGreaterThan(0);
      expect(proj.stack.length).toBeGreaterThan(0);
      expect(proj.architecture.length).toBeGreaterThan(0);
      expect(proj.visuals.length).toBeGreaterThan(0);
      expect(proj.repo).toMatch(/^https:\/\/github\.com\//);
      if (proj.demo) {
        expect(proj.demo).toMatch(/^https?:\/\//);
      }
    });
  });

  it('skill levels adhere strictly to qualitative descriptive tiers', () => {
    const validLevels = ['Proficient', 'Project Experience', 'Practicing', 'Exploring'];
    skillCategories.forEach((cat) => {
      expect(cat.items.length).toBeGreaterThan(0);
      cat.items.forEach((skill) => {
        expect(validLevels).toContain(skill.level);
        expect(skill.context).toBeTruthy();
      });
    });
  });

  it('education and achievements are verified without fake credentials', () => {
    expect(educationList.length).toBeGreaterThan(0);
    expect(educationList[0].institution).toBe('KL University');
    expect(achievementsList.length).toBeGreaterThan(0);
    achievementsList.forEach((ach) => {
      expect(ach.verificationBadge).toBeTruthy();
      expect(ach.date).toBeTruthy();
    });
  });

  it('appMeta covers all 13 primary OS applications', () => {
    const expectedApps = [
      'about',
      'projects',
      'github',
      'linkedin',
      'instagram',
      'skills',
      'resume',
      'contact',
      'education',
      'achievements',
      'notes',
      'terminal',
      'settings',
    ];
    expectedApps.forEach((appId) => {
      expect(appMeta[appId as keyof typeof appMeta]).toBeDefined();
      expect(appMeta[appId as keyof typeof appMeta].label).toBeTruthy();
      expect(appMeta[appId as keyof typeof appMeta].color).toBeTruthy();
    });
  });
});

describe('GitHub Service & Fallback Handling', () => {
  it('provides verified fallback repository metadata when offline or rate-limited', () => {
    expect(fallbackRepos.length).toBeGreaterThanOrEqual(3);
    fallbackRepos.forEach((repo) => {
      expect(repo.name).toBeTruthy();
      expect(repo.html_url).toMatch(/^https:\/\/github\.com\//);
      expect(repo.stargazers_count).toBeGreaterThanOrEqual(0);
    });
  });

  it('gracefully fetches or handles rate-limits without throwing uncaught exceptions', async () => {
    const result = await fetchUserRepos('Udaykiranjammula-alpha', false);
    expect(result).toBeDefined();
    expect(Array.isArray(result.repos)).toBe(true);
    expect(result.repos.length).toBeGreaterThan(0);
  });
});
