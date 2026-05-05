import { ProfileDimensions } from '@/types';
import { BLOCK_SEEDS } from './blockSeeds';
import { MODULE_DEFINITIONS } from './definitions';

export function getBlockSeed(moduleId: string, profile: ProfileDimensions): string {
  const def = MODULE_DEFINITIONS[moduleId];
  if (!def) return '';

  const driverValue = def.primaryDriverKey(profile);
  const moduleSeeds = BLOCK_SEEDS[moduleId];
  if (!moduleSeeds) return '';

  // Exact match first, then fallback to closest key
  return moduleSeeds[driverValue] ?? moduleSeeds[Object.keys(moduleSeeds)[0]] ?? '';
}
