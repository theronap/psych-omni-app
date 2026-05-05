import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { ProfileDimensions } from '@/types';
import { MODULE_DEFINITIONS } from '@/lib/modules/definitions';
import { getBlockSeed } from '@/lib/modules/lookup';
import { db, reports } from '@/lib/db';
import { getSessionId } from '@/lib/session';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  const { moduleId } = await params;
  const { profile, openEnded, profileId }: {
    profile: ProfileDimensions;
    openEnded: Record<string, string>;
    profileId?: string;
  } = await req.json();

  const moduleDef = MODULE_DEFINITIONS[moduleId];
  if (!moduleDef) {
    return Response.json({ error: 'Unknown module' }, { status: 404 });
  }

  const blockSeed = getBlockSeed(moduleId, profile);
  const encoder = new TextEncoder();
  let fullContent = '';

  const systemPrompt = `${moduleDef.synthesisPrompt}

GROUNDING CONTEXT (the archetypal pattern for this person's type — use this as your foundation):
${blockSeed}

CRITICAL INSTRUCTIONS:
- Write 1,500-2,000 words total across all 5 sections
- Be specific to THIS person's actual data (numbers, combinations, open-ended responses)
- Never use generic self-help language
- Reference their actual scores when relevant
- The tone is warm but direct — like a perceptive friend who's done their homework
- Do not add preamble or "Here is your report" — begin with the first section header directly`;

  const userMessage = `Here is the full psychological profile to analyze:

OCEAN Scores: O=${profile.ocean.O}, C=${profile.ocean.C}, E=${profile.ocean.E}, A=${profile.ocean.A}, N=${profile.ocean.N}
Attachment Style: ${profile.attachment.style}
Enneagram Type: ${profile.enneagram.primary}
Jungian Functions: Dominant ${profile.jungian.dominant}, Auxiliary ${profile.jungian.auxiliary}
Top Values: ${profile.values.slice(0, 5).join(', ')}
IFS Primary Protector: ${profile.ifs.primaryProtector} / Exile Themes: ${profile.ifs.themes.join(', ')}
Cognitive Distortions: ${profile.cognitiveDistortions.top3.join(', ')} (${profile.cognitiveDistortions.severity} severity)
Emotion Regulation: ${profile.emotionRegulation.style} (awareness: ${profile.emotionRegulation.awareness}/7)
Decision Style: ${profile.decisionStyle.primary} (loss aversion: ${profile.decisionStyle.lossAversion}/7)
Conflict Style: ${profile.conflictStyle}
Top Strengths: ${profile.strengths.slice(0, 5).join(', ')}
Risk Tolerance: financial=${profile.riskTolerance.financial}/7, social=${profile.riskTolerance.social}/7, intellectual=${profile.riskTolerance.intellectual}/7
Self-Concept Clarity: ${Math.round(profile.selfConceptClarity * 100)}%
Locus of Control: internal=${profile.locusOfControl.internal}/7, external=${profile.locusOfControl.external}/7
Motivation: primary=${profile.motivation.primaryDriver}, fear=${profile.motivation.fearDriver}, aspiration=${profile.motivation.aspirationDriver}

OPEN-ENDED RESPONSES:
${openEnded.formativeChapter ? `Formative chapter: ${openEnded.formativeChapter}` : ''}
${openEnded.othersPerception ? `How others perceive them: ${openEnded.othersPerception}` : ''}
${openEnded.growthGap ? `Growth gap: ${openEnded.growthGap}` : ''}
${openEnded.regrettedDecision ? `Regretted decision: ${openEnded.regrettedDecision}` : ''}`;

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await client.messages.create({
          model: 'claude-sonnet-4-6',
          max_tokens: 4096,
          system: systemPrompt,
          messages: [{ role: 'user', content: userMessage }],
          stream: true,
        });

        for await (const event of response) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            fullContent += event.delta.text;
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }

        // Persist module report to DB
        let reportId = 'local';
        try {
          const sessionId = await getSessionId();
          if (sessionId && profileId) {
            const [saved] = await db.insert(reports).values({
              sessionId,
              profileId,
              moduleType: moduleId,
              content: fullContent,
            }).returning({ id: reports.id });
            reportId = saved.id;
          }
        } catch { /* non-fatal */ }

        const meta = JSON.stringify({ __reportId__: reportId, __moduleId__: moduleId });
        controller.enqueue(encoder.encode(`\n\n<!--META:${meta}:META-->`));
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  });
}
