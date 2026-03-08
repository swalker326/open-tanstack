# Starter Platform Monorepo

A full-stack TypeScript starter that combines a React frontend, Cloudflare Workers API/auth services, and shared workspace packages for data + auth contracts.

## What this project includes

- `apps/web`: React 19 app with TanStack Router, Tailwind CSS, and a small auth store (Zustand).
- `apps/api`: Hono API Worker with OpenAPI routes and auth-protected user endpoints.
- `apps/auth`: OpenAuth issuer Worker with GitHub OAuth provider integration.
- `packages/database`: Shared Drizzle schema, DB helpers, and Zod schemas.
- `packages/subjects`: Shared OpenAuth subject definitions used across services.

## Architecture at a glance

- The web app starts OAuth with the auth worker (`localhost:8788`).
- The auth worker validates identity with GitHub and issues tokens.
- The web app calls the API worker (`localhost:8787`) with bearer tokens.
- The API worker verifies tokens via service binding to the auth worker.
- API and auth both use the shared D1-backed schema from `@repo/database`.

## Prerequisites

- Node.js 20+
- `pnpm` 10+
- Cloudflare account + GitHub OAuth app (for local OAuth flow)

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Create env files from examples:

```bash
cp .env.example .env
cp apps/auth/.dev.vars.example apps/auth/.dev.vars
```

3. Fill in your real values in `.env` and `apps/auth/.dev.vars`.

For web runtime routing, set:

- `API_URL` (local default: `http://localhost:8787`)
- `ISSUER_URL` (local default: `http://localhost:8788`)

## Run locally

Start all app processes with Turbo TUI:

```bash
pnpm run dev
```

This runs:

- Web app: `http://localhost:3000` (or next available port)
- API worker: `http://localhost:8787`
- Auth worker: `http://localhost:8788`

Inspector/debug ports are pinned to avoid collisions:

- API inspector: `9230`
- Auth inspector: `9231`

## Common commands

- `pnpm run dev`: run web + api + auth in parallel with Turbo TUI.
- `pnpm run type-check`: run type checks across workspace packages.
- `pnpm run check`: run Biome checks across workspace packages (no writes).
- `pnpm run check:write`: run Biome checks and apply safe fixes.
- `pnpm run db:generate`: generate Drizzle migrations.
- `pnpm run db:migrate:local`: apply D1 migrations to local Wrangler state.

## Deployment

CI/CD on `main` is split into reusable workflows under `.github/workflows`.

- PRs run validation (`check` + `type-check`) via `pr-validation.yml`.
- Pushes to `main` run `main-deploy.yml`, which composes dedicated workflows for:
  - validation
  - affected range calculation for Turbo
  - migration change detection
  - affected build/deploy tasks

### Web deployment

- The web app uses Zephyr, so a successful web build is the deploy signal.
- CI runs an affected web build only: `pnpm turbo run build --affected --filter=web`.
- If `apps/web` is not affected, Turbo skips the build task.
- In `main` CI, build-time web env values are set to:
  - `API_URL=https://starter-api.shane9741.workers.dev`
  - `ISSUER_URL=https://starter-auth.shane9741.workers.dev`

### Auth and API deployment

- Auth and API are Cloudflare Workers and deploy with Wrangler `deploy` scripts.
- CI deploys only when affected:
  - `pnpm turbo run deploy --affected --filter=@repo/auth`
  - `pnpm turbo run deploy --affected --filter=@repo/api`
- Required GitHub Actions secrets:
  - `CLOUDFLARE_API_TOKEN`
  - `CLOUDFLARE_ACCOUNT_ID`

### Database migrations (Drizzle + D1)

- Create migrations from schema changes with `pnpm run db:generate`.
- Commit the generated files in `packages/database/drizzle/migrations`.
- On `main`, CI detects migration changes in that folder and only then runs:
  - `wrangler d1 migrations apply starter_app_db --remote`
- Migration apply happens before worker deploy jobs.

## Notes

- `apps/auth/.dev.vars` and `.env` are ignored by git.
- Do not commit real tokens, client secrets, or account IDs.
