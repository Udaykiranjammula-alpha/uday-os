import type { Project } from '../types';

export const projects: Project[] = [
  {
    id: 'hospital-management',
    title: 'Hospital Management System',
    category: 'Web Development',
    summary: 'A responsive full-featured hospital operations application organizing patient and clinical workflows.',
    problem: 'Healthcare clinics frequently struggle with fragmented patient intake, appointment scheduling, and queue coordination across departments.',
    solution: 'Designed an ergonomic single-page application dashboard providing real-time triage, patient registry, appointment scheduling, and staff records in a single interface.',
    features: [
      'Interactive patient registry and status tracker',
      'Doctor appointment scheduling & department queue board',
      'Responsive medical dashboard built for clinic screens',
      'Accessible forms with instant client-side validation',
      'Live deployment ready on Vercel with zero runtime lag',
    ],
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Vercel'],
    repo: 'https://github.com/Udaykiranjammula-alpha/hospital-management-system',
    demo: 'https://hospital-management-system-msz2.vercel.app/',
    accent: '#21d4fd',
    status: 'Live & Deployed',
    architecture: [
      { step: 'Patient Triage UI', detail: 'Modular React component tree with keyboard-navigable intake forms.' },
      { step: 'State Machine', detail: 'Centralized queue management controlling triage statuses and doctor availability.' },
      { step: 'Data Store', detail: 'Local storage and mock state persistence with reactive updates.' },
      { step: 'Production Edge', detail: 'Automated CI/CD build deployed to Vercel edge networks.' },
    ],
    contributions: [
      'Architected component hierarchy and responsive layout',
      'Implemented patient intake workflows and search filtering',
      'Optimized asset bundling to maintain fast initial paint times',
    ],
    challenges: 'Balancing data density with visual clarity so healthcare staff can glance at queue states without cognitive overload.',
    visuals: [
      {
        title: 'Triage Dashboard Flow',
        type: 'diagram',
        content: '[Registration Desk] ──> [Queue Dispatcher] ──> [Doctor Console]',
        caption: 'Workflow pipeline from initial patient intake to doctor consultation.'
      },
      {
        title: 'Component Pipeline',
        type: 'code',
        content: '<PatientQueue status="active" onTriage={handleTriageUpdate} />',
        caption: 'Declarative queue component orchestrating reactive updates.'
      }
    ],
  },
  {
    id: 'esp32-ml',
    title: 'ESP32 Distributed ML Accelerator',
    category: 'Embedded Systems',
    summary: 'Exploration of distributed machine learning inference across multiple synchronized ESP32 microcontroller nodes.',
    problem: 'Edge microcontrollers have restricted SRAM (typically 320KB-512KB) and computing power, making on-device deep neural network inference prohibitive for complex models.',
    solution: 'Architected a two-node ESP32 system where Node A handles signal acquisition and feature extraction, while Node B executes compressed model inference over high-speed local serial/Wi-Fi transport.',
    features: [
      'Two-node dual-core ESP32 pipeline architecture',
      'Separation of sensor ingestion and neural compute stages',
      'Rigorous telemetry isolating communication overhead from model compute time',
      'Quantized INT8 weights to fit within tight embedded memory limits',
      'Failover heartbeat keeping nodes synchronized',
    ],
    stack: ['ESP32', 'Embedded C/C++', 'FreeRTOS', 'TensorFlow Lite for Microcontrollers', 'SPI/Wi-Fi'],
    repo: 'https://github.com/Udaykiranjammula-alpha/esp32-distributed-ml-accelerator',
    accent: '#8b5cf6',
    status: 'Active Hardware Prototype',
    architecture: [
      { step: 'Sensor Node A', detail: 'Ingests analog sensor streams at high sample rates and runs lightweight FFT/feature vectorization.' },
      { step: 'Inter-Node Bus', detail: 'Transmits compressed feature vectors over dedicated low-latency serial bus or direct ESP-NOW packets.' },
      { step: 'Inference Node B', detail: 'Executes quantized classification layer using TFLite Micro kernel.' },
      { step: 'Telemetry Display', detail: 'Logs latency breakdown (compute vs transport) to serial monitor and web telemetry.' },
    ],
    contributions: [
      'Wrote FreeRTOS task schedulers on dual cores to prevent buffer overflows',
      'Formulated packet protocol separating framing bytes from float payloads',
      'Measured end-to-end latency benchmarks under simulated load',
    ],
    challenges: 'Minimizing serial transport jitter so inter-node transmission time does not outweigh the benefits of offloading model layers.',
    visuals: [
      {
        title: 'Hardware Interconnect',
        type: 'diagram',
        content: '[Node A: Sensor + FFT] ──(ESP-NOW / SPI Bus)──> [Node B: INT8 Inference]',
        caption: 'Physical separation of data ingestion and inference execution.'
      },
      {
        title: 'Benchmark Metrics',
        type: 'metric',
        content: 'Compute: 42ms | Transport: 9ms | Total Latency: ~51ms',
        caption: 'Isolated latency telemetry under 100-sample test run.'
      }
    ],
  },
  {
    id: 'nexus-presence',
    title: 'NEXUS-PRESENCE',
    category: 'Embedded Systems',
    summary: 'Multi-node Wi-Fi CSI/RSSI human presence detection and spatial movement visualization.',
    problem: 'Traditional infrared (PIR) sensors require direct line-of-sight and cannot detect stationary or obstructed human presence.',
    solution: 'Developed an ESP32 sensing node array that analyzes Wi-Fi Channel State Information (CSI) and signal fluctuations to map indoor presence without optical cameras, preserving privacy.',
    features: [
      'Privacy-preserving spatial presence detection without cameras',
      'Multi-node Wi-Fi signal amplitude and phase analysis',
      'Real-time WebSocket streaming to an interactive visual canvas',
      'Moving-average noise reduction filter for multipath stabilization',
      'Configurable sensitivity thresholds for zone occupancy',
    ],
    stack: ['ESP32', 'C/C++', 'Wi-Fi CSI', 'WebSockets', 'HTML5 Canvas', 'Python'],
    repo: 'https://github.com/Udaykiranjammula-alpha/NEXUS-PRESENCE',
    accent: '#f97316',
    status: 'Hardware Experiment',
    architecture: [
      { step: 'Wi-Fi Probe Transmitters', detail: 'Nodes broadcast regular 802.11 packets across subcarriers.' },
      { step: 'CSI Receiver Node', detail: 'Extracts subcarrier amplitude variations caused by physical movement.' },
      { step: 'Signal Filtering', detail: 'Applies sliding window median filter to eliminate ambient electromagnetic noise.' },
      { step: 'Spatial Canvas Map', detail: 'Renders dynamic heatmap representing occupancy vectors in real time.' },
    ],
    contributions: [
      'Configured ESP32 Wi-Fi promiscuous mode for raw frame capture',
      'Created web canvas heat map interface receiving WebSocket coordinate telemetry',
      'Documented environmental physical constraints and blind spots',
    ],
    challenges: 'Multipath reflections caused by metal furniture and concrete walls required fine-tuning mathematical filter thresholds.',
    visuals: [
      {
        title: 'RF Perturbation Flow',
        type: 'diagram',
        content: '[Wi-Fi Transmitter] ──(Human Movement Attenuation)──> [Receiver Node] ──> [Heatmap]',
        caption: 'Presence detection via ambient Wi-Fi wave disturbance.'
      }
    ],
  },
  {
    id: 'sri-ai',
    title: 'SRI AI Assistant',
    category: 'Artificial Intelligence',
    summary: 'A desktop AI assistant experiment focused on localized developer workflows and contextual task automation.',
    problem: 'Switching contexts between code editors, web browsers, and command line tools slows down technical workflows.',
    solution: 'Prototyped a desktop companion application with keyboard-driven command palettes, contextual prompt templates, and local execution caches.',
    features: [
      'Rapid hotkey activation with modal floating palette',
      'Contextual developer prompts for code review, refactoring, and command generation',
      'Local history cache with offline-first indexing',
      'Token consumption meter and response latency indicators',
    ],
    stack: ['TypeScript', 'Electron', 'React', 'Node.js', 'Tailwind CSS'],
    repo: 'https://github.com/Udaykiranjammula-alpha/sri-ai',
    accent: '#10b981',
    status: 'Prototype Stage',
    architecture: [
      { step: 'Desktop Shell', detail: 'Electron main process managing global shortcut hooks and window states.' },
      { step: 'Prompt Pipeline', detail: 'Context injection layer attaching active workspace metadata to queries.' },
      { step: 'Provider Adapter', detail: 'Unified API client interfacing with local LLM runtimes or cloud APIs.' },
      { step: 'Local Cache', detail: 'Zero-latency retrieval for previously solved technical snippets.' },
    ],
    contributions: [
      'Designed frictionless keyboard navigation patterns',
      'Implemented local caching layer preventing redundant API queries',
      'Integrated system clipboard hooks for instant snippet capture',
    ],
    challenges: 'Ensuring negligible desktop idle memory footprint while keeping the hotkey listener instantly responsive.',
    visuals: [
      {
        title: 'Context Flow',
        type: 'diagram',
        content: '[Global Hotkey] ──> [Workspace Context Injector] ──> [Adapter] ──> [Render Result]',
        caption: 'Instant keyboard-driven prompt orchestration cycle.'
      }
    ],
  },
];
