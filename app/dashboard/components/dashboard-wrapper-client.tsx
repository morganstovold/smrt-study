"use client";

import { type Preloaded, usePreloadedQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { api } from "@/convex/_generated/api";
import DashboardLoading from "./dashboard-loading";

export default function DashboardWrapperClient({
	children,
	preloaded,
}: {
	preloaded: Preloaded<typeof api.users.getUserProfile>;
} & React.PropsWithChildren) {
	const router = useRouter();
	const user = usePreloadedQuery(preloaded);

	useEffect(() => {
		if (user === "UNAUTHORIZED") {
			router.push("/sign-in");
			return;
		}

		if (!user) {
			router.push("/setup-profile");
			return;
		}
	}, [user, router]);

	if (user === "UNAUTHORIZED" || !user) {
		return <DashboardLoading />;
	}

	return <>{children}</>;
}
