# Release safety case

Status: not approved.

Evidence currently present: centralized predecessor-guarded state reducer, idempotent event handling, non-authorizing payment/SMS/notification/AI events, conflict/provider/integrity freeze behavior, global freeze default, provisional local-only test package, and automated tests.

Missing gates: provider-backed workflow integration tests, tenant isolation, signed webhook replay persistence, private Blob authorization, restore exercise, independent cryptographic review, penetration test, legal/privacy approval, production environment separation, assigned incident roles, and two-person freeze removal. Until every gate has evidence, real package upload and production delivery remain disabled.
