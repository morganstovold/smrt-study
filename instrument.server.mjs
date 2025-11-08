import * as Sentry from "@sentry/tanstackstart-react";

Sentry.init({
  dsn: "https://03d36a6463223e353254a4f7b0aba7e1@o4510326395109376.ingest.us.sentry.io/4510326398713856",

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for tracing.
  // We recommend adjusting this value in production
  // Learn more at
  // https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
  tracesSampleRate: 1.0,

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});