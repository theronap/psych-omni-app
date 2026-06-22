import { whoYouAreSeeds } from './whoYouAre';
import { howYouThinkSeeds } from './howYouThink';
import { howYouConnectSeeds } from './howYouConnect';
import { superpowersSeeds } from './superpowers';
import { kryptoniteSeeds } from './kryptonite';
import { hiddenPatternsSeeds } from './hiddenPatterns';
import { drivingYouSeeds } from './drivingYou';
import { blindSpotsSeeds } from './blindSpots';
import { shadowNoteSeeds } from './shadowNote';

/** Section title -> (driver-key -> pre-written body). */
export const CORE_SEEDS: Record<string, Record<string, string>> = {
  'Who You Are': whoYouAreSeeds,
  'How You Think': howYouThinkSeeds,
  'How You Connect': howYouConnectSeeds,
  'Your Superpowers': superpowersSeeds,
  'Your Kryptonite': kryptoniteSeeds,
  'Hidden Patterns': hiddenPatternsSeeds,
  "What's Driving You": drivingYouSeeds,
  'Your Blind Spots': blindSpotsSeeds,
  'A Note on Your Shadow': shadowNoteSeeds,
};
