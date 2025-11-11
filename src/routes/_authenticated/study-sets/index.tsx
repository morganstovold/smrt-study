import { createFileRoute } from "@tanstack/react-router";
import { SidebarInset } from "@/components/ui/sidebar";
import { SidebarPageWrapper } from "@/components/sidebar/sidebar-page-wrapper";

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
						url: "/dashboard",
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
