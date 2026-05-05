import { NextRequest } from 'next/server';
import { ProfileDimensions } from '@/types';
import { MODULE_DEFINITIONS } from '@/lib/modules/definitions';
import { getModuleSections } from '@/lib/modules/lookup';
import { db, reports } from '@/lib/db';
import { getSessionId } from '@/lib/session';

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

  const sections = getModuleSections(moduleId, profile);
  const content = Object.entries(sections)
    .map(([title, body]) => `## ${title}\n\n${body}`)
    .join('\n\n');

  let reportId = 'local';
  try {
    const sessionId = await getSessionId();
    if (sessionId && profileId) {
      const [saved] = await db.insert(reports).values({
        sessionId,
        profileId,
        moduleType: moduleId,
        content,
      }).returning({ id: reports.id });
      reportId = saved.id;
    }
  } catch { /* non-fatal */ }

  const meta = JSON.stringify({ __reportId__: reportId, __moduleId__: moduleId });
  const fullResponse = `${content}\n\n<!--META:${meta}:META-->`;

  return new Response(fullResponse, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
