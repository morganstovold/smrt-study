import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { SITE_INFO } from "@/lib/constants";

const robotoSans = Roboto({
	variable: "--font-roboto-sans",
	subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
	variable: "--font-roboto-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: SITE_INFO.name,
	description: SITE_INFO.description,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${robotoSans.variable} ${robotoMono.variable} font-sans antialiased`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<ConvexClientProvider>{children}</ConvexClientProvider>
				</ThemeProvider>
				<Toaster />
			</body>
		</html>
	);
}
