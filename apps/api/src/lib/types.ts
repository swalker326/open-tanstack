import type { RouteConfig, RouteHandler } from '@hono/zod-openapi';

type Session = { id: string; email?: string };

export type AppBindings = {
  Bindings: CloudflareBindings;
  Variables: {
    session?: Session;
    user?: { id: string; email?: string };
  };
};

export type AppRouteHandler<T extends RouteConfig> = RouteHandler<
  T,
  AppBindings
>;
