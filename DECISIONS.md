# Architectural decisions and open questions

## Accepted decisions

### D-001 — test-only cryptographic boundary

- Decision: Browser Web Crypto may create harmless test packages, using a versioned provisional format. No production payload upload or server persistence is enabled.
- Reason: the specification requires independent review before real material.
- Consequence: every related screen carries a test-only warning and exports locally.

### D-002 — centralized deterministic state transition

- Decision: One pure transition function owns plan-state advancement. Inputs include event ID, actor class, policy version, timestamp, freeze/integrity flags, and prior processed IDs.
- Reason: makes predecessor guards, idempotency, auditability, and model testing enforceable.

### D-003 — fail-closed global default

- Decision: release delivery is frozen unless GLOBAL_RELEASE_FREEZE_DEFAULT is explicitly configured to false in an approved production environment.

### D-004 — lazy integrations

- Decision: Clerk, Neon, Blob, Upstash, Resend, Twilio, Stripe, Sentry, and Workflow adapters are created only inside server operations after configuration validation.
- Consequence: documentation and static/test builds run without secrets; provider-backed actions show unavailable rather than fake success.

### D-005 — synthetic local preview

- Decision: unauthenticated local preview routes use fixed, harmless, non-personal fixture data and no server mutation.

### D-006 — dependency audit gate

- Decision: the deployable dependency set must have no known high or critical production advisories. Development-only Drizzle Kit tooling currently reports moderate transitive advisories and is not included in the runtime bundle.

### D-007 — plain-language interface, exact internal policy

- Decision: Owner-facing screens use everyday terms such as "trusted people",
  "practice run", "locked package", and "people who must agree". Internal
  schemas, event names, and safety documentation retain exact terms such as
  recipient, rehearsal, ciphertext, and quorum.
- Reason: The primary interface must be understandable to older and
  non-technical customers without weakening or hiding the safety rules.
- Consequence: Each safety choice includes a visible explanation. Technical
  identifiers and package hashes appear only in optional technical details or
  operator-facing surfaces.

### D-008 — provider-backed test services before live operations

- Decision: Clerk, Neon, Upstash, Resend, and Stripe are connected in test or
  sandbox mode first. Stripe billing and notification delivery remain isolated
  from continuity-plan state transitions.
- Reason: End-to-end provider behavior can be verified without accepting real
  payments or sending operational reminders.
- Consequence: Stripe Checkout uses test prices and signed, replay-protected
  webhooks. Resend uses its restricted onboarding sender until a custom domain
  is verified. Twilio remains unavailable until an account and test number are
  configured.

### D-009 — Vercel Marketplace environment aliases

- Decision: Runtime adapters accept Vercel Marketplace variable names in
  addition to the provider-native names documented in the original plan.
- Reason: Neon supplies pooled and migration URLs separately, and Upstash
  supplies `KV_REST_API_*` names.
- Consequence: Application traffic prefers the pooled Neon URL, migrations use
  the unpooled URL, and the original names remain supported for portability.

## Unresolved questions

- Launch jurisdictions and qualified legal reviewer.
- Exact safe lower/upper bounds for configurable policy timings.
- Reviewed production algorithm suite and key-envelope protocol.
- Clerk step-up method and phishing-resistant factor policy.
- Two-person control mechanism for global-freeze removal.
- Secondary notification provider and failover criteria.
- Cancellation retention period and account-closure workflow.
- Production observability vendor and redaction verification process.
- Whether organization plans need multiple owners or owner/admin separation in v1.
