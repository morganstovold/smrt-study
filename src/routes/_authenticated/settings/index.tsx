import { createFileRoute } from "@tanstack/react-router";
import { SidebarPageWrapper } from "@/components/sidebar/sidebar-page-wrapper";
import { SidebarInset } from "@/components/ui/sidebar";

export const Route = createFileRoute("/_authenticated/settings/")({
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
						label: "Settings",
						url: "/settings",
					},
				]}
			/>
			<div className="flex flex-1 flex-col p-6">Settings</div>
		</SidebarInset>
	);
}
