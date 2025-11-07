import { createFileRoute } from "@tanstack/react-router";
import { ModeToggle } from "@/components/theme-toggle";

export const Route = createFileRoute("/")({ component: App });

function App() {
	return (
		<div className="flex flex-col min-h-screen">
			<header className="bg-slate-800 text-white p-4">
				<h1 className="text-2xl font-bold">SMRT Study</h1>
			</header>
			<ModeToggle />
		</div>
	);
}
