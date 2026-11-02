# Milestone 1 (Iteration 2) Investigation Report: Coordinate Clamping & Bezel Bounds Fix Strategy

**Author:** Explorer M1 (Iteration 2) Agent 1 (`teamwork_explorer_m1_it2_1`)  
**Target:** Orchestrator (`1ae9bb65-98e9-49e2-889d-e047ba75afaf`), Worker M1 (`teamwork_worker_m1_1`)  
**Date:** 2026-11-01T16:55:00Z  
**Milestone:** M1 (Dynamic Island Live Activities & PiP Multitasking)  
**Topic:** Coordinate Clamping & `bezelBounds` Formulation in `src/services/liveActivity.ts`

---

## 1. Observation

### 1.1 Verbatim Code Inspections

1. **`src/services/liveActivity.ts` (Lines 109-118, Initial State Definition):**
   ```typescript
   pip: {
     isOpen: false,
     title: 'UDAY OS · Screencast',
     videoSrc: '',
     isPlaying: false,
     position: { x: 216, y: 76 },
     bezelBounds: { minX: 12, maxX: 260, minY: 60, maxY: 680 },
     isMinimized: false,
   },
   ```

2. **`src/services/liveActivity.ts` (Lines 226-236, `setPiP` Clamping):**
   ```typescript
   public setPiP(partial: Partial<PiPState>) {
     const updated = { ...this.state.pip, ...partial };
     if (partial.position) {
       updated.position = {
         x: Math.min(Math.max(partial.position.x, this.state.pip.bezelBounds.minX), this.state.pip.bezelBounds.maxX),
         y: Math.min(Math.max(partial.position.y, this.state.pip.bezelBounds.minY), this.state.pip.bezelBounds.maxY),
       };
     }
     this.state.pip = updated;
     this.notify();
   }
   ```

3. **`src/services/liveActivity.ts` (Lines 282-290, `resetAll` Definition):**
   ```typescript
   pip: {
     isOpen: false,
     title: '',
     videoSrc: '',
     isPlaying: false,
     position: { x: 20, y: 120 },
     bezelBounds: { minX: 12, maxX: 260, minY: 60, maxY: 680 },
     isMinimized: false,
   },
   ```

4. **`src/services/liveActivity.ts` (Lines 681-686, `updatePiPPosition` Clamping):**
   ```typescript
   public updatePiPPosition(x: number, y: number) {
     const clampedX = Math.min(Math.max(x, this.state.pip.bezelBounds.minX), this.state.pip.bezelBounds.maxX);
     const clampedY = Math.min(Math.max(y, this.state.pip.bezelBounds.minY), this.state.pip.bezelBounds.maxY);
     this.state.pip.position = { x: clampedX, y: clampedY };
     this.notify();
   }
   ```

5. **`src/components/PiPOverlay.tsx` (Lines 23-31, Component Constraint Bounds):**
   ```typescript
   // Strictly clamped within iPhone AMOLED bezel bounds (372px x 806px display)
   // Screen width 372px: 220 + 144 = 364px (8px safe margin from right border)
   // Screen height 806px: 680 + 98 = 778px (above Home Indicator)
   const BEZEL_CONSTRAINTS = {
     left: 8,
     right: 220,
     top: 60,
     bottom: 680,
   };
   ```

6. **`src/styles.css` (Lines 18802-18803, PiP Window Dimensions):**
   ```css
   .pip-overlay-window {
     width: 144px;
     height: 98px;
     border-radius: 18px;
     ...
   }
   ```

7. **`src/__tests__/e2e/helpers/testDrivers.ts` (Lines 76 and 145, Mock Coordinator Bounds):**
   ```typescript
   // Line 76:
   bezelBounds: { minX: 12, maxX: 260, minY: 60, maxY: 680 },
   // Line 145 (in resetAll):
   bezelBounds: { minX: 12, maxX: 260, minY: 60, maxY: 680 },
   ```

8. **`src/__tests__/adversarial_m1.test.ts` (Lines 183-205, Empirical Defect Assertion):**
   ```typescript
   // Empirical Check 1: Right Boundary Clamp
   liveActivity.updatePiPPosition(350, 300);
   const clampedRight = liveActivity.getPiP().position.x;
   expect(clampedRight).toBe(260); // BUG CONFIRMED: 260 instead of required 220!

   // Empirical Check 2: Left Boundary Clamp
   liveActivity.updatePiPPosition(-50, 300);
   const clampedLeft = liveActivity.getPiP().position.x;
   expect(clampedLeft).toBe(12); // BUG CONFIRMED: 12 instead of required 8!
   ```

