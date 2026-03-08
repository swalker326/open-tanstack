import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { useAuth } from '../stores/auth-store';

export const Route = createFileRoute('/app')({
  component: RouteComponent,
  beforeLoad: async () => {
    const { isLoggedIn } = useAuth.getState();
    if (!isLoggedIn) {
      throw redirect({ to: '/' });
    }
  },
});

function RouteComponent() {
  const { logout } = useAuth();
  return (
    <div className="h-full">
      <nav className="flex items-center justify-between gap-3 border border-pink-200 bg-pink-50/70 px-4 py-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pink-500">
            Starter Platform
          </p>
          <h1 className="text-base font-semibold text-pink-950 sm:text-xl">
            Protected App
          </h1>
        </div>
        <button
          className="rounded-md border border-pink-300 bg-white px-3 py-2 text-sm font-medium text-pink-700 transition hover:border-pink-400 hover:bg-pink-100"
          type="button"
          onClick={() => logout()}
        >
          Logout
        </button>
      </nav>
      <div className="mx-auto flex h-full w-full max-w-5xl flex-col gap-4 px-4 py-4 sm:gap-5 sm:px-6 sm:py-6">
        <main className="p-3 sm:p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
