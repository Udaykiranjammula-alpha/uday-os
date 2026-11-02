import { describe, it, expect, beforeEach } from 'vitest';
import { codeRunner, FLAGSHIP_PROBLEMS } from '../services/codeRunner';
import { liveActivity } from '../services/liveActivity';

describe('Milestone 2: Xcode Cloud Compiler & LeetCode Playground Implementation', () => {
  beforeEach(() => {
    liveActivity.resetAll();
    liveActivity.clearAlgorithm();
  });

  // =========================================================================
  // 1. Two Sum Flagship Algorithm Verification
  // =========================================================================
  describe('Flagship Algorithm: Two Sum', () => {
    it('solves Two Sum with O(N) Hash Map method', () => {
      const { result, steps } = codeRunner.twoSum([2, 7, 11, 15], 9, 'hashmap');
      expect(result).toEqual([0, 1]);
      expect(steps).toBeLessThanOrEqual(4);
    });

    it('solves Two Sum with O(N^2) Brute Force method and produces identical result with higher steps', () => {
      const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const target = 19;
      const hashRes = codeRunner.twoSum(nums, target, 'hashmap');
      const bruteRes = codeRunner.twoSum(nums, target, 'bruteforce');

      expect(hashRes.result).toEqual([8, 9]);
      expect(bruteRes.result).toEqual([8, 9]);
      expect(bruteRes.steps).toBeGreaterThan(hashRes.steps);
    });

    it('returns empty array when target is not reachable', () => {
      const { result } = codeRunner.twoSum([1, 2, 3], 99, 'hashmap');
      expect(result).toEqual([]);
    });

    it('handles negative numbers and zero in input array', () => {
      const { result } = codeRunner.twoSum([-3, 4, 3, 90], 0, 'hashmap');
      expect(result).toEqual([0, 2]);
    });
  });

  // =========================================================================
  // 2. Valid Parentheses Flagship Algorithm Verification
  // =========================================================================
  describe('Flagship Algorithm: Valid Parentheses', () => {
    it('validates simple and mixed balanced bracket sequences', () => {
      expect(codeRunner.isValidParentheses('()')).toBe(true);
      expect(codeRunner.isValidParentheses('()[]{}')).toBe(true);
      expect(codeRunner.isValidParentheses('{[]}')).toBe(true);
      expect(codeRunner.isValidParentheses('((({{{[[[]]]}}})))')).toBe(true);
    });

    it('rejects mismatched and interleaved bracket sequences', () => {
      expect(codeRunner.isValidParentheses('(]')).toBe(false);
      expect(codeRunner.isValidParentheses('([)]')).toBe(false);
      expect(codeRunner.isValidParentheses('(')).toBe(false);
      expect(codeRunner.isValidParentheses(']')).toBe(false);
      expect(codeRunner.isValidParentheses('((((')).toBe(false);
    });

    it('handles empty string as valid', () => {
      expect(codeRunner.isValidParentheses('')).toBe(true);
    });
  });

  // =========================================================================
  // 3. LRU Cache Flagship Algorithm Verification
  // =========================================================================
  describe('Flagship Algorithm: LRU Cache', () => {
    it('evicts least recently used item when capacity is exceeded', () => {
      const lru = codeRunner.createLRUCache(2);
      lru.put(1, 1);
      lru.put(2, 2);
      expect(lru.get(1)).toBe(1); // accesses 1 -> 2 becomes LRU
      lru.put(3, 3); // evicts key 2
      expect(lru.get(2)).toBe(-1); // key 2 evicted
      expect(lru.get(3)).toBe(3);
      expect(lru.get(1)).toBe(1);
    });

    it('updates value and marks key as recently used on overwrite', () => {
      const lru = codeRunner.createLRUCache(2);
      lru.put(1, 10);
      lru.put(2, 20);
      lru.put(1, 100); // overwrite key 1
      lru.put(3, 30); // should evict 2, not 1
      expect(lru.get(1)).toBe(100);
      expect(lru.get(2)).toBe(-1);
      expect(lru.get(3)).toBe(30);
    });

    it('returns -1 for non-existent keys', () => {
      const lru = codeRunner.createLRUCache(3);
      expect(lru.get(999)).toBe(-1);
    });
  });

  // =========================================================================
  // 4. Binary Search Flagship Algorithm Verification
  // =========================================================================
  describe('Flagship Algorithm: Binary Search', () => {
    it('finds target index in sorted array in O(log N) time', () => {
      const nums = [-1, 0, 3, 5, 9, 12];
      expect(codeRunner.binarySearch(nums, 9)).toBe(4);
      expect(codeRunner.binarySearch(nums, -1)).toBe(0);
      expect(codeRunner.binarySearch(nums, 12)).toBe(5);
      expect(codeRunner.binarySearch(nums, 3)).toBe(2);
    });

    it('returns -1 when target does not exist in array', () => {
      const nums = [-1, 0, 3, 5, 9, 12];
      expect(codeRunner.binarySearch(nums, 2)).toBe(-1);
      expect(codeRunner.binarySearch(nums, 100)).toBe(-1);
      expect(codeRunner.binarySearch(nums, -99)).toBe(-1);
    });

    it('handles single-element array correctly', () => {
      expect(codeRunner.binarySearch([5], 5)).toBe(0);
      expect(codeRunner.binarySearch([5], 1)).toBe(-1);
    });
  });

  // =========================================================================
  // 5. Merge Intervals Flagship Algorithm Verification
  // =========================================================================
  describe('Flagship Algorithm: Merge Intervals', () => {
    it('merges overlapping interval ranges correctly', () => {
      const intervals = [
        [1, 3],
        [2, 6],
        [8, 10],
        [15, 18],
      ];
      expect(codeRunner.mergeIntervals(intervals)).toEqual([
        [1, 6],
        [8, 10],
        [15, 18],
      ]);
    });

    it('handles touching edges and fully nested intervals', () => {
      expect(codeRunner.mergeIntervals([[1, 4], [4, 5]])).toEqual([[1, 5]]);
      expect(codeRunner.mergeIntervals([[1, 10], [2, 3], [4, 8]])).toEqual([[1, 10]]);
    });

    it('handles unsorted input intervals', () => {
      const unsorted = [
        [8, 10],
        [1, 3],
        [15, 18],
        [2, 6],
      ];
      expect(codeRunner.mergeIntervals(unsorted)).toEqual([
        [1, 6],
        [8, 10],
        [15, 18],
      ]);
    });

    it('returns empty array when input is empty', () => {
      expect(codeRunner.mergeIntervals([])).toEqual([]);
    });
  });

  // =========================================================================
  // 6. Sandboxed Execution Engine Verification
  // =========================================================================
  describe('Sandboxed Execution Engine', () => {
    it('executes valid JavaScript and returns typed ExecutionResult with stdout', async () => {
      const jsCode = `
        const sum = input.nums.reduce((acc, n) => acc + n, 0);
        console.log("Calculated sum:", sum);
        return sum;
      `;
      const result = await codeRunner.runSandboxed(jsCode, 'javascript', { nums: [10, 20, 30, 40] });

      expect(result.success).toBe(true);
      expect(result.output).toBe(100);
      expect(result.stdout.length).toBeGreaterThan(0);
      expect(result.stdout[0]).toContain('Calculated sum: 100');
      expect(result.executionTimeUs).toBeGreaterThanOrEqual(1);
      expect(result.memoryBytesEstimate).toBeGreaterThan(0);
    });

    it('captures multiple console.log stdout lines in order', async () => {
      const jsCode = `
        console.log("Line 1: A18 Pro JIT init");
        console.log("Line 2: Allocating heap buffer");
        console.log("Line 3: Execution finished");
        return true;
      `;
      const result = await codeRunner.runSandboxed(jsCode, 'javascript');

      expect(result.success).toBe(true);
      expect(result.stdout).toEqual([
        'Line 1: A18 Pro JIT init',
        'Line 2: Allocating heap buffer',
        'Line 3: Execution finished',
      ]);
    });

    it('gracefully catches JavaScript syntax errors without crashing', async () => {
      const brokenCode = `function broken( { return 123;`;
      const result = await codeRunner.runSandboxed(brokenCode, 'javascript');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.output).toBeNull();
    });

    it('gracefully catches JavaScript runtime exceptions without crashing', async () => {
      const crashCode = `
        const obj = null;
        return obj.nonExistent();
      `;
      const result = await codeRunner.runSandboxed(crashCode, 'javascript');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('executes Python simulation environment with stdout', async () => {
      const pyCode = `print("Running Two Sum in Python")\nreturn [0, 1]`;
      const result = await codeRunner.runSandboxed(pyCode, 'python', [0, 1]);

      expect(result.success).toBe(true);
      expect(result.stdout[0]).toContain('Python 3.12');
      expect(result.executionTimeUs).toBeGreaterThanOrEqual(1);
    });
  });

  // =========================================================================
  // 7. Dynamic Island Compiler Live Activity Integration
  // =========================================================================
  describe('Dynamic Island Compiler Integration', () => {
    it('dispatches compiler live activity with A18 Pro CPU gauge to Dynamic Island', () => {
      liveActivity.startAlgorithm('Two Sum (A18 Pro Engine)', 'O(N)');

      const islandAlgo = liveActivity.getAlgorithm();
      expect(islandAlgo.isRunning).toBe(true);
      expect(islandAlgo.algorithmName).toContain('Two Sum');
      expect(islandAlgo.timeComplexity).toBe('O(N)');
      expect(islandAlgo.passStatus).toBe('running');
    });

    it('updates Dynamic Island with microsecond runtime and pass status on completion', () => {
      liveActivity.startAlgorithm('LRU Cache', 'O(1)');
      liveActivity.completeAlgorithm(42, true, ['LRU Cache initialized', 'Eviction test passed']);

      const islandAlgo = liveActivity.getAlgorithm();
      expect(islandAlgo.isRunning).toBe(false);
      expect(islandAlgo.runtimeUs).toBe(42);
      expect(islandAlgo.passStatus).toBe('passed');
      expect(islandAlgo.stdoutLines.length).toBe(2);
      expect(islandAlgo.stdoutPreview).toBe('Eviction test passed');
    });
  });

  // =========================================================================
  // 8. Flagship Problems Catalog Integrity
  // =========================================================================
  describe('Flagship Problems Catalog Integrity', () => {
    it('provides all 5 flagship algorithm definitions with Python and JS templates', () => {
      expect(FLAGSHIP_PROBLEMS.length).toBe(5);
      const problemIds = FLAGSHIP_PROBLEMS.map((p) => p.id);
      expect(problemIds).toContain('two-sum');
      expect(problemIds).toContain('valid-parentheses');
      expect(problemIds).toContain('lru-cache');
      expect(problemIds).toContain('binary-search');
      expect(problemIds).toContain('merge-intervals');

      for (const p of FLAGSHIP_PROBLEMS) {
        expect(p.pythonTemplate.length).toBeGreaterThan(10);
        expect(p.jsTemplate.length).toBeGreaterThan(10);
        expect(p.testCases.length).toBeGreaterThanOrEqual(1);
        expect(p.sampleInput.length).toBeGreaterThan(0);
      }
    });
  });
});
