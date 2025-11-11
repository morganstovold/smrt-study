import { createFileRoute } from "@tanstack/react-router";
import { SidebarPageWrapper } from "@/components/sidebar/sidebar-page-wrapper";
import { SidebarInset } from "@/components/ui/sidebar";

export const Route = createFileRoute("/_authenticated/quiz/")({
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
						label: "Quiz",
						url: "/quiz",
					},
				]}
			/>
			<div className="flex flex-1 flex-col p-6">Quiz</div>
		</SidebarInset>
	);
}
