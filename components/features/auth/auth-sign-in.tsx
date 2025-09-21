"use client";

import { FingerprintIcon, LibrarySquareIcon, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GithubIcon, GoogleIcon } from "@/components/brands";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { SITE_INFO } from "@/lib/constants";

export function AuthSignIn() {
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [passkeySupported, setPasskeySupported] = useState(false);

	const handleGithubSignIn = async () => {
		setError(null);
		setLoading(true);

		await authClient.signIn.social(
			{
				provider: "github",
				callbackURL: "/dashboard",
				errorCallbackURL: "/sign-in",
			},
			{
				onResponse: () => setLoading(false),
				onError: (ctx) => {
					setError(ctx.error.message);
				},
			},
		);
	};

	const handleGoogleSignIn = async () => {
		setError(null);
		setLoading(true);

		await authClient.signIn.social(
			{
				provider: "google",
				callbackURL: "/dashboard",
				errorCallbackURL: "/sign-in",
			},
			{
				onResponse: () => setLoading(false),
				onError: (ctx) => {
					setError(ctx.error.message);
				},
			},
		);
	};

	const handlePasskeySignIn = async () => {
		setError(null);
		setLoading(true);

		try {
			await authClient.signIn.passkey({
				fetchOptions: {
					onSuccess: () => {
						setLoading(false);
						router.push("/dashboard");
					},
					onError: (context) => {
						console.error("Passkey sign-in failed:", context.error.message);
						setError(context.error.message);
						setLoading(false);
					},
				},
			});

			setLoading(false);
		} catch (error) {
			console.log("Passkey authentication cancelled or failed:", error);
			setLoading(false);
		}
	};

	const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setError(null);
		setLoading(true);

		await authClient.signIn.magicLink(
			{
				email,
				callbackURL: "/dashboard",
				errorCallbackURL: "/sign-in",
			},
			{
				onRequest: () => {
					setLoading(true);
				},
				onSuccess: () => {
					setLoading(false);
					router.push("/magic-link");
				},
				onError: (ctx) => {
					setLoading(false);
					if (ctx.error.code === "USER_NOT_FOUND") {
						router.push("/magic-link");
					} else {
						setError(ctx.error.message);
					}
				},
			},
		);
	};

	useEffect(() => {
		const checkPasskeySupport = async () => {
			try {
				if (
					window?.PublicKeyCredential &&
					typeof window.PublicKeyCredential === "function"
				) {
					const available =
						await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
					setPasskeySupported(available);
				}
			} catch (error) {
				console.log("Passkey support check failed:", error);
				setPasskeySupported(false);
			}
		};

		checkPasskeySupport();
	}, []);

	return (
		<div className="flex min-h-screen">
			<div className="relative flex w-full items-center justify-center px-6 sm:px-12 lg:w-1/2">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="w-full max-w-md space-y-8"
				>
					<div className="w-full space-y-6 text-center">
						<div className="space-y-2">
							<h1 className="text-3xl text-foreground sm:text-4xl">
								Welcome to {SITE_INFO.name}
							</h1>
							<p className="text-lg text-muted-foreground leading-relaxed">
								{SITE_INFO.tagline}
							</p>
						</div>
						<div className="space-y-4">
							<Button
								type="button"
								size="lg"
								variant="outline"
								className="w-full gap-2"
								disabled={loading}
								onClick={handleGithubSignIn}
							>
								<GithubIcon />
								Sign in with Github
							</Button>

							<Button
								type="button"
								size="lg"
								variant="outline"
								className="w-full gap-2"
								disabled={loading}
								onClick={handleGoogleSignIn}
							>
								<GoogleIcon />
								Sign in with Google
							</Button>
							{passkeySupported && (
								<Button
									type="button"
									size="lg"
									variant="outline"
									className="w-full gap-2"
									disabled={loading}
									onClick={handlePasskeySignIn}
								>
									<FingerprintIcon />
									Sign in with Passkey
								</Button>
							)}
							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<span className="w-full border-foreground/25 border-t" />
								</div>
								<div className="relative flex justify-center">
									<span className="bg-background px-2 text-foreground/25 text-xs">
										OR
									</span>
								</div>
							</div>
							<form onSubmit={handleSignIn} className="flex flex-col gap-4">
								<Input
									id="email"
									type="email"
									placeholder="name@email.com"
									required
									onChange={(e) => {
										setEmail(e.target.value);
									}}
									value={email}
								/>
								<Button type="submit" className="w-full" disabled={loading}>
									{loading ? (
										<motion.div
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ duration: 0.4 }}
										>
											<Loader2 className="mr-2 size-4 animate-spin" />
										</motion.div>
									) : (
										"Continue"
									)}
								</Button>
								{error && <p className="text-destructive text-sm">{error}</p>}
							</form>
							{/* by continueing, you agree to our terms and conditions */}
							<p className="text-muted-foreground text-xs">
								By continuing, you agree to our{" "}
								<Link href="/terms" className="text-primary">
									Terms of Service
								</Link>{" "}
								and{" "}
								<Link href="/privacy" className="text-primary">
									Privacy Policy
								</Link>
							</p>
						</div>
					</div>
				</motion.div>
				<div className="absolute bottom-10">
					{/* copywrite, terms, privacy make it look nice */}

					<div className="flex items-center justify-center gap-6 font-mono text-xs">
						<span className="text-muted-foreground">
							{SITE_INFO.name} © {new Date().getFullYear()}
						</span>
						<Link
							className="text-muted-foreground hover:underline"
							href="/terms"
						>
							Terms of Service
						</Link>
						<Link
							className="text-muted-foreground hover:underline"
							href="/privacy"
						>
							Privacy Policy
						</Link>
					</div>
				</div>
			</div>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.3, duration: 0.8 }}
				className="relative hidden items-center justify-center overflow-hidden bg-muted/30 lg:flex lg:w-1/2"
			>
				<div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-violet-500/10" />

				<div className="absolute top-20 left-20 h-3 w-3 animate-pulse rounded-full bg-primary/20" />
				<div className="absolute top-40 right-32 h-2 w-2 animate-pulse rounded-full bg-violet-500/20 [animation-delay:1s]" />
				<div className="absolute bottom-32 left-16 h-4 w-4 animate-pulse rounded-full bg-emerald-500/20 [animation-delay:2s]" />
				<div className="absolute right-20 bottom-20 h-2 w-2 animate-pulse rounded-full bg-primary/20 [animation-delay:0.5s]" />

				<div className="relative z-10 space-y-6 text-center">
					<motion.div
						animate={{
							rotate: [0, 5, -5, 0],
							scale: [1, 1.05, 1],
						}}
						transition={{
							duration: 6,
							repeat: Infinity,
							ease: "easeInOut",
						}}
						className="mx-auto flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-400 to-violet-900 p-2 text-white"
					>
						<LibrarySquareIcon className="h-16 w-16 text-white" />
					</motion.div>

					<div className="space-y-2">
						<h2 className="font-bold text-2xl text-foreground">SmrtStudy</h2>
						<p className="text-muted-foreground">Study smarter, not harder</p>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
