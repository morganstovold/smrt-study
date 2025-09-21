"use client";

import { useCustomer } from "autumn-js/react";
import { Button } from "@/components/ui/button";

export default function DashboardClient() {
	const { customer, isLoading, error, refetch } = useCustomer();

	const refreshCustomerObject = async () => {
		await refetch();
	};

	return (
		<div>
			<Button onClick={refreshCustomerObject}>Refetch</Button>
			{isLoading ? (
				<p>Loading...</p>
			) : error ? (
				<p>Error: {error.message}</p>
			) : (
				<pre>{JSON.stringify(customer || {}, null, 2)}</pre>
			)}
		</div>
	);
}
