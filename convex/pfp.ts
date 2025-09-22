import { R2 } from "@convex-dev/r2";
import { components } from "./_generated/api";

export const r2 = new R2(components.r2);

export const { generateUploadUrl, syncMetadata } = r2.clientApi({
	checkUpload: async (ctx, bucket) => {
		const user = await ctx.auth.getUserIdentity();
		if (!user) {
			throw new Error("Must be authenticated to upload profile picture");
		}
	},
	onUpload: async (ctx, bucket, key) => {},
});
