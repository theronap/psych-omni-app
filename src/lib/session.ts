import { cookies } from 'next/headers';
import { db, sessions } from './db';
import { eq } from 'drizzle-orm';

const COOKIE_NAME = 'psych_session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 90; // 90 days

export async function getOrCreateSession(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(COOKIE_NAME)?.value;

  if (existing) {
    // Refresh last_active
    await db.update(sessions)
      .set({ lastActive: new Date() })
      .where(eq(sessions.id, existing));
    return existing;
  }

  const [session] = await db.insert(sessions).values({}).returning({ id: sessions.id });
  cookieStore.set(COOKIE_NAME, session.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
  return session.id;
}

export async function getSessionId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value ?? null;
}

export async function getSession(sessionId: string) {
  const [session] = await db.select().from(sessions).where(eq(sessions.id, sessionId));
  return session ?? null;
}

export async function linkEmail(sessionId: string, email: string) {
  await db.update(sessions)
    .set({ email })
    .where(eq(sessions.id, sessionId));
}
