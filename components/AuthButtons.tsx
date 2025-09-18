"use client";

import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { buttonVariants } from "./ui/button";

export default function AuthButtons() {
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	async function handleLogout() {
		setIsLoggingOut(true);
		await authClient.signOut();
		setIsLoggingOut(false);
	}

	return (
		<main className="flex flex-col items-center justify-center">
			<Authenticated>
				<button
					type="button"
					className={buttonVariants({ variant: "default" })}
					onClick={handleLogout}
					disabled={isLoggingOut}
				>
					{isLoggingOut ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Logging out...
						</>
					) : (
						"Sign out"
					)}
				</button>
			</Authenticated>
			<Unauthenticated>
				<Link
					href="/sign-in"
					className={buttonVariants({ variant: "outline" })}
				>
					Sign in
				</Link>
			</Unauthenticated>
			<AuthLoading>
				<span className="text-sm">Loading...</span>
			</AuthLoading>
		</main>
	);
}