9. **`src/__tests__/challenger2_multitasking_bezel.test.ts` (Lines 108-120 and 317-321):**
   ```typescript
   liveActivity.updatePiPPosition(300, 480);
   const pos = liveActivity.getPiP().position;
   const pipRightEdge = pos.x + PIP_WIDTH; // 260 + 144 = 404px!
   const overflowPx = pipRightEdge - SCREEN_WIDTH; // 404 - 372 = 32px!
   expect(pos.x).toBe(260);
   expect(pipRightEdge).toBe(404);
   expect(overflowPx).toBe(32); // BUG CONFIRMED: 32px overflow outside screen!
   ...
   liveActivity.updatePiPPosition(-999, 9999);
   const clamped = liveActivity.getPiP().position;
   expect(clamped.x).toBeGreaterThanOrEqual(12);
   expect(clamped.y).toBeLessThanOrEqual(680);
   ```

---

## 2. Logic Chain

1. **[From Observation 1.5, 1.6 & 1.7] Display & Window Geometry:**
   - The virtual iPhone 16 Pro AMOLED viewport has a width of `372px` and height of `806px` (`.iphone-screen`).
   - The PiP overlay window has a fixed width of `144px` and height of `98px`.
   - The phone has interactive bezel sensors and chrome elements:
     - Left edge: Action Button sensor at `left: 0..6px` (width 6px).
     - Right edge: Camera Control capacitive sensor at `left: 366..372px` (width 6px, top: 475..531px).
     - Top edge: Dynamic Island compact pill (`14..47px`), expanded capsule (`14..182px`).
     - Bottom edge: Home Indicator at `top: 793..798px` (height 5px).

2. **[From Observation 1.1, 1.3 & 1.9] The Defect in `liveActivity.ts`:**
   - `liveActivity.ts` specifies `bezelBounds: { minX: 12, maxX: 260, minY: 60, maxY: 680 }`.
   - When an application drags or programmatically positions PiP to the right (`x = 260`):
     - PiP right edge = `x + width` = `260 + 144 = 404px`.
     - Screen overflow = `404px - 372px = 32px`.
     - 32 horizontal pixels of the PiP window render outside the AMOLED viewport, clipped by the 3D phone chassis.
     - Crucially, within vertical span `475..531px`, the PiP window horizontally spans `260..404px`, completely occluding the essential Camera Control sensor (`366..372px`, z-index 44 vs PiP z-index 45).
   - When an application drags or positions PiP to the left edge:
     - `PiPOverlay.tsx` sets `BEZEL_CONSTRAINTS.left = 8`.
     - When the pointer releases at `x = 8`, `onDragEnd` calls `liveActivity.updatePiPPosition(8, y)`.
     - In `liveActivity.ts`, `clampedX = Math.min(Math.max(8, 12), 260) = 12`.
     - The window snaps 4px to the right (`8 -> 12px`), causing visual UI stutter and violating the user's intended drop position.

3. **[From Observation 1.5 & DISPATCH Specification] Proof of the Exact Bounds `[8, 220]` and `[60, 680]`:**
   - **Horizontal Bounds (`x: [8, 220]`):**
     - Leftmost clamp (`x = 8`):
       - PiP horizontal span: `[8, 8 + 144] = [8, 152px]`.
       - Distance from left screen edge (`0px`): `8px` safe margin.
       - Clearance from Action Button sensor (`0..6px`): `8 - 6 = 2px` safe clearance. Zero occlusion.
     - Rightmost clamp (`x = 220`):
       - PiP horizontal span: `[220, 220 + 144] = [220, 364px]`.
       - Distance to right screen edge (`372px`): `372 - 364 = 8px` safe margin.
       - Clearance from Camera Control sensor (`366..372px`): `366 - 364 = 2px` safe clearance. Zero occlusion.
       - Viewport overflow: `364px <= 372px` (`0px` overflow). 100% contained within AMOLED display.
   - **Vertical Bounds (`y: [60, 680]`):**
     - Topmost clamp (`y = 60`):
       - PiP vertical span: `[60, 60 + 98] = [60, 158px]`.
       - Clearance below compact Dynamic Island (`14..47px`): `60 - 47 = 13px` margin.
       - Margin from screen top (`0px`): `60px`, well clear of status bar time and network indicators (`y = 14..30px`).
     - Bottommost clamp (`y = 680`):
       - PiP vertical span: `[680, 680 + 98] = [680, 778px]`.
       - Clearance above Home Indicator (`793..798px`): `793 - 778 = 15px` margin.
       - Margin from screen bottom (`806px`): `806 - 778 = 28px`.

