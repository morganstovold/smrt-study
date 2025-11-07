import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { Spinner } from "@/components/ui/spinner";

export const Route = createFileRoute("/_authenticated/dashboard")({
	component: RouteComponent,
	pendingComponent: () => (
		<div className="flex h-screen items-center justify-center">
			<Spinner />
		</div>
	),
	pendingMs: 0,
	beforeLoad: async ({ context }) => {
		await context.queryClient.prefetchQuery(
			convexQuery(api.auth.getCurrentUser, {}),
		);
	},
});

function RouteComponent() {
	const data = useSuspenseQuery(convexQuery(api.auth.getCurrentUser, {}));
	return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
