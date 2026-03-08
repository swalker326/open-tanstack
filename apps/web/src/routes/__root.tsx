import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { useAuth } from '../stores/auth-store';

const RootLayout = () => {
  return (
    <>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
};

export const Route = createRootRoute({
  component: RootLayout,
  beforeLoad: async () => {
    await useAuth.getState().initialize();
  },
});
