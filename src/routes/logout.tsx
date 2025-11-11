import { createFileRoute, redirect } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/logout")({
	preload: false,
	loader: async () => {
		await authClient.signOut();
		throw redirect({
			to: "/login",
		});
	},
});
