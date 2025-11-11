"use client";

import { Sidebar } from "@/components/ui/sidebar";
import { SidebarItems } from "./siddebar-items";
import { AppSidebarFooter } from "./sidebar-footer";
import { AppSidebarHeader } from "./sidebar-header";

export function AppSidebar() {
	return (
		<Sidebar variant="inset">
			<AppSidebarHeader />
			<SidebarItems />
			<AppSidebarFooter />
		</Sidebar>
	);
}
