"use client";

import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [magicLinkLoading, setMagicLinkLoading] = useState(false);
	const [otpLoading, setOtpLoading] = useState(false);
	const [forgotLoading, setForgotLoading] = useState(false);
	const [signInMethod, setSignInMethod] = useState<"password" | "passwordless">(
		"passwordless",
	);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const clearMessages = () => {
		setError(null);
		setSuccess(null);
	};

	const handleSignIn = async () => {
		clearMessages();
		await authClient.signIn.email(
			{
				email,
				password,
			},
			{
				onRequest: () => {
					setOtpLoading(true);
				},
				onSuccess: (ctx) => {
					setOtpLoading(false);
					if (ctx.data.twoFactorRedirect) {
						router.push("/verify-2fa");
					} else {
						toast.success("Welcome back! You've been signed in successfully.");
						router.push("/");
					}
				},
				onError: (ctx) => {
					setOtpLoading(false);
					console.log(ctx);
					// Check for better-auth USER_NOT_FOUND error code
					if (ctx.error.code === "USER_NOT_FOUND") {
						toast.error("No account found with this email", {
							action: {
								label: "Sign up",
								onClick: () => router.push("/sign-up"),
							},
						});
					} else {
						setError(ctx.error.message);
					}
				},
			},
		);
	};

	const handleResetPassword = async () => {
		clearMessages();
		setForgotLoading(true);
		try {
			await authClient.forgetPassword({
				email,
				redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
			});
			toast.success("Password reset email sent!");
		} catch {
			toast.error("Failed to send reset email");
		} finally {
			setForgotLoading(false);
		}
	};

	const handleMagicLinkSignIn = async () => {
		clearMessages();
		await authClient.signIn.magicLink(
			{
				email,
				callbackURL: "/dashboard",
				errorCallbackURL: "/sign-in",
			},
			{
				onRequest: () => {
					setMagicLinkLoading(true);
				},
				onSuccess: () => {
					setMagicLinkLoading(false);
					toast.success("Check your email and click the link to sign in.");
				},
				onError: (ctx) => {
					setMagicLinkLoading(false);
					console.log(ctx);
					// Check for better-auth USER_NOT_FOUND error code
					if (ctx.error.code === "USER_NOT_FOUND") {
						toast.error("No account found with this email", {
							action: {
								label: "Sign up",
								onClick: () => router.push("/sign-up"),
							},
						});
					} else {
						setError(ctx.error.message);
					}
				},
			},
		);
	};

	const handleGithubSignIn = async () => {
		clearMessages();
		await authClient.signIn.social(
			{
				provider: "github",
				callbackURL: "/dashboard",
				errorCallbackURL: "/sign-in",
			},
			{
				onRequest: () => {
					setOtpLoading(true);
				},
				onResponse: () => setOtpLoading(false),
				onError: (ctx) => {
					setError(ctx.error.message);
				},
			},
		);
	};

	const handleGoogleSignIn = async () => {
		clearMessages();
		await authClient.signIn.social(
			{
				provider: "google",
				callbackURL: "/dashboard",
				errorCallbackURL: "/sign-in",
			},
			{
				onRequest: () => {
					setOtpLoading(true);
				},
				onResponse: () => setOtpLoading(false),
				onError: (ctx) => {
					setError(ctx.error.message);
				},
			},
		);
	};

	return (
		<div className="flex min-h-screen w-full items-center justify-center p-4">
			<div className="w-full max-w-md">
				<Card className="max-w-md">
					<CardHeader>
						<CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
						<CardDescription className="text-xs md:text-sm">
							Enter your email below to login to your account
						</CardDescription>
					</CardHeader>
					<CardContent>
						{error && (
							<Alert variant="destructive" className="mb-4">
								<AlertCircle className="h-4 w-4" />
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						{success && (
							<Alert className="mb-4 border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
								<CheckCircle2 className="h-4 w-4" />
								<AlertDescription>{success}</AlertDescription>
							</Alert>
						)}

						<form
							onSubmit={(e) => {
								e.preventDefault();
								if (signInMethod === "password") {
									handleSignIn();
								}
							}}
							className="grid gap-4"
						>
							<div className="grid gap-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="m@example.com"
									required
									onChange={(e) => {
										setEmail(e.target.value);
										clearMessages();
									}}
									value={email}
								/>
							</div>

							{signInMethod === "password" && (
								<div className="grid gap-2">
									<div className="flex items-center justify-between">
										<Label htmlFor="password">Password</Label>
										<Button
											variant="link"
											size="sm"
											type="button"
											onClick={handleResetPassword}
											className="cursor-pointer"
											disabled={forgotLoading || !email}
										>
											{forgotLoading ? (
												<Loader2 size={14} className="mr-1 animate-spin" />
											) : null}
											Forgot your password?
										</Button>
									</div>
									<Input
										id="password"
										type="password"
										placeholder="password"
										autoComplete="password"
										required
										value={password}
										onChange={(e) => {
											setPassword(e.target.value);
											clearMessages();
										}}
									/>
								</div>
							)}

							<div className="flex flex-col gap-2">
								{signInMethod === "password" && (
									<Button
										type="submit"
										className="w-full"
										disabled={otpLoading}
									>
										{otpLoading ? (
											<Loader2 size={16} className="mr-2 animate-spin" />
										) : null}
										Sign in with Password
									</Button>
								)}
								{signInMethod === "passwordless" && (
									<Button
										type="button"
										className="w-full"
										disabled={magicLinkLoading || otpLoading}
										onClick={handleMagicLinkSignIn}
									>
										{magicLinkLoading ? (
											<Loader2 size={16} className="mr-2 animate-spin" />
										) : null}
										Send Magic Link
									</Button>
								)}

								<Button
									type="button"
									variant="ghost"
									className="text-sm"
									onClick={() => {
										setSignInMethod(
											signInMethod === "password" ? "passwordless" : "password",
										);
										setPassword("");
										clearMessages();
									}}
								>
									{signInMethod === "password"
										? "Sign in with magic link"
										: "Sign in with a password instead"}
								</Button>
							</div>

							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<span className="w-full border-neutral-800 border-t" />
								</div>
								<div className="relative flex justify-center text-xs">
									<span className="bg-card px-2 text-neutral-500">
										or continue with
									</span>
								</div>
							</div>

							<Button
								type="button"
								variant="outline"
								className="w-full gap-2"
								disabled={otpLoading}
								onClick={handleGithubSignIn}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="1em"
									height="1em"
									viewBox="0 0 24 24"
								>
									<title>GitHub</title>
									<path
										fill="currentColor"
										d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
									/>
								</svg>
								Sign in with Github
							</Button>

							<Button
								type="button"
								variant="outline"
								className="w-full gap-2"
								disabled={otpLoading}
								onClick={handleGoogleSignIn}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="0.98em"
									height="1em"
									viewBox="0 0 256 262"
								>
									<title>Google</title>
									<path
										fill="#4285F4"
										d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
									/>
									<path
										fill="#34A853"
										d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
									/>
									<path
										fill="#FBBC05"
										d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
									/>
									<path
										fill="#EB4335"
										d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
									/>
								</svg>
								Sign in with Google
							</Button>
						</form>
					</CardContent>
				</Card>
				<p className="mt-4 text-center text-neutral-600 text-sm dark:text-neutral-400">
					Don&apos;t have an account?{" "}
					<Link
						href="/sign-up"
						className="text-orange-400 underline hover:text-orange-500 dark:text-orange-300 dark:hover:text-orange-200"
					>
						Sign up
					</Link>
				</p>
			</div>
		</div>
	);
}
