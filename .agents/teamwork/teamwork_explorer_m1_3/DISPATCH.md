# DISPATCH — Explorer M1_3: Persistent PiP Overlay & Bezel Constraints

## Mission
Analyze and provide the concrete implementation strategy for:
1. `src/components/PiPOverlay.tsx`:
   - Persistent draggable floating Picture-in-Picture window overlay
   - Draggable across the phone screen using Framer Motion (`drag`, `dragConstraints`)
   - Strictly constrained within iPhone screen bounds (`x: [8, 220]`, `y: [60, 680]`, `overflow: hidden; border-radius: 46px;`)
   - Video/canvas demo stream player with play/pause, seek, close, and minimize controls
   - Uninterrupted persistence across all app route transitions
2. Mounting in `src/components/IPhoneScreenContent.tsx` as a top-level persistent overlay.
3. Verification procedures: build verification and Robocopy synchronization command to `F:\app\udayport`.

## Inputs
- ORIGINAL_REQUEST.md: c:\Users\ASUS\Documents\antigravity\busy-faraday\.agents\teamwork\ORIGINAL_REQUEST.md
- PROJECT.md: c:\Users\ASUS\Documents\antigravity\busy-faraday\PROJECT.md
- Survey Report 1 & 3: `teamwork_explorer_survey_1/handoff.md`, `teamwork_explorer_survey_3/handoff.md`

## Outputs
Write your detailed recommendations to:
`c:\Users\ASUS\Documents\antigravity\busy-faraday\.agents\teamwork\teamwork_explorer_m1_3\handoff.md`


## 2026-11-01T15:45:28Z
You are Explorer M1_3 (teamwork_explorer).
Your working directory is: c:\Users\ASUS\Documents\antigravity\busy-faraday\.agents\teamwork\teamwork_explorer_m1_3

MANDATORY FIRST STEP: Read the user request file at:
c:\Users\ASUS\Documents\antigravity\busy-faraday\.agents\teamwork\ORIGINAL_REQUEST.md
Also read the project architecture at:
c:\Users\ASUS\Documents\antigravity\busy-faraday\PROJECT.md
Survey 1 report at:
c:\Users\ASUS\Documents\antigravity\busy-faraday\.agents\teamwork\teamwork_explorer_survey_1\handoff.md
And your dispatch file at:
c:\Users\ASUS\Documents\antigravity\busy-faraday\.agents\teamwork\teamwork_explorer_m1_3\DISPATCH.md

Your Mission:
Analyze and formulate the exact implementation blueprint for:
1. `src/components/PiPOverlay.tsx`:
   - Persistent draggable floating Picture-in-Picture window overlay
   - Draggable using Framer Motion with strict screen clamping (`x: [8, 220]`, `y: [60, 680]`, `border-radius: 46px; overflow: hidden;`)
   - Interactive demo video / canvas player with play/pause, seek, minimize, close
   - Seamless persistence across all screen routes in `src/components/IPhoneScreenContent.tsx`
2. Robocopy mirror command verification and deployment checklist for Milestone 1.

Output:
Write your handoff report to:
c:\Users\ASUS\Documents\antigravity\busy-faraday\.agents\teamwork\teamwork_explorer_m1_3\handoff.md
And send a concise message back to the orchestrator when finished.
