# Service setup for the first connected test

This file separates account setup from production approval. Create sandbox or
test resources first. Keep `GLOBAL_RELEASE_FREEZE_DEFAULT=true`, and do not use
real customer instructions, documents, passwords, or recovery information.

You may use the same Google account to sign in to each provider through its own
Google sign-in page. Never paste the Google password into this repository, a
terminal, a chat, or an environment variable.

## Accounts already connected

- GitHub hosts the source repository.
- Vercel builds the `main` branch and hosts previews and production deployments.
- Vercel Workflow runs inside the existing Vercel project and does not require
  a separate account.

## Create these accounts next

| Order | Service                                                                 | What it does                                                      | First resource to create                                  | App configuration                                                                                  |
| ----- | ----------------------------------------------------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| 1     | [Clerk](https://clerk.com/docs/nextjs/getting-started/quickstart)       | Secure sign-in and account sessions                               | Development application with Google sign-in               | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET`                    |
| 2     | [Neon](https://neon.com/docs/guides/vercel-manual)                      | Stores accounts, plans, rules, check-ins, and redacted activity   | Test Postgres project connected to Vercel                 | `DATABASE_URL`                                                                                     |
| 3     | [Upstash Redis](https://upstash.com/docs/redis/howto/vercelintegration) | Rate limits and blocks repeated or replayed requests              | Test Redis database in the Vercel region                  | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`                                               |
| 4     | [Resend](https://resend.com/changelog/vercel-marketplace-integration)   | Sends check-in reminders and trusted-person invitations           | Test sending domain or Vercel-managed integration         | `RESEND_API_KEY`, `RESEND_WEBHOOK_SECRET`, `EMAIL_FROM`                                            |
| 5     | [Stripe](https://docs.stripe.com/payments/subscriptions)                | Test subscriptions and billing                                    | Test-mode products and monthly/yearly prices              | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and the six `STRIPE_PRICE_*` values                  |
| 6     | [Twilio](https://www.twilio.com/docs/messaging/quickstart)              | Sends text-message reminders                                      | Trial account, messaging service, and test-capable number | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_MESSAGING_SERVICE_SID`, `TWILIO_WEBHOOK_SECRET` |
| 7     | [Sentry](https://docs.sentry.io/platforms/javascript/guides/nextjs/)    | Reports application errors without exposing protected information | Next.js test project                                      | `SENTRY_DSN`                                                                                       |

Create a **private** [Vercel Blob](https://vercel.com/docs/vercel-blob) store
later, after the package format has passed independent cryptographic review.
Until then, `BLOB_READ_WRITE_TOKEN` should stay unset and package upload must
stay disabled.

## Recommended setup order

1. Buy or connect a domain in Vercel. Email sending needs a domain with DNS
   records that can be verified.
2. Connect Clerk, Neon, and Upstash to the Vercel project.
3. Add Resend and verify an email subdomain such as `notify.example.com`.
4. Configure Stripe in test mode only. Billing status must never approve or
   advance package sharing.
5. Add Twilio after email reminders work. Sending to real US or Canadian phone
   numbers may require toll-free verification or A2P registration.
6. Add Sentry with strict data scrubbing before sending any test error events.
7. Redeploy, run database migrations against the test database, and verify
   `/api/status` reports the expected providers as configured.

## What I can complete after account access exists

- Replace the preview sign-in pages with Clerk development authentication.
- Persist tenant-scoped plans and redacted audit events in Neon.
- Add Upstash rate limits and replay protection to mutations and webhooks.
- Send harmless email and SMS practice reminders through provider sandboxes.
- Connect Stripe test subscriptions without coupling billing to safety rules.
- Add signed webhooks, idempotency, retry tests, and provider-failure tests.
- Add a redacted operations dashboard for workflow runs, provider health,
  delivery attempts, and frozen cases.

Account creation can involve accepting provider terms, choosing paid plans,
buying a domain or phone number, and regulatory registration. Those choices
must be made by the account owner in the provider pages. Credentials should be
added directly to Vercel environment settings, not sent through chat.
