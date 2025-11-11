import * as Sentry from "@sentry/tanstackstart-react";

Sentry.init({
	dsn: "https://1168f394eb02ba91a8a69980df23f8cd@o4510326395109376.ingest.us.sentry.io/4510326462021632",

	// Set tracesSampleRate to 1.0 to capture 100%
	// of transactions for tracing.
	// We recommend adjusting this value in production
	// Learn more at
	// https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
	tracesSampleRate: 1.0,

	// Setting this option to true will send default PII data to Sentry.
	// For example, automatic IP address collection on events
	sendDefaultPii: true,

	environment: process.env.NODE_ENV,
});
