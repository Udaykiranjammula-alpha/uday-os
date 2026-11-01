/**
 * UDAY OS E2E Test Drivers and Reference Oracles
 * Strictly adhering to PROJECT.md § Interface Contracts and ORIGINAL_REQUEST.md
 */

import { projects } from '../../../data/projects';
import { skillCategories } from '../../../data/skills';
import { educationList } from '../../../data/education';
import { achievementsList } from '../../../data/achievements';
import { profile } from '../../../data/profile';

// ==========================================
// 1. Live Activity & Dynamic Island Contracts
// ==========================================

export interface AudioLiveActivity {
  isPlaying: boolean;
  trackTitle: string;
  artist: string;
  albumArt?: string;
  waveformFrequencies?: number[];
}

export interface ClockLiveActivity {
  isActive: boolean;
  type: 'stopwatch' | 'timer';
  remainingMs: number;
  totalDurationMs: number;
  formattedTime: string;
}

export interface AlgorithmLiveActivity {
  isRunning: boolean;
  algorithmName: string;
  timeComplexity: string;
  runtimeUs?: number;
  passStatus?: 'running' | 'passed' | 'failed';
  stdoutPreview?: string;
}

export interface PiPState {
  isOpen: boolean;
  title: string;
  videoSrc?: string;
  isPlaying: boolean;
  position: { x: number; y: number };
  bezelBounds: { minX: number; maxX: number; minY: number; maxY: number };
}

export class LiveActivityCoordinatorDriver {
  private audio: AudioLiveActivity = {
    isPlaying: false,
    trackTitle: '',
    artist: '',
  };

  private clock: ClockLiveActivity = {
    isActive: false,
    type: 'stopwatch',
    remainingMs: 0,
    totalDurationMs: 0,
    formattedTime: '00:00.00',
  };

  private algorithm: AlgorithmLiveActivity = {
    isRunning: false,
    algorithmName: '',
    timeComplexity: '',
  };

  private pip: PiPState = {
    isOpen: false,
    title: '',
    isPlaying: false,
    position: { x: 20, y: 120 },
    bezelBounds: { minX: 8, maxX: 220, minY: 60, maxY: 680 },
  };

  private listeners: Array<() => void> = [];

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  getAudio(): AudioLiveActivity {
    return { ...this.audio };
  }

  setAudio(audio: Partial<AudioLiveActivity>) {
    this.audio = { ...this.audio, ...audio };
    this.notify();
  }

  getClock(): ClockLiveActivity {
    return { ...this.clock };
  }

  setClock(clock: Partial<ClockLiveActivity>) {
    this.clock = { ...this.clock, ...clock };
    this.notify();
  }

  getAlgorithm(): AlgorithmLiveActivity {
    return { ...this.algorithm };
  }

  setAlgorithm(algo: Partial<AlgorithmLiveActivity>) {
    this.algorithm = { ...this.algorithm, ...algo };
    this.notify();
  }

  getPiP(): PiPState {
    return { ...this.pip };
  }

  setPiP(pip: Partial<PiPState>) {
    const updated = { ...this.pip, ...pip };
    // Enforce bezel bounds
    if (pip.position) {
      updated.position = {
        x: Math.min(Math.max(pip.position.x, this.pip.bezelBounds.minX), this.pip.bezelBounds.maxX),
        y: Math.min(Math.max(pip.position.y, this.pip.bezelBounds.minY), this.pip.bezelBounds.maxY),
      };
    }
    this.pip = updated;
    this.notify();
  }

  resetAll() {
    this.audio = { isPlaying: false, trackTitle: '', artist: '' };
    this.clock = { isActive: false, type: 'stopwatch', remainingMs: 0, totalDurationMs: 0, formattedTime: '00:00.00' };
    this.algorithm = { isRunning: false, algorithmName: '', timeComplexity: '' };
    this.pip = {
      isOpen: false,
      title: '',
      isPlaying: false,
      position: { x: 20, y: 120 },
      bezelBounds: { minX: 8, maxX: 220, minY: 60, maxY: 680 },
    };
    this.notify();
  }
}

// ==========================================
// 2. Code Execution Engine Contracts
// ==========================================

export interface ExecutionResult {
  success: boolean;
  output: unknown;
  stdout: string[];
  executionTimeUs: number;
  memoryBytesEstimate?: number;
  error?: string;
}

