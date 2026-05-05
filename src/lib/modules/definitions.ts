import { ProfileDimensions } from '@/types';

export interface ModuleDefinition {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string; // emoji
  estimatedTime: string;
  primaryDriverKey: (profile: ProfileDimensions) => string;
  synthesisPrompt: string; // injected into Claude system prompt
}

export const MODULE_DEFINITIONS: Record<string, ModuleDefinition> = {
  shadow_self: {
    id: 'shadow_self',
    name: 'Shadow Self Report',
    tagline: 'What you buried — and how it runs your life from underground.',
    description: 'The traits you suppressed to function. How they leak out, sabotage you, and what integrating them actually looks like.',
    icon: '🌑',
    estimatedTime: '~45 sec',
    primaryDriverKey: (p) => String(p.enneagram.primary),
    synthesisPrompt: `You are analyzing a person's psychological shadow — the traits they've buried, denied, or projected onto others.
Structure the report in 5 sections using ## headers:
## Your Shadow Profile
## How It Leaks Out
## Where It Helps You (Secretly)
## Where It Costs You
## Integrating Your Shadow

Each section 250-350 words. Be specific to their Enneagram type and attachment style. Reference their actual OCEAN scores. The shadow is not bad — it's the unlived life. Treat it that way.`,
  },

  cognitive_bias: {
    id: 'cognitive_bias',
    name: 'Cognitive Bias Scanner',
    tagline: 'The specific ways your brain bends reality.',
    description: 'Your top cognitive distortions, where they activate, how dangerous they are in your life right now, and the exact thoughts to watch for.',
    icon: '🔍',
    estimatedTime: '~40 sec',
    primaryDriverKey: (p) => p.cognitiveDistortions.top3[0],
    synthesisPrompt: `You are analyzing the cognitive distortions that shape how this person perceives reality.
Structure in 5 sections:
## Your Bias Profile
## How This Bias Distorts Your Reality
## Where It Appears Most (Relationships / Work / Self-Talk)
## The Cost — What It's Made You Miss
## Rewiring It

Each section 250-350 words. Reference their specific distortions, severity level, and decision style. This should feel uncomfortably accurate. Don't soften the diagnosis.`,
  },

  internal_conflict: {
    id: 'internal_conflict',
    name: 'Internal Conflict Mapper',
    tagline: 'The war inside you — and what it\'s actually about.',
    description: 'The competing drives creating your most persistent internal friction. Why you\'re paralyzed on certain decisions. What the war is really about.',
    icon: '⚔️',
    estimatedTime: '~45 sec',
    primaryDriverKey: (p) => String(p.enneagram.primary),
    synthesisPrompt: `You are mapping the competing internal drives — the psychological civil war this person fights.
Structure in 5 sections:
## Your Internal Conflict Map
## The Two Sides in Conflict
## Where It Shows Up Most Destructively
## What Each Side Actually Needs
## Finding a Truce

Each section 250-350 words. Reference their values hierarchy tension, IFS parts, and Enneagram drives. The goal is to make them feel seen — like someone finally named the thing they've been living with.`,
  },

  narrative_identity: {
    id: 'narrative_identity',
    name: 'Narrative Identity Analyzer',
    tagline: 'The story you\'re living — and whether it\'s yours.',
    description: 'Your dominant life narrative: the unconscious story that frames every major decision, relationship, and setback. Who\'s the protagonist? What\'s the plot?',
    icon: '📖',
    estimatedTime: '~45 sec',
    primaryDriverKey: (p) => p.attachment.style,
    synthesisPrompt: `You are analyzing the narrative identity — the dominant story this person is unconsciously living.
Structure in 5 sections:
## Your Life Narrative
## How This Story Was Written
## The Story\'s Strengths
## Where the Story Becomes a Cage
## Rewriting the Narrative

Each section 250-350 words. Reference their attachment style, formative chapter open-ended response, values, and strengths. This is the most meaning-making report on the platform — make it feel like it matters.`,
  },

  blindspot: {
    id: 'blindspot',
    name: 'Blind Spot Finder',
    tagline: 'What everyone around you sees that you can\'t.',
    description: 'Your systematic self-perception gaps. The patterns you\'re in that you can\'t see. What people who know you well would say if they were being completely honest.',
    icon: '👁️',
    estimatedTime: '~40 sec',
    primaryDriverKey: (p) => {
      const scc = p.selfConceptClarity;
      if (scc < 0.4) return 'low';
      if (scc < 0.65) return 'medium';
      return 'high';
    },
    synthesisPrompt: `You are surfacing the blind spots — what this person systematically cannot see about themselves.
Structure in 5 sections:
## Your Blind Spot Profile
## The Pattern You\'re In
## How Others Experience This
## The Cost of Not Seeing It
## Getting Eyes on Your Blind Spots

Each section 250-350 words. Reference self-concept clarity score, OCEAN scores especially Agreeableness and Neuroticism, cognitive distortions, conflict style. Be honest and specific — this report has the most value when it says the uncomfortable thing.`,
  },

  motivation_source: {
    id: 'motivation_source',
    name: 'Motivation Source Analyzer',
    tagline: 'What actually drives you — not what you tell yourself.',
    description: 'Fear vs. aspiration vs. meaning vs. status. The real fuel behind your effort. How sustainable it is — and what happens when it runs out.',
    icon: '⚡',
    estimatedTime: '~35 sec',
    primaryDriverKey: (p) => p.motivation.primaryDriver,
    synthesisPrompt: `You are analyzing the motivational engine — what actually drives this person versus what they tell themselves drives them.
Structure in 5 sections:
## Your Motivation Profile
## The Engine Running Your Life
## Where This Fuel Works (and Where It\'s Rocket Fuel)
## Where This Fuel Burns Out (or Burns You)
## Building a More Sustainable Drive

Each section 250-350 words. Reference their motivation primary driver, fear driver, aspiration driver, locus of control, and values hierarchy. Be honest about whether their drive is sustainable. Most people are running on fuel that has hidden costs.`,
  },

  overthinking: {
    id: 'overthinking',
    name: 'Overthinking Diagnosis',
    tagline: 'When your mind becomes the obstacle.',
    description: 'Your specific overthinking triggers, the loop you get stuck in, and what you\'re actually avoiding when you think instead of act.',
    icon: '🌀',
    estimatedTime: '~40 sec',
    primaryDriverKey: (p) => p.emotionRegulation.style,
    synthesisPrompt: `You are diagnosing the overthinking patterns — when and how this person's thinking becomes avoidance.
Structure in 5 sections:
## Your Overthinking Profile
## The Loop You Get Stuck In
## What You\'re Actually Avoiding
## The Cost of the Loop
## Breaking the Pattern

Each section 250-350 words. Reference emotion regulation style, cognitive distortions, decision style, Neuroticism (N score), and their open-ended responses. Overthinking is always about something — name what it is for this person specifically.`,
  },

  emotional_trigger: {
    id: 'emotional_trigger',
    name: 'Emotional Trigger Blueprint',
    tagline: 'What sets you off, why, and how predictable it is.',
    description: 'Your specific emotional tripwires. The internal sequence from trigger to reaction. Why these things hit so hard — and how to get ahead of the next one.',
    icon: '🔥',
    estimatedTime: '~40 sec',
    primaryDriverKey: (p) => p.attachment.style,
    synthesisPrompt: `You are mapping the emotional trigger blueprint — the specific tripwires and the internal sequence from trigger to reaction.
Structure in 5 sections:
## Your Trigger Blueprint
## The Tripwires (What Sets You Off)
## The Internal Sequence (What Happens Inside)
## Why These Hit So Hard
## Getting Ahead of the Pattern

Each section 250-350 words. Reference attachment style, IFS exile themes, emotion regulation style, Enneagram type, and open-ended responses about conflict. This should feel like a map they didn't know existed.`,
  },

  mental_energy: {
    id: 'mental_energy',
    name: 'Mental Energy Map',
    tagline: 'When and how your mind works best — and worst.',
    description: 'Your cognitive rhythm. The conditions that produce your best thinking. What drains you without you noticing. How to design your environment around how your brain actually works.',
    icon: '🧠',
    estimatedTime: '~35 sec',
    primaryDriverKey: (p) => {
      const E = p.ocean.E;
      if (E < 35) return 'low';
      if (E < 65) return 'medium';
      return 'high';
    },
    synthesisPrompt: `You are mapping the mental energy profile — the cognitive rhythm, peak conditions, and drain patterns for this person.
Structure in 5 sections:
## Your Mental Energy Profile
## When Your Mind Works Best
## What Drains You (That You Probably Don\'t Realize)
## Your Cognitive Rhythm
## Designing Your Environment for Peak Thinking

Each section 250-350 words. Reference Extraversion score, Jungian dominant function, Openness, decision style, and any relevant open-ended context. This should give them practical, immediately actionable insight about how to structure their days.`,
  },

  decision_pattern: {
    id: 'decision_pattern',
    name: 'Decision Pattern Analyzer',
    tagline: 'Your decision algorithm — and exactly where it breaks.',
    description: 'The cognitive sequence you run when making decisions. Your consistent failure modes. The biases that show up every time. And the specific decisions where your pattern is most dangerous.',
    icon: '🎯',
    estimatedTime: '~40 sec',
    primaryDriverKey: (p) => p.decisionStyle.primary,
    synthesisPrompt: `You are analyzing the decision-making pattern — the algorithm this person runs and precisely where it breaks down.
Structure in 5 sections:
## Your Decision Profile
## How You Actually Make Decisions
## Where the Algorithm Breaks
## Your Most Dangerous Decision Type
## Upgrading Your Process

Each section 250-350 words. Reference decision style, loss aversion score, risk tolerance across financial/social/intellectual, locus of control, cognitive distortions. Be specific about the failure modes — vague decision advice is useless.`,
  },

  personal_leverage: {
    id: 'personal_leverage',
    name: 'Personal Leverage Report',
    tagline: 'Your highest-ROI personal actions.',
    description: 'The small moves that produce disproportionate results for you specifically. What to double down on, what to stop doing, and the one thing you\'re probably underusing.',
    icon: '🏋️',
    estimatedTime: '~40 sec',
    primaryDriverKey: (p) => p.strengths[0] || 'Curiosity',
    synthesisPrompt: `You are identifying the personal leverage points — where small effort produces disproportionate results for this specific person.
Structure in 5 sections:
## Your Leverage Profile
## Your Highest-ROI Move
## What to Stop Doing (It\'s Costing You More Than You Think)
## The Strength You\'re Underusing
## A 90-Day Leverage Plan

Each section 250-350 words. Reference their top strengths, values hierarchy, Enneagram type, and motivation source. Be specific to their actual profile data — generic "lean into your strengths" advice is not what this is.`,
  },

  life_as_game: {
    id: 'life_as_game',
    name: 'Life as a Game Engine',
    tagline: 'Your life reframed as RPG mechanics.',
    description: 'Your stats, your class, your boss enemies, your hidden quests, your party composition needs — your psychological profile as a game system.',
    icon: '🎮',
    estimatedTime: '~45 sec',
    primaryDriverKey: (p) => String(p.enneagram.primary),
    synthesisPrompt: `You are reframing this person's psychological profile as game mechanics — their life as an RPG system. This is playful but grounded in real psychology.
Structure in 5 sections:
## Your Character Sheet
## Your Strongest Stats (and Where You\'re OP)
## Your Weakest Stats (Where You\'re Underleveled)
## Your Boss Enemies (The Recurring Challenges That Keep Reappearing)
## Your Main Quest and Hidden Side Quests

Each section 250-350 words. Use game language (stats, XP, quests, party members, boss mechanics, power-ups) but ground every mechanic in their actual psychological data. Map OCEAN scores to stats. Map cognitive distortions to debuffs. Map strengths to class abilities. This should be genuinely fun to read while being surprisingly accurate.`,
  },
};

export const MODULE_ORDER = [
  'shadow_self',
  'cognitive_bias',
  'internal_conflict',
  'narrative_identity',
  'blindspot',
  'motivation_source',
  'overthinking',
  'emotional_trigger',
  'mental_energy',
  'decision_pattern',
  'personal_leverage',
  'life_as_game',
];
