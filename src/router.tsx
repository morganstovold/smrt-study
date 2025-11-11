import { ConvexQueryClient } from "@convex-dev/react-query";
import * as Sentry from "@sentry/tanstackstart-react";
import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { DefaultCatchBoundary } from "./components/default-catch-boundary";
import { NotFound } from "./components/not-found";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
	const CONVEX_URL = import.meta.env.VITE_CONVEX_URL;
	if (!CONVEX_URL) {
		throw new Error("missing VITE_CONVEX_URL envar");
	}
	const convex = new ConvexReactClient(CONVEX_URL, {
		unsavedChangesWarning: false,
	});
	const convexQueryClient = new ConvexQueryClient(convex);

	const queryClient: QueryClient = new QueryClient({
		defaultOptions: {
			queries: {
				queryKeyHashFn: convexQueryClient.hashFn(),
				queryFn: convexQueryClient.queryFn(),
			},
		},
	});
	convexQueryClient.connect(queryClient);

	const router = routerWithQueryClient(
		createRouter({
			routeTree,
			context: { queryClient, convexClient: convex, convexQueryClient },
			scrollRestoration: true,
			defaultPreload: "intent",
			defaultErrorComponent: DefaultCatchBoundary,
			defaultNotFoundComponent: () => <NotFound />,
			Wrap: ({ children }) => (
				<ConvexProvider client={convexQueryClient.convexClient}>
					{children}
				</ConvexProvider>
			),
		}),
		queryClient,
	);

	if (!router.isServer) {
		Sentry.init({
			dsn: "https://1168f394eb02ba91a8a69980df23f8cd@o4510326395109376.ingest.us.sentry.io/4510326462021632",

			integrations: [
				Sentry.tanstackRouterBrowserTracingIntegration(router),
				Sentry.replayIntegration(),
			],

			// Set tracesSampleRate to 1.0 to capture 100%
			// of transactions for tracing.
			tracesSampleRate: 1.0,

			// Capture Replay for 10% of all sessions,
			// plus for 100% of sessions with an error.
			replaysSessionSampleRate: 0.1,
			replaysOnErrorSampleRate: 1.0,

			// Setting this option to true will send default PII data to Sentry.
			// For example, automatic IP address collection on events
			sendDefaultPii: true,

			environment: import.meta.env.NODE_ENV,
		});
	}

	return router;
};

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
