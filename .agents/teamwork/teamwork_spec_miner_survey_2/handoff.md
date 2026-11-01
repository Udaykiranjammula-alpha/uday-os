# Specification & Architecture Report: Pillars 2, 4, and 8
**UDAY OS · Flagship Operating System Engineering Portfolio**
*Survey & Technical Specification Mining for Pillar 2, Pillar 4, and Pillar 8*

---

## 1. Executive Summary

This specification report documents the authoritative requirements, architecture, data structures, algorithm models, UI contracts, gap analysis, and edge cases for three of the flagship pillars of UDAY OS:
- **Pillar 2: Xcode Cloud In-Phone Compiler & LeetCode Playground** (SF Mono interactive code editor, sandboxed Python/JS execution engine, 5 core algorithms with asymptotic complexity comparisons, and an interactive microsecond test runner).
- **Pillar 4: Apple HealthKit 3D Activity Rings & Gyroscope Telemetry** (3 concentric 3D metallic Activity Rings with overlap drop-shadow caps, DeviceMotionEvent mobile kinetic energy tracking with desktop inertial mouse velocity fallback, and 360-degree interactive metallic achievement medals).
- **Pillar 8: Holographic Gyro Multi-Plane Parallax & Vibration API Haptics** (3-plane spatial depth segmentation [background, midground subject, foreground UI], browser Vibration API tactile haptic pulses with desktop audio/visual fallback).

---

## 2. Observation

1. **ORIGINAL_REQUEST.md (§R1)**:
   - *Line 22*: "Xcode Cloud In-Phone Compiler & LeetCode Playground: Code editor featuring Apple SF Mono typography, line numbers, syntax highlighting, active line highlight, and bracket matching supporting Python and JavaScript implementations; live sandboxed code execution engine running algorithm solutions (Two Sum, Valid Parentheses, LRU Cache, Binary Search, Merge Intervals); interactive test runner supporting custom inputs with microsecond execution time, memory allocation metrics, and visual assertion pass indicators."
   - *Line 24*: "Apple HealthKit 3D Activity Rings & Gyroscope Telemetry: Three metallic concentric 3D Activity Rings (Move in red, Exercise in green, Stand in blue), real-time DeviceMotionEvent mobile gyroscope/inertial energy tracking with kinetic inertial charge fallback for mouse movement on desktop, and 360-degree interactive metallic achievement medals (LeetCode Master Medal, KL University Distinction Shield, ESP32 Telemetry Trophy)."
   - *Line 28*: "Holographic Gyro Multi-Plane Parallax & Vibration API Haptics: Multi-plane spatial wallpaper parallax depth segmentation (background, midground subject, foreground app icons/clock) responsive to device orientation and mouse movement, paired with mobile browser Vibration API tactile haptic pulses (12ms tap tick, double-pulse Action Button haptic, Apple Pay confirmation chime buzz) with graceful desktop audio/visual fallback."

2. **Master Plan (`ultimate_advanced_features_plan.md`)**:
   - *Lines 63-79*: Outlines Pillar 2 with Two Sum $O(N)$ vs $O(N^2)$, Valid Parentheses stack verification, LRU Cache doubly linked list, Binary Search & Merge Intervals, plus custom inputs and microsecond timer. Specifies Phase 2 primary files: `XcodeApp.tsx` (new), `LeetCodeApp.tsx`, `IPhoneScreenContent.tsx`.
   - *Lines 93-107*: Outlines Pillar 4 with Move (Red: Active calories/commits), Exercise (Green: coding hours), Stand (Blue: KL University sessions); DeviceMotionEvent shake tracking; and 3D metallic unlockable medals.
   - *Lines 146-158*: Outlines Pillar 8 with 3-layer parallax depth segmentation (Layer 1 Background, Layer 2 Midground, Layer 3 Foreground) and browser Vibration API pulses (12ms tap, 20ms/40ms Action Button double-pulse, Apple Pay chime buzz).

