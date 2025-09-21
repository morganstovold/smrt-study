import { v } from "convex/values";
import { query } from "./_generated/server";
import { autumn } from "./autumn";

export const getFeatureSummary = query({
	args: {},
	returns: v.union(
		v.null(),
		v.object({
			plan: v.string(),
			features: v.any(),
			nextBillingDate: v.string(),
		}),
	),
	handler: async (ctx) => {
		try {
			const { data, error } = await autumn.customers.get(ctx, {
				expand: ["entities", "invoices", "referrals", "rewards", "trials_used"],
			});

			if (error) {
				console.error("Usage summary error:", error);
				return null;
			}

			const features = data?.features || {};

			Object.entries(features).map(([key, value]) => {
				console.log(key, value);
				return null;
			});

			return null;
		} catch (error) {
			console.error("Usage summary error:", error);
			return null;
		}
	},
});
