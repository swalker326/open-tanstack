import { issuer } from '@openauthjs/openauth';
import { GithubProvider } from '@openauthjs/openauth/provider/github';
import { CloudflareStorage } from '@openauthjs/openauth/storage/cloudflare';
import { createDb, schema } from '@repo/database';
import { subjects } from '@repo/subjects';
import { z } from 'zod';

console.log('[ci] auth affected trigger');

const GithubUserSchema = z
	.object({
		id: z.number().int(),
		login: z.string(),
		name: z.string().nullable(),
		email: z.string().email().nullable(),
		avatar_url: z.string().url().optional(),
	})
	.passthrough();

const GithubUserEmailSchema = z
	.object({
		email: z.string().email(),
		primary: z.boolean(),
		verified: z.boolean(),
		visibility: z.string().nullable().optional(),
	})
	.passthrough();

const GithubUserEmailsSchema = z.array(GithubUserEmailSchema);

const allowedRedirectOrigins = new Set([
	'https://production-web-open-tanstack-swalker326-ze.zephyrcloud.app',
	'https://starter-api.shane9741.workers.dev',
]);

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext) {
		return issuer({
			storage: CloudflareStorage({
				// @ts-expect-error runtime binding type mismatches package's Cloudflare types
				namespace: env.STARTER_AUTH_KV,
			}),
			subjects,
			providers: {
				github: GithubProvider({
					clientID: env.GITHUB_CLIENT_ID,
					clientSecret: env.GITHUB_CLIENT_SECRET,
					scopes: ['email', 'profile'],
				}),
			},
			allow: async ({ redirectURI }) => {
				try {
					const redirectOrigin = new URL(redirectURI).origin;
					return allowedRedirectOrigins.has(redirectOrigin);
				} catch {
					return false;
				}
			},
			success: async (ctx, value) => {
				const db = await createDb(env.APP_DB);
				if (value.provider === 'github') {
					const ghAccess = value.tokenset.access;
					const ghUserRes = await fetch('https://api.github.com/user', {
						headers: {
							Authorization: `Bearer ${ghAccess}`,
							Accept: 'application/vnd.github+json',
							'X-GitHub-Api-Version': '2022-11-28',
							'User-Agent': 'yorio-auth',
						},
					});
					const ghUserJson: unknown = await ghUserRes.json();
					const ghUser = GithubUserSchema.parse(ghUserJson);
					const ghAvatarUrl = ghUser.avatar_url ?? null;

					let userEmail = ghUser.email;
					if (!userEmail) {
						const ghEmailsRes = await fetch('https://api.github.com/user/emails', {
							headers: {
								Authorization: `Bearer ${ghAccess}`,
								Accept: 'application/vnd.github+json',
								'X-GitHub-Api-Version': '2022-11-28',
								'User-Agent': 'yorio-auth',
							},
						});
						const ghEmailsJson: unknown = await ghEmailsRes.json();
						const ghEmails = GithubUserEmailsSchema.parse(ghEmailsJson) as {
							email: string;
							primary: boolean;
							verified: boolean;
						}[];
						let primaryVerifiedEmail: string | null = null;
						for (const email of ghEmails) {
							if (email.primary && email.verified) {
								primaryVerifiedEmail = email.email;
								break;
							}
						}
						userEmail = primaryVerifiedEmail ?? ghEmails[0]?.email ?? null;
					}

					const resolvedUserEmail = userEmail ?? `${ghUser.login}@users.noreply.github.com`;
					let user = await db.query.users.findFirst({
						where: (users, { eq }) => eq(users.email, resolvedUserEmail),
					});
					if (!user) {
						[user] = await db
							.insert(schema.users)
							.values({
								email: resolvedUserEmail,
								avatarUrl: ghAvatarUrl,
							})
							.returning({
								id: schema.users.id,
								email: schema.users.email,
								updatedAt: schema.users.updatedAt,
								deletedAt: schema.users.deletedAt,
								avatarUrl: schema.users.avatarUrl,
								createdAt: schema.users.createdAt,
							});
					}
					return ctx.subject('user', {
						id: user.id,
						email: user.email,
					});
				}
				throw new Error('Invalid provider');
			},
		}).fetch(request, env, ctx);
	},
};
