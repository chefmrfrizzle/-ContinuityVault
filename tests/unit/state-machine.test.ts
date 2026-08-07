import fc from "fast-check";
import { describe, expect, it } from "vitest";
import {
  initialSnapshot,
  planStates,
  transition,
  type MachineSnapshot,
  type PlanEvent,
  type PlanEventType,
} from "@/lib/policy/state-machine";

function event(
  type: PlanEventType,
  id = crypto.randomUUID(),
  overrides: Partial<PlanEvent> = {},
): PlanEvent {
  return {
    id,
    type,
    actorType: "SYSTEM",
    actorId: "system",
    occurredAt: "2026-08-07T12:00:00.000Z",
    policyVersion: 1,
    ...overrides,
  };
}

describe("deterministic state machine", () => {
  it("moves only through explicit predecessors", () => {
    const result = transition(initialSnapshot(), event("OWNER_ARMED"));
    expect(result.status).toBe("REJECTED");
    expect(result.snapshot.state).toBe("DRAFT");
  });

  it("is idempotent by event ID", () => {
    const start = initialSnapshot();
    const first = transition(start, event("CONFIGURATION_COMPLETED", "fixed"));
    expect(first.status).toBe("APPLIED");
    const duplicate = transition(
      first.snapshot,
      event("CONFIGURATION_COMPLETED", "fixed"),
    );
    expect(duplicate.status).toBe("DUPLICATE");
    expect(duplicate.snapshot).toEqual(first.snapshot);
  });

  it.each([
    "PAYMENT_FAILED",
    "NOTIFICATION_FAILED",
    "SMS_REPLY_RECEIVED",
    "AI_SIGNAL_RECEIVED",
  ] as const)("%s cannot advance release", (type) => {
    const start = { ...initialSnapshot(), state: "FINAL_HOLD" as const };
    const result = transition(start, event(type));
    expect(result.status).toBe("IGNORED");
    expect(result.snapshot.state).toBe("FINAL_HOLD");
  });

  it("conflicting contact evidence freezes", () => {
    const start = {
      ...initialSnapshot(),
      state: "CONTACT_VERIFICATION" as const,
    };
    expect(transition(start, event("CONTACT_CONFLICT")).snapshot.state).toBe(
      "FROZEN",
    );
  });

  it("provider uncertainty freezes rather than advances", () => {
    const start = { ...initialSnapshot(), state: "FINAL_HOLD" as const };
    expect(transition(start, event("PROVIDER_UNCERTAIN")).snapshot.state).toBe(
      "FROZEN",
    );
  });

  it("rechecks freeze and integrity immediately before delivery", () => {
    const start = { ...initialSnapshot(), state: "FINAL_HOLD" as const };
    expect(
      transition(
        start,
        event("FINAL_HOLD_EXPIRED", "a", {
          globalFreeze: true,
          packageIntegrityValid: true,
        }),
      ).snapshot.state,
    ).toBe("FROZEN");
    expect(
      transition(
        start,
        event("FINAL_HOLD_EXPIRED", "b", {
          globalFreeze: false,
          packageIntegrityValid: false,
        }),
      ).snapshot.state,
    ).toBe("FROZEN");
    expect(
      transition(
        start,
        event("FINAL_HOLD_EXPIRED", "c", {
          globalFreeze: false,
          packageIntegrityValid: true,
        }),
      ).snapshot.state,
    ).toBe("DELIVERY_IN_PROGRESS");
  });

  it("owner check-in safely cancels every pre-delivery escalation stage", () => {
    for (const state of [
      "CHECK_IN_DUE",
      "REMINDER_WINDOW",
      "GRACE_PERIOD",
      "CONTACT_VERIFICATION",
      "FINAL_HOLD",
    ] as const) {
      expect(
        transition(
          { ...initialSnapshot(), state },
          event("SECURE_OWNER_CHECK_IN"),
        ).snapshot.state,
      ).toBe("ARMED");
    }
  });

  it("rejects policy-version drift for every state/event pair", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...planStates),
        fc.constantFrom<PlanEventType>(
          "OWNER_ARMED",
          "CHECK_IN_BECAME_DUE",
          "FINAL_HOLD_EXPIRED",
          "DELIVERY_COMPLETED",
          "SECURITY_INCIDENT",
        ),
        (state, type) => {
          const result = transition(
            { ...initialSnapshot(), state },
            event(type, crypto.randomUUID(), { policyVersion: 2 }),
          );
          return result.status === "REJECTED" && result.snapshot.version === 1;
        },
      ),
    );
  });

  it("never advances on non-authorizing events under generated sequences", () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.constantFrom<PlanEventType>(
            "PAYMENT_FAILED",
            "NOTIFICATION_FAILED",
            "SMS_REPLY_RECEIVED",
            "AI_SIGNAL_RECEIVED",
          ),
          { maxLength: 100 },
        ),
        (events) => {
          let snapshot: MachineSnapshot = {
            ...initialSnapshot(),
            state: "FINAL_HOLD",
          };
          for (const [index, type] of events.entries())
            snapshot = transition(
              snapshot,
              event(type, String(index)),
            ).snapshot;
          return snapshot.state === "FINAL_HOLD" && snapshot.version === 1;
        },
      ),
    );
  });
});