export class CodeExecutionEngineDriver {
  // Flagship Algorithm Implementations
  twoSum(nums: number[], target: number, method: 'hashmap' | 'bruteforce' = 'hashmap'): { result: number[]; steps: number } {
    let steps = 0;
    if (method === 'hashmap') {
      const map = new Map<number, number>();
      for (let i = 0; i < nums.length; i++) {
        steps++;
        const complement = target - nums[i];
        if (map.has(complement)) {
          return { result: [map.get(complement)!, i], steps };
        }
        map.set(nums[i], i);
      }
      return { result: [], steps };
    } else {
      for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
          steps++;
          if (nums[i] + nums[j] === target) {
            return { result: [i, j], steps };
          }
        }
      }
      return { result: [], steps };
    }
  }

  isValidParentheses(s: string): boolean {
    const stack: string[] = [];
    const map: Record<string, string> = { ')': '(', '}': '{', ']': '[' };
    for (const char of s) {
      if (char === '(' || char === '{' || char === '[') {
        stack.push(char);
      } else if (char in map) {
        if (stack.pop() !== map[char]) {
          return false;
        }
      }
    }
    return stack.length === 0;
  }

  createLRUCache(capacity: number) {
    const map = new Map<number, number>();
    return {
      get: (key: number): number => {
        if (!map.has(key)) return -1;
        const val = map.get(key)!;
        map.delete(key);
        map.set(key, val);
        return val;
      },
      put: (key: number, value: number): void => {
        if (map.has(key)) {
          map.delete(key);
        } else if (map.size >= capacity) {
          const oldestKey = map.keys().next().value;
          if (oldestKey !== undefined) map.delete(oldestKey);
        }
        map.set(key, value);
      },
      size: () => map.size,
    };
  }

  binarySearch(nums: number[], target: number): number {
    let left = 0;
    let right = nums.length - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (nums[mid] === target) return mid;
      if (nums[mid] < target) left = mid + 1;
      else right = mid - 1;
    }
    return -1;
  }

  mergeIntervals(intervals: number[][]): number[][] {
    if (intervals.length <= 1) return intervals;
    const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
    const merged: number[][] = [sorted[0]];
    for (let i = 1; i < sorted.length; i++) {
      const current = sorted[i];
      const lastMerged = merged[merged.length - 1];
      if (current[0] <= lastMerged[1]) {
        lastMerged[1] = Math.max(lastMerged[1], current[1]);
      } else {
        merged.push(current);
      }
    }
    return merged;
  }

  async runSandboxed(code: string, language: 'javascript' | 'python', inputData?: unknown): Promise<ExecutionResult> {
    const stdout: string[] = [];
    const startTime = performance.now();
    try {
      if (language === 'javascript') {
        const customConsole = {
          log: (...args: unknown[]) => stdout.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ')),
        };
        const sandboxedFunc = new Function('console', 'input', code);
        const result = sandboxedFunc(customConsole, inputData);
        const endTime = performance.now();
        const durationUs = Math.round((endTime - startTime) * 1000);
        return {
          success: true,
          output: result,
          stdout,
          executionTimeUs: Math.max(durationUs, 1),
          memoryBytesEstimate: Math.max(code.length * 2 + 1024, 1024),
        };
      } else {
        // Python sandbox simulation
        stdout.push(`Python 3.12 A18 Pro JIT Sandbox`);
        if (code.includes('print(')) {
          const match = code.match(/print\((.*?)\)/);
          if (match) stdout.push(match[1].replace(/['"]/g, ''));
        }
        const endTime = performance.now();
        const durationUs = Math.round((endTime - startTime) * 1000);
        return {
          success: true,
          output: inputData,
          stdout,
          executionTimeUs: Math.max(durationUs, 1),
          memoryBytesEstimate: 2048,
        };
      }
    } catch (err: unknown) {
      const endTime = performance.now();
      return {
        success: false,
        output: null,
        stdout,
        executionTimeUs: Math.round((endTime - startTime) * 1000),
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }
}

// ==========================================
// 3. Unified Haptics Contract
// ==========================================

export interface IHapticsService {
  tap(): void;
  actionButton(): void;
  success(): void;
  wheelTick(): void;
  error(): void;
}

export class HapticsServiceDriver implements IHapticsService {
  public history: Array<{ action: string; pattern?: number | number[]; timestamp: number }> = [];
  public audioFallbackPlayed: string[] = [];

  tap(): void {
    this.history.push({ action: 'tap', pattern: 12, timestamp: Date.now() });
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(12);
    } else {
      this.audioFallbackPlayed.push('tick');
    }
  }

  actionButton(): void {
    this.history.push({ action: 'actionButton', pattern: [20, 40, 20], timestamp: Date.now() });
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate([20, 40, 20]);
    } else {
      this.audioFallbackPlayed.push('double-pulse');
    }
  }

  success(): void {
    this.history.push({ action: 'success', pattern: [30, 60, 30, 60, 100], timestamp: Date.now() });
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate([30, 60, 30, 60, 100]);
    } else {
      this.audioFallbackPlayed.push('crescendo-chime');
    }
  }

  wheelTick(): void {
    this.history.push({ action: 'wheelTick', pattern: 8, timestamp: Date.now() });
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(8);
    } else {
      this.audioFallbackPlayed.push('camera-dial-tick');
    }
  }

  error(): void {
    this.history.push({ action: 'error', pattern: [50, 50, 50], timestamp: Date.now() });
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate([50, 50, 50]);
    } else {
      this.audioFallbackPlayed.push('reject-buzz');
    }
  }
}

