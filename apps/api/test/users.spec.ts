import { env, SELF } from 'cloudflare:test';
import { beforeAll, describe, expect, it } from 'vitest';
import { mintTestToken } from '../src/lib/auth/test-token';

const TEST_AUTH_SECRET = 'local-test-auth-secret';

const setupUsersTable = async () => {
  await env.APP_DB.prepare(
    'CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT NOT NULL, avatar_url TEXT, created_at INTEGER NOT NULL DEFAULT (unixepoch()), updated_at INTEGER NOT NULL DEFAULT (unixepoch()), deleted_at INTEGER)',
  ).run();
};

const authHeaders = async (userId = 'usr_test') => {
  const token = await mintTestToken(TEST_AUTH_SECRET, userId);
  return { Authorization: `Bearer ${token}` };
};

describe('Users API', () => {
  beforeAll(async () => {
    await setupUsersTable();
  });

  it('rejects request without auth token', async () => {
    const response = await SELF.fetch('https://example.com/api/users');

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: 'Unauthorized' });
  });

  it('creates and lists users when authorized', async () => {
    const email = `user-${Date.now()}@example.com`;
    const createResponse = await SELF.fetch('https://example.com/api/users', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(await authHeaders()),
      },
      body: JSON.stringify({ email, avatarUrl: null }),
    });

    expect(createResponse.status).toBe(201);
    const createdBody = (await createResponse.json()) as {
      data: { id: string; email: string };
    };
    expect(createdBody.data.email).toBe(email);

    const listResponse = await SELF.fetch('https://example.com/api/users', {
      headers: await authHeaders(),
    });
    expect(listResponse.status).toBe(200);
    const listBody = (await listResponse.json()) as {
      data: Array<{ id: string }>;
    };
    expect(listBody.data.some((user) => user.id === createdBody.data.id)).toBe(
      true,
    );
  });

  it('returns user by id and 404 for missing id when authorized', async () => {
    const email = `lookup-${Date.now()}@example.com`;
    const createResponse = await SELF.fetch('https://example.com/api/users', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(await authHeaders()),
      },
      body: JSON.stringify({ email, avatarUrl: null }),
    });
    const createdBody = (await createResponse.json()) as {
      data: { id: string; email: string };
    };

    const getResponse = await SELF.fetch(
      `https://example.com/api/users/${createdBody.data.id}`,
      {
        headers: await authHeaders(),
      },
    );
    expect(getResponse.status).toBe(200);
    const getBody = (await getResponse.json()) as { data: { id: string } };
    expect(getBody.data.id).toBe(createdBody.data.id);

    const missingResponse = await SELF.fetch(
      'https://example.com/api/users/usr_missing',
      {
        headers: await authHeaders(),
      },
    );
    expect(missingResponse.status).toBe(404);
    expect(await missingResponse.json()).toEqual({ error: 'User not found' });
  });
});
