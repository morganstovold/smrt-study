import { Github } from "lucide-react";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { Link } from "@tanstack/react-router";

export function LoginPage() {
	const [isLoading, setIsLoading] = useState(false);

	const handleGithubLogin = async () => {
		setIsLoading(true);
		try {
			await authClient.signIn.social({
				provider: "github",
				callbackURL: "/overview",
			});
		} catch (error) {
			console.error("Login failed:", error);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="w-full max-w-sm space-y-8">
				<div className="text-center space-y-2">
					<h1 className="text-2xl font-semibold">Welcome back</h1>
					<p className="text-muted-foreground text-sm">
						Continue to your workspace
					</p>
				</div>

				<Button
					onClick={handleGithubLogin}
					disabled={isLoading}
					className="w-full"
					variant="outline"
					size="lg"
				>
					<Github className="mr-2 h-4 w-4" />
					{isLoading ? "Signing in..." : "Continue with GitHub"}
				</Button>

				<p className="text-center text-xs text-muted-foreground">
					By continuing, you agree to our{" "}
					<Link to="/terms" className="underline hover:no-underline">
						Terms
					</Link>{" "}
					and{" "}
					<Link to="/privacy" className="underline hover:no-underline">
						Privacy Policy
					</Link>
				</p>
			</div>
		</div>
	);
}
