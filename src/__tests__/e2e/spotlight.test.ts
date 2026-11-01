import { describe, it, expect, beforeEach } from 'vitest';
import { SpotlightEngineDriver } from './helpers/testDrivers';
import { projects } from '../../data/projects';
import { skillCategories } from '../../data/skills';

describe('Spotlight Search 2.0 with Math, Conversions & Shortcuts (Features 18 - 21)', () => {
  let spotlight: SpotlightEngineDriver;

  beforeEach(() => {
    spotlight = new SpotlightEngineDriver();
  });

  // ==========================================
  // Feature 18: Universal Deep Search Index
  // ==========================================
  describe('Feature 18: Universal Deep Search Index', () => {
    it('indexes and retrieves project repositories by title, summary, and tech stack', () => {
      const results = spotlight.search('FreeRTOS');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((r) => r.type === 'project' || r.type === 'skill')).toBe(true);

      const mlResults = spotlight.search('Hospital');
      expect(mlResults.length).toBeGreaterThan(0);
      expect(mlResults[0].title).toContain('Hospital');
    });

    it('indexes and retrieves technical skills by skill name and proficiency level', () => {
      const reactResults = spotlight.search('React');
      expect(reactResults.some((r) => r.type === 'skill')).toBe(true);

      const pythonResults = spotlight.search('Python');
      expect(pythonResults.some((r) => r.type === 'skill')).toBe(true);
    });

    it('returns empty array for empty or whitespace-only search queries', () => {
      expect(spotlight.search('')).toEqual([]);
      expect(spotlight.search('   ')).toEqual([]);
    });

    it('handles special punctuation and meta-characters without crashing regex parser', () => {
      const specialQueries = ['C++', 'Three.js', 'O(N)', 'ESP32 & CSI', '***', '[[['];
      specialQueries.forEach((q) => {
        expect(() => spotlight.search(q)).not.toThrow();
      });
    });

    it('is case-insensitive across all searchable domains', () => {
      const lower = spotlight.search('docker');
      const upper = spotlight.search('DOCKER');
      const mixed = spotlight.search('DocKEr');

      expect(lower.length).toBe(upper.length);
      expect(lower.length).toBe(mixed.length);
    });
  });

  // ==========================================
  // Feature 19: Natural Language Math Calculator
  // ==========================================
  describe('Feature 19: Natural Language Math Calculator', () => {
    it('evaluates basic arithmetic expressions (multiplication, addition, division, subtraction)', () => {
      const mul = spotlight.evaluateMath('128 * 64');
      expect(mul).not.toBeNull();
      expect(mul?.result).toBe('8,192');

      const add = spotlight.evaluateMath('45 + 55');
      expect(add?.result).toBe('100');

      const div = spotlight.evaluateMath('1000 / 8');
      expect(div?.result).toBe('125');

      const sub = spotlight.evaluateMath('250 - 42');
      expect(sub?.result).toBe('208');
    });

    it('evaluates square root expressions (e.g. sqrt(256), sqrt(144))', () => {
      const sqrt256 = spotlight.evaluateMath('sqrt(256)');
      expect(sqrt256).not.toBeNull();
      expect(sqrt256?.result).toBe('16');

      const sqrt144 = spotlight.evaluateMath('sqrt(144)');
      expect(sqrt144?.result).toBe('12');
    });

    it('evaluates exponentiation / power expressions (e.g. 2^16, 2^8)', () => {
      const pow16 = spotlight.evaluateMath('2^16');
      expect(pow16).not.toBeNull();
      expect(pow16?.result).toBe('65,536');

      const pow8 = spotlight.evaluateMath('2^8');
      expect(pow8?.result).toBe('256');
    });

    it('evaluates natural language percentage expressions (e.g. 15% of 80, 20% of 250)', () => {
      const pct1 = spotlight.evaluateMath('15% of 80');
      expect(pct1).not.toBeNull();
      expect(pct1?.result).toBe('12');

      const pct2 = spotlight.evaluateMath('20% of 250');
      expect(pct2?.result).toBe('50');
    });

    it('formats math result item with 1-click copy action payload in search results', () => {
      const results = spotlight.search('128 * 64');
      const mathItem = results.find((r) => r.type === 'math');

      expect(mathItem).toBeDefined();
      expect(mathItem?.title).toBe('8,192');
      expect(mathItem?.subtitle).toContain('128 * 64');
      expect(mathItem?.actionPayload).toBe('8,192');
    });

    it('gracefully returns null for invalid math expressions without throwing', () => {
      expect(spotlight.evaluateMath('128 + * 64')).toBeNull();
      expect(spotlight.evaluateMath('hello world')).toBeNull();
      expect(spotlight.evaluateMath('sqrt(-16)')).toBeNull();
    });
  });

  // ==========================================
  // Feature 20: Tech Unit & Currency Converter
  // ==========================================
  describe('Feature 20: Tech Unit & Currency Converter', () => {
    it('converts computer storage units accurately (e.g. 16 gb in mb, 1 tb in gb)', () => {
      const conv1 = spotlight.evaluateConversion('16 gb in mb');
      expect(conv1).not.toBeNull();
      expect(conv1?.result).toBe('16,384 MB');
      expect(conv1?.unit).toBe('MB');

      const conv2 = spotlight.evaluateConversion('1 tb in gb');
      expect(conv2?.result).toBe('1,024 GB');
    });

    it('converts frame latency to target FPS refresh rate (e.g. 16.67 ms in fps, 100 ms in fps)', () => {
      const convFps = spotlight.evaluateConversion('16.67 ms in fps');
      expect(convFps).not.toBeNull();
      expect(convFps?.result).toBe('60 FPS');

      const convSlow = spotlight.evaluateConversion('100 ms in fps');
      expect(convSlow?.result).toBe('10 FPS');
    });

    it('converts annual compensation benchmark into dual monthly USD and INR equivalents', () => {
      const salaryConv = spotlight.evaluateConversion('salary 150k');
      expect(salaryConv).not.toBeNull();
      expect(salaryConv?.title).toContain('$150k/yr');
      expect(salaryConv?.result).toContain('Lakhs INR');
      expect(salaryConv?.result).toContain('$12500/mo');
    });

    it('converts USD currency to pegged INR rate (e.g. 100 usd in inr)', () => {
      const curr = spotlight.evaluateConversion('100 usd in inr');
      expect(curr).not.toBeNull();
      expect(curr?.result).toContain('8,350 INR');
    });

    it('is resilient to spacing and capitalization in conversion queries', () => {
      const c1 = spotlight.evaluateConversion('  16   GB   in   MB  ');
      const c2 = spotlight.evaluateConversion('16 gb in mb');
      expect(c1?.result).toBe(c2?.result);
    });
  });

  // ==========================================
  // Feature 21: Direct App Action Shortcuts
  // ==========================================
  describe('Feature 21: Direct App Action Shortcuts', () => {
    it('returns direct Camera action shortcut for "take photo" and "camera"', () => {
      const act1 = spotlight.evaluateActionShortcuts('take photo');
      expect(act1).not.toBeNull();
      expect(act1?.route).toBe('camera');

      const act2 = spotlight.evaluateActionShortcuts('camera');
      expect(act2?.route).toBe('camera');
    });

    it('returns direct Recruiter Email action shortcut for "hire" and "email"', () => {
      const mailAct = spotlight.evaluateActionShortcuts('hire');
      expect(mailAct).not.toBeNull();
      expect(mailAct?.route).toBe('contact');
      expect(mailAct?.title).toContain('Email Uday Kiran');
    });

    it('returns direct Chassis Finish toggle action for "dark" and "orange"', () => {
      const darkAct = spotlight.evaluateActionShortcuts('dark');
      expect(darkAct).not.toBeNull();
      expect(darkAct?.actionPayload).toBe('titanium-black');

      const orangeAct = spotlight.evaluateActionShortcuts('orange');
      expect(orangeAct).not.toBeNull();
      expect(orangeAct?.actionPayload).toBe('titanium-desert');
    });

    it('returns direct Torch toggle action for "torch" and "flashlight"', () => {
      const torchAct = spotlight.evaluateActionShortcuts('torch');
      expect(torchAct).not.toBeNull();
      expect(torchAct?.actionPayload).toBe('toggle-torch');
    });

    it('returns direct Music playback shortcut for "play music"', () => {
      const musicAct = spotlight.evaluateActionShortcuts('play music');
      expect(musicAct).not.toBeNull();
      expect(musicAct?.route).toBe('music');
    });
  });
});
