# Repository rules

These rules apply to every contributor and automation.

1. Treat README.md as binding. Record gaps and choices in DECISIONS.md; never silently invent safety behavior.
2. Make small coherent commits. Do not mix provider provisioning, migrations, workflow policy, and visual cleanup without a clear reason.
3. Run formatting, lint, typecheck, unit/model/integration/workflow tests, applicable Playwright tests, and a production build at each phase gate.
4. Add a reviewed migration for every schema change. Never mutate production schema implicitly at application startup.
5. Never commit or log secrets, tokens, protected plaintext, plaintext filenames, unwrapped keys, recovery material, customer data, or provider message bodies.
6. The server accepts ciphertext and validated redacted metadata only. Production protected-material handling remains disabled until independent cryptographic approval is recorded.
7. All release behavior is deterministic, versioned, attributable, idempotent, auditable, and fail closed. Uncertainty, conflicting evidence, provider failure, incident, or freeze cannot advance release.
8. SMS and email only notify. Payment and AI output never affect release authorization.
9. External providers initialize lazily. Missing optional configuration must produce a clear unavailable state, never a fabricated success.
10. Mutations require authentication, authorization, runtime validation, idempotency, replay protection where relevant, and audit events.
11. Keep documentation synchronized with behavior and residual risks.
12. Preserve accessibility: semantic structure, keyboard operation, focus visibility, reduced motion, minimum touch targets, and non-color status cues.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
