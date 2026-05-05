import { shadowSelfSeeds } from './seeds/shadowSelf';
import { cognitiveBiasSeeds } from './seeds/cognitiveBias';
import { internalConflictSeeds } from './seeds/internalConflict';
import { narrativeIdentitySeeds } from './seeds/narrativeIdentity';
import { blindspotSeeds } from './seeds/blindspot';
import { motivationSourceSeeds } from './seeds/motivationSource';
import { overthinkingSeeds } from './seeds/overthinking';
import { emotionalTriggerSeeds } from './seeds/emotionalTrigger';
import { mentalEnergySeeds } from './seeds/mentalEnergy';
import { decisionPatternSeeds } from './seeds/decisionPattern';
import { personalLeverageSeeds } from './seeds/personalLeverage';
import { lifeAsGameSeeds } from './seeds/lifeAsGame';

export const BLOCK_SEEDS: Record<string, Record<string, Record<string, string>>> = {
  shadow_self: shadowSelfSeeds,
  cognitive_bias: cognitiveBiasSeeds,
  internal_conflict: internalConflictSeeds,
  narrative_identity: narrativeIdentitySeeds,
  blindspot: blindspotSeeds,
  motivation_source: motivationSourceSeeds,
  overthinking: overthinkingSeeds,
  emotional_trigger: emotionalTriggerSeeds,
  mental_energy: mentalEnergySeeds,
  decision_pattern: decisionPatternSeeds,
  personal_leverage: personalLeverageSeeds,
  life_as_game: lifeAsGameSeeds,
};