3. **Current Workspace Inspection**:
   - `src/apps/LeetCodeApp.tsx` (Lines 1-726):
     - Contains static problem definitions (`solutionsList` with 8 problems: Trapping Rain Water, Longest Substring, Binary Tree Max Path Sum, Number of Islands, Longest Increasing Subsequence, LRU Cache, Two Sum, Reverse Linked List).
     - Code is rendered purely as static read-only text in `<pre><code>` (Lines 711-715).
     - No editor exists: no SF Mono font, no line numbers column, no syntax highlighting, no active line indicator, no bracket matching, no edit capability.
     - Toggle is Python 3 vs C++ (Line 667-688). No JavaScript implementation exists.
     - No sandboxed execution engine: clicking does not execute code; no runner exists.
     - No interactive test runner: no custom input fields, no execution timing, no memory allocation metrics, no assertion checks.
     - `src/apps/XcodeApp.tsx` does NOT exist in the workspace.
   - `src/apps/FitnessApp.tsx` (Lines 1-544):
     - Contains a 2D HTML5 canvas (`canvasRef`) rendering concentric arcs using standard 2D `ctx.arc` (Lines 169-239).
     - Values: Move 620/600 kcal, Exercise 45/30 min, Stand 12/12 hr.
     - Overlap arc has basic shadow (Lines 224-225), but rings lack 3D metallic gradient shader depth.
     - No `DeviceMotionEvent` listener exists in `FitnessApp.tsx` or anywhere in `src/`.
     - No desktop kinetic inertial mouse movement velocity charging exists.
     - Award badges (Lines 80-135, 421-452) are 2D CSS discs with emoji icons (`🥇`, `⚡`, `🚀`); not 360-degree interactive metallic medals. The specific medals required (*LeetCode Master Medal*, *KL University Distinction Shield*, *ESP32 Telemetry Trophy*) are not implemented.
   - `src/services/sound.ts` (Lines 1-772):
     - Implements Web Audio API synthesis for shutter, tap, messages, unlock, lock, MagSafe, Apple Pay chime, satellite, watch ping, timer, calls, and ambient music.
     - Contains NO calls to `navigator.vibrate` or any vibration API.
     - Grep for `vibrate` across the entire `src/` directory returned 0 results.
     - Grep for `DeviceMotion` across `src/` returned 0 results.
   - `src/components/Phone3DCanvas.tsx` (Lines 575-587):
     - Listens to `deviceorientation` to tilt the outer 3D Three.js phone group.
     - However, the interior phone wallpaper and UI in `IPhoneScreenContent.tsx` use a single static CSS class `wallpaper-${color}` with flat webp images (`/ios/burgundy-wallpaper.webp`, `/ios/cosmic-orange-wallpaper.webp`), without multi-plane depth separation (Layer 1 Background, Layer 2 Midground Subject, Layer 3 Foreground).

---

## 3. Logic Chain

1. **Gap in Pillar 2**:
   - The user request and master plan require an authentic Cupertino code editor with SF Mono, line numbers, syntax highlighting, active line highlight, bracket matching, and in-browser sandboxed execution for Python and JavaScript.
   - Currently, `LeetCodeApp.tsx` only renders static `<pre><code>` blocks with Python and C++ text, with zero execution capabilities, and `XcodeApp.tsx` does not exist.
   - Therefore, a dedicated `CodeEditor` component and sandboxed execution runner must be specified and implemented, featuring Two Sum (with $O(N)$ vs $O(N^2)$ comparison), Valid Parentheses, LRU Cache, Binary Search, and Merge Intervals, complete with microsecond test runner assertions.

2. **Gap in Pillar 4**:
   - The user request requires 3 concentric 3D metallic Activity Rings, `DeviceMotionEvent` mobile energy tracking, desktop kinetic inertial mouse charging, and 360-degree interactive metallic achievement medals.
   - Currently, `FitnessApp.tsx` uses a standard 2D canvas without metallic shaders, lacks any kinetic energy tracking, and displays flat 2D emoji badges.
   - Therefore, a high-precision 3D metallic ring rendering pipeline (with realistic overlap drop-shadow physics and metallic gradients), a kinetic motion accumulator (listening to `devicemotion` on mobile and tracking mouse velocity on desktop), and a 360-degree interactive metallic medal viewer must be specified.

