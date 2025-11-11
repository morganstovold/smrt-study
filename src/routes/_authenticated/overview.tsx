import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { SidebarPageWrapper } from "@/components/sidebar/sidebar-page-wrapper";
import { SidebarInset } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";

export const Route = createFileRoute("/_authenticated/overview")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data, isLoading, isFetching } = useQuery(
		convexQuery(api.auth.getCurrentUser, {}),
	);

	const isLoadingOrFetching = isLoading || isFetching;

	return (
		<SidebarInset>
			<SidebarPageWrapper
				breadcrumbs={[
					{
						label: "Overview",
						url: "/overview",
					},
				]}
			/>
			<div className="flex flex-1 flex-col p-6">
				{isLoadingOrFetching ? (
					<div className="flex h-full items-center justify-center">
						<Spinner />
					</div>
				) : (
					<pre>{JSON.stringify(data, null, 2)}</pre>
				)}
			</div>
		</SidebarInset>
	);
}
