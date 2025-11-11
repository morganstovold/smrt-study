import { createFileRoute } from "@tanstack/react-router";
import { SidebarPageWrapper } from "@/components/sidebar/sidebar-page-wrapper";
import { SidebarInset } from "@/components/ui/sidebar";

export const Route = createFileRoute("/_authenticated/study-sets/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<SidebarInset>
			<SidebarPageWrapper
				breadcrumbs={[
					{
						label: "Dashboard",
						url: "/overview",
					},
					{
						label: "Study Sets",
						url: "/study-sets",
					},
				]}
			/>
			<div className="flex flex-1 flex-col p-6">Study Sets</div>
		</SidebarInset>
	);
}
