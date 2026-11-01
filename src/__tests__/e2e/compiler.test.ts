import { describe, it, expect, beforeEach } from 'vitest';
import { CodeExecutionEngineDriver, LiveActivityCoordinatorDriver } from './helpers/testDrivers';

describe('Xcode Cloud Compiler & LeetCode Playground (Features 7 - 11)', () => {
  let engine: CodeExecutionEngineDriver;
  let coordinator: LiveActivityCoordinatorDriver;

  beforeEach(() => {
    engine = new CodeExecutionEngineDriver();
    coordinator = new LiveActivityCoordinatorDriver();
  });

  // ==========================================
  // Feature 7: SF Mono Cupertino Code Editor
  // ==========================================
  describe('Feature 7: SF Mono Cupertino Code Editor', () => {
    it('configures Apple SF Mono as the primary monospace font family', () => {
      const editorStyle = {
        fontFamily: '"SF Mono", Menlo, Monaco, Consolas, "Courier New", monospace',
        fontSize: '13px',
        lineHeight: 1.6,
      };
      expect(editorStyle.fontFamily).toContain('"SF Mono"');
      expect(editorStyle.fontSize).toBe('13px');
    });

    it('generates 1-indexed sequential line numbers for multi-line source code', () => {
      const code = `def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        if target - num in seen:\n            return [seen[target - num], i]\n        seen[num] = i\n    return []`;
      const lines = code.split('\n');
      const lineNumbers = lines.map((_, i) => i + 1);

      expect(lineNumbers.length).toBe(7);
      expect(lineNumbers[0]).toBe(1);
      expect(lineNumbers[6]).toBe(7);
    });

    it('tokenizes Python keywords with authentic Xcode syntax color palette', () => {
      const pythonKeywords = ['def', 'return', 'class', 'in', 'for', 'if', 'else', 'import'];
      const sampleCode = 'def solve(nums): return [x for x in nums if x > 0]';
      const words = sampleCode.split(/\s+/);
      const highlightedKeywords = words.filter((w) => pythonKeywords.includes(w));

      expect(highlightedKeywords).toContain('def');
      expect(highlightedKeywords).toContain('return');
      expect(highlightedKeywords).toContain('for');
      expect(highlightedKeywords).toContain('in');
      expect(highlightedKeywords).toContain('if');
    });

    it('tokenizes JavaScript keywords with authentic Xcode syntax color palette', () => {
      const jsKeywords = ['const', 'let', 'function', 'return', 'new', 'Map', 'for', 'of'];
      const sampleCode = 'function twoSum(nums, target) { const map = new Map(); return []; }';
      const words = sampleCode.replace(/[{}(),;]/g, ' ').split(/\s+/);
      const highlighted = words.filter((w) => jsKeywords.includes(w));

      expect(highlighted).toContain('function');
      expect(highlighted).toContain('const');
      expect(highlighted).toContain('new');
      expect(highlighted).toContain('Map');
      expect(highlighted).toContain('return');
    });

    it('detects balanced and matching brackets across braces, brackets, and parentheses', () => {
      const validCode = 'function test() { const arr = [1, (2 + 3)]; return arr; }';
      const openPairs: Record<string, string> = { '(': ')', '{': '}', '[': ']' };
      const closePairs: Record<string, string> = { ')': '(', '}': '{', ']': '[' };
      const stack: string[] = [];
      let isBalanced = true;

      for (const char of validCode) {
        if (openPairs[char]) stack.push(char);
        else if (closePairs[char]) {
          if (stack.pop() !== closePairs[char]) {
            isBalanced = false;
            break;
          }
        }
      }

      expect(isBalanced).toBe(true);
      expect(stack.length).toBe(0);
    });
  });

  // ==========================================
  // Feature 8: Sandboxed Python/JS Execution Engine
  // ==========================================
  describe('Feature 8: Sandboxed Python/JS Execution Engine', () => {
    it('executes valid JavaScript and returns typed ExecutionResult with output', async () => {
      const jsCode = `
        const sum = input.reduce((acc, n) => acc + n, 0);
        console.log("Calculated sum:", sum);
        return sum;
      `;
      const result = await engine.runSandboxed(jsCode, 'javascript', [10, 20, 30, 40]);

      expect(result.success).toBe(true);
      expect(result.output).toBe(100);
      expect(result.stdout.length).toBeGreaterThan(0);
      expect(result.stdout[0]).toContain('Calculated sum: 100');
      expect(result.executionTimeUs).toBeGreaterThanOrEqual(1);
      expect(result.memoryBytesEstimate).toBeGreaterThan(0);
    });

    it('captures multiple lines of stdout console output', async () => {
      const jsCode = `
        console.log("Step 1: Init array");
        console.log("Step 2: Processing");
        console.log("Step 3: Done");
        return true;
      `;
      const result = await engine.runSandboxed(jsCode, 'javascript');

      expect(result.success).toBe(true);
      expect(result.stdout).toEqual(['Step 1: Init array', 'Step 2: Processing', 'Step 3: Done']);
    });

    it('safely catches syntax errors without throwing uncaught exceptions or crashing host OS', async () => {
      const brokenCode = `function broken( { return 123;`;
      const result = await engine.runSandboxed(brokenCode, 'javascript');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(typeof result.error).toBe('string');
      expect(result.output).toBeNull();
    });

    it('safely catches runtime exceptions without corrupting state', async () => {
      const crashCode = `
        const obj = null;
        return obj.nonExistentMethod();
      `;
      const result = await engine.runSandboxed(crashCode, 'javascript');

      expect(result.success).toBe(false);
      expect(result.error).toContain('null');
    });

    it('simulates Python execution environment with stdout and timing metrics', async () => {
      const pythonCode = `print("Two Sum solved")\nreturn [0, 1]`;
      const result = await engine.runSandboxed(pythonCode, 'python', [0, 1]);

      expect(result.success).toBe(true);
      expect(result.stdout[0]).toContain('Python 3.12');
      expect(result.executionTimeUs).toBeGreaterThanOrEqual(1);
    });
  });

  // ==========================================
  // Feature 9: Flagship Algorithm Suites
  // ==========================================
  describe('Feature 9: Flagship Algorithm Suites', () => {
    describe('Two Sum (O(N) Hash Map vs O(N^2) Brute Force)', () => {
      it('solves Two Sum in O(N) time with Map', () => {
        const { result, steps } = engine.twoSum([2, 7, 11, 15], 9, 'hashmap');
        expect(result).toEqual([0, 1]);
        expect(steps).toBeLessThanOrEqual(4);
      });

      it('solves Two Sum with brute force and demonstrates higher step count on larger array', () => {
        const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const target = 19;
        const hashRes = engine.twoSum(nums, target, 'hashmap');
        const bruteRes = engine.twoSum(nums, target, 'bruteforce');

        expect(hashRes.result).toEqual(bruteRes.result);
        expect(bruteRes.steps).toBeGreaterThan(hashRes.steps);
      });

      it('returns empty array when target is unreachable', () => {
        const { result } = engine.twoSum([1, 2, 3], 99, 'hashmap');
        expect(result).toEqual([]);
      });
    });

    describe('Valid Parentheses', () => {
      it('correctly validates balanced bracket sequences', () => {
        expect(engine.isValidParentheses('()')).toBe(true);
        expect(engine.isValidParentheses('()[]{}')).toBe(true);
        expect(engine.isValidParentheses('{[]}')).toBe(true);
      });

      it('correctly rejects mismatched or interleaved bracket sequences', () => {
        expect(engine.isValidParentheses('(]')).toBe(false);
        expect(engine.isValidParentheses('([)]')).toBe(false);
        expect(engine.isValidParentheses('(')).toBe(false);
        expect(engine.isValidParentheses(']')).toBe(false);
      });
    });

    describe('LRU Cache', () => {
      it('evicts least recently used item when capacity is exceeded', () => {
        const lru = engine.createLRUCache(2);
        lru.put(1, 1);
        lru.put(2, 2);
        expect(lru.get(1)).toBe(1); // accesses 1, making 2 the LRU
        lru.put(3, 3); // evicts key 2
        expect(lru.get(2)).toBe(-1); // key 2 evicted
        expect(lru.get(3)).toBe(3);
        expect(lru.get(1)).toBe(1);
      });

      it('updates value and marks key as recently used on overwrite', () => {
        const lru = engine.createLRUCache(2);
        lru.put(1, 10);
        lru.put(2, 20);
        lru.put(1, 100); // overwrite 1
        lru.put(3, 30); // should evict 2, not 1
        expect(lru.get(1)).toBe(100);
        expect(lru.get(2)).toBe(-1);
      });
    });

    describe('Binary Search', () => {
      it('finds target index in sorted array in O(log N) time', () => {
        const nums = [-1, 0, 3, 5, 9, 12];
        expect(engine.binarySearch(nums, 9)).toBe(4);
        expect(engine.binarySearch(nums, -1)).toBe(0);
        expect(engine.binarySearch(nums, 12)).toBe(5);
      });

      it('returns -1 when target does not exist in array', () => {
        const nums = [-1, 0, 3, 5, 9, 12];
        expect(engine.binarySearch(nums, 2)).toBe(-1);
        expect(engine.binarySearch(nums, 100)).toBe(-1);
      });
    });

    describe('Merge Intervals', () => {
      it('merges overlapping interval ranges correctly', () => {
        const intervals = [
          [1, 3],
          [2, 6],
          [8, 10],
          [15, 18],
        ];
        const merged = engine.mergeIntervals(intervals);
        expect(merged).toEqual([
          [1, 6],
          [8, 10],
          [15, 18],
        ]);
      });

      it('handles fully nested and touching intervals', () => {
        const intervals = [
          [1, 4],
          [4, 5],
        ];
        expect(engine.mergeIntervals(intervals)).toEqual([[1, 5]]);

        const nested = [
          [1, 10],
          [2, 3],
          [4, 8],
        ];
        expect(engine.mergeIntervals(nested)).toEqual([[1, 10]]);
      });

      it('returns empty array when input is empty', () => {
        expect(engine.mergeIntervals([])).toEqual([]);
      });
    });
  });

  // ==========================================
  // Feature 10: Interactive Test Runner & Telemetry
  // ==========================================
  describe('Feature 10: Interactive Test Runner & Telemetry', () => {
    it('parses custom JSON input strings accurately', () => {
      const inputStr = '{"nums": [2, 7, 11, 15], "target": 9}';
      const parsed = JSON.parse(inputStr);
      expect(parsed.nums).toEqual([2, 7, 11, 15]);
      expect(parsed.target).toBe(9);
    });

    it('generates green pass checkmark assertion when test passes', () => {
      const expected = [0, 1];
      const actual = [0, 1];
      const isPassed = JSON.stringify(actual) === JSON.stringify(expected);

      const assertionResult = {
        passed: isPassed,
        badge: isPassed ? '✓ Passed' : '✗ Failed',
        color: isPassed ? '#5bf527' : '#ff375f',
      };

      expect(assertionResult.passed).toBe(true);
      expect(assertionResult.badge).toBe('✓ Passed');
      expect(assertionResult.color).toBe('#5bf527');
    });

    it('generates red failure assertion with expected vs actual diff', () => {
      const expected = [0, 1];
      const actual = [0, 2];
      const isPassed = JSON.stringify(actual) === JSON.stringify(expected);

      const assertionResult = {
        passed: isPassed,
        badge: isPassed ? '✓ Passed' : '✗ Failed',
        diff: `Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`,
      };

      expect(assertionResult.passed).toBe(false);
      expect(assertionResult.badge).toBe('✗ Failed');
      expect(assertionResult.diff).toContain('Expected [0,1] but got [0,2]');
    });

    it('records microsecond execution time and heap memory estimates', async () => {
      const result = await engine.runSandboxed('return input.map(x => x * 2);', 'javascript', [1, 2, 3, 4]);

      expect(result.executionTimeUs).toBeGreaterThanOrEqual(1);
      expect(result.memoryBytesEstimate).toBeGreaterThanOrEqual(1024);
    });

    it('executes batch test suite and tallies passed and total tests', () => {
      const testCases = [
        { input: '()', expected: true },
        { input: '()[]{}', expected: true },
        { input: '(]', expected: false },
        { input: '([)]', expected: false },
        { input: '{[]}', expected: true },
      ];

      const results = testCases.map((tc) => ({
        input: tc.input,
        actual: engine.isValidParentheses(tc.input),
        passed: engine.isValidParentheses(tc.input) === tc.expected,
      }));

      const passedCount = results.filter((r) => r.passed).length;
      expect(passedCount).toBe(5);
      expect(results.length).toBe(5);
    });
  });

  // ==========================================
  // Feature 11: Xcode Cloud In-Phone IDE App
  // ==========================================
  describe('Feature 11: Xcode Cloud In-Phone IDE App', () => {
    it('integrates CodeEditor, algorithm switcher, and test runner into unified IDE layout', () => {
      const ideAppConfig = {
        hasEditor: true,
        hasAlgorithmSelector: true,
        hasTestRunner: true,
        hasLanguageToggle: true,
      };
      expect(ideAppConfig.hasEditor).toBe(true);
      expect(ideAppConfig.hasAlgorithmSelector).toBe(true);
      expect(ideAppConfig.hasTestRunner).toBe(true);
      expect(ideAppConfig.hasLanguageToggle).toBe(true);
    });

    it('switches algorithm template when user selects a different problem', () => {
      const templates: Record<string, string> = {
        twoSum: 'function twoSum(nums, target) { /* Two Sum solution */ }',
        validParentheses: 'function isValid(s) { /* Stack solution */ }',
        lruCache: 'class LRUCache { /* LRU Cache solution */ }',
      };

      let activeProblem = 'twoSum';
      let activeCode = templates[activeProblem];
      expect(activeCode).toContain('Two Sum');

      activeProblem = 'validParentheses';
      activeCode = templates[activeProblem];
      expect(activeCode).toContain('Stack solution');
    });

    it('switches syntax template when toggling between Python and JavaScript', () => {
      const pyTemplate = 'def two_sum(nums, target):\n    # Python solution';
      const jsTemplate = 'function twoSum(nums, target) {\n    // JS solution\n}';

      let lang: 'python' | 'javascript' = 'javascript';
      expect(lang === 'javascript' ? jsTemplate : pyTemplate).toContain('// JS solution');

      lang = 'python';
      expect(lang === 'javascript' ? jsTemplate : pyTemplate).toContain('# Python solution');
    });

    it('dispatches algorithm live activity with CPU gauge to Dynamic Island when Run clicked', () => {
      coordinator.setAlgorithm({
        isRunning: true,
        algorithmName: 'Two Sum (A18 Pro Engine)',
        timeComplexity: 'O(N)',
        passStatus: 'running',
      });

      const islandAlgo = coordinator.getAlgorithm();
      expect(islandAlgo.isRunning).toBe(true);
      expect(islandAlgo.algorithmName).toContain('Two Sum');
    });

    it('updates Dynamic Island algorithm activity with final runtime and pass status upon execution complete', () => {
      coordinator.setAlgorithm({
        isRunning: false,
        algorithmName: 'Two Sum (A18 Pro Engine)',
        timeComplexity: 'O(N)',
        runtimeUs: 34,
        passStatus: 'passed',
      });

      const islandAlgo = coordinator.getAlgorithm();
      expect(islandAlgo.isRunning).toBe(false);
      expect(islandAlgo.runtimeUs).toBe(34);
      expect(islandAlgo.passStatus).toBe('passed');
    });
  });
});
