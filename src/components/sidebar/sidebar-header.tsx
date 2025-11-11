"use client";

import { Link } from "@tanstack/react-router";
import { BrainIcon } from "lucide-react";
import {
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebarHeader() {
	return (
		<SidebarHeader>
			<SidebarMenu>
				<SidebarMenuItem>
					<Link to="/overview">
						<SidebarMenuButton
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground gap-3"
							size="lg"
						>
							<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
								<BrainIcon className="size-5" />
							</div>
							<div className="flex-1 text-left text-lg">
								<span className="font-semibold">SmrtStudy</span>
							</div>
						</SidebarMenuButton>
					</Link>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarHeader>
	);
}
