# DISPATCH — E2E Test Writer (Dual Track)

## Mission
Design and implement the complete opaque-box E2E test infrastructure and comprehensive test suites for UDAY OS following the 4-tier methodology:
- Tier 1: Feature Coverage (>=5 tests per feature for all 31 features in PROJECT.md § Feature Inventory)
- Tier 2: Boundary & Corner Cases (>=5 tests per feature)
- Tier 3: Cross-Feature Combinations (pairwise interactions)
- Tier 4: Real-World Application Scenarios (realistic workflows)

Create `TEST_INFRA.md` at the project root (`c:\Users\ASUS\Documents\antigravity\busy-faraday\TEST_INFRA.md`).
Implement executable Vitest test suites under `src/__tests__/e2e/` (e.g. `dynamic_island.test.ts`, `compiler.test.ts`, `fitness.test.ts`, `spotlight.test.ts`, `embedded_lab.test.ts`, `mirroring.test.ts`, `genmoji.test.ts`, `haptics.test.ts`, `scenarios.test.ts`).
When complete and verified via `npm test -- --run`, generate and publish `TEST_READY.md` at project root.

## Inputs
- ORIGINAL_REQUEST.md: c:\Users\ASUS\Documents\antigravity\busy-faraday\.agents\teamwork\ORIGINAL_REQUEST.md
- PROJECT.md: c:\Users\ASUS\Documents\antigravity\busy-faraday\PROJECT.md
- Master Plan: C:\Users\ASUS\.gemini\antigravity\brain\ddeebe4f-4427-4e45-a9da-305e7c97659b\ultimate_advanced_features_plan.md

## Outputs
- `TEST_INFRA.md` at project root
- Test files in `src/__tests__/e2e/`
- `TEST_READY.md` at project root
- Handoff report at: `c:\Users\ASUS\Documents\antigravity\busy-faraday\.agents\teamwork\teamwork_test_writer_e2e_1\handoff.md`

## 2026-11-01T15:45:05Z
You are E2E Test Writer (teamwork_test_writer) for UDAY OS.
Your working directory is: c:\Users\ASUS\Documents\antigravity\busy-faraday\.agents\teamwork\teamwork_test_writer_e2e_1

MANDATORY FIRST STEP: Read the user request file at:
c:\Users\ASUS\Documents\antigravity\busy-faraday\.agents\teamwork\ORIGINAL_REQUEST.md
Also read the project architecture and feature inventory at:
c:\Users\ASUS\Documents\antigravity\busy-faraday\PROJECT.md
And your dispatch file at:
c:\Users\ASUS\Documents\antigravity\busy-faraday\.agents\teamwork\teamwork_test_writer_e2e_1\DISPATCH.md

Your Mission:
1. Create TEST_INFRA.md at the project root (c:\Users\ASUS\Documents\antigravity\busy-faraday\TEST_INFRA.md) according to the project pattern specification (Category-Partition, Boundary Value Analysis, Pairwise Combinatorial, and Real-World Workload Testing).
2. Author executable Vitest E2E test suites in src/__tests__/e2e/ covering:
   - Tier 1: Feature coverage (>=5 tests per feature across all 31 features)
   - Tier 2: Boundary and corner cases (empty arrays, max limits, timeouts, CRC noise)
   - Tier 3: Cross-feature combinations (e.g. Dynamic Island + Music + Clock + PiP, LeetCode + Island compiler gauge, Mac Mirroring + Clipboard + Genmoji)
   - Tier 4: Real-world recruiter & manager scenarios (running algorithms, inspecting telemetry, checking achievements)
3. Ensure all tests run with `npm test -- --run` and exit 0.
4. When test creation is complete, generate and publish `TEST_READY.md` at project root.
5. Write your handoff report to:
c:\Users\ASUS\Documents\antigravity\busy-faraday\.agents\teamwork\teamwork_test_writer_e2e_1\handoff.md
And send a concise message back to the orchestrator when finished.

