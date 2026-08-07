# Continuity Vault implementation plan

This plan is governed by README.md. “Complete” means the code and evidence meet the gate; it does not imply production approval.

## Phase 0 — repository and safety foundation

Status: complete for the test-only repository gate (07 August 2026)

- Dependencies: none.
- Scope: strict Next.js foundation, accessible design tokens and primitives, CI, secret hygiene, deterministic policy/state model, Drizzle schema and initial migration, documentation baseline.
- Main risks: creating a polished surface that implies readiness; allowing optional providers to break builds; state transitions distributed across the UI.
- Acceptance: formatting, lint, typecheck, unit/model tests, and production build pass; no provider is initialized at module load; global release freeze defaults on; threat model is reviewed.
- Verification gate: npm run verify.

## Phase 1 — public product and local test-package mode

Status: complete for the local test-only vertical slice (07 August 2026)

- Dependencies: Phase 0 model and UI primitives.
- Scope: marketing, pricing, security boundary, auth handoff, onboarding, plan designer, Web Crypto test-package creation, local encrypted export, prototype warnings.
- Main risks: plaintext leaving the browser; test mode appearing production-safe.
- Acceptance: network-boundary tests show plaintext is never submitted; unknown package versions reject; all screens identify test-only status; usability and accessibility smoke tests pass.
- Verification gate: unit, security, and Playwright suites plus production build.

## Phase 2 — accounts, plans, recipients, audit, billing adapters

Status: schema and fail-closed adapter contracts complete; live provider-backed behavior pending provisioning

- Dependencies: provisioned test Clerk, Neon, Stripe, Resend, Upstash.
- Scope: tenant-scoped persistence, migrations, recipient invitations, Stripe test subscriptions, signed/replay-protected webhooks, hash-chained audit events.
- Main risks: IDOR/cross-tenant access, webhook replay, billing coupled to release.
- Acceptance: isolation and webhook suites pass; billing events cannot advance plan state.

## Phase 3 — durable check-ins

Status: pending

- Dependencies: Phase 2 provider sandboxes and policy model.
- Scope: Workflow DevKit orchestration, challenges, reminders, grace period, contact quorum, holds, owner return, retries, exception queue.
- Main risks: duplicate workflow execution, clock/provider ambiguity.
- Acceptance: model-based and workflow tests pass; every ambiguous/provider-failure path freezes or preserves state.

## Phase 4 — release rehearsals

Status: pending

- Dependencies: Phase 3.
- Scope: harmless test delivery, readiness, quorum simulation, cancellation, recovery-guide verification, tamper-evident receipt.
- Acceptance: failed rehearsal cannot arm; rehearsal cannot resolve a production package.

## Phase 5 — cryptographic production candidate

Status: externally gated

- Dependencies: independent cryptographic and penetration reviews.
- Scope: reviewed package format, recipient envelopes, private ciphertext storage, recovery kit, migration support.
- Acceptance: independent reviews completed and critical findings retested. Until then, production package upload remains disabled.

## Phase 6 — limited pilot

Status: externally gated

- Dependencies: legal/policy, operations, restore and incident exercises.
- Acceptance: capped cohort, environment separation, freeze exercise, restore evidence, assigned incident roles, no unresolved high/critical findings.

## Cross-phase rules

- One coherent checkpoint per phase or smaller reviewable slice.
- Schema changes always include migrations and rollback notes.
- Security-sensitive changes update THREAT_MODEL.md, ARCHITECTURE.md, and DECISIONS.md.
- No production promotion until the exact preview artifact has passed end-to-end checks.
