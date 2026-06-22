import { NextRequest } from 'next/server';
import { buildProfile } from '@/lib/scoring';
import { Answers } from '@/types';
import { db, profiles, reports } from '@/lib/db';
import { getOrCreateSession } from '@/lib/session';
import { assembleCoreReport } from '@/lib/coreReport/lookup';

export async function POST(req: NextRequest) {
  const { answers }: { answers: Answers } = await req.json();

  const profile = buildProfile(answers);
  const openEnded = {
    formativeChapter: (answers['story1'] as string) || '',
    othersPerception: (answers['story2'] as string) || '',
    growthGap: (answers['story3'] as string) || '',
    regrettedDecision: (answers['story4'] as string) || '',
  };

  // Create anonymous session + persist profile (best-effort).
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
    // DB unavailable — degrade gracefully to localStorage-only mode.
  }

  // Report is assembled from pre-written blocks — no LLM call, instant, $0,
  // and immune to API outages or usage caps.
  const content = assembleCoreReport(profile);

  // Persist the report (best-effort).
  let reportId = 'local';
  if (sessionId !== 'local') {
    try {
      const [savedReport] = await db.insert(reports).values({
        sessionId,
        profileId,
        moduleType: 'core',
        content,
      }).returning({ id: reports.id });
      reportId = savedReport.id;
    } catch {
      // non-fatal
    }
  }

  const meta = JSON.stringify({
    __profile__: profile,
    __reportId__: reportId,
    __profileId__: profileId,
    __sessionId__: sessionId,
  });

  // Keep the existing response contract: the client reads the body as a stream
  // and strips the META trailer.
  return new Response(`${content}\n\n<!--META:${meta}:META-->`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
