import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Authenticated, AuthLoading } from "convex/react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";

export const Route = createFileRoute("/_authenticated")({
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