// ==========================================
// 4. Spotlight & Natural Language Math Evaluator
// ==========================================

export interface SearchResultItem {
  id: string;
  type: 'app' | 'leetcode' | 'project' | 'skill' | 'math' | 'conversion' | 'action';
  title: string;
  subtitle: string;
  route?: string;
  actionPayload?: unknown;
}

export class SpotlightEngineDriver {
  evaluateMath(expr: string): { expression: string; result: string } | null {
    const trimmed = expr.trim();
    // percentage: e.g. 15% of 80
    const pctMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*%\s*of\s*(\d+(?:\.\d+)?)$/i);
    if (pctMatch) {
      const pct = parseFloat(pctMatch[1]);
      const base = parseFloat(pctMatch[2]);
      const res = (pct / 100) * base;
      return { expression: trimmed, result: Number.isInteger(res) ? res.toString() : res.toFixed(2) };
    }

    // sqrt: e.g. sqrt(256)
    const sqrtMatch = trimmed.match(/^sqrt\s*\(\s*(\d+(?:\.\d+)?)\s*\)$/i);
    if (sqrtMatch) {
      const val = parseFloat(sqrtMatch[1]);
      const res = Math.sqrt(val);
      return { expression: trimmed, result: Number.isInteger(res) ? res.toString() : res.toFixed(4) };
    }

