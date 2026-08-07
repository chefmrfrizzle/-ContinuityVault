import { describe, expect, it } from "vitest";
import { receiptHash } from "@/lib/receipts/hash-chain";
import { isGlobalReleaseFrozen } from "@/lib/security/global-freeze";
import { redactRecord } from "@/lib/security/redact";

describe("security helpers", () => {
  it("defaults the global release freeze on", () => {
    expect(isGlobalReleaseFrozen({})).toBe(true);
    expect(
      isGlobalReleaseFrozen({ GLOBAL_RELEASE_FREEZE_DEFAULT: "false" }),
    ).toBe(false);
  });

  it("redacts sensitive nested keys", () => {
    expect(
      redactRecord({
        event: "ok",
        accessToken: "never",
        nested: { recoveryKey: "never" },
      }),
    ).toEqual({
      event: "ok",
      accessToken: "[REDACTED]",
      nested: { recoveryKey: "[REDACTED]" },
    });
  });

  it("hashes receipts with stable key ordering", () => {
    const base = {
      eventId: "e1",
      eventType: "CHECKED",
      objectId: "p1",
      occurredAt: "2026-01-01T00:00:00Z",
      previousEventHash: null,
    };
    expect(receiptHash({ ...base, payload: { b: 2, a: 1 } })).toBe(
      receiptHash({ ...base, payload: { a: 1, b: 2 } }),
    );
  });
});
