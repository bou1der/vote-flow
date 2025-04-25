import type { UserRole } from "shared/types/user";

import { betterAuth, type BetterAuthPlugin } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { db } from "../db";

import { logger } from "utils/logger";
import { redis } from "../redis";
import { email, VerificationEmail, SignUpEmail, ResetPasswordEmail } from "../mailer";
import { env } from "../env";
import { env as globalEnv } from "utils/env";

export const auth = betterAuth({
	advanced: {
		crossSubDomainCookies: {
			enabled: true,
			domain: `.${globalEnv.NEXT_PUBLIC_DOMAIN}`,
		},
	},
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	secondaryStorage: {
		get: async key => {
			const value = await redis.get(key);
			return value ? value : null;
		},
		set: async (key, value, ttl) => {
			if (ttl) await redis.set(key, value, { EX: ttl });
			else await redis.set(key, value);
		},
		delete: async key => {
			await redis.del(key);
		},
	},
	user: {
		additionalFields: {
			role: {
				type: "string",
				required: true,
				defaultValue: "user" as UserRole,
				input: false,
			},
		},
	},
	databaseHooks: {
		user: {
			create: {
				before: user =>
					new Promise(resolve =>
						resolve({
							data: {
								...user,
								role: (user.email === env.MAIN_ADMIN_EMAIL ? "admin" : "user") as UserRole,
							},
						}),
					),
				after: async user => {
					logger.info({ message: "Sending SignUp Email", user });
					await email.send({
						to: user.email,
						subject: "Спасибо за регистрацию",
						body: SignUpEmail(),
					});
				},
			},
		},
	},
	emailAndPassword: {
		enabled: true,
		sendResetPassword: async ({ user, url }) => {
			logger.info({ message: "Sending reset Email", user, url });
			await email.send({
				to: user.email,
				subject: "Восстановление пароля",
				body: ResetPasswordEmail({ url }),
			});
		},
		requireEmailVerification: env.NODE_ENV !== "test",
	},
	emailVerification: {
		autoSignInAfterVerification: true,
		sendOnSignUp: true,
		sendVerificationEmail: async ({ user, token }) => {
			logger.info({ message: "Sending verification Email", user });
			await email.send({
				to: user.email,
				subject: "Подтвердите ваш адрес электронной почты",
				body: VerificationEmail({ token }),
			});
		},
	},
	plugins: [
		admin({
			defaultRole: "user",
			adminRole: "admin",
		}) as BetterAuthPlugin,
	],
	trustedOrigins: [`https://web.${globalEnv.NEXT_PUBLIC_DOMAIN}`],
});

export type Auth = typeof auth;
export type Session = Awaited<ReturnType<(typeof auth)["api"]["getSession"]>>;
