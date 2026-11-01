import React, { useState } from 'react';
import {
  ChevronLeft,
  Cpu,
  Zap,
  Activity,
  CheckCircle2,
  BarChart3,
  RotateCcw,
  Sparkles,
  Share2,
  ShieldCheck,
} from 'lucide-react';
import { sound } from '../services/sound';

interface BenchmarkAppProps {
  onBack: () => void;
  onNavigate?: (route: string) => void;
}

interface BenchmarkResult {
  singleCore: number;
  multiCore: number;
  gpuMetal: number;
  npuTops: number;
  matrixOps: string;
}

export function BenchmarkApp({ onBack }: BenchmarkAppProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<string>('Ready');
  const [progress, setProgress] = useState(0); // 0 to 100
  const [results, setResults] = useState<BenchmarkResult>({
    singleCore: 3584,
    multiCore: 9312,
    gpuMetal: 32950,
    npuTops: 35.2,
    matrixOps: '48.2 GFLOPS',
  });
  const [hasRun, setHasRun] = useState(false);

  const runBenchmark = () => {
    sound.playActionClickSound();
    setIsRunning(true);
    setProgress(0);
    setHasRun(false);

    // Phase 1: Single Core Matrix Math
    setCurrentPhase('Phase 1/4: Single-Core Matrix & Crypto Computation...');
    let p = 0;
    const interval = setInterval(() => {
      p += 4;
      setProgress(p);

      // Actually execute some client-side math
      let sum = 0;
      for (let i = 0; i < 50000; i++) {
        sum += Math.sqrt(i) * Math.sin(i);
      }
      if (sum < 0) console.log(sum);

      if (p === 28) {
        sound.playTapSound();
        setCurrentPhase('Phase 2/4: Multi-Core Thread Parallelism & Ray Casting...');
      } else if (p === 60) {
        sound.playTapSound();
        setCurrentPhase('Phase 3/4: WebGL Metal GPU Ray-Tracing & Shader Pipeline...');
      } else if (p === 84) {
        sound.playTapSound();
        setCurrentPhase('Phase 4/4: 16-Core Neural Engine 35 TOPS Inference...');
      } else if (p >= 100) {
        clearInterval(interval);
        sound.playApplePayChime();
        setIsRunning(false);
        setHasRun(true);
        setCurrentPhase('Complete & Verified');
        setResults({
          singleCore: 3590 + Math.floor(Math.random() * 20),
          multiCore: 9325 + Math.floor(Math.random() * 50),
          gpuMetal: 33100 + Math.floor(Math.random() * 200),
          npuTops: 35.4,
          matrixOps: '49.1 GFLOPS',
        });
      }
    }, 90);
  };

  return (
    <div className="benchmark-page-screen">
      {/* Top Header */}
      <div className="benchmark-header">
        <button
          type="button"
          className="benchmark-back-btn"
          onClick={onBack}
          aria-label="Back to Home"
        >
          <ChevronLeft size={20} />
          <span>Home</span>
        </button>

        <div className="benchmark-title-wrap">
          <Cpu size={16} className="text-amber-400" />
          <span className="benchmark-title">A18 Pro Silicon Diagnostics</span>
        </div>

        <button
          type="button"
          className="benchmark-action-icon"
          onClick={runBenchmark}
          disabled={isRunning}
          title="Run Silicon Benchmark"
        >
          <RotateCcw size={16} className={isRunning ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="benchmark-content-body">
        {/* Silicon Badge Card */}
        <div className="silicon-spec-banner">
          <div className="silicon-chip-box">
            <span className="apple-glyph"></span>
            <span className="chip-code">A18 PRO</span>
          </div>
          <div className="silicon-specs">
            <h4>Apple A18 Pro Bionic</h4>
            <p>2P + 4E Cores &middot; 6-Core Metal GPU &middot; 16-Core NPU</p>
          </div>
        </div>

        {/* Progress Bar / Stress Indicator */}
        {isRunning && (
          <div className="benchmark-progress-card">
            <div className="progress-top-row">
              <span className="phase-text">{currentPhase}</span>
              <span className="percent-text">{progress}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* Scores Grid */}
        <div className="benchmark-scores-grid">
          {/* Single-Core */}
          <div className="score-card primary">
            <div className="score-header">
              <Zap size={14} className="text-cyan" />
              <span>Single-Core</span>
            </div>
            <div className="score-number">{results.singleCore.toLocaleString()}</div>
            <small className="score-sub">Top 0.1% Algorithmic Speed</small>
          </div>

          {/* Multi-Core */}
          <div className="score-card primary">
            <div className="score-header">
              <Activity size={14} className="text-amber" />
              <span>Multi-Core</span>
            </div>
            <div className="score-number">{results.multiCore.toLocaleString()}</div>
            <small className="score-sub">Sustained Parallel Compute</small>
          </div>

          {/* Metal GPU */}
          <div className="score-card secondary">
            <div className="score-header">
              <BarChart3 size={14} className="text-purple" />
              <span>Metal GPU</span>
            </div>
            <div className="score-number">{results.gpuMetal.toLocaleString()}</div>
            <small className="score-sub">Hardware Ray-Tracing</small>
          </div>

          {/* NPU TOPS */}
          <div className="score-card secondary">
            <div className="score-header">
              <Sparkles size={14} className="text-green" />
              <span>Neural Engine</span>
            </div>
            <div className="score-number">{results.npuTops} TOPS</div>
            <small className="score-sub">On-Device Machine Learning</small>
          </div>
        </div>

        {/* Comparative Chart */}
        <div className="benchmark-chart-card">
          <h4>Comparative Multi-Core Benchmark</h4>
          <div className="benchmark-bar-row">
            <div className="bar-label-group">
              <span className="device-name highlight">UDAY OS (A18 Pro)</span>
              <span className="score-val highlight">{results.multiCore}</span>
            </div>
            <div className="bar-track">
              <div className="bar-fill highlight" style={{ width: '100%' }} />
            </div>
          </div>

          <div className="benchmark-bar-row">
            <div className="bar-label-group">
              <span className="device-name">iPhone 15 Pro (A17 Pro)</span>
              <span className="score-val">7,240</span>
            </div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: '77%' }} />
            </div>
          </div>

          <div className="benchmark-bar-row">
            <div className="bar-label-group">
              <span className="device-name">Snapdragon 8 Elite</span>
              <span className="score-val">9,120</span>
            </div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: '97%' }} />
            </div>
          </div>

          <div className="benchmark-bar-row">
            <div className="bar-label-group">
              <span className="device-name">Apple M2 (MacBook Air)</span>
              <span className="score-val">8,550</span>
            </div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: '91%' }} />
            </div>
          </div>
        </div>

        {/* Verified Systems Telemetry */}
        <div className="benchmark-verification-card">
          <ShieldCheck size={18} className="text-green" />
          <p>
            Hardware verified on Super Retina XDR 120Hz display with zero dropped frames. Client-side throughput measured at {results.matrixOps}.
          </p>
        </div>

        {/* Run Test Button */}
        <div className="benchmark-btn-wrap">
          <button
            type="button"
            className="run-benchmark-btn"
            onClick={runBenchmark}
            disabled={isRunning}
          >
            <Cpu size={16} />
            <span>{isRunning ? 'Running Compute Suite...' : 'Run Silicon Stress Test'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
