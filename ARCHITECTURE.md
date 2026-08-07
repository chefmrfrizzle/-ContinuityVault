# Architecture

## System boundary

```mermaid
flowchart LR
  B[Browser: plaintext + local keys] -->|ciphertext + redacted metadata only| A[Next.js App Router]
  A --> N[(Neon Postgres)]
  A --> V[(Private Vercel Blob)]
  A --> U[(Upstash replay/rate data)]
  A --> W[Vercel Workflow]
  W --> R[Resend]
  W --> T[Twilio]
  A --> C[Clerk]
  A --> S[Stripe]
  O[Operator: redacted exception plane] --> A
```

The browser alone prepares/decrypts packages. The application does not receive protected plaintext or unwrapped keys. Test mode currently exports ciphertext locally and has no real upload path.

## Request and data flows

1. Authenticated owner obtains a one-time scoped action challenge.
2. Browser validates inputs and, for harmless test packages, encrypts locally through the CryptoProvider.
3. Server accepts only versioned metadata/ciphertext in a future reviewed phase; ownership and policy are checked before storage.
4. Workflow reads an immutable policy version, records an attributable event, and asks the pure state reducer for the only permitted next state.
5. Provider calls are retryable step functions with deterministic idempotency keys.
6. Immediately before delivery, state, policy, package integrity, and global freeze are re-read. Any mismatch freezes.

## Cryptographic boundary

```mermaid
flowchart TD
  P[Harmless test plaintext] --> WC[Browser Web Crypto]
  K[Random local content key] --> WC
  WC --> CT[Test ciphertext]
  WC --> RK[Local recovery export]
  CT -. never uploaded in current phase .-> X[Local download]
  K -. never leaves browser unwrapped .-> X
```

The provisional format is versioned and rejected when unknown. It is not approved for real data.

## State model

```mermaid
stateDiagram-v2
  [*] --> DRAFT
  DRAFT --> REHEARSAL_REQUIRED
  REHEARSAL_REQUIRED --> REHEARSAL_IN_PROGRESS
  REHEARSAL_IN_PROGRESS --> READY_TO_ARM: pass
  REHEARSAL_IN_PROGRESS --> REHEARSAL_REQUIRED: fail
  READY_TO_ARM --> ARMED
  ARMED --> CHECK_IN_DUE
  CHECK_IN_DUE --> ARMED: secure check-in
  CHECK_IN_DUE --> REMINDER_WINDOW
  REMINDER_WINDOW --> ARMED: secure check-in
  REMINDER_WINDOW --> GRACE_PERIOD
  GRACE_PERIOD --> ARMED: secure check-in
  GRACE_PERIOD --> CONTACT_VERIFICATION
  CONTACT_VERIFICATION --> ARMED: owner return
  CONTACT_VERIFICATION --> FROZEN: conflict
  CONTACT_VERIFICATION --> FINAL_HOLD: quorum
  FINAL_HOLD --> ARMED: cancel
  FINAL_HOLD --> DELIVERY_IN_PROGRESS: hold expiry + all gates
  DELIVERY_IN_PROGRESS --> DELIVERED
```

Security incident can freeze any pre-delivery state. Material changes require rehearsal; owner pause enters PAUSED. Unknown transitions reject without mutation.

## Database relationships

```mermaid
erDiagram
  USERS ||--o{ PLANS : owns
  ORGANIZATIONS ||--o{ ORGANIZATION_MEMBERS : contains
  USERS ||--o{ ORGANIZATION_MEMBERS : joins
  PLANS ||--o{ PLAN_POLICIES : versions
  PLANS ||--o{ PACKAGE_VERSIONS : versions
  PLANS ||--o{ RECIPIENTS : authorizes
  PACKAGE_VERSIONS ||--o{ RECIPIENT_KEY_ENVELOPES : wraps
  RECIPIENTS ||--o{ RECIPIENT_KEY_ENVELOPES : receives
  PLANS ||--o{ CHECK_IN_CYCLES : schedules
  CHECK_IN_CYCLES ||--o{ CHECK_IN_EVENTS : records
  CHECK_IN_CYCLES ||--o{ CONTACT_RESPONSES : gathers
  PLANS ||--o{ REHEARSALS : requires
  PLANS ||--o{ AUDIT_EVENTS : audits
  PLANS ||--o{ OPERATOR_CASES : blocks
```

## Integration availability

Each adapter validates its own environment on invocation. Missing configuration returns a typed unavailable error. Rendering and builds never make provider calls.
