import AppSidebar from "../components/app-sidebar";
import { SidebarHeader } from "../components/sidebar-header";

export default async function DashboardPage() {
	return (
		<AppSidebar>
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
			<div className="flex flex-1 flex-col">
				<div>Study Sets</div>
			</div>
		</AppSidebar>
	);
}