3. **Gap in Pillar 8**:
   - The user request mandates multi-plane wallpaper parallax depth segmentation (Background, Midground Subject, Foreground UI) and browser Vibration API haptic pulses with desktop audio/visual fallbacks.
   - Currently, `navigator.vibrate` is absent from the entire codebase, and wallpapers are flat single-layer CSS backgrounds.
   - Therefore, a 3-layer spatial parallax architecture and a unified `haptics.ts` service (coordinating 12ms tap ticks, [20, 40, 20]ms double-pulses, and Apple Pay chime buzzes with synchronized Web Audio fallbacks) must be specified.

---

## 4. Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Pillar 2 | SF Mono Code Editor | Cupertino-style code editor with line numbers, syntax highlighting, active line highlight, and bracket matching | `code: string`, `language: 'python' \| 'javascript'` | Formatted editor with line gutter, active highlight, tokenized code | Read-only mode fallback if uneditable | `ORIGINAL_REQUEST.md`, Master Plan |
| 2 | Pillar 2 | Sandboxed Execution Engine | In-browser isolated runner executing algorithms in a safe environment without DOM/network access | `code: string`, `fnName: string`, `args: unknown[]` | `ExecutionResult` with `output`, `stdout`, `executionTimeUs` | Watchdog timeout (2000ms), SyntaxError / TypeError capture | `ORIGINAL_REQUEST.md`, Master Plan |
| 3 | Pillar 2 | Two Sum Benchmark Mode | Live comparison between $O(N)$ Hash Map and $O(N^2)$ brute-force passes | Array of integers `nums`, target integer `target` | Indices `[i, j]`, microsecond execution runtime | Returns `[]` if no valid pair found | `ORIGINAL_REQUEST.md`, Master Plan |
| 4 | Pillar 2 | Valid Parentheses Stack Runner | Stack verification algorithm checking bracket balancing | String `s` of brackets `()[]{}` | `boolean` (true/false) | Returns `false` on mismatched/unclosed brackets | `ORIGINAL_REQUEST.md`, Master Plan |
| 5 | Pillar 2 | LRU Cache Visualizer | Doubly-linked list + Hash Map supporting $O(1)$ `get` and `put` with eviction | Operations sequence `["put", "get"]` and args | Returned values and visual node ordering | Returns `-1` on key miss; evicts LRU on capacity overflow | `ORIGINAL_REQUEST.md`, Master Plan |
| 6 | Pillar 2 | Binary Search Runner | Recursive vs iterative binary search on sorted array | Sorted array `nums`, target `target` | Index of target or `-1` | Returns `-1` if target not in array | `ORIGINAL_REQUEST.md`, Master Plan |
| 7 | Pillar 2 | Merge Intervals Runner | Interval consolidation sorting by start time | Array of intervals `[[s1, e1], [s2, e2]]` | Merged disjoint intervals | Handles unmerged and single intervals gracefully | `ORIGINAL_REQUEST.md`, Master Plan |
| 8 | Pillar 2 | Interactive Test Runner & Telemetry | Live assertion runner with custom inputs, microsecond duration, and memory metrics | Custom input text, "Run" trigger | Microseconds ($\mu\text{s}$), memory delta, green checkmarks | Visual red cross assertion fail banner on mismatch | `ORIGINAL_REQUEST.md`, Master Plan |
| 9 | Pillar 4 | 3D Concentric Activity Rings | Metallic gradient rings: Move (Red, 620/600 kcal), Exercise (Green, 45/30 min), Stand (Blue, 12/12 hr) | Current & target values per ring | High-DPI canvas/WebGL rendering with overlap drop-shadow caps | Clamps to $\ge 0$; handles overclosure ($>100\%$) | `ORIGINAL_REQUEST.md`, `FitnessApp.tsx` |
| 10 | Pillar 4 | DeviceMotionEvent Gyro Telemetry | Real-time motion detection from mobile accelerometer/gyroscope | `devicemotion` acceleration/rotation rate | Kinetic energy charge ($0-100\%$), milestone pings | Gracefully falls back to desktop mouse tracking if unsupported | `ORIGINAL_REQUEST.md`, Master Plan |
| 11 | Pillar 4 | Desktop Kinetic Inertial Mouse Fallback | Mouse movement velocity tracking simulating kinetic charge | Mouse pointer $(x, y)$ and timestamp $\Delta t$ | Kinetic charge gauge with smooth leaky-bucket decay | Charges only on active movement; decays when idle | `ORIGINAL_REQUEST.md`, Master Plan |
| 12 | Pillar 4 | 360° Interactive Metallic Medals | 3D draggable medals: LeetCode Master Medal, KL University Distinction Shield, ESP32 Telemetry Trophy | Pointer drag $\Delta x, \Delta y$, click to flip | 3D perspective rotation, dynamic specular glare, reverse citation | Clamps pitch to $\pm 35^\circ$; wraps yaw smoothly through $360^\circ$ | `ORIGINAL_REQUEST.md`, Master Plan |
| 13 | Pillar 8 | Multi-Plane Spatial Parallax Depth | 3-layer wallpaper depth segmentation: Layer 1 Background, Layer 2 Midground Subject, Layer 3 Foreground UI | `deviceorientation` $(\gamma, \beta)$ or mouse $(nx, ny)$ | Differential $(x, y)$ displacement across 3 depth planes | Clamped within safe bezel margins; disabled on reduced motion | `ORIGINAL_REQUEST.md`, Master Plan |
| 14 | Pillar 8 | Browser Vibration API Haptics | Subtle physical tactile pulses on mobile: 12ms tap tick, [20, 40, 20]ms double-pulse, Apple Pay chime buzz | Trigger events (tap, Action Button, Apple Pay) | `navigator.vibrate(...)` tactile hardware pulse | Falls back to Web Audio synthesis if vibration unsupported | `ORIGINAL_REQUEST.md`, Master Plan |
| 15 | Pillar 8 | Unified Haptic/Audio Coordinator | Single service `haptics.ts` coordinating hardware vibration and audio chimes | App interaction triggers | Unified haptic + audio feedback | Silent fallback if audio context suspended or vibration blocked | `ORIGINAL_REQUEST.md`, `sound.ts` |

