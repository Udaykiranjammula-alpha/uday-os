import type { CuratedPost } from '../types';

export const curatedPosts: CuratedPost[] = [
  {
    id: 'post-1',
    title: 'Systems Thinking in Modern Engineering',
    tag: '#SoftwareEngineering',
    date: '2d ago',
    detail: 'Great software is not just about writing clean functions; it is about understanding how user intent flows through network hops, operating system buffers, and silicon registers. When you respect the entire stack, everything runs faster.',
    stats: { likes: 48, comments: 12 },
  },
  {
    id: 'post-2',
    title: 'Microcontroller Telemetry & Edge AI',
    tag: '#EmbeddedSystems',
    date: '1w ago',
    detail: 'Measuring is knowing. In our two-node ESP32 ML experiments, isolating the transport latency from the model compute latency was the breakthrough that helped us optimize packet sizes from 64-byte chunks down to 18-byte packed structs.',
    stats: { likes: 62, comments: 19 },
  },
  {
    id: 'post-3',
    title: 'Building in Public: UDAY OS Release',
    tag: '#BuildInPublic',
    date: '2w ago',
    detail: 'Excited to present UDAY OS—an interactive in-phone portfolio experience. Every interaction, back-stack transition, and terminal command stays contained within a simulated mobile shell.',
    stats: { likes: 95, comments: 27 },
  },
];
