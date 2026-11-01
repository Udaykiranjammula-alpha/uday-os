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
      'State management coordinates audio synthesis, window navigation, and reactive system services seamlessly.',
    ],
  },
  {
    id: 'note-algorithms',
    title: 'Algorithmic Systems: Graph Theory & Dynamic Programming',
    date: 'Sep 2026',
    category: 'Algorithms',
    excerpt: 'Optimizing high-throughput algorithmic pipelines on LeetCode and competitive programming platforms.',
    content: [
      'Mastering algorithmic paradigms—such as Dijkstra\'s shortest path, Fenwick trees, and memoized dynamic programming—shapes how I design resilient software architectures.',
      'When building search features and recommendation indices, implementing custom Trie structures and amortized O(1) LRU caches delivers sub-millisecond response times.',
      'Rigorous edge-case verification and complexity bounds analysis ensure production code performs deterministically under peak load.',
    ],
  },
  {
    id: 'note-kl-smart-campus',
    title: 'Smart Campus IoT & Edge ML Research at KL University',
    date: 'Aug 2026',
    category: 'KL University',
    excerpt: 'Coordinating distributed sensor telemetry and micro-edge inference across university facilities.',
    content: [
      'At KL University, our team developed a decentralized edge computing network for environmental monitoring and energy tracking across academic blocks.',
      'By pairing dual-core ESP32 microcontrollers with INT8-quantized TinyML models, we executed real-time acoustic anomaly detection directly at the sensor node.',
      'Data packets were securely synchronized over an encrypted Wi-Fi/LoRa mesh topology with an automated fallback protocol.',
    ],
  },
  {
    id: 'note-workflow-ui',
    title: 'Distributed Microservices & Clinician Workflow Systems',
    date: 'Jul 2026',
    category: 'Architecture',
    excerpt: 'In high-stress medical environments, UI ergonomics and distributed data integrity prevent critical errors.',
    content: [
      'Clinicians do not need decorative animations; they need clear triage hierarchy, rapid keyboard shortcuts, and persistent status indicators.',
      'I designed an event-driven microservices architecture backed by Redis pub/sub and optimistic UI updates for sub-50ms clinician workflow synchronization.',
      'Offline-first synchronization with IndexedDB and localStorage guarantees operational continuity even during hospital network interruptions.',
    ],
  },
  {
    id: 'note-embedded-hardware',
    title: 'Autonomous Embedded Hardware & RTOS Optimization',
    date: 'Jun 2026',
    category: 'KL University',
    excerpt: 'Low-level hardware driver development, SPI/I2C sensor timing, and FreeRTOS task priority tuning.',
    content: [
      'Hands-on laboratory work at KL University deep-dived into microcontroller architecture, direct memory access (DMA), and low-power sleep state transitions.',
      'Balancing interrupt service routines with FreeRTOS task scheduling taught me the critical value of deterministic latency and lock-free ring buffers.',
      'These foundational hardware lessons directly inform how I optimize web and backend concurrency.',
    ],
  },
];
