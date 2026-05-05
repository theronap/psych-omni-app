import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { buildProfile } from '@/lib/scoring';
import { buildReportPrompt } from '@/lib/reportPrompt';
import { Answers } from '@/types';
import { db, profiles, reports } from '@/lib/db';
import { getOrCreateSession } from '@/lib/session';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { answers }: { answers: Answers } = await req.json();

  const profile = buildProfile(answers);
  const openEnded = {
    formativeChapter: (answers['story1'] as string) || '',
    othersPerception: (answers['story2'] as string) || '',
    growthGap: (answers['story3'] as string) || '',
    regrettedDecision: (answers['story4'] as string) || '',
  };

  // Create anonymous session + persist profile before streaming
  let sessionId = 'local';
  let profileId = 'local';

  try {
    sessionId = await getOrCreateSession();
    const [savedProfile] = await db.insert(profiles).values({
      sessionId,
      dimensions: profile,
      openEnded,
    }).returning({ id: profiles.id });
    profileId = savedProfile.id;
  } catch {
    // DB unavailable — degrade gracefully to localStorage-only mode
  }

  const { system, user } = buildReportPrompt(profile, openEnded);
  const encoder = new TextEncoder();
  let fullContent = '';

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await client.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 8192,
          system,
          messages: [{ role: 'user', content: user }],
          stream: true,
        });

        for await (const event of response) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            fullContent += event.delta.text;
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }

        // Persist report to DB after stream completes
        let reportId = 'local';
        if (sessionId !== 'local') {
          try {
            const [savedReport] = await db.insert(reports).values({
              sessionId,
              profileId,
              moduleType: 'core',
              content: fullContent,
            }).returning({ id: reports.id });
            reportId = savedReport.id;
          } catch { /* non-fatal */ }
        }

        const meta = JSON.stringify({
          __profile__: profile,
          __reportId__: reportId,
          __profileId__: profileId,
          __sessionId__: sessionId,
        });
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
