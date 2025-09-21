import { Suspense } from "react";
import DashboardLoading from "./components/dashboard-loading";
import DashboardWrapper from "./components/dashboard-wrapper";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Suspense fallback={<DashboardLoading />}>
			<DashboardWrapper>{children}</DashboardWrapper>
		</Suspense>
	);
}
