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
