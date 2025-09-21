import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent, createAuth } from "./auth";

export const getUserProfile = query({
	args: {},
	handler: async (ctx) => {
		const user = await ctx.auth.getUserIdentity();

		if (!user) return "UNAUTHORIZED";

		const profile = await ctx.db
			.query("users")
			.withIndex("by_user_id", (q) => q.eq("userId", user.subject))
			.unique();

		return profile;
	},
});

export const editUserProfile = mutation({
	args: v.object({
		name: v.optional(v.string()),
		marketingEmails: v.optional(v.boolean()),
	}),
	handler: async (ctx, args) => {
		const user = await ctx.auth.getUserIdentity();

		if (!user) return "UNAUTHORIZED";

		const profile = await ctx.db
			.query("users")
			.withIndex("by_user_id", (q) => q.eq("userId", user.subject))
			.unique();

		if (!profile) {
			await ctx.db.insert("users", {
				userId: user.subject,
				marketingEmails: args.marketingEmails ?? false,
				profile: {
					level: 1,
					experiencePoints: 0,
					streak: {
						current: 0,
						longest: 0,
						lastStudyDate: undefined,
					},
					stats: {
						totalStudySessions: 0,
						totalStudyTime: 0,
						totalQuestionsAnswered: 0,
						averageScore: 0,
					},
				},
				createdAt: Date.now(),
				updatedAt: Date.now(),
				lastActiveAt: Date.now(),
			});
		} else {
			await ctx.db.patch(profile._id, {
				marketingEmails: args.marketingEmails ?? false,
			});
		}

		await createAuth(ctx).api.updateUser({
			headers: await authComponent.getHeaders(ctx),
			body: {
				name: args.name,
			},
		});

		return "SUCCESS";
	},
});
