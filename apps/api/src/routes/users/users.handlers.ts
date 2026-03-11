import { createDb, eq, schema } from '@repo/database';
import * as httpStatusCodes from 'stoker/http-status-codes';
import type { AppRouteHandler } from '../../lib/types';
import type {
  createUserRoute,
  getUserByIdRoute,
  getUserMeRoute,
  listUsersRoute,
} from './users.routes';

export const listUsersHandler: AppRouteHandler<typeof listUsersRoute> = async (
  c,
) => {
  const db = createDb(c.env.APP_DB);
  const users = await db.select().from(schema.users);

  return c.json({ data: users }, 200);
};

export const getUserMeHandler: AppRouteHandler<typeof getUserMeRoute> = async (
  c,
) => {
  const db = createDb(c.env.APP_DB);
  const userFromToken = c.get('user');
  if (!userFromToken) {
    return c.json({ error: 'Unauthorized' }, httpStatusCodes.UNAUTHORIZED);
  }

  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, userFromToken.id));

  if (!user) {
    return c.json({ error: 'User not found' }, httpStatusCodes.NOT_FOUND);
  }

  return c.json({ data: user }, httpStatusCodes.OK);
};

export const getUserByIdHandler: AppRouteHandler<
  typeof getUserByIdRoute
> = async (c) => {
  const db = createDb(c.env.APP_DB);
  const params = c.req.valid('param');

  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, params.id));

  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }

  return c.json({ data: user }, 200);
};

export const createUserHandler: AppRouteHandler<
  typeof createUserRoute
> = async (c) => {
  const db = createDb(c.env.APP_DB);
  const body = c.req.valid('json');

  const [user] = await db
    .insert(schema.users)
    .values({
      email: body.email,
      avatarUrl: body.avatarUrl ?? null,
    })
    .returning({
      id: schema.users.id,
      email: schema.users.email,
      avatarUrl: schema.users.avatarUrl,
      createdAt: schema.users.createdAt,
      updatedAt: schema.users.updatedAt,
      deletedAt: schema.users.deletedAt,
    });

  return c.json({ data: user }, 201);
};
