import { createRoute, z } from '@hono/zod-openapi';
import { userInsertSchema, userSelectSchema } from '@repo/database';

const usersResponseSchema = z.object({
  data: z.array(userSelectSchema),
});

const userResponseSchema = z.object({
  data: userSelectSchema,
});

const errorResponseSchema = z.object({
  error: z.string(),
});

const createUserBodySchema = userInsertSchema.pick({
  email: true,
  avatarUrl: true,
});

export const listUsersRoute = createRoute({
  method: 'get',
  path: '/users',
  tags: ['Users'],
  responses: {
    200: {
      description: 'List users',
      content: {
        'application/json': {
          schema: usersResponseSchema,
        },
      },
    },
  },
});

export const getUserByIdRoute = createRoute({
  method: 'get',
  path: '/users/{id}',
  tags: ['Users'],
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    404: {
      description: 'User not found',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    200: {
      description: 'Get user by id',
      content: {
        'application/json': {
          schema: userResponseSchema,
        },
      },
    },
  },
});

export const createUserRoute = createRoute({
  method: 'post',
  path: '/users',
  tags: ['Users'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: createUserBodySchema,
        },
      },
      required: true,
    },
  },
  responses: {
    201: {
      description: 'Create user',
      content: {
        'application/json': {
          schema: userResponseSchema,
        },
      },
    },
  },
});
