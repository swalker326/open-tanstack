import type { OpenAPIHono } from '@hono/zod-openapi';
import { apiReference } from '@scalar/hono-api-reference';
import type { AppBindings } from './types';

export const configureOpenAPI = (app: OpenAPIHono<AppBindings>) => {
  app.doc('/doc', {
    openapi: '3.0.0',
    info: {
      title: 'Starter API',
      version: '1.0.0',
      description: 'API documentation for starter backend',
    },
  });

  app.get(
    '/reference',
    apiReference({
      url: '/doc',
    }),
  );
};
