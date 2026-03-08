import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

export const createDb = (CloudflareD1Binding: any) => {
  return drizzle(CloudflareD1Binding, { schema });
};
