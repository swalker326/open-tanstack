import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '../stores/auth-store';

export const Route = createFileRoute('/app/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();
  console.log('User in RouteComponent:', user);
  const initials = user?.email.split('@')[0].slice(0, 2).toUpperCase() || '??';

  return (
    <section className="space-y-3 sm:space-y-4">
      <div className="rounded-md border border-pink-200 bg-pink-50 p-4 sm:p-5">
        <p className="text-sm font-medium text-pink-700">You're signed in</p>
        <h2 className="mt-1 text-lg font-semibold text-pink-950 sm:text-xl">
          Welcome back
        </h2>
        <p className="mt-2 text-sm text-pink-800/80">
          This page is rendered from the protected app layout.
        </p>
      </div>

      <div className="rounded-md border border-pink-100 bg-white p-4 sm:p-5">
        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-pink-500">
          User Demo
        </h3>
        <div className="mt-3 flex flex-col items-start gap-3 rounded-md border border-pink-100 bg-pink-50/40 p-3 sm:flex-row sm:items-center">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={`${user.email} avatar`}
              className="h-12 w-12 rounded-md object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-pink-200 text-sm font-semibold text-pink-800">
              {initials}
            </div>
          )}

          <div className="min-w-0 w-full sm:w-auto">
            <p className="truncate text-sm font-medium text-neutral-900">
              {user?.email ?? 'Unknown user'}
            </p>
            <p className="truncate text-xs text-neutral-600">
              ID: {user?.id ?? 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
