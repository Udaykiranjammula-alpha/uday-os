# UDAY OS 2.0 · Interactive Phone Portfolio

> **"One device. My entire world."**  
> An interactive personal digital operating system inspired by modern smartphone hardware and interactions, engineered by **Uday Kiran Jammula**.

---

## 🌟 Overview

**UDAY OS** is not a static mockup, a screenshot gallery, or a basic landing page. It is a fully working, self-contained virtual smartphone experience designed to showcase software engineering, embedded systems research, UI/UX craftsmanship, and systems architecture.

Every application—from **Projects** and **GitHub** to **Terminal** and **Settings**—launches and operates **inside the virtual phone screen**, preserving hardware bezels, the Dynamic Island, and the status bar throughout the entire session.

---

## 📱 Hardware & OS Features

- **Titanium Device Frame**: Realistic metallic gradients, subtle bezel highlights, hardware buttons, and ambient lighting.
- **Interactive Dynamic Island**:
  - Compact default pill with camera lens and sensor dots.
  - Interactive expansion with an ambient lo-fi audio player and live equalizer bars.
  - Notification alerts for repository synchronization and project deployment.
- **Convincing Lock Screen**:
  - Live visitor digital clock & calendar.
  - Activity preview cards (GitHub activity & live Hospital Management demo).
  - Screen Flashlight mode (lights up virtual display).
  - Swipe-up, click, or keyboard unlock.
- **Internal In-Phone App Navigation**:
  - Reusable screen-state router supporting complete back-stack history.
  - Fluid spring transitions powered by Framer Motion.
  - Home indicator gesture bar that returns to the app grid from anywhere.
- **Spotlight Search (`⌘ K` / `Ctrl + K`)**:
  - Global fuzzy search across all applications, projects, skills, education, and milestones with arrow-key navigation.
- **Interactive Control Center**:
  - Functional screen brightness slider (applies real-time CSS brightness filter to virtual phone).
  - Audio effects toggle.
  - Dark / Light theme toggle.
  - Wallpaper tone cycle (Graphite, Midnight Violet, Cyber Cyan).
  - Network and Bluetooth simulation toggles.
  - Demo state reset.
- **Developer Terminal CLI Easter Egg**:
  - Sandboxed command shell with `help`, `about`, `projects`, `skills`, `github`, `contact`, `whoami`, `date`, `cat <topic>`, `theme <dark|light>`, `sudo`, `systeminfo`, and `clear`.
  - Command history navigation with `ArrowUp` and `ArrowDown`.

---

## 🚀 Built-In Applications

| App | Description | In-Phone Capabilities |
| :--- | :--- | :--- |
| **About Me** | Personal and engineering biography | Specializations, interests, values, degree credentials, and links. |
| **Projects** | Filterable project showcase | Categories: Web Dev, Embedded Systems, AI. Includes problem statements, solutions, step-by-step architectures, and inline diagrams. |
| **Demo Preview** | In-phone live app iframe | Real-time preview of deployed Vercel apps with browser bar and external fallback. |
| **GitHub** | Live public repo integration | REST API integration for `Udaykiranjammula-alpha` with client cache, stars, forks, and rate-limit fallbacks. |
| **LinkedIn** | In-phone professional profile | Custom styled profile card, education, strengths, and curated posts. |
| **Gallery (IG)** | Curated engineering gallery | 2x2 grid with hardware schematics, UI prototypes, and lightbox previews. |
| **Skills** | Qualitative engineering toolbox | Categorized into Languages, Frontend, Embedded/IoT, and AI/ML with descriptive levels (no arbitrary percentages). |
| **Resume** | PDF & Document viewer | Embedded PDF preview iframe, instant PDF download button, and external tab launcher. |
| **Contact** | Direct inbox & composer | Interactive in-phone email composer (`mailto:` launcher with pre-filled inputs) and clipboard copy action. |
| **Education** | Academic foundation | Verified B.Tech coursework and practical labs at KL University. |
| **Milestones** | Verified achievements | Hardware milestones, Vercel deployments, open-source work, and academic honors. |
| **Notes** | Dual-mode dev & scratchpad | Read Uday's architectural journal or leave an interactive visitor note saved to `localStorage`. |
| **Terminal** | Sandboxed developer CLI | Interactive bash emulator with real configuration responses. |
| **Settings** | Preferences & hardware config | Theme, wallpaper, reduced motion, and demo state reset. |

---

## 🛠️ Technology Stack

- **Framework**: React 18.3 (Strict Mode)
- **Language**: TypeScript 5.6 (Strict Type Checking)
- **Build Tool**: Vite 6.0 (ESM Bundler)
- **Animation**: Framer Motion 11.11
- **Icons**: Lucide React
- **Testing**: Vitest 5.0
- **Deployment**: Vercel SPA Configuration

---

## 💻 Local Setup & Execution

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Udaykiranjammula-alpha/uday-os.git
cd uday-os
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Navigate to `http://localhost:5173`.

### 3. Run Automated Tests
```bash
npm test
```
Executes the Vitest suite validating data integrity, external URLs, project schemas, and GitHub fallback services.

### 4. Build for Production
```bash
npm run build
```
Generates an optimized, tree-shaken static production bundle in `dist/`.

---

## ⚙️ Configuration Guide

All personal data, links, projects, and skills are centralized in typed modules under `src/data/`:

- **Identity & Links**: Edit [`src/data/profile.ts`](file:///c:/Users/ASUS/Documents/antigravity/busy-faraday/src/data/profile.ts) to update your name, email, LinkedIn URL, Instagram URL, and bio.
- **Projects**: Edit [`src/data/projects.ts`](file:///c:/Users/ASUS/Documents/antigravity/busy-faraday/src/data/projects.ts) to add or adjust project architectures, repositories, or demo links.
- **Skills**: Edit [`src/data/skills.ts`](file:///c:/Users/ASUS/Documents/antigravity/busy-faraday/src/data/skills.ts) to manage technical competencies.
- **Resume**: Replace [`public/resume.pdf`](file:///c:/Users/ASUS/Documents/antigravity/busy-faraday/public/resume.pdf) with your updated PDF document.

---

## 🚢 Deployment to Vercel

The repository includes a ready [`vercel.json`](file:///c:/Users/ASUS/Documents/antigravity/busy-faraday/vercel.json) file with SPA rewrite rules:
1. Connect your GitHub repository to [Vercel](https://vercel.com).
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Deploy!

---

## 🔒 Security & Privacy

- **No Secrets in Frontend**: Does not expose private API keys or tokens. GitHub requests utilize unauthenticated public endpoints with graceful rate-limiting fallbacks.
- **Safe Sandboxed Execution**: The in-phone terminal executes strictly predefined command handlers and does not evaluate raw JavaScript or arbitrary shell strings.
- **Privacy-First**: No invasive user telemetry or third-party trackers. All user notes and preferences remain client-side in `localStorage`.
