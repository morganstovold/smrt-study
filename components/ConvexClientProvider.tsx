"use client";

import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";
import { authClient } from "@/lib/auth-client";
import { AutumnWrapper } from "./AutumnWrapper";

// biome-ignore lint/style/noNonNullAssertion: false positive
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!, {
	verbose: true,
});

export default function ConvexClientProvider({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<ConvexBetterAuthProvider client={convex} authClient={authClient}>
			<AutumnWrapper>{children}</AutumnWrapper>
		</ConvexBetterAuthProvider>
	);
}