4. **[From Observation 1.2 & 1.4] Clamping Implementation Robustness:**
   - In `updatePiPPosition` and `setPiP`, guarding input coordinates against non-finite values (`NaN`, `Infinity`, `undefined`) using `Number.isFinite()` prevents state corruption from invalid gestures or uninitialized pointer events.

5. **[From Observation 1.7, 1.8 & 1.9] Test Suite Synchronization Requirement:**
   - Both `adversarial_m1.test.ts` and `challenger2_multitasking_bezel.test.ts` currently contain assertions that explicitly expect the old defective values (`260`, `12`, and `>= 12`) to verify the bug existed.
   - When `liveActivity.ts` is corrected to `[8, 220]`, those assertions must be updated to expect `220`, `8`, and `>= 8`.
   - `testDrivers.ts` mock coordinator must also be updated to `{ minX: 8, maxX: 220, minY: 60, maxY: 680 }`.

---

## 3. Caveats

1. **Read-Only Explorer Scope:** As an explorer agent, no production or test source files have been modified. All proposed changes are provided below as exact, machine-applicable code snippets and diff specifications for Worker M1.
2. **Dependent Clock Fixes:** In addition to coordinate clamping, Reviewer 1 and Challenger 1 identified two related defects in `liveActivity.ts` (Clock type cross-toggle deadlock and negative duration timer display). Those are investigated in companion Explorer tracks, but their compatibility with this fix has been confirmed.
3. **No Dynamic Island Overlap Collision:** At `y = 60`, standard PiP is clear of compact Dynamic Island (`14..47px`). When Dynamic Island expands (`min-height: 168px`), expanded capsule z-index is 100, which naturally floats above PiP (z-index 45) according to Cupertino layering specs.

---

## 4. Conclusion & Actionable Fix Strategy

### 4.1 Target Changes in `src/services/liveActivity.ts`

#### Fix 1: Initial State `bezelBounds` (Line 115)
```typescript
<<<< BEFORE (Line 115)
      bezelBounds: { minX: 12, maxX: 260, minY: 60, maxY: 680 },
==== AFTER
      bezelBounds: { minX: 8, maxX: 220, minY: 60, maxY: 680 },
>>>>
```

#### Fix 2: `setPiP` Clamping Guard (Lines 226-236)
```typescript
<<<< BEFORE (Lines 226-236)
  public setPiP(partial: Partial<PiPState>) {
    const updated = { ...this.state.pip, ...partial };
    if (partial.position) {
      updated.position = {
        x: Math.min(Math.max(partial.position.x, this.state.pip.bezelBounds.minX), this.state.pip.bezelBounds.maxX),
        y: Math.min(Math.max(partial.position.y, this.state.pip.bezelBounds.minY), this.state.pip.bezelBounds.maxY),
      };
    }
    this.state.pip = updated;
    this.notify();
  }
==== AFTER
  public setPiP(partial: Partial<PiPState>) {
    const updated = { ...this.state.pip, ...partial };
    if (partial.position) {
      const bounds = updated.bezelBounds;
      const rawX = Number.isFinite(partial.position.x) ? partial.position.x : bounds.minX;
      const rawY = Number.isFinite(partial.position.y) ? partial.position.y : bounds.minY;
      updated.position = {
        x: Math.min(Math.max(rawX, bounds.minX), bounds.maxX),
        y: Math.min(Math.max(rawY, bounds.minY), bounds.maxY),
      };
    }
    this.state.pip = updated;
    this.notify();
  }
>>>>
```

#### Fix 3: `resetAll()` Bezel Bounds (Line 288)
```typescript
<<<< BEFORE (Line 288)
        bezelBounds: { minX: 12, maxX: 260, minY: 60, maxY: 680 },
==== AFTER
        bezelBounds: { minX: 8, maxX: 220, minY: 60, maxY: 680 },
>>>>
```

#### Fix 4: `updatePiPPosition` Clamping Logic (Lines 681-686)
```typescript
<<<< BEFORE (Lines 681-686)
  public updatePiPPosition(x: number, y: number) {
    const clampedX = Math.min(Math.max(x, this.state.pip.bezelBounds.minX), this.state.pip.bezelBounds.maxX);
    const clampedY = Math.min(Math.max(y, this.state.pip.bezelBounds.minY), this.state.pip.bezelBounds.maxY);
    this.state.pip.position = { x: clampedX, y: clampedY };
    this.notify();
  }
==== AFTER
  public updatePiPPosition(x: number, y: number) {
    const bounds = this.state.pip.bezelBounds;
    const rawX = Number.isFinite(x) ? x : bounds.minX;
    const rawY = Number.isFinite(y) ? y : bounds.minY;
    const clampedX = Math.min(Math.max(rawX, bounds.minX), bounds.maxX);
    const clampedY = Math.min(Math.max(rawY, bounds.minY), bounds.maxY);
    this.state.pip.position = { x: clampedX, y: clampedY };
    this.notify();
  }
>>>>
```

