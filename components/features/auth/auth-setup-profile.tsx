"use client";

import { useMutation } from "convex/react";
import { LibrarySquareIcon, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import { SITE_INFO } from "@/lib/constants";

export function AuthSetupProfile() {
	const router = useRouter();
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [marketingEmails, setMarketingEmails] = useState(true);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const editUserProfile = useMutation(api.users.editUserProfile);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!firstName || !lastName) {
			setError("Please fill in all required fields");
			return;
		}

		setError(null);
		setLoading(true);

		try {
			const result = await editUserProfile({
				name: `${firstName} ${lastName}`,
				marketingEmails,
			});

			if (result !== "SUCCESS") {
				setError("Failed to edit user profile");
				return;
			}

			router.push("/dashboard");
		} catch (error) {
			console.error("Error editing user profile:", error);
			setError("Failed to edit user profile");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen">
			<div className="relative flex w-full items-center justify-center px-6 sm:px-12 lg:w-1/2">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="w-full max-w-md space-y-10"
				>
					<div className="space-y-2 text-center">
						<h1 className="text-3xl text-foreground sm:text-4xl">
							Complete Your Profile
						</h1>
						<p className="text-lg text-muted-foreground leading-relaxed">
							Let's personalize your {SITE_INFO.name} experience
						</p>
					</div>
					<div className="w-full space-y-6">
						<form onSubmit={handleSubmit} className="space-y-6 text-left">
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-4">
									<Label htmlFor="firstName">First Name</Label>
									<Input
										id="firstName"
										type="text"
										placeholder="John"
										required
										value={firstName}
										onChange={(e) => setFirstName(e.target.value)}
									/>
								</div>
								<div className="space-y-4">
									<Label htmlFor="lastName">Last Name</Label>
									<Input
										id="lastName"
										type="text"
										placeholder="Doe"
										required
										value={lastName}
										onChange={(e) => setLastName(e.target.value)}
									/>
								</div>
							</div>

							<div className="flex space-x-4 px-2">
								<Checkbox
									id="marketing"
									checked={marketingEmails}
									onCheckedChange={(checked) => setMarketingEmails(!!checked)}
								/>
								<Label
									htmlFor="marketing"
									className="cursor-pointer font-normal text-sm"
								>
									I'd like to receive marketing emails & product updates
								</Label>
							</div>

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
									"Complete Setup"
								)}
							</Button>

							{error && (
								<p className="text-center text-destructive text-sm">{error}</p>
							)}
						</form>

						<p className="text-center text-muted-foreground text-xs">
							By continuing, you agree to our{" "}
							<Link href="/terms" className="text-primary hover:underline">
								Terms of Service
							</Link>{" "}
							and{" "}
							<Link href="/privacy" className="text-primary hover:underline">
								Privacy Policy
							</Link>
						</p>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.4, duration: 0.8 }}
					className="absolute bottom-10"
				>
					<div className="flex items-center justify-center gap-6 font-mono text-xs">
						<motion.span
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4, duration: 0.4 }}
							className="text-muted-foreground"
						>
							{SITE_INFO.name} © {new Date().getFullYear()}
						</motion.span>
						<motion.span
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.6, duration: 0.4 }}
							className="text-muted-foreground"
						>
							<Link
								className="text-muted-foreground hover:underline"
								href="/terms"
							>
								Terms of Service
							</Link>
						</motion.span>
						<motion.span
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.8, duration: 0.4 }}
							className="text-muted-foreground"
						>
							<Link
								className="text-muted-foreground hover:underline"
								href="/privacy"
							>
								Privacy Policy
							</Link>
						</motion.span>
					</div>
				</motion.div>
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
