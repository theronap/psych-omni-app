import { ProfileDimensions } from '@/types';

export function buildReportPrompt(
  profile: ProfileDimensions,
  openEnded: Record<string, string>
): { system: string; user: string } {
  const system = `You are writing a comprehensive psychological self-analysis report for a person who has just completed a detailed psychological intake questionnaire.

Your role: You are a world-class psychological analyst — the intersection of a Jungian therapist, a behavioral scientist, and a perceptive biographer. You have deep knowledge of personality psychology, attachment theory, cognitive behavioral therapy, internal family systems, and motivational psychology.

Tone and style:
- Warm but unflinching. You tell the truth with kindness, not with softness.
- Conversational and direct — never clinical, never academic, never generic.
- Write as if you have known this person for years and can see them clearly.
- Occasionally surprising. The best moments are when the reader thinks "how did it know that?"
- Accessible to a mainstream audience — no jargon without explanation.
- No filler sentences. Every sentence earns its place.

Report structure — write these 10 sections IN ORDER, using these EXACT headers:

## Who You Are
## How You Think
## How You Connect
## Your Superpowers
## Your Kryptonite
## Hidden Patterns
## What's Driving You
## Your Blind Spots
## A Note on Your Shadow
## Where to Go From Here

Each section: 350–550 words of flowing prose. "A Note on Your Shadow" can be 200–300 words. "Where to Go From Here" should include 4–5 specific recommendations tied to their actual data.

Critical rules:
- NEVER be generic. Every observation must be tied to their specific data.
- Write in flowing prose only — no bullet points anywhere.
- Name their specific cognitive distortions, attachment style, enneagram type, strengths, and values in behavioral terms.
- Total target: 4,500–6,000 words.
- Output clean markdown with ## headers only.`;

  const user = `Here is the person's complete psychological profile:

## Big Five / OCEAN (0–100)
Openness: ${profile.ocean.O} | Conscientiousness: ${profile.ocean.C} | Extraversion: ${profile.ocean.E} | Agreeableness: ${profile.ocean.A} | Neuroticism: ${profile.ocean.N}

## Attachment Style
Primary: ${profile.attachment.style}
Scores — Secure: ${profile.attachment.scores.secure || 0}, Anxious: ${profile.attachment.scores.anxious || 0}, Avoidant: ${profile.attachment.scores.avoidant || 0}, Disorganized: ${profile.attachment.scores.disorganized || 0}

## Enneagram
Primary type: ${profile.enneagram.primary}
All scores (1–7): ${Object.entries(profile.enneagram.scores).map(([k, v]) => `Type ${k}: ${v}`).join(', ')}

## Jungian Functions
Dominant: ${profile.jungian.dominant} | Auxiliary: ${profile.jungian.auxiliary}

## Core Values (most to least important)
${profile.values.join(', ')}

## Internal Family Systems
Primary protector: ${profile.ifs.primaryProtector}
Exile themes: ${profile.ifs.themes.join(', ')}

## Cognitive Distortions
Top 3: ${profile.cognitiveDistortions.top3.join(', ')}
Severity: ${profile.cognitiveDistortions.severity}

## Emotion Regulation
Style: ${profile.emotionRegulation.style}
Emotional awareness (1–7): ${profile.emotionRegulation.awareness}

## Decision Making
Primary style: ${profile.decisionStyle.primary}
Loss aversion (1–7): ${profile.decisionStyle.lossAversion}

## Conflict Style
${profile.conflictStyle}

## Signature Strengths
${profile.strengths.join(', ')}

## Risk Tolerance (1–7)
Financial: ${profile.riskTolerance.financial} | Social: ${profile.riskTolerance.social} | Intellectual: ${profile.riskTolerance.intellectual}

## Self-Concept Clarity
${profile.selfConceptClarity} (0 = very unclear, 1 = very clear)

## Locus of Control (1–7)
Internal: ${profile.locusOfControl.internal} | External: ${profile.locusOfControl.external}

## Motivation
Primary driver: ${profile.motivation.primaryDriver}
Fear driver: ${profile.motivation.fearDriver}
Aspiration driver: ${profile.motivation.aspirationDriver}

## In Their Own Words

Formative chapter of their life:
${openEnded.formativeChapter || '[Not provided]'}

What others consistently say about them:
${openEnded.othersPerception || '[Not provided]'}

The gap between who they are and who they want to become:
${openEnded.growthGap || '[Not provided]'}

A decision they deeply regret:
${openEnded.regrettedDecision || '[Not provided]'}

---

Write the complete psychological report now. Be specific, be honest, be warm, and be unforgettable.`;

  return { system, user };
}
