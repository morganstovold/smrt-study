import { SidebarHeader } from "./components/sidebar-header";
import DashboardClient from "./dashboardClient";

export default async function DashboardPage() {
	return (
		<>
			<SidebarHeader
				breadcrumbs={[
					{
						label: "Dashboard",
						url: "/dashboard",
					},
				]}
			/>
			<div className="flex flex-1 flex-col">
				<DashboardClient />
			</div>
		</>
	);
}
