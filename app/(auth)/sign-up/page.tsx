"use client";
import { AlertCircle, Loader2 } from "lucide-react";
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

export default function SignUpPage() {
	const router = useRouter();
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [validationErrors, setValidationErrors] = useState<{
		password?: string;
		passwordMatch?: string;
		email?: string;
	}>({});

	const clearMessages = () => {
		setError(null);
		setValidationErrors({});
	};

	const validateForm = () => {
		const errors: typeof validationErrors = {};

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			errors.email = "Please enter a valid email address";
		}

		// Password validation
		if (password.length < 8) {
			errors.password = "Password must be at least 8 characters long";
		}

		// Password confirmation validation
		if (password !== passwordConfirmation) {
			errors.passwordMatch = "Passwords do not match";
		}

		setValidationErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleSignUp = async () => {
		clearMessages();

		// Validate form before submission
		if (!validateForm()) {
			return;
		}

		await authClient.signUp.email(
			{
				email,
				password,
				name: `${firstName} ${lastName}`,
			},
			{
				onRequest: () => {
					setLoading(true);
				},
				onSuccess: () => {
					setLoading(false);
					toast.success("Account created successfully!", {
						description: "Welcome! You can now sign in to your account.",
					});
					// Redirect to sign-in page or dashboard
					router.push("/sign-in");
				},
				onError: async (ctx) => {
					setLoading(false);
					console.error(ctx.error);
					console.error("response", ctx.response);

					// Handle specific better-auth error codes
					if (ctx.error.code === "USER_ALREADY_EXISTS") {
						toast.error("Account already exists", {
							description:
								"An account with this email already exists. Try signing in instead.",
							action: {
								label: "Sign in",
								onClick: () => router.push("/sign-in"),
							},
						});
					} else if (ctx.error.code === "INVALID_EMAIL") {
						setValidationErrors({
							email: "Please enter a valid email address",
						});
					} else if (ctx.error.code === "WEAK_PASSWORD") {
						setValidationErrors({
							password:
								"Password is too weak. Please choose a stronger password.",
						});
					} else {
						setError(ctx.error.message);
					}
				},
			},
		);
	};

	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		handleSignUp();
	};

	return (
		<div className="flex min-h-screen w-full items-center justify-center p-4">
			<div className="w-full max-w-md">
				<Card className="max-w-md">
					<CardHeader>
						<CardTitle className="text-lg md:text-xl">Sign Up</CardTitle>
						<CardDescription className="text-xs md:text-sm">
							Enter your information to create an account
						</CardDescription>
					</CardHeader>
					<CardContent>
						{error && (
							<Alert variant="destructive" className="mb-4">
								<AlertCircle className="h-4 w-4" />
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						<form onSubmit={handleFormSubmit} className="grid gap-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="grid gap-2">
									<Label htmlFor="first-name">First name</Label>
									<Input
										id="first-name"
										placeholder="Max"
										required
										onChange={(e) => {
											setFirstName(e.target.value);
											clearMessages();
										}}
										value={firstName}
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="last-name">Last name</Label>
									<Input
										id="last-name"
										placeholder="Robinson"
										required
										onChange={(e) => {
											setLastName(e.target.value);
											clearMessages();
										}}
										value={lastName}
									/>
								</div>
							</div>

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
									className={validationErrors.email ? "border-red-500" : ""}
								/>
								{validationErrors.email && (
									<p className="text-red-500 text-sm">
										{validationErrors.email}
									</p>
								)}
							</div>

							<div className="grid gap-2">
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									type="password"
									value={password}
									onChange={(e) => {
										setPassword(e.target.value);
										clearMessages();
									}}
									autoComplete="new-password"
									placeholder="Password"
									className={validationErrors.password ? "border-red-500" : ""}
								/>
								{validationErrors.password && (
									<p className="text-red-500 text-sm">
										{validationErrors.password}
									</p>
								)}
								<p className="text-muted-foreground text-xs">
									Password must be at least 8 characters long
								</p>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="password_confirmation">Confirm Password</Label>
								<Input
									id="password_confirmation"
									type="password"
									value={passwordConfirmation}
									onChange={(e) => {
										setPasswordConfirmation(e.target.value);
										clearMessages();
									}}
									autoComplete="new-password"
									placeholder="Confirm Password"
									className={
										validationErrors.passwordMatch ? "border-red-500" : ""
									}
								/>
								{validationErrors.passwordMatch && (
									<p className="text-red-500 text-sm">
										{validationErrors.passwordMatch}
									</p>
								)}
							</div>

							<Button
								type="submit"
								className="w-full"
								disabled={
									loading ||
									!firstName ||
									!lastName ||
									!email ||
									!password ||
									!passwordConfirmation
								}
							>
								{loading ? (
									<Loader2 size={16} className="mr-2 animate-spin" />
								) : null}
								Create an account
							</Button>

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
								disabled={loading}
								onClick={async () => {
									await authClient.signIn.social(
										{
											provider: "github",
										},
										{
											onRequest: () => {
												setLoading(true);
											},
											onResponse: () => setLoading(false),
											onError: (ctx) => {
												toast.error("GitHub sign-up failed", {
													description: ctx.error.message,
												});
											},
										},
									);
								}}
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
								Sign up with Github
							</Button>

							<Button
								type="button"
								variant="outline"
								className="w-full gap-2"
								disabled={loading}
								onClick={async () => {
									await authClient.signIn.social(
										{
											provider: "google",
										},
										{
											onRequest: () => {
												setLoading(true);
											},
											onSuccess: () => {
												setLoading(false);
												toast.success("Google sign-up successful!", {
													description:
														"Welcome! Your account has been created.",
												});
											},
											onError: (ctx) => {
												setLoading(false);
												toast.error("Google sign-up failed", {
													description: ctx.error.message,
												});
											},
										},
									);
								}}
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
								Sign up with Google
							</Button>
						</form>
					</CardContent>
				</Card>
				<p className="mt-4 text-center text-neutral-600 text-sm dark:text-neutral-400">
					Already have an account?{" "}
					<Link
						href="/sign-in"
						className="text-orange-400 underline hover:text-orange-500 dark:text-orange-300 dark:hover:text-orange-200"
					>
						Sign in
					</Link>
				</p>
			</div>
		</div>
	);
}