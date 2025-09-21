import { getStaticAuth } from "@convex-dev/better-auth";
import { getToken as getTokenNextjs } from "@convex-dev/better-auth/nextjs";
import { cache } from "react";
import { createAuth } from "@/convex/auth";

export const getToken = cache(() => {
	getStaticAuth(createAuth);
	return getTokenNextjs(createAuth);
});
