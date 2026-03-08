import type { D1Database } from '@cloudflare/workers-types';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

export const createDb = (CloudflareD1Binding: D1Database) => {
  return drizzle(CloudflareD1Binding, { schema });
};