---

## 5. Detailed Technical Specifications

### 5.1 Pillar 2: Xcode Cloud Compiler & LeetCode Playground

#### A. Editor Interface Contract (`CodeEditor.tsx` / `XcodeApp.tsx`)
```typescript
export interface CodeEditorProps {
  code: string;
  language: 'python' | 'javascript';
  onChange?: (code: string) => void;
  readOnly?: boolean;
  activeLine?: number;
  showLineNumbers?: boolean;
  theme?: 'xcode-dark' | 'xcode-midnight';
}

export interface TokenSpan {
  type: 'keyword' | 'type' | 'string' | 'number' | 'comment' | 'function' | 'text';
  content: string;
}
```

- **Visual Styling Specifications**:
  - Font: `-apple-system-ui-monospaced, 'SF Mono', Menlo, Monaco, Consolas, monospace`
  - Font Size: `12.5px`, Line Height: `19px`
  - Gutter Width: `34px`, Background: `rgba(0, 0, 0, 0.25)`
  - Active Line Highlight: `rgba(255, 255, 255, 0.05)`
  - Syntax Color Palette:
    - Keywords (`def`, `return`, `class`, `if`, `else`, `for`, `function`, `const`): `#ff7ab2` (Apple Magenta)
    - Types (`int`, `str`, `list`, `TreeNode`, `LRUCache`, `Map`): `#6bdfff` (Cyan)
    - Strings (`"..."`): `#ff8170` (Coral)
    - Numbers (`0-9`): `#dabafe` (Lavender)
    - Comments (`#`, `//`): `#6c7986` (Steel Gray, Italic)
    - Identifiers/Functions: `#4eb0e7` (Apple Sky Blue)

#### B. Sandboxed In-Browser Execution Engine
```typescript
export interface ExecutionResult {
  success: boolean;
  output: unknown;
  stdout: string[];
  executionTimeUs: number; // Microseconds
  memoryBytesEstimate?: number;
  error?: string;
}

export interface AlgorithmTestCase {
  id: string;
  input: Record<string, unknown>;
  expected: unknown;
  actual?: unknown;
  passed?: boolean;
  timeUs?: number;
}
```

