import { Loader2 } from "lucide-react";
import { SidebarInset } from "@/components/ui/sidebar";
import { SidebarHeader } from "../components/sidebar-header";

export default function Loading() {
	return (
		<SidebarInset>
			<SidebarHeader
				breadcrumbs={[
					{
						label: "Dashboard",
						url: "/dashboard",
					},
					{
						label: "Study Sets",
						url: "/dashboard/study-sets",
					},
				]}
			/>
			<div className="flex flex-1 flex-col items-center justify-center">
				<Loader2 className="size-6 animate-spin text-primary" />
			</div>
		</SidebarInset>
	);
}
