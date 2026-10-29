import type { NoteEntry } from '../types';

export const initialNotes: NoteEntry[] = [
  {
    id: 'note-uday-os',
    title: 'Why I Built UDAY OS: Personal Computing as Portfolio',
    date: 'Oct 2026',
    category: 'Architecture',
    excerpt: 'Traditional portfolio landing pages often feel disconnected from the developer\'s actual passion for computing.',
    content: [
      'Most developer portfolios are static grids of cards. But computing is dynamic, interactive, and tactile.',
      'By framing my digital identity within a virtual smartphone operating system, every project, skill, and interaction feels cohesive.',
      'Visitors explore a self-contained device: boot up, unlock, open apps, inspect code pipelines, run terminal commands, and toggle control center settings without ever leaving the viewport.',
    ],
  },
  {
    id: 'note-esp32-ml',
    title: 'Lessons in Edge AI: Two ESP32 Nodes Coordinating Inference',
    date: 'Sep 2026',
    category: 'Embedded Systems',
    excerpt: 'Overcoming the SRAM wall on microcontrollers by splitting feature ingestion and tensor arithmetic.',
    content: [
      'Microcontrollers excel at sensor sampling, but large tensor buffers quickly exhaust internal memory.',
      'Separating sensor acquisition on Node A and neural classification on Node B allowed both chips to operate within comfortable thermal and memory limits.',
      'The real engineering challenge was packet serialization latency—making sure the transmission cost did not exceed the compute savings.',
    ],
  },
  {
    id: 'note-workflow-ui',
    title: 'Designing the Hospital Management Interface',
    date: 'Aug 2026',
    category: 'UI/UX Engineering',
    excerpt: 'In high-stress medical environments, UI ergonomics can prevent critical human error.',
    content: [
      'Clinicians do not need flashy animations; they need clear triage hierarchy, rapid keyboard access, and unmistakable status indicators.',
      'I prioritized high contrast typography, persistent status badges, and rapid filtering over decorative flair.',
    ],
  },
];
