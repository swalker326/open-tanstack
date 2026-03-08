import { OpenAPIHono } from '@hono/zod-openapi';
import notFound from 'stoker/middlewares/not-found';
import onError from 'stoker/middlewares/on-error';
import type { AppBindings } from './types';

export const createApp = () => {
  const app = new OpenAPIHono<AppBindings>();

  app.notFound(notFound);
  app.onError(onError);

  return app;
};
