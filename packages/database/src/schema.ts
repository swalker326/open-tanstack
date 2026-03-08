import { sql } from 'drizzle-orm';
import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';

const now = sql`(unixepoch())`;
const prefixedId = (prefix: string) => `${prefix}_${nanoid()}`;

export const users = sqliteTable(
  'users',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => prefixedId('usr')),
    email: text('email').notNull(),
    avatarUrl: text('avatar_url'),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(now),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .default(now),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
  },
  (table) => [
    uniqueIndex('users_email_uq').on(table.email),
    index('users_deleted_at_idx').on(table.deletedAt),
  ],
);
