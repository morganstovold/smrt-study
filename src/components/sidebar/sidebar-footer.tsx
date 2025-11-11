"use client";

import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import {
	CogIcon,
	EllipsisVerticalIcon,
	LogOutIcon,
	MoonIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarFooter,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "../theme-provider";
import { Skeleton } from "../ui/skeleton";

export function AppSidebarFooter() {
	const { isMobile } = useSidebar();
	const { theme, setTheme } = useTheme();
	const { data, isLoading } = useQuery(
		convexQuery(api.auth.getCurrentUser, {}),
	);

	return (
		<SidebarFooter>
			<SidebarMenu className="border-b pb-2">
				<SidebarMenuItem>
					<SidebarMenuButton asChild>
						<Link to="/settings">
							<CogIcon />
							<span>Settings</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
				<SidebarMenuItem className="group-data-[collapsible=icon]:hidden">
					<SidebarMenuButton asChild>
						{/** biome-ignore lint/a11y/noLabelWithoutControl: false */}
						<label>
							<MoonIcon />
							<span>Dark Mode</span>
							<Switch
								checked={theme !== "light"}
								className="ml-auto"
								onCheckedChange={() =>
									setTheme(theme === "dark" ? "light" : "dark")
								}
							/>
						</label>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
			{isLoading || !data ? (
				<Skeleton className="h-12 w-full" />
			) : (
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton
									className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
									size="lg"
								>
									<Avatar className="h-8 w-8 rounded-lg">
										<AvatarImage src={data.image || undefined} />
										<AvatarFallback className="rounded-lg">
											{data.name
												?.split(" ")
												.map((name) => name[0])
												.join("")}
										</AvatarFallback>
									</Avatar>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-medium">{data.name}</span>
										<span className="truncate text-muted-foreground text-xs">
											{data.email}
										</span>
									</div>
									<EllipsisVerticalIcon className="ml-auto size-4" />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
								side={isMobile ? "bottom" : "right"}
								sideOffset={4}
							>
								<DropdownMenuLabel className="p-0 font-normal">
									<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
										<Avatar className="h-8 w-8 rounded-lg">
											<AvatarImage src={data.image || undefined} />
											<AvatarFallback className="rounded-lg">
												{data.name
													?.split(" ")
													.map((name) => name[0])
													.join("")}
											</AvatarFallback>
										</Avatar>
										<div className="grid flex-1 text-left text-sm leading-tight">
											<span className="truncate font-medium">{data.name}</span>
											<span className="truncate text-muted-foreground text-xs">
												{data.email}
											</span>
										</div>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<DropdownMenuItem asChild>
										<Link to="/settings">
											<CogIcon />
											Settings
										</Link>
									</DropdownMenuItem>
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
								<DropdownMenuItem asChild>
									<Link to="/logout">
										<LogOutIcon />
										Log out
									</Link>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			)}
		</SidebarFooter>
	);
}