    // power: e.g. 2^16
    const powMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*\^\s*(\d+(?:\.\d+)?)$/);
    if (powMatch) {
      const base = parseFloat(powMatch[1]);
      const exp = parseFloat(powMatch[2]);
      const res = Math.pow(base, exp);
      return { expression: trimmed, result: res.toLocaleString() };
    }

    // arithmetic: 128 * 64, 45 + 55, 1000 / 8, 250 - 42
    if (/^[0-9+\-*/. ()]+$/.test(trimmed) && /[+\-*/]/.test(trimmed)) {
      try {
        const sanitized = trimmed.replace(/[^0-9+\-*/. ()]/g, '');
        // Evaluate using Function sandbox
        const evalVal = Function(`"use strict"; return (${sanitized})`)();
        if (typeof evalVal === 'number' && !isNaN(evalVal) && isFinite(evalVal)) {
          return { expression: trimmed, result: evalVal.toLocaleString() };
        }
      } catch {
        return null;
      }
    }
    return null;
  }

  evaluateConversion(query: string): { title: string; result: string; unit: string } | null {
    const q = query.toLowerCase().trim();
    // Storage: e.g. 16 gb in mb, 1 tb in gb
    const storageMatch = q.match(/^(\d+(?:\.\d+)?)\s*(gb|tb|mb|kb)\s+in\s+(mb|gb|kb|b)$/);
    if (storageMatch) {
      const val = parseFloat(storageMatch[1]);
      const from = storageMatch[2];
      const to = storageMatch[3];
      const bytesPerUnit: Record<string, number> = { b: 1, kb: 1024, mb: 1024 ** 2, gb: 1024 ** 3, tb: 1024 ** 4 };
      const totalBytes = val * bytesPerUnit[from];
      const converted = totalBytes / bytesPerUnit[to];
      return {
        title: `${val} ${from.toUpperCase()} to ${to.toUpperCase()}`,
        result: `${converted.toLocaleString()} ${to.toUpperCase()}`,
        unit: to.toUpperCase(),
      };
    }

    // Latency to FPS: e.g. 16.67 ms in fps, 100 ms in fps
    const fpsMatch = q.match(/^(\d+(?:\.\d+)?)\s*ms\s+in\s+fps$/);
    if (fpsMatch) {
      const ms = parseFloat(fpsMatch[1]);
      const fps = ms > 0 ? Math.round(1000 / ms) : 0;
      return {
        title: `${ms}ms Frame Latency`,
        result: `${fps} FPS`,
        unit: 'FPS',
      };
    }

    // Salary: e.g. salary 150k
    const salaryMatch = q.match(/^salary\s+(\d+(?:\.\d+)?)\s*k$/);
    if (salaryMatch) {
      const thousands = parseFloat(salaryMatch[1]);
      const usdAnnual = thousands * 1000;
      const inrPeg = Math.round(usdAnnual * 83.5);
      return {
        title: `Compensation Benchmark: $${thousands}k/yr`,
        result: `₹${(inrPeg / 100000).toFixed(1)} Lakhs INR / $${(usdAnnual / 12).toFixed(0)}/mo`,
        unit: 'USD/INR',
      };
    }

    // Currency: 100 usd in inr
    const currMatch = q.match(/^(\d+(?:\.\d+)?)\s*usd\s+in\s+inr$/);
    if (currMatch) {
      const usd = parseFloat(currMatch[1]);
      const inr = Math.round(usd * 83.5);
      return {
        title: `$${usd} USD to INR`,
        result: `₹${inr.toLocaleString()} INR`,
        unit: 'INR',
      };
    }

    return null;
  }

  evaluateActionShortcuts(query: string): SearchResultItem | null {
    const q = query.toLowerCase().trim();
    if (q === 'take photo' || q === 'camera' || q === 'photo') {
      return { id: 'act-camera', type: 'action', title: 'Open Camera', subtitle: 'Launch authentic 48MP Fusion Camera', route: 'camera' };
    }
    if (q === 'hire' || q === 'email' || q === 'contact') {
      return { id: 'act-mail', type: 'action', title: 'Email Uday Kiran', subtitle: 'Compose pre-filled recruiter inquiry', route: 'contact' };
    }
    if (q === 'dark' || q === 'black' || q === 'finish black') {
      return { id: 'act-dark', type: 'action', title: 'Switch Chassis: Titanium Black', subtitle: 'Apply Black Titanium PVD finish', actionPayload: 'titanium-black' };
    }
    if (q === 'orange' || q === 'desert' || q === 'finish desert') {
      return { id: 'act-desert', type: 'action', title: 'Switch Chassis: Desert Titanium', subtitle: 'Apply Desert Titanium gold finish', actionPayload: 'titanium-desert' };
    }
    if (q === 'torch' || q === 'flashlight') {
      return { id: 'act-torch', type: 'action', title: 'Toggle Flashlight', subtitle: 'Trigger Dynamic Island LED torch pulse', actionPayload: 'toggle-torch' };
    }
    if (q === 'music' || q === 'play music') {
      return { id: 'act-music', type: 'action', title: 'Play Ambient Audio', subtitle: 'Stream Cupertino Lo-Fi audio', route: 'music' };
    }
    return null;
  }

  search(query: string): SearchResultItem[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results: SearchResultItem[] = [];

    // 1. Math calculation
    const mathRes = this.evaluateMath(query);
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
    const convRes = this.evaluateConversion(query);
    if (convRes) {
      results.push({
        id: 'conv-eval',
        type: 'conversion',
        title: convRes.result,
        subtitle: convRes.title,
        actionPayload: convRes.result,
      });
    }

    // 3. Action shortcut
    const actionRes = this.evaluateActionShortcuts(query);
    if (actionRes) {
      results.push(actionRes);
    }

    // 4. Projects search
    projects.forEach((p) => {
      if (p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q) || p.stack.some((s) => s.toLowerCase().includes(q))) {
        results.push({
          id: `proj-${p.id}`,
          type: 'project',
          title: p.title,
          subtitle: p.summary,
          route: `projects/${p.id}`,
        });
      }
    });

    // 5. Skills search
    skillCategories.forEach((cat) => {
      cat.items.forEach((item) => {
        if (item.name.toLowerCase().includes(q) || item.context.toLowerCase().includes(q)) {
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

// ==========================================
// 5. Embedded Lab & FreeRTOS Telemetry Contract
// ==========================================

export interface FreeRTOSTask {
  id: string;
  name: string;
  core: 0 | 1;
  priority: number;
  state: 'Running' | 'Ready' | 'Blocked' | 'Suspended';
  cpuUtilization: number;
}

export class EmbeddedLabDriver {
  // Dual-Core FreeRTOS Simulation
  private core0Tasks: FreeRTOSTask[] = [
    { id: 'wifi', name: 'Wi-Fi CSI Ingest', core: 0, priority: 5, state: 'Running', cpuUtilization: 42 },
    { id: 'spi', name: 'SPI DMA Transport', core: 0, priority: 4, state: 'Ready', cpuUtilization: 28 },
    { id: 'telemetry', name: 'Telemetry Broadcast', core: 0, priority: 2, state: 'Ready', cpuUtilization: 14 },
  ];

  private core1Tasks: FreeRTOSTask[] = [
    { id: 'tflite', name: 'TFLite INT8 Conv2D', core: 1, priority: 6, state: 'Running', cpuUtilization: 68 },
    { id: 'quant', name: 'Matrix Quantization', core: 1, priority: 4, state: 'Ready', cpuUtilization: 22 },
    { id: 'kalman', name: 'Kalman Filter Est', core: 1, priority: 3, state: 'Ready', cpuUtilization: 8 },
  ];

  getCoreTelemetry() {
    const core0Util = this.core0Tasks.reduce((sum, t) => sum + t.cpuUtilization, 0) / this.core0Tasks.length;
    const core1Util = this.core1Tasks.reduce((sum, t) => sum + t.cpuUtilization, 0) / this.core1Tasks.length;
    return {
      core0: { name: 'Core 0 (Networking & I/O)', utilization: Math.round(core0Util), tasks: this.core0Tasks },
      core1: { name: 'Core 1 (Edge ML & Signal Proc)', utilization: Math.round(core1Util), tasks: this.core1Tasks },
    };
  }

  // CRC-16 CCITT computation: x^16 + x^12 + x^5 + 1 (0x1021)
  computeCRC16(data: Uint8Array): number {
    let crc = 0xffff;
    for (let i = 0; i < data.length; i++) {
      crc ^= data[i] << 8;
      for (let j = 0; j < 8; j++) {
        if ((crc & 0x8000) !== 0) {
          crc = ((crc << 1) ^ 0x1021) & 0xffff;
        } else {
          crc = (crc << 1) & 0xffff;
        }
      }
    }
    return crc;
  }

  generatePacket(payload: number[]): { payload: number[]; crc: number; isCorrupted: boolean } {
    const data = new Uint8Array(payload);
    const crc = this.computeCRC16(data);
    return { payload, crc, isCorrupted: false };
  }

  injectNoise(packet: { payload: number[]; crc: number; isCorrupted: boolean }): {
    corruptedPayload: number[];
    originalCRC: number;
    recomputedCRC: number;
    errorDetected: boolean;
  } {
    const corrupted = [...packet.payload];
    // Invert bit 0 of the first byte
    if (corrupted.length > 0) {
      corrupted[0] = corrupted[0] ^ 0x01;
    }
    const recomputed = this.computeCRC16(new Uint8Array(corrupted));
    return {
      corruptedPayload: corrupted,
      originalCRC: packet.crc,
      recomputedCRC: recomputed,
      errorDetected: recomputed !== packet.crc,
    };
  }

  simulateRetransmit(corruptedPacket: { payload: number[]; crc: number }): {
    success: boolean;
    attempts: number;
    restoredCRC: number;
  } {
    // FreeRTOS SPI bus re-transmit protocol
    const cleanData = new Uint8Array(corruptedPacket.payload);
    const restoredCRC = this.computeCRC16(cleanData);
    return {
      success: true,
      attempts: 1,
      restoredCRC,
    };
  }
}

// ==========================================
// 6. Mac Mirroring & Genmoji Contracts
// ==========================================

export class MacMirroringDriver {
  private clipboardHistory: Array<{ text: string; source: 'mac' | 'iphone'; timestamp: number }> = [];
  private bannerNotification: { message: string; visible: boolean } | null = null;

  copyFromMac(text: string): { message: string } {
    this.clipboardHistory.push({ text, source: 'mac', timestamp: Date.now() });
    this.bannerNotification = { message: 'Pasted from MacBook Pro', visible: true };
    return { message: 'Pasted from MacBook Pro' };
  }

  getBanner() {
    return this.bannerNotification;
  }

  dismissBanner() {
    if (this.bannerNotification) {
      this.bannerNotification.visible = false;
    }
  }

  getClipboardHistory() {
    return [...this.clipboardHistory];
  }

  translateMacClickToPhone(macCoords: { x: number; y: number }, windowBounds: { width: number; height: number }) {
    // 19.5:9 aspect ratio mapping
    const phoneWidth = 402;
    const phoneHeight = 874;
    const normX = macCoords.x / windowBounds.width;
    const normY = macCoords.y / windowBounds.height;
    return {
      phoneX: Math.round(normX * phoneWidth),
      phoneY: Math.round(normY * phoneHeight),
    };
  }
}
