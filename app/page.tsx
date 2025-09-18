"use client";

import AuthButtons from "@/components/AuthButtons";

export default function Home() {
	return (
		<div className="flex h-screen w-screen flex-col items-center justify-center gap-6 bg-background text-foreground">
			<h1 className="font-bold text-4xl">Smrt Study</h1>
			<AuthButtons />
		</div>
	);
}
