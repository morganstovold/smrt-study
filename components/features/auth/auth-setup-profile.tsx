"use client";

import { useUploadFile } from "@convex-dev/r2/react";
import { useMutation } from "convex/react";
import { LibrarySquareIcon, Loader2, Upload, User } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
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

	const fileInputRef = useRef<HTMLInputElement>(null);
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [uploadingImage, setUploadingImage] = useState(false);
	const uploadFile = useUploadFile(api.pfp);

	const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			// Validate file type
			if (!file.type.startsWith("image/")) {
				setError("Please select an image file");
				return;
			}

			// Validate file size (5MB max)
			if (file.size > 5 * 1024 * 1024) {
				setError("Image must be less than 5MB");
				return;
			}

			setSelectedImage(file);
			setError(null);

			const reader = new FileReader();
			reader.onload = (e) => {
				setImagePreview(e.target?.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleImageRemove = () => {
		setSelectedImage(null);
		setImagePreview(null);
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!firstName || !lastName) {
			setError("Please fill in all required fields");
			return;
		}

		setError(null);
		setLoading(true);

		try {
			let profileImageKey: string | undefined;

			if (selectedImage) {
				setUploadingImage(true);
				try {
					const uploadResult = await uploadFile(selectedImage);
					profileImageKey = uploadResult;
				} catch (uploadError) {
					console.error("Error uploading image:", uploadError);
					setError("Failed to upload profile image");
					return;
				} finally {
					setUploadingImage(false);
				}
			}

			const result = await editUserProfile({
				name: `${firstName} ${lastName}`,
				marketingEmails,
				imageKey: profileImageKey,
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
					<div className="space-y-2">
						<h1 className="text-3xl text-foreground sm:text-4xl">
							Complete Your Profile
						</h1>
						<p className="text-lg text-muted-foreground leading-relaxed">
							Let's personalize your {SITE_INFO.name} experience
						</p>
					</div>

					<div className="w-full space-y-6">
						<form onSubmit={handleSubmit} className="space-y-6 text-left">
							<div className="flex items-center gap-6">
								<button
									type="button"
									className="group relative h-24 w-24 cursor-pointer rounded-lg border-2 border-muted-foreground/25 border-dashed transition-colors hover:border-primary/50"
									onClick={() => fileInputRef.current?.click()}
								>
									{imagePreview ? (
										<Image
											src={imagePreview}
											alt="Profile preview"
											width={96}
											height={96}
											className="h-full w-full rounded-lg object-cover"
										/>
									) : (
										<div className="flex h-full w-full items-center justify-center rounded-lg bg-muted/30 transition-colors group-hover:bg-muted/50">
											<User className="h-8 w-8 text-muted-foreground" />
										</div>
									)}

									{/* Upload overlay */}
									<div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
										<Upload className="h-5 w-5 text-white" />
									</div>
								</button>

								<input
									ref={fileInputRef}
									type="file"
									accept="image/*"
									onChange={handleImageSelect}
									className="hidden"
								/>

								<div className="flex flex-col items-start gap-4">
									<div className="text-muted-foreground text-sm">
										Add or change your profile photo
									</div>
									<div className="flex gap-2">
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => fileInputRef.current?.click()}
											disabled={uploadingImage}
										>
											{uploadingImage ? (
												<>
													<Loader2 className="mr-2 h-4 w-4 animate-spin" />
													Uploading...
												</>
											) : (
												<>
													<Upload className="mr-2 h-4 w-4" />
													{selectedImage ? "Change Photo" : "Add Photo"}
												</>
											)}
										</Button>
										{/* remove image */}
										{selectedImage && (
											<Button
												type="button"
												size="sm"
												variant="destructive"
												onClick={() => handleImageRemove()}
											>
												Remove Photo
											</Button>
										)}
									</div>
								</div>
							</div>

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

							<Button
								type="submit"
								className="w-full"
								disabled={loading || uploadingImage}
							>
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

				<div className="absolute bottom-15">
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3, duration: 0.8 }}
						className="flex items-center justify-center gap-6 font-mono text-xs"
					>
						<motion.span
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.4, duration: 0.8 }}
							className="text-muted-foreground"
						>
							{SITE_INFO.name} © {new Date().getFullYear()}
						</motion.span>
						<motion.span
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.6, duration: 0.8 }}
						>
							<Link
								href="/terms"
								className="text-muted-foreground hover:underline"
							>
								Terms of Service
							</Link>
						</motion.span>
						<motion.span
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.8, duration: 0.8 }}
						>
							<Link
								href="/privacy"
								className="text-muted-foreground hover:underline"
							>
								Privacy Policy
							</Link>
						</motion.span>
					</motion.div>
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
