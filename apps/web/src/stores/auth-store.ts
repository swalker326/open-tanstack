import { type Client, createClient } from '@openauthjs/openauth/client';
import { create } from 'zustand';

const API_BASE_URL = import.meta.env.API_URL || 'http://localhost:8787';
const ISSUER_URL = import.meta.env.ISSUER_URL || 'http://localhost:8788';

interface UserObject {
  id: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
}

interface ResolvedAuthState {
  accessToken?: string;
  isLoggedIn: boolean;
  user?: UserObject;
}

interface AuthStore {
  accessToken?: string;
  isLoaded: boolean;
  isLoggedIn: boolean;
  user?: UserObject;
  initialize: () => Promise<void>;
  login: () => void;
  logout: () => void;
  refreshAccessToken: () => Promise<string | undefined>;
  getToken: () => Promise<string | undefined>;
}

export const useAuth = create<AuthStore>((set, get) => ({
  accessToken: undefined,
  isLoaded: false,
  isLoggedIn: false,
  user: undefined,
  initialize: async () => {
    const client = createClient({
      clientID: 'starter-api',
      issuer: ISSUER_URL,
    });
    if (get().isLoaded) {
      return;
    }

    const authState = await resolveAuthState(client, get().accessToken);
    set({ ...authState, isLoaded: true });
  },
  login: async () => {
    const client = createClient({
      clientID: 'starter-api',
      issuer: ISSUER_URL,
    });
    await login(client);
  },
  logout: async () => {
    set({
      accessToken: undefined,
      isLoggedIn: false,
      user: undefined,
      isLoaded: true,
    });
    await logout();
  },
  refreshAccessToken: async () => {
    const client = createClient({
      clientID: 'starter-api',
      issuer: ISSUER_URL,
    });
    const token = await refreshAccessToken(client, get().accessToken);
    if (token) {
      set({ accessToken: token });
    }
    return token;
  },
  getToken: async () => {
    let token = get().accessToken;
    if (!token) {
      token = await get().refreshAccessToken();
    }
    return token;
  },
}));

async function refreshAccessToken(client: Client, token: string | undefined) {
  const refresh = localStorage.getItem('refresh');
  if (!refresh) return;
  const next = await client.refresh(refresh, {
    access: token,
  });
  if (next.err) return;
  if (!next.tokens) return token;

  localStorage.setItem('refresh', next.tokens.refresh);
  return next.tokens.access;
}

async function callback(client: Client, code: string, state: string) {
  const sessionChallenge = sessionStorage.getItem('challenge');
  if (!sessionChallenge) {
    return {
      url: '/',
      token: null,
    };
  }
  const challenge = JSON.parse(sessionChallenge);
  if (code) {
    if (state === challenge.state && challenge.verifier) {
      const exchanged = await client.exchange(
        code,
        location.origin,
        challenge.verifier,
      );
      if (!exchanged.err) {
        localStorage.setItem('refresh', exchanged.tokens.refresh);
        return {
          url: '/app',
          token: exchanged.tokens.access,
        };
      }
    }
    return {
      url: '/',
      token: null,
    };
  }
  throw new Error('No code provided');
}

async function fetchUser(token: string) {
  const res = await fetch(`${API_BASE_URL}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    return;
  }

  const payload = (await res.json()) as { data?: UserObject } | UserObject;
  if ('data' in payload && payload.data) {
    return payload.data;
  }

  return payload as UserObject;
}

async function resolveAuthState(
  client: Client,
  currentAccessToken: string | undefined,
): Promise<ResolvedAuthState> {
  const search = new URLSearchParams(window.location.search);
  const code = search.get('code');
  const state = search.get('state');

  if (code && state) {
    const exchanged = await callback(client, code, state);

    if (!exchanged.token) {
      return { accessToken: undefined, isLoggedIn: false, user: undefined };
    }

    const user = await fetchUser(exchanged.token);
    return {
      accessToken: exchanged.token,
      isLoggedIn: Boolean(user),
      user,
    };
  }

  const token = await refreshAccessToken(client, currentAccessToken);
  if (!token) {
    return { accessToken: undefined, isLoggedIn: false, user: undefined };
  }

  const user = await fetchUser(token);
  return {
    accessToken: token,
    isLoggedIn: Boolean(user),
    user,
  };
}

async function logout() {
  localStorage.removeItem('refresh');
  window.location.replace('/');
}

async function login(client: Client) {
  const { challenge, url } = await client.authorize(location.origin, 'code', {
    pkce: true,
  });
  sessionStorage.setItem('challenge', JSON.stringify(challenge));
  location.href = url;
}
