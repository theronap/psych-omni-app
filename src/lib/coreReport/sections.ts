import { ProfileDimensions } from '@/types';
import { dominantOcean } from './bucket';

/**
 * The 10 core-report sections, in render order. Unlike modules (which key the
 * whole report off one driver), each core section keys off its OWN dimension
 * and picks a pre-written block from its seed bank. "Where to Go From Here" is
 * a composite assembled from the recommendation library (see seeds/recommendations).
 */
export interface CoreSection {
  /** Exact markdown header used in the rendered report. */
  title: string;
  /** Maps a profile to the seed-bank key for this section. */
  driverKey: (p: ProfileDimensions) => string;
  /** Authoring guidance only — not enforced at runtime. */
  wordTarget: string;
}

export const CORE_SECTIONS: CoreSection[] = [
  { title: 'Who You Are', driverKey: (p) => dominantOcean(p), wordTarget: '350-550' },
  { title: 'How You Think', driverKey: (p) => p.jungian.dominant, wordTarget: '350-550' },
  { title: 'How You Connect', driverKey: (p) => p.attachment.style, wordTarget: '350-550' },
  { title: 'Your Superpowers', driverKey: (p) => p.strengths[0] ?? 'Curiosity', wordTarget: '350-550' },
  { title: 'Your Kryptonite', driverKey: (p) => p.cognitiveDistortions.top3[0] ?? 'catastrophizing', wordTarget: '350-550' },
  { title: 'Hidden Patterns', driverKey: (p) => String(p.enneagram.primary), wordTarget: '350-550' },
  { title: "What's Driving You", driverKey: (p) => p.motivation.primaryDriver, wordTarget: '350-550' },
  { title: 'Your Blind Spots', driverKey: (p) => p.conflictStyle, wordTarget: '350-550' },
  { title: 'A Note on Your Shadow', driverKey: (p) => String(p.enneagram.primary), wordTarget: '200-300' },
  { title: 'Where to Go From Here', driverKey: () => 'composite', wordTarget: '4-5 recommendations' },
];
