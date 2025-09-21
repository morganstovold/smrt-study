"use client";

import { LibrarySquareIcon } from "lucide-react";
import Link from "next/link";
import {
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebarLogo() {
	return (
		<SidebarHeader className="p-0">
			<SidebarMenu>
				<SidebarMenuItem>
					{/* display smrtStudy and a book icon. this will be the main application logo so make it look clean */}
					<SidebarMenuButton asChild className="h-(--header-height) p-4 px-2">
						<Link href="/dashboard" className="flex items-center gap-3">
							<div className="flex items-center justify-center rounded-sm bg-gradient-to-br from-violet-400 to-violet-900 p-1 text-white shadow-2xl">
								<LibrarySquareIcon className="!size-7" />
							</div>
							<span className="font-semibold text-xl">SmrtStudy</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarHeader>
	);
}
