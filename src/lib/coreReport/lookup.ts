import { ProfileDimensions } from '@/types';
import { CORE_SECTIONS } from './sections';
import { CORE_SEEDS } from './seeds';
import { buildRecommendations } from './seeds/recommendations';

/**
 * Resolve every core section to a { title, body } pair for the given profile.
 * Each section looks up its driver key in its seed bank, falling back to the
 * first authored bucket if a key is missing (so the report never breaks even
 * if a bucket is unauthored). "Where to Go From Here" is assembled from the
 * recommendation library.
 */
export function getCoreReportSections(p: ProfileDimensions): Array<{ title: string; body: string }> {
  return CORE_SECTIONS.map((section) => {
    if (section.title === 'Where to Go From Here') {
      return { title: section.title, body: buildRecommendations(p) };
    }
    const bank = CORE_SEEDS[section.title] ?? {};
    const key = section.driverKey(p);
    const body = bank[key] ?? bank[Object.keys(bank)[0]] ?? '';
    return { title: section.title, body };
  });
}

/** Stitch the resolved sections into the final markdown report. */
export function assembleCoreReport(p: ProfileDimensions): string {
  return getCoreReportSections(p)
    .filter((s) => s.body)
    .map((s) => `## ${s.title}\n\n${s.body}`)
    .join('\n\n');
}
