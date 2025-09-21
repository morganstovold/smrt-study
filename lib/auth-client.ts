import { convexClient } from "@convex-dev/better-auth/client/plugins";
import {
	inferAdditionalFields,
	magicLinkClient,
	passkeyClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { createAuth } from "@/convex/auth";

export const authClient = createAuthClient({
	plugins: [
		inferAdditionalFields<typeof createAuth>(),
		magicLinkClient(),
		passkeyClient(),
		convexClient(),
	],
});