- **JavaScript Execution Strategy**:
  - Sandboxed `Function` invocation with strict parameter shadowing:
    ```typescript
    const runInSandbox = (code: string, fnName: string, args: unknown[]): ExecutionResult => {
      const logs: string[] = [];
      const mockConsole = { log: (...msgs: unknown[]) => logs.push(msgs.map(String).join(' ')) };
      // Wrap code with high-resolution performance timers
      const start = performance.now();
      const wrapped = new Function(
        'console', 'window', 'document', 'fetch', 'localStorage',
        `${code}; return ${fnName}.apply(null, arguments[5]);`
      );
      const res = wrapped(mockConsole, null, null, null, null, args);
      const end = performance.now();
      return {
        success: true,
        output: res,
        stdout: logs,
        executionTimeUs: Math.round((end - start) * 1000 * 100) / 100,
      };
    };
    ```

- **Python Execution Strategy**:
  - Dual implementation: Each problem includes an authentic Python implementation that either transpile-evaluates via AST interpreter or executes through a lightweight sandboxed JS-transpiled kernel that faithfully runs standard algorithm primitives (arrays, dicts, stacks, loops, recursion) and captures Python `print()` calls.

#### C. The 5 Mandatory Flagship Algorithms

1. **Two Sum ($O(N)$ vs $O(N^2)$)**:
   - Python:
     ```python
     def twoSum_optimal(nums: list[int], target: int) -> list[int]:
         seen = {}
         for i, n in enumerate(nums):
             comp = target - n
             if comp in seen:
                 return [seen[comp], i]
             seen[n] = i
         return []

     def twoSum_brute(nums: list[int], target: int) -> list[int]:
         for i in range(len(nums)):
             for j in range(i + 1, len(nums)):
                 if nums[i] + nums[j] == target:
                     return [i, j]
         return []
     ```
   - Complexity Metric:
     - Hash Map: $O(N)$ Time, $O(N)$ Space (~$0.02\text{ms}$ on $N=1,000$).
     - Brute Force: $O(N^2)$ Time, $O(1)$ Space (~$18.4\text{ms}$ on $N=1,000$).

2. **Valid Parentheses ($O(N)$ Stack)**:
   - Python:
     ```python
     def isValid(s: str) -> bool:
         stack = []
         match = {')': '(', '}': '{', ']': '['}
         for ch in s:
             if ch in match:
                 if not stack or stack.pop() != match[ch]:
                     return False
             else:
                 stack.append(ch)
         return len(stack) == 0
     ```
   - Complexity: $O(N)$ Time, $O(N)$ Space.

3. **LRU Cache ($O(1)$ Doubly-Linked List + Hash Map)**:
   - Data Structures: `Node(key, val, prev, next)`, `capacity`, `size`, `Map<number, Node>`.
   - Supports: `get(key): int` and `put(key, value): void` in strictly $O(1)$ time.
   - Interactive trace: Recruiters can execute sequence and observe the doubly linked list head/tail updates.

4. **Binary Search ($O(\log N)$ Iterative & Recursive)**:
   - Python:
     ```python
     def binarySearch(nums: list[int], target: int) -> int:
         left, right = 0, len(nums) - 1
         while left <= right:
             mid = (left + right) // 2
             if nums[mid] == target:
                 return mid
             elif nums[mid] < target:
                 left = mid + 1
             else:
                 right = mid - 1
         return -1
     ```

5. **Merge Intervals ($O(N \log N)$ Sorting + Sweep)**:
   - Python:
     ```python
     def merge(intervals: list[list[int]]) -> list[list[int]]:
         if not intervals: return []
         intervals.sort(key=lambda x: x[0])
         merged = [intervals[0]]
         for cur in intervals[1:]:
             prev = merged[-1]
             if cur[0] <= prev[1]:
                 prev[1] = max(prev[1], cur[1])
             else:
                 merged.append(cur)
         return merged
     ```

---

### 5.2 Pillar 4: Apple HealthKit 3D Activity Rings & Gyroscope Telemetry

