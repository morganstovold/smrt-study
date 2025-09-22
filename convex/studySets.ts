import { R2 } from "@convex-dev/r2";
import { paginationOptsValidator } from "convex/server";
import { components } from "./_generated/api";
import { query } from "./_generated/server";
import { authComponent, createAuth } from "./auth";

export const r2 = new R2(components.r2);

export const getStudySets = query({
	args: { paginationOpts: paginationOptsValidator },
	handler: async (ctx, args) => {
		const session = await createAuth(ctx).api.getSession({
			headers: await authComponent.getHeaders(ctx),
		});

		if (!session || !session.user) {
			return {
				page: [],
				isDone: true,
				continueCursor: "",
			};
		}

		const user = session.user;

		const studySets = await ctx.db
			.query("studySets")
			.withIndex("by_user", (q) => q.eq("userId", user.id))
			.order("asc")
			.paginate(args.paginationOpts);

		return studySets;
	},
});
