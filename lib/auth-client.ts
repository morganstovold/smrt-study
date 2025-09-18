import {
  magicLinkClient,
  emailOTPClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { createAuth } from "@/convex/auth";
import { convexClient } from "@convex-dev/better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof createAuth>(),
    magicLinkClient(),
    emailOTPClient(),
    convexClient(),
  ],
});
