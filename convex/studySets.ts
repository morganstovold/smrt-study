import { R2 } from "@convex-dev/r2";
import { paginationOptsValidator } from "convex/server";
import { components } from "./_generated/api";
import { query } from "./_generated/server";
import { getUserId } from "./utils";

export const r2 = new R2(components.r2);

export const getStudySets = query({
	args: { paginationOpts: paginationOptsValidator },
	handler: async (ctx, args) => {
		const userId = await getUserId(ctx);

		if (!userId) {
			return {
				page: [],
				isDone: true,
				continueCursor: "",
			};
		}

		return await ctx.db
			.query("studySets")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.order("desc")
			.paginate(args.paginationOpts);
	},
});
