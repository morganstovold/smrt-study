import AppSidebar from "./components/app-sidebar";
import { SidebarHeader } from "./components/sidebar-header";

export default async function DashboardPage() {
	return (
		<AppSidebar>
			<SidebarHeader
				breadcrumbs={[
					{
						label: "Dashboard",
						url: "/dashboard",
					},
				]}
			/>
			<div className="flex flex-1 flex-col">
				<div className="flex-1 overflow-auto p-4">
					<div className="h-full w-full rounded-lg bg-card p-6">
						<h1 className="font-bold text-2xl">Dashboard</h1>
						<p className="text-muted-foreground">Welcome to your dashboard</p>
					</div>
				</div>
				<div className="flex-shrink-0 p-4">
					<div className="h-full w-full rounded-lg bg-card p-6">
						<h1 className="font-bold text-2xl">Dashboard</h1>
						<p className="text-muted-foreground">Welcome to your dashboard</p>
					</div>
				</div>
			</div>
		</AppSidebar>
	);
}
