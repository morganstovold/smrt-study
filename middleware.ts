import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

const signInRoutes = [
	"/sign-in",
	"/sign-up",
	"/verify-email",
	"/reset-password",
];
const protectedRoutes = ["/dashboard"];

export default async function middleware(request: NextRequest) {
	const sessionCookie = getSessionCookie(request);

	const isSignInRoute = signInRoutes.includes(request.nextUrl.pathname);

	if (protectedRoutes.includes(request.nextUrl.pathname) && !sessionCookie) {
		const url = request.nextUrl.clone();
		url.searchParams.set("redirect", request.nextUrl.pathname);
		return NextResponse.redirect(new URL("/sign-in", request.url));
	}

	if (isSignInRoute && sessionCookie) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	return NextResponse.next();
}

export const config = {
	/*
	 * Match all request paths except for the ones starting with:
	 * - _next/static (static files)
	 * - _next/image (image optimization files)
	 * - favicon.ico (favicon file)
	 * - public files (public folder)
	 */
	matcher:
		"/((?!_next/static|_next/image|api/auth|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
};
