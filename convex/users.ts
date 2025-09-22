import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { authComponent, createAuth } from "./auth";
import { r2 } from "./pfp";

export const editUserProfile = mutation({
	args: v.object({
		name: v.optional(v.string()),
		marketingEmails: v.optional(v.boolean()),
		imageKey: v.optional(v.string()),
	}),
	handler: async (ctx, args) => {
		const auth = createAuth(ctx).api;

		const userSession = await auth.getSession({
			headers: await authComponent.getHeaders(ctx),
		});

		if (!userSession || !userSession.user) return "UNAUTHORIZED";

		const user = userSession.user;

		let imageUrl: string | undefined;

		if (args.imageKey) {
			try {
				imageUrl = await r2.getUrl(args.imageKey);

				// Delete old profile image if it exists
				if (
					user.currentProfileImageKey &&
					user.currentProfileImageKey !== args.imageKey
				) {
					try {
						await r2.deleteObject(ctx, user.currentProfileImageKey);
					} catch (deleteError) {
						console.error("Failed to delete old profile image:", deleteError);
					}
				}
			} catch (error) {
				console.error("Invalid image key:", error);
				return "INVALID_IMAGE";
			}
		}

		await auth.updateUser({
			headers: await authComponent.getHeaders(ctx),
			body: {
				name: args.name,
				marketingEmails: args.marketingEmails,
				currentProfileImageKey: args.imageKey,
				image: imageUrl,
				onboardingCompleted: true,
			},
		});

		return "SUCCESS";
	},
});