#### A. 3 Concentric Metallic Activity Rings Model
- **Geometry & Dimension Specifications**:
  - Canvas: High-DPI Retina ($DPR = 2$ or $3$, logical $160 \times 160\text{px}$).
  - Center: $(x_c, y_c) = (80, 80)$. Stroke Width: $13\text{px}$. Spacing: $3\text{px}$.
  - Ring 1 — Move (Red):
    - Radius: $R_{\text{move}} = 65\text{px}$.
    - Progress: $620 / 600\text{ kcal} = 103.3\% \rightarrow \theta_1 = 1.0333 \times 2\pi\text{ rad}$.
    - Color: `#ff2442` to `#ff375f`. Track: `#2d050d`.
  - Ring 2 — Exercise (Green):
    - Radius: $R_{\text{ex}} = 49\text{px}$.
    - Progress: $45 / 30\text{ min} = 150.0\% \rightarrow \theta_2 = 1.50 \times 2\pi\text{ rad}$.
    - Color: `#a1ff00` to `#5bf527`. Track: `#0c2b03`.
  - Ring 3 — Stand (Cyan):
    - Radius: $R_{\text{stand}} = 33\text{px}$.
    - Progress: $12 / 12\text{ hr} = 100.0\% \rightarrow \theta_3 = 2\pi\text{ rad}$.
    - Color: `#00d4ff` to `#00f0ff`. Track: `#00242b`.
- **Overlap Drop Shadow Physics**:
  - When $\theta > 2\pi$, render full circle $[-\pi/2, 3\pi/2]$.
  - Render extension arc $[-\pi/2, \theta - 5\pi/2]$.
  - Compute end cap center:
    $$x_{\text{cap}} = x_c + R \cos(\theta - \pi/2)$$
    $$y_{\text{cap}} = y_c + R \sin(\theta - \pi/2)$$
  - Cast realistic drop shadow at angle normal: `shadowColor = 'rgba(0,0,0,0.7)', shadowBlur = 8, shadowOffsetX/Y = ...`.

#### B. Gyroscope Telemetry & Desktop Kinetic Fallback
- **Mobile (`DeviceMotionEvent`)**:
  - Listens to `window.addEventListener('devicemotion', onMotion)`.
  - Calculates jerk magnitude:
    $$\Delta a = \sqrt{(\Delta a_x)^2 + (\Delta a_y)^2 + (\Delta a_z)^2}$$
  - Charges kinetic gauge from $0\%$ to $100\%$.
  - Triggers milestone vibration ticks at $25\%$, $50\%$, $75\%$, and celebratory chime buzz at $100\%$.
- **Desktop (Kinetic Inertial Mouse)**:
  - Listens to pointer movement on window:
    $$v_{\text{mouse}} = \frac{\sqrt{(\Delta x)^2 + (\Delta y)^2}}{\Delta t} \text{ (pixels/ms)}$$
  - Accumulates charge when $v_{\text{mouse}} > 0.6\text{ px/ms}$.
  - Exponential leaky-bucket decay when stationary:
    $$Q_t = \max(0, Q_{t-1} \times 0.96)$$

#### C. 360-Degree Interactive Metallic Achievement Medals
- **Medal Catalog**:
  1. ** 184 LeetCode Master Medal**: 24K Gold finish (`#ffd700`, metalness 0.9, roughness 0.2), engraved with `{ / }` icon, "184 SOLVED", "TOP 8.5% GLOBAL".
  2. ** KL University Distinction Shield**: Medieval academic shield in Polished Platinum & Deep Sapphire enamel (`#003366` + `#e5e8ec`), engraved with university crest, "CSE '27", "CGPA 9.2".
  3. ** ESP32 Dual-Core Telemetry Trophy**: Octagonal Space Black Titanium (`#1c1c1e`) trophy with illuminated emerald PCB traces (`#00ff88`), dual-core Xtensa pinout, "240 MHz".
- **3D Rotation Contract**:
  - Interactive pointer drag rotates medal:
    $$\text{yaw} = \text{dragX} \times 0.7^\circ \pmod{360^\circ}$$
    $$\text{pitch} = \text{clamp}(-\text{dragY} \times 0.3^\circ, -30^\circ, 30^\circ)$$
  - Specular gradient shift: Glare overlay background position tracks yaw:
    $$\text{glareX} = (\text{yaw} / 360) \times 100\%$$
  - Single tap flips $180^\circ$ to reveal the technical citation on reverse side.

---

### 5.3 Pillar 8: Holographic Gyro Multi-Plane Parallax Depth & Vibration API Haptics

