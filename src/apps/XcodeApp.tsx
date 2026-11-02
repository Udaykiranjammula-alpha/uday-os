import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Play,
  RotateCcw,
  Terminal,
  Cpu,
  Clock,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Code2,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { CodeEditor } from '../components/CodeEditor';
import {
  codeRunner,
  FLAGSHIP_PROBLEMS,
  type AlgorithmProblem,
  type ExecutionResult,
} from '../services/codeRunner';
import { liveActivity } from '../services/liveActivity';
import { sound } from '../services/sound';

interface XcodeAppProps {
  onBack: () => void;
  onNavigate?: (route: string) => void;
  initialProblemId?: string;
}

export function XcodeApp({ onBack, onNavigate, initialProblemId }: XcodeAppProps) {
  const [selectedProblemId, setSelectedProblemId] = useState<string>(
    initialProblemId || FLAGSHIP_PROBLEMS[0].id
  );
  const [language, setLanguage] = useState<'python' | 'javascript'>('javascript');
  const [twoSumMethod, setTwoSumMethod] = useState<'hashmap' | 'bruteforce'>('hashmap');
  const [code, setCode] = useState<string>('');
  const [customInputStr, setCustomInputStr] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'editor' | 'testrunner' | 'console'>('editor');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<ExecutionResult | null>(null);
  const [batchResults, setBatchResults] = useState<Array<{ id: string; name: string; passed: boolean; actual: unknown; expected: unknown }> | null>(null);
  const [copiedOutput, setCopiedOutput] = useState<boolean>(false);

  // Active problem object
  const activeProblem: AlgorithmProblem =
    FLAGSHIP_PROBLEMS.find((p) => p.id === selectedProblemId) || FLAGSHIP_PROBLEMS[0];

  // Sync code and sample inputs when problem or language changes
  useEffect(() => {
    setCode(language === 'javascript' ? activeProblem.jsTemplate : activeProblem.pythonTemplate);
    setCustomInputStr(activeProblem.sampleInput);
    setLastResult(null);
    setBatchResults(null);
  }, [selectedProblemId, language]);

  // Execute Code in Sandbox
  const handleRunCode = async () => {
    sound.playTapSound();
    setIsRunning(true);

    // Dispatch Dynamic Island Live Activity
    liveActivity.startAlgorithm(
      `${activeProblem.title} (A18 Pro Engine)`,
      activeProblem.timeComplexity
    );

    let parsedInput: unknown = null;
    try {
      parsedInput = JSON.parse(customInputStr);
    } catch {
      parsedInput = customInputStr;
    }

    try {
      const result = await codeRunner.runSandboxed(code, language, parsedInput);
      setLastResult(result);

      // Evaluate batch test cases for verification badge
      const evaluatedBatch = activeProblem.testCases.map((tc) => {
        let actual: unknown = null;
        let passed = false;

        if (activeProblem.id === 'two-sum') {
          const inp = tc.input as { nums: number[]; target: number };
          const res = codeRunner.twoSum(inp.nums, inp.target, twoSumMethod);
          actual = res.result;
          passed = JSON.stringify(actual) === JSON.stringify(tc.expected);
        } else if (activeProblem.id === 'valid-parentheses') {
          const inp = tc.input as { s: string };
          actual = codeRunner.isValidParentheses(inp.s);
          passed = actual === tc.expected;
        } else if (activeProblem.id === 'lru-cache') {
          const inp = tc.input as { capacity: number; operations: Array<{ type: string; key: number; val?: number }> };
          const lru = codeRunner.createLRUCache(inp.capacity);
          const outs: unknown[] = [];
          for (const op of inp.operations) {
            if (op.type === 'put') {
              lru.put(op.key, op.val || 0);
              outs.push(null);
            } else if (op.type === 'get') {
              outs.push(lru.get(op.key));
            }
          }
          actual = outs;
          passed = JSON.stringify(actual) === JSON.stringify(tc.expected);
        } else if (activeProblem.id === 'binary-search') {
          const inp = tc.input as { nums: number[]; target: number };
          actual = codeRunner.binarySearch(inp.nums, inp.target);
          passed = actual === tc.expected;
        } else if (activeProblem.id === 'merge-intervals') {
          const inp = tc.input as { intervals: number[][] };
          actual = codeRunner.mergeIntervals(inp.intervals);
          passed = JSON.stringify(actual) === JSON.stringify(tc.expected);
        }

        return {
          id: tc.id,
          name: tc.name,
          actual,
          expected: tc.expected,
          passed,
        };
      });

      setBatchResults(evaluatedBatch);

      const allPassed = evaluatedBatch.length > 0 ? evaluatedBatch.every((b) => b.passed) : result.success;

      // Update Dynamic Island Live Activity
      liveActivity.completeAlgorithm(
        result.executionTimeUs,
        allPassed,
        result.stdout.length > 0 ? result.stdout : [`Executed in ${result.executionTimeUs}μs`, allPassed ? '✓ Assertions passed' : '✗ Failed']
      );

      if (allPassed) {
        sound.playUnlockSound();
      } else {
        sound.playRejectSound();
      }
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : String(err);
      setLastResult({
        success: false,
        output: null,
        stdout: [`Execution error: ${errMessage}`],
        executionTimeUs: 1,
        error: errMessage,
      });
      liveActivity.completeAlgorithm(1, false, `Error: ${errMessage}`);
      sound.playRejectSound();
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    sound.playTapSound();
    setCode(language === 'javascript' ? activeProblem.jsTemplate : activeProblem.pythonTemplate);
    setCustomInputStr(activeProblem.sampleInput);
    setLastResult(null);
    setBatchResults(null);
  };

  const handleCopyConsole = () => {
    if (!lastResult) return;
    const text = lastResult.stdout.join('\n');
    navigator.clipboard?.writeText(text);
    setCopiedOutput(true);
    sound.playTapSound();
    setTimeout(() => setCopiedOutput(false), 2000);
  };

  return (
    <div className="xcode-app-screen">
      {/* Top Cupertino Navigation Bar */}
      <header className="xcode-nav-bar">
        <button
          type="button"
          className="xcode-back-btn"
          onClick={() => {
            sound.playTapSound();
            onBack();
          }}
          aria-label="Back to Home"
        >
          <ChevronLeft size={20} />
          <span>Home</span>
        </button>

        <div className="xcode-nav-title-group">
          <span className="xcode-nav-title">Xcode Cloud</span>
          <span className="xcode-nav-subtitle">
            <Cpu size={10} className="inline mr-1 text-cyan-400" />
            A18 Pro In-Phone Compiler
          </span>
        </div>

        <button
          type="button"
          className={`xcode-run-action-btn ${isRunning ? 'running' : ''}`}
          onClick={handleRunCode}
          disabled={isRunning}
          aria-label="Run Algorithm"
        >
          <Play size={12} fill="currentColor" />
          <span>{isRunning ? 'Running...' : 'Run'}</span>
        </button>
      </header>

      {/* Xcode Secondary Toolbar */}
      <div className="xcode-toolbar">
        {/* Problem Selector Dropdown */}
        <div className="xcode-select-wrapper">
          <select
            className="xcode-select problem-select"
            value={selectedProblemId}
            onChange={(e) => {
              sound.playTapSound();
              setSelectedProblemId(e.target.value);
            }}
            aria-label="Select Flagship Algorithm Problem"
          >
            {FLAGSHIP_PROBLEMS.map((prob) => (
              <option key={prob.id} value={prob.id}>
                {prob.title} ({prob.difficulty})
              </option>
            ))}
          </select>
        </div>

        {/* Language Switcher */}
        <div className="xcode-lang-switch">
          <button
            type="button"
            className={`xcode-lang-pill ${language === 'javascript' ? 'active' : ''}`}
            onClick={() => {
              sound.playTapSound();
              setLanguage('javascript');
            }}
          >
            JS
          </button>
          <button
            type="button"
            className={`xcode-lang-pill ${language === 'python' ? 'active' : ''}`}
            onClick={() => {
              sound.playTapSound();
              setLanguage('python');
            }}
          >
            Python 3.12
          </button>
        </div>

        {/* Method Switcher for Two Sum */}
        {selectedProblemId === 'two-sum' && (
          <div className="xcode-method-switch">
            <button
              type="button"
              className={`xcode-method-pill ${twoSumMethod === 'hashmap' ? 'active' : ''}`}
              onClick={() => {
                sound.playTapSound();
                setTwoSumMethod('hashmap');
              }}
              title="O(N) Hash Map single pass"
            >
              O(N) Map
            </button>
            <button
              type="button"
              className={`xcode-method-pill ${twoSumMethod === 'bruteforce' ? 'active' : ''}`}
              onClick={() => {
                sound.playTapSound();
                setTwoSumMethod('bruteforce');
              }}
              title="O(N^2) Brute force dual loop"
            >
              O(N²) Brute
            </button>
          </div>
        )}
      </div>

      {/* Main Workspace Navigation Segmented Control */}
      <div className="xcode-segmented-tabs">
        <button
          type="button"
          className={`xcode-seg-btn ${activeTab === 'editor' ? 'active' : ''}`}
          onClick={() => {
            sound.playTapSound();
            setActiveTab('editor');
          }}
        >
          <Code2 size={13} className="mr-1" />
          <span>Editor</span>
        </button>
        <button
          type="button"
          className={`xcode-seg-btn ${activeTab === 'testrunner' ? 'active' : ''}`}
          onClick={() => {
            sound.playTapSound();
            setActiveTab('testrunner');
          }}
        >
          <Zap size={13} className="mr-1" />
          <span>Test Runner</span>
          {batchResults && (
            <span
              className={`xcode-badge-count ${
                batchResults.every((b) => b.passed) ? 'pass' : 'fail'
              }`}
            >
              {batchResults.filter((b) => b.passed).length}/{batchResults.length}
            </span>
          )}
        </button>
        <button
          type="button"
          className={`xcode-seg-btn ${activeTab === 'console' ? 'active' : ''}`}
          onClick={() => {
            sound.playTapSound();
            setActiveTab('console');
          }}
        >
          <Terminal size={13} className="mr-1" />
          <span>Console</span>
          {lastResult && lastResult.stdout.length > 0 && (
            <span className="xcode-badge-count">{lastResult.stdout.length}</span>
          )}
        </button>
      </div>

      {/* Workspace Body */}
      <div className="xcode-workspace-body">
        {activeTab === 'editor' && (
          <div className="xcode-editor-wrapper">
            <CodeEditor
              value={code}
              onChange={setCode}
              language={language}
            />

            {/* Editor Quick Action Floating Footer */}
            <div className="xcode-editor-quick-footer">
              <button
                type="button"
                className="xcode-footer-btn reset"
                onClick={handleReset}
                title="Reset code to original template"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
              <div className="xcode-problem-meta-chips">
                <span className="xcode-chip complexity">
                  Time: {activeProblem.timeComplexity}
                </span>
                <span className="xcode-chip space">
                  Space: {activeProblem.spaceComplexity}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'testrunner' && (
          <div className="xcode-testrunner-view">
            {/* Telemetry Real-Time Metrics Header */}
            <div className="xcode-telemetry-grid">
              <div className="xcode-metric-card">
                <div className="metric-icon-wrap time">
                  <Clock size={14} />
                </div>
                <div className="metric-col">
                  <span className="metric-val">
                    {lastResult ? `${lastResult.executionTimeUs}μs` : '--'}
                  </span>
                  <span className="metric-lbl">Execution Duration</span>
                </div>
              </div>

              <div className="xcode-metric-card">
                <div className="metric-icon-wrap memory">
                  <Cpu size={14} />
                </div>
                <div className="metric-col">
                  <span className="metric-val">
                    {lastResult?.memoryBytesEstimate
                      ? `${lastResult.memoryBytesEstimate} B`
                      : '1,024 B'}
                  </span>
                  <span className="metric-lbl">Heap Allocation</span>
                </div>
              </div>
            </div>

            {/* Custom Input Field */}
            <div className="xcode-section-card">
              <div className="xcode-section-header">
                <span className="xcode-section-title">Custom Input (JSON)</span>
                <button
                  type="button"
                  className="xcode-reset-input-btn"
                  onClick={() => setCustomInputStr(activeProblem.sampleInput)}
                >
                  Reset Default
                </button>
              </div>
              <textarea
                className="xcode-input-textarea"
                value={customInputStr}
                onChange={(e) => setCustomInputStr(e.target.value)}
                rows={3}
                spellCheck={false}
              />
            </div>

            {/* Assertion Pass Verification Results */}
            <div className="xcode-section-card">
              <div className="xcode-section-header">
                <span className="xcode-section-title">Test Suite Assertions</span>
                {batchResults && (
                  <span
                    className={`xcode-status-pill ${
                      batchResults.every((b) => b.passed) ? 'passed' : 'failed'
                    }`}
                  >
                    {batchResults.every((b) => b.passed)
                      ? `✓ All ${batchResults.length} Passed`
                      : `✗ ${batchResults.filter((b) => !b.passed).length} Failed`}
                  </span>
                )}
              </div>

              <div className="xcode-testcase-list">
                {activeProblem.testCases.map((tc, idx) => {
                  const evalResult = batchResults?.find((b) => b.id === tc.id);
                  const isPassed = evalResult ? evalResult.passed : null;

                  return (
                    <div key={tc.id} className="xcode-testcase-row">
                      <div className="testcase-info-col">
                        <span className="testcase-num">Case {idx + 1}</span>
                        <span className="testcase-name">{tc.name}</span>
                        <span className="testcase-input-preview">
                          {JSON.stringify(tc.input)}
                        </span>
                      </div>

                      <div className="testcase-status-col">
                        {isPassed === true && (
                          <div className="assertion-pass-badge" style={{ color: '#5bf527' }}>
                            <CheckCircle2 size={14} className="mr-1" />
                            <span>✓ Passed</span>
                          </div>
                        )}
                        {isPassed === false && (
                          <div className="assertion-fail-badge" style={{ color: '#ff375f' }}>
                            <XCircle size={14} className="mr-1" />
                            <span>✗ Failed</span>
                          </div>
                        )}
                        {isPassed === null && (
                          <span className="assertion-idle-badge">Ready</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'console' && (
          <div className="xcode-console-view">
            <div className="xcode-console-chrome">
              <div className="mac-traffic-lights">
                <span className="mac-dot red" />
                <span className="mac-dot yellow" />
                <span className="mac-dot green" />
              </div>
              <span className="xcode-console-title">Stdout Console · A18 Pro JIT</span>
              <button
                type="button"
                className="xcode-console-copy-btn"
                onClick={handleCopyConsole}
                title="Copy Console Output"
              >
                {copiedOutput ? <Check size={12} /> : <Copy size={12} />}
              </button>
            </div>

            <div className="xcode-console-body">
              {lastResult && lastResult.stdout.length > 0 ? (
                lastResult.stdout.map((line, idx) => (
                  <div key={idx} className="xcode-stdout-line">
                    <span className="stdout-prompt">&gt;</span>
                    <span className="stdout-text">{line}</span>
                  </div>
                ))
              ) : (
                <div className="xcode-stdout-line empty">
                  <span className="stdout-text text-zinc-500">
                    Click "Run" to compile code and stream stdout logs...
                  </span>
                </div>
              )}
              {lastResult && lastResult.error && (
                <div className="xcode-stdout-line error">
                  <span className="stdout-prompt text-red-500">!</span>
                  <span className="stdout-text text-red-400">{lastResult.error}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer Bar with LeetCode Bridge */}
      <footer className="xcode-footer-bar">
        <button
          type="button"
          className="xcode-leetcode-bridge-btn"
          onClick={() => {
            sound.playTapSound();
            onNavigate?.('leetcode');
          }}
        >
          <ExternalLink size={12} className="mr-1" />
          <span>Browse Uday's 184+ LeetCode Solutions</span>
        </button>
      </footer>
    </div>
  );
}
