import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "./ui/button";

export function ModeToggle() {
	const { theme, setTheme } = useTheme();

	function toggleTheme() {
		setTheme(theme === "light" ? "dark" : "light");
	}

	return (
		<Button onClick={toggleTheme} size="icon" aria-label="Toggle theme">
			{theme === "dark" ? <Moon /> : <Sun />}
		</Button>
	);
}
