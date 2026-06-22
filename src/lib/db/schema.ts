import { pgTable, text, jsonb, timestamp, uuid } from 'drizzle-orm/pg-core';

// Anonymous sessions — created when intake starts, persists forever via cookie
export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email'), // null until user provides it
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastActive: timestamp('last_active').defaultNow().notNull(),
});

// Psychological profiles — one per session (rebuilt if retaken)
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').notNull().references(() => sessions.id),
  dimensions: jsonb('dimensions').notNull(), // ProfileDimensions
  openEnded: jsonb('open_ended').notNull(),  // open-ended responses
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Generated reports — core + all module reports
export const reports = pgTable('reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').notNull().references(() => sessions.id),
  profileId: uuid('profile_id').notNull().references(() => profiles.id),
  moduleType: text('module_type').notNull(), // 'core' | 'shadow_self' | etc.
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
