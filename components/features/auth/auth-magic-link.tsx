"use client";

import { LibrarySquareIcon, MailCheckIcon } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { SITE_INFO } from "@/lib/constants";

export function AuthMagicLinkSent() {
	return (
		<div className="flex min-h-screen">
			<div className="relative flex w-full items-center justify-center px-6 sm:px-12 lg:w-1/2">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="w-full max-w-sm space-y-8 text-center"
				>
					<div className="relative flex flex-col items-center gap-2">
						<MailCheckIcon
							strokeWidth={0.5}
							className="-top-[250%] absolute mb-2 size-42 text-primary opacity-10"
						/>
						<h1 className="text-3xl text-foreground sm:text-4xl">
							Check Your Email
						</h1>
						<p className="text-lg text-muted-foreground leading-relaxed">
							We've sent you a magic link to continue
						</p>
					</div>

					<Link
						href="/sign-in"
						className={buttonVariants({
							variant: "outline",
							className: "w-full",
						})}
					>
						← Back to Sign In
					</Link>
				</motion.div>

				<div className="absolute bottom-10">
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