---

### 4.2 Associated Fix in Test Driver Mock: `src/__tests__/e2e/helpers/testDrivers.ts`

Lines 76 and 145:
```typescript
<<<< BEFORE (Lines 76 & 145)
    bezelBounds: { minX: 12, maxX: 260, minY: 60, maxY: 680 },
==== AFTER
    bezelBounds: { minX: 8, maxX: 220, minY: 60, maxY: 680 },
>>>>
```

---

### 4.3 Associated Updates in Adversarial Test Assertions

1. **`src/__tests__/adversarial_m1.test.ts` (Lines 183-205):**
   ```typescript
   it('strictly clamps PiP coordinates to DISPATCH specification x: [8, 220] and y: [60, 680]', () => {
     liveActivity.openPiP({ title: 'Test PiP' });

     // Empirical Check 1: Right Boundary Clamp
     liveActivity.updatePiPPosition(350, 300);
     const clampedRight = liveActivity.getPiP().position.x;
     expect(clampedRight).toBe(220); // Clamped strictly to maxX: 220

     // Empirical Check 2: Left Boundary Clamp
     liveActivity.updatePiPPosition(-50, 300);
     const clampedLeft = liveActivity.getPiP().position.x;
     expect(clampedLeft).toBe(8); // Clamped strictly to minX: 8

     // Empirical Check 3: Top/Bottom Boundary Clamp
     liveActivity.updatePiPPosition(100, 10);
     expect(liveActivity.getPiP().position.y).toBe(60); // Clamped strictly to minY: 60
     liveActivity.updatePiPPosition(100, 9999);
     expect(liveActivity.getPiP().position.y).toBe(680); // Clamped strictly to maxY: 680
   });
   ```

2. **`src/__tests__/challenger2_multitasking_bezel.test.ts`:**
   - Lines 95-120:
     ```typescript
     it('verifies liveActivity.ts PiP coordinate bounds (maxX=220) strictly respect 372px screen bounds and avoid sensor occlusion', () => {
       const PIP_WIDTH = 144;
       const PIP_HEIGHT = 98;
       liveActivity.openPiP({ title: 'Adversarial Boundary Test' });
       liveActivity.updatePiPPosition(300, 480);
       const pos = liveActivity.getPiP().position;
       const pipRightEdge = pos.x + PIP_WIDTH;
       const overflowPx = Math.max(0, pipRightEdge - SCREEN_WIDTH);

       expect(pos.x).toBe(220);
       expect(pipRightEdge).toBe(364);
       expect(overflowPx).toBe(0);
       expect(pipRightEdge).toBeLessThanOrEqual(SCREEN_WIDTH);
       expect(pipRightEdge).toBeLessThan(CAMERA_CONTROL_SENSOR.left);
     });
     ```
   - Line 319:
     ```typescript
     expect(clamped.x).toBeGreaterThanOrEqual(8);
     ```

---

## 5. Verification Method

Once Worker M1 applies the code modifications:

1. **Verify Coordinate Clamping Unit Behavior:**
   ```powershell
   npx vitest run src/__tests__/adversarial_m1.test.ts
   npx vitest run src/__tests__/challenger2_multitasking_bezel.test.ts
   npx vitest run src/__tests__/liveActivity.test.ts
   ```
   *Expected:* All clamping tests pass with 0 errors.

2. **Verify Full Project Test Suite:**
   ```powershell
   npm test -- --run
   ```
   *Expected:* 13/13 test files passing, 224/224 tests passing.

3. **Verify TypeScript Compilation:**
   ```powershell
   npx tsc --noEmit
   ```
   *Expected:* Exit code 0, 0 diagnostic errors.

4. **Verify Production Bundle Build:**
   ```powershell
   npm run build
   ```
   *Expected:* Clean build in `dist/`.

5. **Invalidation Conditions:**
   - Any PiP position resulting in `position.x > 220` or `position.x < 8`.
   - Any PiP position resulting in `position.y > 680` or `position.y < 60`.
   - Calling `updatePiPPosition(NaN, 300)` returning `NaN` instead of clamped default `8`.
   - Visual clipping where the 144px PiP window right edge exceeds `372px` screen boundary.
