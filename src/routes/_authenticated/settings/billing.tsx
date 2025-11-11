import { createFileRoute } from "@tanstack/react-router";
import { SidebarPageWrapper } from "@/components/sidebar/sidebar-page-wrapper";
import { SidebarInset } from "@/components/ui/sidebar";

export const Route = createFileRoute("/_authenticated/settings/billing")({
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
					{
						label: "Billing",
						url: "/settings/billing",
					},
				]}
			/>
			<div className="flex flex-1 flex-col p-6">Billing</div>
		</SidebarInset>
	);
}
