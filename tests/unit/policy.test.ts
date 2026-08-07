import { describe, expect, it } from "vitest";
import {
  defaultPolicy,
  policySchema,
  quorumOutcome,
} from "@/lib/policy/schema";

describe("policy", () => {
  it("accepts the safe default policy", () => {
    expect(policySchema.parse(defaultPolicy)).toEqual(defaultPolicy);
  });

  it("rejects single-contact authorization", () => {
    expect(() =>
      policySchema.parse({ ...defaultPolicy, quorumRequired: 1 }),
    ).toThrow();
  });

  it("freezes quorum interpretation on conflict", () => {
    expect(quorumOutcome(["AVAILABLE", "UNAVAILABLE"], defaultPolicy)).toBe(
      "CONFLICT",
    );
    expect(quorumOutcome(["UNCERTAIN"], defaultPolicy)).toBe("CONFLICT");
  });

  it("passes only with sufficient unavailable confirmations", () => {
    expect(quorumOutcome(["UNAVAILABLE", "UNAVAILABLE"], defaultPolicy)).toBe(
      "PASS",
    );
    expect(quorumOutcome(["UNAVAILABLE"], defaultPolicy)).toBe("PENDING");
  });
});
