import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// db is null when DATABASE_URL is not configured — routes degrade gracefully
const url = process.env.DATABASE_URL;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let db: any;

if (url) {
  const sql = neon(url);
  db = drizzle(sql, { schema });
} else {
  // Stub — throw on actual queries so callers catch and degrade
  db = new Proxy({}, {
    get: () => () => { throw new Error('DATABASE_URL not configured'); },
  });
}

export { db };
export * from './schema';
