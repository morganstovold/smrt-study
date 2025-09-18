"use client";

import { BadgeQuestionMarkIcon, CogIcon, MoonIcon } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";

const items = [
	{
		title: "Settings",
		url: "#",
		icon: CogIcon,
	},
	{
		title: "Get Help",
		url: "#",
		icon: BadgeQuestionMarkIcon,
	},
];

export default function SidebarSecondary() {
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<SidebarGroup className="mt-auto">
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton asChild>
								<Link href={item.url}>
									<item.icon />
									<span>{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
					<SidebarMenuItem className="group-data-[collapsible=icon]:hidden">
						<SidebarMenuButton asChild>
							<label>
								<MoonIcon />
								<span>Dark Mode</span>
								{mounted ? (
									<Switch
										className="ml-auto"
										checked={resolvedTheme !== "light"}
										onCheckedChange={() =>
											setTheme(resolvedTheme === "dark" ? "light" : "dark")
										}
									/>
								) : (
									<Skeleton className="ml-auto h-4 w-8 rounded-full" />
								)}
							</label>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
