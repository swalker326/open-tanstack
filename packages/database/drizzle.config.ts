import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config as loadEnv } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

const configDir = dirname(fileURLToPath(import.meta.url));

loadEnv({ path: resolve(configDir, '../../.env') });
loadEnv({ path: resolve(configDir, '.env') });

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const databaseId = process.env.CLOUDFLARE_DATABASE_ID;
const token = process.env.CLOUDFLARE_API_TOKEN;

if (!accountId) {
  throw new Error(
    'CLOUDFLARE_ACCOUNT_ID is not set in the environment variables.',
  );
}

if (!databaseId) {
  throw new Error(
    'CLOUDFLARE_DATABASE_ID is not set in the environment variables.',
  );
}

if (!token) {
  throw new Error(
    'CLOUDFLARE_API_TOKEN is not set in the environment variables.',
  );
}

export default defineConfig({
  out: './drizzle/migrations',
  schema: './src/schema.ts',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId,
    databaseId,
    token,
  },
});
