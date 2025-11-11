"use client";

import { Link, useLocation } from "@tanstack/react-router";
import {
	BookIcon,
	BookOpenIcon,
	BookOpenTextIcon,
	LayoutDashboardIcon,
	LibraryIcon,
} from "lucide-react";
import {
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

export function SidebarItems() {
	const pathname = useLocation({
		select: (location) => location.pathname,
	});

	const isActive = (url: string) => {
		return pathname.startsWith(url);
	};

	return (
		<SidebarContent className="border-t">
			<SidebarGroup>
				<SidebarGroupLabel>Overview</SidebarGroupLabel>
				<SidebarGroupContent>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton asChild isActive={isActive("/overview")}>
								<Link to="/overview">
									<LayoutDashboardIcon />
									<span>Overview</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton asChild isActive={isActive("/study-sets")}>
								<Link to="/study-sets">
									<LibraryIcon />
									<span>Study Sets</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton asChild isActive={isActive("/materials")}>
								<Link to="/materials">
									<BookIcon />
									<span>Materials</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton asChild isActive={isActive("/learn")}>
								<Link to="/learn">
									<BookOpenTextIcon />
									<span>Learn</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton asChild isActive={isActive("/quiz")}>
								<Link to="/quiz">
									<BookOpenIcon />
									<span>Quiz</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>
		</SidebarContent>
	);
}