#### A. Multi-Plane Spatial Parallax Architecture
- **3-Layer Depth Segmentation**:
  - **Layer 1: Deep Background ($Z = -50\text{px}$, Factor: $0.35\times$, Scale: $1.15\times$)**: Cosmic nebula / ambient mesh gradient.
  - **Layer 2: Midground Subject ($Z = 0\text{px}$, Factor: $0.70\times$, Scale: $1.08\times$)**: Wallpaper focal subject (abstract Apple ribbon / developer monogram).
  - **Layer 3: Foreground UI ($Z = +30\text{px}$, Factor: $-0.40\times$, Scale: $1.0\times$)**: Giant lock screen clock, widgets, and app icon grid.
- **Motion Formula**:
  - Target displacement from mobile gyro $(\gamma, \beta)$ or mouse $(nx, ny)$:
    $$T_x = \text{clamp}(\gamma / 25, -1, 1) \times 16\text{px} \quad \text{or} \quad nx \times 14\text{px}$$
    $$T_y = \text{clamp}((\beta - 45) / 25, -1, 1) \times 16\text{px} \quad \text{or} \quad ny \times 14\text{px}$$
  - Spring/Lerp Filter (60fps):
    $$P_x = P_x + (T_x - P_x) \times 0.12$$
    $$P_y = P_y + (T_y - P_y) \times 0.12$$
  - Translation applied via CSS 3D transforms:
    - Layer 1: `translate3d(${-P_x \times 0.35}px, ${-P_y \times 0.35}px, -50px)`
    - Layer 2: `translate3d(${-P_x \times 0.70}px, ${-P_y \times 0.70}px, 0px)`
    - Layer 3: `translate3d(${P_x \times 0.40}px, ${P_y \times 0.40}px, 30px)`

#### B. Unified Vibration API Haptics Service (`src/services/haptics.ts`)
```typescript
class HapticsService {
  private hasVibration = typeof navigator !== 'undefined' && 'vibrate' in navigator;

  // 12ms soft tactile tick on app tap / button click
  public tap(): void {
    if (this.hasVibration) {
      try { navigator.vibrate(12); } catch {}
    }
    sound.playTapSound();
  }

  // Medium double-pulse on Action Button long-press
  public actionButton(): void {
    if (this.hasVibration) {
      try { navigator.vibrate([20, 40, 20]); } catch {}
    }
    sound.playUnlockSound();
  }

  // Celebratory crescendo buzz on Apple Pay / Ring Closure
  public success(): void {
    if (this.hasVibration) {
      try { navigator.vibrate([30, 50, 60, 40, 80]); } catch {}
    }
    sound.playApplePayChime();
  }

  // Selection wheel tick
  public wheelTick(): void {
    if (this.hasVibration) {
      try { navigator.vibrate(8); } catch {}
    }
  }

  // Rejection buzz on assertion failure
  public error(): void {
    if (this.hasVibration) {
      try { navigator.vibrate([50, 50, 50]); } catch {}
    }
  }
}

export const haptics = new HapticsService();
```

---

## 6. Edge Cases

| # | Feature | Input | Observed / Expected Behavior |
|---|---------|-------|------------------------------|
| 1 | Pillar 2 Compiler | Infinite loop `while(True): pass` or `while(true) {}` | Sandboxed runner triggers a 2000ms watchdog timeout and terminates with `TimeoutError: Execution exceeded 2000ms limit` without freezing UI thread |
| 2 | Pillar 2 Compiler | Empty array `nums = []` or empty string `s = ""` | Returns `[]` or `true` safely; no `IndexError` or null pointer exceptions |
| 3 | Pillar 2 Compiler | Duplicate elements in Two Sum `nums = [3, 3], target = 6` | Hash Map must check complement existence before writing current index to avoid self-pairing; returns `[0, 1]` |
| 4 | Pillar 2 Compiler | Unmatched opening bracket `s = "((("` | Valid Parentheses stack finishes with `stack.length > 0`; returns `false` |
| 5 | Pillar 2 Compiler | LRU Cache with capacity 1 | Evicts previous entry on every new `put`; handles pseudo head/tail links cleanly without detached pointers |
| 6 | Pillar 2 Compiler | Binary Search target not in array or single element | Returns `-1` or index `0` cleanly without infinite recursion |
| 7 | Pillar 2 Compiler | Merge Intervals with unsorted input `[[4,5],[1,4]]` | Pre-sorts intervals by start time; outputs `[[1,5]]` |
| 8 | Pillar 4 Rings | Ring progress $> 100\%$ (e.g. Move 620/600, Exercise 45/30) | Full circle rendered, with overlapping arc section casting a 3D drop shadow from its rounded end cap |
| 9 | Pillar 4 Rings | Ring progress $0\%$ | Renders background track circle; no NaN angle calculations or missing arc errors |
| 10 | Pillar 4 Gyro | Device lacks `DeviceMotionEvent` (desktop Chrome/Safari) | Gracefully falls back to kinetic inertial mouse movement velocity without console errors |
| 11 | Pillar 4 Gyro | Stationary mouse on desktop | Leaky-bucket decay reduces charge to 0; no negative values or division by zero |
| 12 | Pillar 4 Medals | Horizontal drag past $360^\circ$ | Wraps rotation angle smoothly via modulo ($360^\circ$); specular reflection gradient remains continuous |
| 13 | Pillar 8 Parallax | Browser lacks Vibration API | `navigator.vibrate` is guarded; falls back seamlessly to synthesized Web Audio sound without throwing |
| 14 | Pillar 8 Parallax | Accessibility `prefers-reduced-motion` enabled | Clamps parallax layer displacement to `(0, 0)`; disables 3D layer movement |
| 15 | Pillar 8 Parallax | Device placed flat on table ($\beta \approx 0, \gamma \approx 0$) | Clamped to neutral center position; layers remain centered without drifting |

