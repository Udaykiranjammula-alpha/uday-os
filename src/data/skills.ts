import type { SkillCategory } from '../types';

export const skillCategories: SkillCategory[] = [
  {
    category: 'Programming Languages',
    description: 'Languages used for core systems, algorithmic problems, and application development.',
    items: [
      { name: 'Python', level: 'Proficient', context: 'Data analysis, ML scripts, backend prototypes, and automation.' },
      { name: 'TypeScript', level: 'Proficient', context: 'Type-safe React applications, component architecture, and modern web tooling.' },
      { name: 'JavaScript (ESNext)', level: 'Proficient', context: 'Asynchronous event loops, DOM manipulation, and modern web APIs.' },
      { name: 'C / C++', level: 'Project Experience', context: 'Microcontroller programming, FreeRTOS tasks, and memory-constrained devices.' },
      { name: 'SQL', level: 'Project Experience', context: 'Relational data modeling, querying, and schema definition.' },
      { name: 'Rust', level: 'Exploring', context: 'Investigating memory safety models and low-level CLI development.' },
    ],
  },
  {
    category: 'Frontend & UI Engineering',
    description: 'Constructing accessible, high-performance, and fluid digital interfaces.',
    items: [
      { name: 'React 18', level: 'Proficient', context: 'Custom hooks, memoization, state machines, and compound component patterns.' },
      { name: 'Tailwind CSS & Modern CSS', level: 'Proficient', context: 'CSS custom properties, glassmorphism, responsive grid/flexbox layouts.' },
      { name: 'Framer Motion', level: 'Project Experience', context: 'Spring animations, drag gestures, layout morphing, and accessible transitions.' },
      { name: 'Accessibility (WCAG 2.2 AA)', level: 'Project Experience', context: 'Keyboard focus trapping, ARIA roles, semantic landmarks, and high contrast.' },
      { name: 'Vite & Webpack', level: 'Project Experience', context: 'Modern ESM bundling, tree-shaking, code splitting, and dev-server configuration.' },
    ],
  },
  {
    category: 'Embedded Systems & IoT',
    description: 'Bridging physical sensor environments with microcontroller compute.',
    items: [
      { name: 'ESP32 & Microcontrollers', level: 'Project Experience', context: 'Dual-core task management, GPIO interrupt handling, and sensor integration.' },
      { name: 'FreeRTOS', level: 'Project Experience', context: 'Queue IPC, semaphore synchronization, and real-time scheduling.' },
      { name: 'IoT Protocols (MQTT, ESP-NOW, HTTP)', level: 'Project Experience', context: 'Low-latency peer-to-peer transport and packet serialization.' },
      { name: 'Wi-Fi CSI / RF Telemetry', level: 'Practicing', context: 'Extracting physical presence signatures from subcarrier signal waves.' },
      { name: 'Sensor Pipelines (I2C, SPI, UART)', level: 'Project Experience', context: 'Wiring, signal conditioning, and analog-to-digital data ingestion.' },
    ],
  },
  {
    category: 'AI / Machine Learning & Tools',
    description: 'Applied machine learning pipelines and engineering workflows.',
    items: [
      { name: 'TensorFlow Lite Micro / Edge AI', level: 'Practicing', context: 'Quantized INT8 model deployment on resource-constrained microcontrollers.' },
      { name: 'Git & GitHub Workflows', level: 'Proficient', context: 'Branching, PR reviews, release tagging, and collaborative version control.' },
      { name: 'Linux / Termux Environment', level: 'Project Experience', context: 'Shell scripting, headless server administration, and process management.' },
      { name: 'REST APIs & Fetch Architecture', level: 'Proficient', context: 'Caching layers, exponential backoff, rate-limit resilience, and error boundaries.' },
    ],
  },
];
