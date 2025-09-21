import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { getToken } from "@/lib/auth-server";
import AppSidebar from "./app-sidebar";
import DashboardWrapperClient from "./dashboard-wrapper-client";

export default async function DashboardWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	const token = await getToken();

	const preloadedUserQuery = await preloadQuery(
		api.users.getUserProfile,
		{},
		{ token },
	);

	await new Promise((resolve) => setTimeout(resolve, 3000));

	return (
		<DashboardWrapperClient preloaded={preloadedUserQuery}>
			<AppSidebar>{children}</AppSidebar>
		</DashboardWrapperClient>
	);
}
