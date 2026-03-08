import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/about')({
  component: About,
});

const apps = [
  {
    name: 'apps/web',
    title: 'Frontend App',
    stack: 'React 19, TanStack Router, Rsbuild, Tailwind CSS',
    details:
      'Public and protected UI routes, login/logout state, and client-side auth store using Zustand.',
  },
  {
    name: 'apps/api',
    title: 'API Worker',
    stack: 'Hono, Zod OpenAPI, Drizzle ORM, Cloudflare Workers',
    details:
      'Typed HTTP API with OpenAPI docs, CORS setup, auth middleware, and user CRUD/me endpoints.',
  },
  {
    name: 'apps/auth',
    title: 'Auth Issuer',
    stack: 'OpenAuth, GitHub OAuth, Cloudflare KV, Cloudflare Workers',
    details:
      'Issues auth sessions/tokens, validates provider data, resolves user identity, and provisions users in the shared database.',
  },
];

const packages = [
  {
    name: 'packages/database',
    title: 'Shared Database Layer',
    stack: 'Drizzle ORM, libSQL, Zod schemas',
    details:
      'Exports schema, query helpers, and typed validators. Current schema includes a users table with soft-delete and indexed lookups.',
  },
  {
    name: 'packages/subjects',
    title: 'Shared Auth Subjects',
    stack: 'OpenAuth Subjects, Valibot',
    details:
      'Defines the canonical auth subject model (currently user id/email) reused by auth and API services for type-safe identity contracts.',
  },
];

function About() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <section className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
          Monorepo Architecture
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
          About this starter
        </h1>
        <p className="max-w-3xl text-sm leading-6 text-neutral-600 sm:text-base">
          This workspace is organized into deployable apps and shared packages.
          Apps handle runtime concerns while packages provide reusable typed
          modules used across services.
        </p>
      </section>

      <section className="mt-8 space-y-3 sm:mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-neutral-600">
          Apps
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {apps.map((app) => (
            <article
              key={app.name}
              className="rounded-xl border border-neutral-200 bg-white p-4"
            >
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-pink-600">
                {app.name}
              </p>
              <h3 className="mt-1 text-base font-semibold text-neutral-900">
                {app.title}
              </h3>
              <p className="mt-2 text-sm text-neutral-700">{app.details}</p>
              <p className="mt-3 text-xs text-neutral-500">{app.stack}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 space-y-3 sm:mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-neutral-600">
          Shared Packages
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {packages.map((pkg) => (
            <article
              key={pkg.name}
              className="rounded-xl border border-neutral-200 bg-white p-4"
            >
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-pink-600">
                {pkg.name}
              </p>
              <h3 className="mt-1 text-base font-semibold text-neutral-900">
                {pkg.title}
              </h3>
              <p className="mt-2 text-sm text-neutral-700">{pkg.details}</p>
              <p className="mt-3 text-xs text-neutral-500">{pkg.stack}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
