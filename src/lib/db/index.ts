import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

const url = process.env.DATABASE_URL;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let db: any;

if (url) {
  // connection_limit=1 required for serverless (Supabase PgBouncer pooled mode)
  const client = postgres(url, { prepare: false });
  db = drizzle(client, { schema });
} else {
  db = new Proxy({}, {
    get: () => () => { throw new Error('DATABASE_URL not configured'); },
  });
}

export { db };
export * from './schema';
