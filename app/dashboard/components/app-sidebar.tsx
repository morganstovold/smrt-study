import { preloadedQueryResult, preloadQuery } from "convex/nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { api } from "@/convex/_generated/api";
import { getToken } from "@/lib/auth-server";
import { AppSidebarFooter } from "./sidebar-footer";
import { SidebarItems } from "./sidebar-items";
import { AppSidebarLogo } from "./sidebar-logo";

export async function AppSidebar() {
	const token = await getToken();

	const preloadedUserQuery = await preloadQuery(
		api.auth.getCurrentUser,
		{},
		{ token },
	);

	const user = preloadedQueryResult(preloadedUserQuery);

	if (!user?.onboardingCompleted) {
		redirect("/setup-profile");
	}

	return (
		<Sidebar variant="inset">
			<AppSidebarLogo />
			<SidebarContent>
				<SidebarItems />
			</SidebarContent>
			<AppSidebarFooter preloaded={preloadedUserQuery} />
		</Sidebar>
	);
}
