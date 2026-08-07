# Service setup for the connected test system

This file separates harmless provider testing from production approval. Keep
`GLOBAL_RELEASE_FREEZE_DEFAULT=true`, and do not enter real instructions,
documents, passwords, recovery codes, or customer information.

## Connected now

- **GitHub and Vercel:** `main` deploys to the linked Continuity Vault project.
- **Clerk:** development authentication keys are connected.
- **Neon:** Postgres is connected and the reviewed migration created 18 tables.
- **Upstash Redis:** connected for rate limits and webhook replay protection.
- **Stripe:** a sandbox catalog contains the Personal, Household, and Founder
  monthly and annual CAD prices. Checkout, the customer portal, and a signed
  webhook are wired. These are test payments only.
- **Resend:** the restricted onboarding key is connected. It may send a harmless
  practice message to the account email through `onboarding@resend.dev`.
- **Vercel Workflow:** runs in the existing Vercel project and needs no separate
  account.

## Still needed before broader testing

| Service           | What the owner must do                                                                                            | Why                                                                        |
| ----------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Domain and Resend | Buy or connect a domain, then verify a sending subdomain such as `notify.example.com`                             | Resend's onboarding sender is restricted and is not suitable for customers |
| Stripe            | Finish business verification and claim the sandbox when ready to move toward live mode                            | The current catalog cannot accept real money                               |
| Twilio            | Create a trial account, select a test-capable number or Messaging Service, and complete any required registration | SMS is intentionally unavailable until the account exists                  |
| Sentry            | Create a Next.js project and approve strict data scrubbing                                                        | Production error reporting must not receive protected data                 |

Twilio's `pip install Flask Twilio` command belongs to its Python tutorial.
Continuity Vault is a Node/Next.js application and already includes the Twilio
Node library, so do not install Flask or Python packages for this website.

Create a **private** Vercel Blob store only after the protected-package format
passes independent cryptographic review. Until then, keep
`BLOB_READ_WRITE_TOKEN` unset and keep real package upload disabled.

## Production gates that remain closed

- Independent cryptographic and security review of protected-material handling.
- Legal review for launch jurisdictions, consent, retention, and exceptions.
- Verified Resend domain and signed delivery-event webhook.
- Registered Twilio sending route and signed callback test.
- Stripe live-mode activation, tax decision, refund policy, and a live-mode test
  performed by the business owner.
- Redacted observability review and an operator runbook.

Billing, email, SMS, and AI output never authorize or advance package sharing.
Provider failure, ambiguity, replay, or missing configuration fails closed.
