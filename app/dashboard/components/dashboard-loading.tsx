import { LibrarySquareIcon } from "lucide-react";

export default function DashboardLoading() {
	return (
		<div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-background">
			{/* Single subtle background gradient */}
			<div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-primary/5" />

			{/* One floating orb for subtle ambiance */}
			<div className="absolute top-1/6 right-1/6 size-48 animate-pulse rounded-full bg-primary/8 blur-3xl [animation-duration:4s]" />
			<div className="absolute bottom-1/6 left-1/6 size-48 animate-pulse rounded-full bg-primary/8 blur-3xl [animation-duration:4s]" />

			{/* Main logo with clean styling */}
			<div className="relative z-10 flex items-center space-x-4 rounded-2xl border border-border/30 bg-card/30 p-8 shadow-lg backdrop-blur-sm">
				<LibrarySquareIcon className="size-12 text-primary" />
				<h1 className="font-semibold text-4xl text-foreground tracking-tight">
					SmrtStudy
				</h1>
			</div>

			<div className="absolute bottom-16 flex items-center space-x-1">
				<div className="h-1 w-8 animate-pulse rounded-full bg-primary/50" />
				<div className="h-1 w-8 animate-pulse rounded-full bg-primary/50 [animation-delay:0.3s]" />
				<div className="h-1 w-8 animate-pulse rounded-full bg-primary/50 [animation-delay:0.6s]" />
			</div>
		</div>
	);
}
