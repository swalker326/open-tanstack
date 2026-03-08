import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { useAuth } from '../stores/auth-store';

export const Route = createFileRoute('/')({
  component: Index,
  beforeLoad: async () => {
    const { isLoggedIn } = useAuth.getState();
    if (isLoggedIn) {
      throw redirect({ to: '/app' });
    }
  },
});

function Index() {
  const { login } = useAuth();
  return (
    <div>
      <div className="flex items-center justify-between gap-3 border-b border-b-neutral-200 p-3 sm:p-4">
        <div className="space-y-1">
          <Link to="/" className="[&.active]:font-bold">
            <h1 className="text-2xl font-semibold sm:text-3xl">
              Starter Platform
            </h1>
          </Link>
          <Link to="/about" className="[&.active]:font-bold">
            About
          </Link>
        </div>
        <div className="flex items-center justify-center">
          <button
            className="cursor-pointer rounded-md bg-linear-to-br from-pink-400 to-pink-700 px-4 py-2 text-base font-bold text-white hover:bg-linear-to-br hover:from-pink-500 hover:to-pink-900 sm:text-lg"
            type="button"
            onClick={() => {
              login();
            }}
          >
            Login
          </button>
        </div>
      </div>
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-14">
        <div className="space-y-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
            Starter Platform
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl lg:text-4xl">
            Build quickly with a modern TypeScript stack
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-neutral-600 sm:text-base">
            This starter combines fast frontend tooling, typed APIs, and
            OpenAuth flows so you can ship product features without rebuilding
            app infrastructure from scratch.
          </p>
        </div>

        <section className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2">
          <article className="rounded-xl border border-neutral-200 bg-white p-4">
            <h2 className="text-sm font-semibold text-neutral-900">Frontend</h2>
            <p className="mt-1 text-sm text-neutral-600">
              React 19 + TanStack Router + Rsbuild for a fast DX and scalable
              routing.
            </p>
          </article>
          <article className="rounded-xl border border-neutral-200 bg-white p-4">
            <h2 className="text-sm font-semibold text-neutral-900">API</h2>
            <p className="mt-1 text-sm text-neutral-600">
              Hono on Cloudflare Workers with OpenAPI tooling and typed clients.
            </p>
          </article>
          <article className="rounded-xl border border-neutral-200 bg-white p-4">
            <h2 className="text-sm font-semibold text-neutral-900">Auth</h2>
            <p className="mt-1 text-sm text-neutral-600">
              OpenAuth with PKCE and refresh token handling for secure sessions.
            </p>
          </article>
          <article className="rounded-xl border border-neutral-200 bg-white p-4">
            <h2 className="text-sm font-semibold text-neutral-900">Data</h2>
            <p className="mt-1 text-sm text-neutral-600">
              Drizzle-powered data layer with shared types across packages.
            </p>
          </article>
        </section>
      </main>
    </div>
  );
}
