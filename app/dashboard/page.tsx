import { SidebarInset } from "@/components/ui/sidebar";
import { SidebarHeader } from "./components/sidebar-header";

export default async function DashboardPage() {
	return (
		<SidebarInset>
			<SidebarHeader
				breadcrumbs={[
					{
						label: "Dashboard",
						url: "/dashboard",
					},
				]}
			/>
			<div className="flex flex-1 flex-col">
				<div>Dashboard</div>
			</div>
		</SidebarInset>
	);
}
