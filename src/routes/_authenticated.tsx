import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: ({ context, location }) => {
		if (!context.token) {
			throw redirect({
				to: "/login",
				search: {
					redirect: location.pathname,
				},
			});
		}
	},
});
