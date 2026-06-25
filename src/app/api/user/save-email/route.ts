import { NextRequest } from 'next/server';
import { getOrCreateSession, linkEmail } from '@/lib/session';

export async function POST(req: NextRequest) {
  const { email }: { email: string } = await req.json();

  if (!email || !email.includes('@')) {
    return Response.json({ error: 'Invalid email' }, { status: 400 });
  }

  try {
    // Lazily create a session if one doesn't exist yet (e.g. intake degraded
    // to localStorage-only earlier), so a missing cookie isn't a hard failure.
    const sessionId = await getOrCreateSession();
    await linkEmail(sessionId, email.toLowerCase().trim());
    return Response.json({ ok: true });
  } catch (err) {
    // DB unreachable — the only remaining failure mode. Log it (so a future
    // outage is visible in Vercel logs instead of silent), then let the client
    // keep the email locally and show a calm "cloud unavailable" message.
    console.error('[save-email] failed to persist email:', err);
    return Response.json({ error: 'Cloud storage unavailable' }, { status: 503 });
  }
}
