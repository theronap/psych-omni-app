import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { buildProfile } from '@/lib/scoring';
import { buildReportPrompt } from '@/lib/reportPrompt';
import { Answers } from '@/types';

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

  const { system, user } = buildReportPrompt(profile, openEnded);

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await client.messages.create({
          model: 'claude-sonnet-4-6',
          max_tokens: 8192,
          system,
          messages: [{ role: 'user', content: user }],
          stream: true,
        });

        for await (const event of response) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }

        const meta = JSON.stringify({ __profile__: profile });
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