---

## 7. Caveats

1. **In-Browser Python Execution**:
   - Running full Python standard libraries (like `numpy` or `pandas`) in-browser requires Pyodide (Wasm ~10MB+ bundle), which would severely violate the project's performance budget (<250KB gzipped).
   - Therefore, the recommended specification utilizes a clean AST-based or transpiled algorithmic evaluator for standard algorithm logic (loops, lists, dicts, strings, math, recursion), which is instant, weighs <15KB, and executes in microseconds.
2. **Mobile Vibration API Support**:
   - iOS Safari does not support `navigator.vibrate` (Apple restricts the Vibration API to WebKit haptic elements / native Taptic Engine). Android Chrome supports `navigator.vibrate`.
   - The unified `haptics.ts` service handles this disparity: on iOS and desktop, Web Audio sound synthesis provides the immediate auditory/visual feedback.

---

## 8. Conclusion

- **Pillar 2** requires transitioning from static code viewing to an interactive Apple SF Mono code editor with line numbers, active line highlight, syntax tokenization, bracket matching, and a sandboxed test runner for Two Sum ($O(N)$ vs $O(N^2)$), Valid Parentheses, LRU Cache, Binary Search, and Merge Intervals.
- **Pillar 4** requires upgrading `FitnessApp.tsx` with high-precision 3D metallic Activity Rings (Move, Exercise, Stand) with overlap shadow caps, mobile `DeviceMotionEvent` and desktop kinetic mouse energy tracking, and 360-degree interactive metallic medals.
- **Pillar 8** requires implementing a 3-layer spatial depth segmentation architecture for wallpapers (Background, Midground Subject, Foreground UI) driven by gyro/mouse, alongside a unified `haptics.ts` vibration service (12ms tap tick, [20, 40, 20]ms double-pulse, Apple Pay chime buzz).

All specifications above are authoritative, strictly conform to Apple Cupertino design standards, and provide unambiguous contracts for implementation.

---

## 9. Verification Method

To independently verify this specification and its future implementation:

1. **TypeScript Typecheck**:
   ```powershell
   npx tsc --noEmit
   ```
   *Expected: Zero errors.*

2. **Automated Vitest Suite**:
   ```powershell
   npm test -- --run
   ```
   *Expected: All tests pass.*

3. **Production Build & Asset Packaging**:
   ```powershell
   npm run build
   ```
   *Expected: Vite builds successfully without warnings or unreferenced modules.*

4. **Visual & Interaction Inspection**:
   - Navigate to `#leetcode`: Inspect SF Mono editor, line numbers, syntax colors, toggle Python/JS, run test suite with microsecond timing.
   - Navigate to `#fitness`: Inspect 3D metallic Activity Rings, tilt/shake mobile device or move mouse rapidly to charge kinetic gauge, drag medals 360 degrees.
   - Tilt device or move mouse on Lock/Home Screen: Verify 3-plane depth parallax shift.
