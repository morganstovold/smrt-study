import { cookies } from "next/headers";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const cookieStore = await cookies();
	const defaultOpen =
		(cookieStore.get("sidebar_state")?.value ?? "true") === "true";

	return (
		<SidebarProvider defaultOpen={defaultOpen}>
			<AppSidebar />
			{children}
		</SidebarProvider>
	);
}
