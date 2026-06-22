import { ProfileDimensions } from '@/types';

/**
 * Returns the single most-extreme OCEAN trait as a driver key, e.g. "O_high".
 * "Most extreme" = furthest from the neutral midpoint (50). This is how the
 * "Who You Are" section picks its lead trait without exploding into a 3^5
 * cross-product of all five dimensions.
 */
export function dominantOcean(p: ProfileDimensions): string {
  const dims: Array<[string, number]> = [
    ['O', p.ocean.O],
    ['C', p.ocean.C],
    ['E', p.ocean.E],
    ['A', p.ocean.A],
    ['N', p.ocean.N],
  ];
  let best = dims[0];
  let bestDist = -1;
  for (const d of dims) {
    const dist = Math.abs(d[1] - 50);
    if (dist > bestDist) {
      bestDist = dist;
      best = d;
    }
  }
  const [trait, val] = best;
  return `${trait}_${val >= 50 ? 'high' : 'low'}`;
}

/** Quantize a continuous value into low / medium / high by two thresholds. */
export function bucket3(v: number, lo: number, hi: number): 'low' | 'medium' | 'high' {
  if (v <= lo) return 'low';
  if (v >= hi) return 'high';
  return 'medium';
}
