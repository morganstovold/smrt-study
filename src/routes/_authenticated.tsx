import {
	fetchSession,
	getCookieName,
} from "@convex-dev/better-auth/react-start";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getCookie, getRequest } from "@tanstack/react-start/server";
import { Authenticated, AuthLoading } from "convex/react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { createAuth } from "../../convex/auth";

const fetchAuth = createServerFn({ method: "GET" }).handler(async () => {
	const { session } = await fetchSession(getRequest());
	const sessionCookieName = getCookieName(createAuth);
	const token = getCookie(sessionCookieName);
	return {
		userId: session?.user.id,
		token,
	};
});

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async ({ context, location }) => {
		const { userId, token } = await fetchAuth();

		if (!token) {
			throw redirect({
				to: "/login",
				search: {
					redirect: location.pathname,
				},
			});
		}

		if (token) {
			context.convexQueryClient.serverHttpClient?.setAuth(token);
		}

		return { userId, token };
	},

	pendingComponent: AuthenticatedLayoutPending,

	component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
	return (
		<>
			<Authenticated>
				<SidebarProvider>
					<AppSidebar />
					<Outlet />
				</SidebarProvider>
			</Authenticated>
			<AuthLoading>
				<AuthenticatedLayoutPending />
			</AuthLoading>
		</>
	);
}

function AuthenticatedLayoutPending() {
	return (
		<div className="flex h-screen items-center justify-center">
			<Spinner />
		</div>
	);
}
