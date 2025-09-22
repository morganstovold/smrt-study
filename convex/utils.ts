import type { Auth } from "convex/server";

export const getUserId = async (ctx: { auth: Auth }) => {
	const identity = await ctx.auth.getUserIdentity();
	return identity?.subject;
};
