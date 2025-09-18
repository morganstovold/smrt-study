import { preloadQuery } from "convex/nextjs";
import { cookies } from "next/headers";
import {
	Sidebar,
	SidebarContent,
	SidebarInset,
	SidebarProvider,
} from "@/components/ui/sidebar";
import { api } from "@/convex/_generated/api";
import { getToken } from "@/lib/auth-server";
import { AppSidebarFooter } from "./sidebar-footer";
import { SidebarItems } from "./sidebar-items";
import { AppSidebarLogo } from "./sidebar-logo";
import SidebarSecondary from "./sidebar-secondary";

export default async function AppSidebar({
	children,
}: {
	children: React.ReactNode;
}) {
	const cookieStore = await cookies();
	const defaultOpen =
		(cookieStore.get("sidebar_state")?.value ?? "true") === "true";

	const token = await getToken();

	const preloadedUserQuery = await preloadQuery(
		api.auth.getCurrentUser,
		{},
		{ token },
	);

	return (
		<SidebarProvider defaultOpen={defaultOpen}>
			<Sidebar variant="inset">
				<AppSidebarLogo />
				<SidebarContent>
					<SidebarItems />
					<SidebarSecondary />
				</SidebarContent>
				<AppSidebarFooter preloaded={preloadedUserQuery} />
			</Sidebar>
			<SidebarInset>
				<main>{children}</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
