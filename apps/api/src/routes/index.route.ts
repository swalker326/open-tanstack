import { createRoute, z } from '@hono/zod-openapi';
import { createApp } from '../lib/create-app';

const indexRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Meta'],
  responses: {
    200: {
      description: 'API health endpoint',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
  },
});

const indexRouter = createApp().openapi(indexRoute, (c) => {
  return c.json({ message: 'Starter API up' }, 200);
});

export default indexRouter;
