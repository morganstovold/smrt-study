import {
	BookOpenIcon,
	HomeIcon,
	PlayIcon,
	RefreshCwIcon,
	TimerIcon,
} from "lucide-react";
import Link from "next/link";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
	{
		title: "Dashboard",
		url: "/dashboard",
		icon: HomeIcon,
	},
	{
		title: "Study Sets",
		url: "/dashboard/study-sets",
		icon: BookOpenIcon,
	},
	{
		title: "Practice",
		url: "/dashboard/practice-mode",
		icon: PlayIcon,
	},
	{
		title: "Quiz",
		url: "/dashboard/quiz-mode",
		icon: TimerIcon,
	},
	{
		title: "Review",
		url: "/dashboard/review-mode",
		icon: RefreshCwIcon,
	},
];

export function SidebarItems() {
	return (
		<SidebarGroup className="border-t">
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
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
