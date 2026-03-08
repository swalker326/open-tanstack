import { createClient } from '@openauthjs/openauth/client';
import { subjects } from '@repo/subjects';
import { createMiddleware } from 'hono/factory';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import type { AppBindings } from '../lib/types';

export const openauthMiddleware = createMiddleware<AppBindings>(
  async (c, next) => {
    const token = c.req.header('Authorization')?.replace('Bearer ', '').trim();
    if (!token) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    const client = createClient({
      clientID: 'starter-api',
      fetch: c.env.AUTH.fetch,
      issuer: 'http://localhost:8788',
    });

    const verified = await client.verify(subjects, token);
    if (verified.err) {
      return c.json({ error: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED);
    }
    c.set('user', verified.subject.properties);
    await next();
  },
);
