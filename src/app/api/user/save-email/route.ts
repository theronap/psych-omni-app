import { NextRequest } from 'next/server';
import { getSessionId, linkEmail } from '@/lib/session';

export async function POST(req: NextRequest) {
  const { email }: { email: string } = await req.json();

  if (!email || !email.includes('@')) {
    return Response.json({ error: 'Invalid email' }, { status: 400 });
  }

  try {
    const sessionId = await getSessionId();
    if (!sessionId) {
      return Response.json({ error: 'No active session' }, { status: 400 });
    }
    await linkEmail(sessionId, email.toLowerCase().trim());
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: 'Failed to save email' }, { status: 500 });
  }
}
