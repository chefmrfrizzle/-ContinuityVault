# Threat model

## Scope and safety posture

The current build is an unaudited test-mode system. It must not accept real protected material. Delivery advances only through deterministic policy; uncertainty freezes.

## Protected assets

- Protected plaintext, filenames, content-encryption keys, recipient private keys, and recovery material.
- Account sessions, one-time challenges, webhook secrets, provider credentials, and step-up evidence.
- Ciphertext packages, wrapped-key envelopes, policy versions, recipient status, workflow state, and audit-chain integrity.
- Availability and correctness of check-in and freeze controls.
- Privacy of identities, plan purposes, notification metadata, and operator cases.

## Trust boundaries

1. Browser: plaintext and unwrapped keys exist only here during explicit local operations.
2. Next.js application: authentication, authorization, redacted metadata, policy, state, orchestration.
3. Data services: Neon relational data, private Blob ciphertext, Upstash replay/rate controls.
4. Providers: Clerk, Workflow, Resend, Twilio, Stripe, monitoring; each receives minimal scoped data.
5. Operator plane: redacted exception data and freeze/hold controls; no decrypt or force-deliver permission.

## Adversaries and abuse cases

| Threat                                | Primary controls                                                                           | Residual risk                                             |
| ------------------------------------- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------- |
| Account takeover/session fixation     | Managed auth, phishing-resistant factors, step-up, cooling periods, old-channel notice     | Identity provider compromise or coerced user              |
| SIM swap/email compromise             | Channels only notify; authenticated one-time app challenge                                 | Compromised primary account may still aid takeover        |
| Stolen/replayed link or webhook       | Short TTL, single use, hashed challenge, signature verification, replay store, idempotency | Replay-store outage must freeze processing                |
| Malicious recipient                   | Per-plan auth challenge, quorum, conflict freeze, least metadata                           | Coordinated quorum collusion                              |
| Malicious operator                    | No keys/plaintext, no force delivery, immutable audit, two-person high-risk control        | Privileged infrastructure compromise                      |
| Database or Blob exposure             | Ciphertext only, private access, tenant authorization, envelope separation                 | Metadata leakage and offline cryptanalysis                |
| Cross-tenant IDOR                     | Ownership predicates, server-side authorization, isolation tests                           | Application defect before independent test                |
| Supply-chain compromise               | Lockfile, CI scanning, pinned actions, secret-free builds                                  | Compromised upstream package/signing                      |
| Workflow duplication/clock error      | Event IDs, predecessor guards, versioned UTC policy, state reconciliation                  | Coordinated time/infrastructure failure                   |
| Provider outage/conflicting callbacks | No advancement on failure, bounded retry, operator case, freeze                            | Delayed check-in or delivery                              |
| Billing error                         | Entitlements isolated from release reducer                                                 | Account-access/support disruption                         |
| Plaintext logging/analytics           | Structured allowlist, redaction, no message bodies or filenames                            | Browser extensions/client compromise                      |
| Package integrity failure             | SHA-256 receipt, authenticated encryption, pre-delivery verification                       | Unreviewed provisional crypto is not production assurance |
| Recovery-material loss                | Local export/recovery rehearsal and explicit warnings                                      | Company cannot recover customer-held key                  |
| Coercive/abusive configuration        | AUP, clear effects, cooling period, reporting and operator freeze                          | Abuse not detectable from encrypted contents              |
| Security/platform incident            | Global and plan freeze checked immediately before delivery                                 | Freeze-control compromise                                 |

## Misuse invariants

- SMS replies, email delivery, provider success, subscription events, AI output, or operator preference cannot authorize or accelerate delivery.
- A failed notification never counts as evidence.
- Conflict, malformed data, unknown versions, missing configuration, integrity failure, or state mismatch returns a blocked/frozen result.

## Review gates

Production requires cryptographic review, penetration testing, tenant-isolation verification, restore exercise, incident/freeze exercise, supply-chain scan, and legal/policy approval.
