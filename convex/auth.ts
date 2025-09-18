import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { requireMutationCtx } from "@convex-dev/better-auth/utils";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { type QueryCtx, query } from "./_generated/server";
import {
	sendEmailVerification,
	sendMagicLink,
	sendResetPassword,
} from "./email";

// biome-ignore lint/style/noNonNullAssertion: false positive
const siteUrl = process.env.SITE_URL!;

export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (
	ctx: GenericCtx<DataModel>,
	{ optionsOnly }: { optionsOnly?: boolean } = { optionsOnly: false },
) => {
	return betterAuth({
		logger: {
			disabled: optionsOnly,
		},
		baseURL: siteUrl,
		database: authComponent.adapter(ctx),
		account: {
			accountLinking: {
				enabled: true,
				allowDifferentEmails: true,
			},
		},
		user: {
			deleteUser: {
				enabled: true,
			},
		},
		emailVerification: {
			sendVerificationEmail: async ({ user, url }) => {
				await sendEmailVerification(requireMutationCtx(ctx), {
					to: user.email,
					url,
				});
			},
		},
		emailAndPassword: {
			enabled: true,
			requireEmailVerification: false,
			sendResetPassword: async ({ user, url }) => {
				await sendResetPassword(requireMutationCtx(ctx), {
					to: user.email,
					url,
				});
			},
		},
		socialProviders: {
			github: {
				clientId: process.env.GITHUB_CLIENT_ID as string,
				clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
			},
			google: {
				clientId: process.env.GOOGLE_CLIENT_ID as string,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
				accessType: "offline",
				prompt: "select_account consent",
			},
		},
		plugins: [
			magicLink({
				disableSignUp: true,
				
				sendMagicLink: async ({ email, url }) => {
					await sendMagicLink(requireMutationCtx(ctx), {
						to: email,
						url,
					});
				},
			}),
			convex(),
		],
	} satisfies BetterAuthOptions);
};

export const safeGetUser = async (ctx: QueryCtx) => {
	return authComponent.safeGetAuthUser(ctx);
};

export const getUser = async (ctx: QueryCtx) => {
	return authComponent.getAuthUser(ctx);
};

export const getCurrentUser = query({
	args: {},
	handler: async (ctx) => {
		return safeGetUser(ctx);
	},
});
