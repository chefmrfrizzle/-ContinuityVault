export const planStates = [
  "DRAFT",
  "REHEARSAL_REQUIRED",
  "REHEARSAL_IN_PROGRESS",
  "READY_TO_ARM",
  "ARMED",
  "CHECK_IN_DUE",
  "REMINDER_WINDOW",
  "GRACE_PERIOD",
  "CONTACT_VERIFICATION",
  "FINAL_HOLD",
  "DELIVERY_IN_PROGRESS",
  "DELIVERED",
  "PAUSED",
  "FROZEN",
  "CANCELLED",
] as const;

export type PlanState = (typeof planStates)[number];

export type PlanEventType =
  | "CONFIGURATION_COMPLETED"
  | "REHEARSAL_STARTED"
  | "REHEARSAL_PASSED"
  | "REHEARSAL_FAILED"
  | "OWNER_ARMED"
  | "CHECK_IN_BECAME_DUE"
  | "REMINDER_WINDOW_STARTED"
  | "GRACE_PERIOD_STARTED"
  | "CONTACT_VERIFICATION_STARTED"
  | "CONTACT_QUORUM_PASSED"
  | "CONTACT_CONFLICT"
  | "FINAL_HOLD_EXPIRED"
  | "DELIVERY_COMPLETED"
  | "SECURE_OWNER_CHECK_IN"
  | "OWNER_PAUSED"
  | "OWNER_RESUMED"
  | "OWNER_CANCELLED"
  | "MATERIAL_CONFIGURATION_CHANGED"
  | "SECURITY_INCIDENT"
  | "PROVIDER_UNCERTAIN"
  | "PACKAGE_INTEGRITY_FAILED"
  | "PAYMENT_FAILED"
  | "NOTIFICATION_FAILED"
  | "SMS_REPLY_RECEIVED"
  | "AI_SIGNAL_RECEIVED";

export type ActorType =
  "OWNER" | "RECIPIENT" | "SYSTEM" | "OPERATOR" | "PROVIDER";

export type PlanEvent = {
  id: string;
  type: PlanEventType;
  actorType: ActorType;
  actorId: string;
  occurredAt: string;
  policyVersion: number;
  globalFreeze?: boolean;
  packageIntegrityValid?: boolean;
};

export type MachineSnapshot = {
  state: PlanState;
  version: number;
  policyVersion: number;
  processedEventIds: readonly string[];
  pausedFrom?: PlanState;
};

export type TransitionResult =
  | {
      status: "APPLIED";
      snapshot: MachineSnapshot;
      audit: {
        eventId: string;
        eventType: PlanEventType;
        actorType: ActorType;
        actorId: string;
        occurredAt: string;
        from: PlanState;
        to: PlanState;
        stateVersion: number;
        policyVersion: number;
      };
    }
  | {
      status: "DUPLICATE" | "IGNORED";
      snapshot: MachineSnapshot;
      reason: string;
    }
  | { status: "REJECTED"; snapshot: MachineSnapshot; reason: string };

const nonAuthorizingEvents = new Set<PlanEventType>([
  "PAYMENT_FAILED",
  "NOTIFICATION_FAILED",
  "SMS_REPLY_RECEIVED",
  "AI_SIGNAL_RECEIVED",
]);

const terminalStates = new Set<PlanState>(["DELIVERED", "CANCELLED"]);

const ordinaryTransitions: Partial<
  Record<PlanState, Partial<Record<PlanEventType, PlanState>>>
> = {
  DRAFT: {
    CONFIGURATION_COMPLETED: "REHEARSAL_REQUIRED",
    OWNER_CANCELLED: "CANCELLED",
  },
  REHEARSAL_REQUIRED: {
    REHEARSAL_STARTED: "REHEARSAL_IN_PROGRESS",
    OWNER_CANCELLED: "CANCELLED",
  },
  REHEARSAL_IN_PROGRESS: {
    REHEARSAL_PASSED: "READY_TO_ARM",
    REHEARSAL_FAILED: "REHEARSAL_REQUIRED",
    OWNER_CANCELLED: "CANCELLED",
  },
  READY_TO_ARM: { OWNER_ARMED: "ARMED", OWNER_CANCELLED: "CANCELLED" },
  ARMED: {
    CHECK_IN_BECAME_DUE: "CHECK_IN_DUE",
    OWNER_PAUSED: "PAUSED",
    OWNER_CANCELLED: "CANCELLED",
  },
  CHECK_IN_DUE: {
    SECURE_OWNER_CHECK_IN: "ARMED",
    REMINDER_WINDOW_STARTED: "REMINDER_WINDOW",
    OWNER_PAUSED: "PAUSED",
    OWNER_CANCELLED: "CANCELLED",
  },
  REMINDER_WINDOW: {
    SECURE_OWNER_CHECK_IN: "ARMED",
    GRACE_PERIOD_STARTED: "GRACE_PERIOD",
    OWNER_PAUSED: "PAUSED",
    OWNER_CANCELLED: "CANCELLED",
  },
  GRACE_PERIOD: {
    SECURE_OWNER_CHECK_IN: "ARMED",
    CONTACT_VERIFICATION_STARTED: "CONTACT_VERIFICATION",
    OWNER_PAUSED: "PAUSED",
    OWNER_CANCELLED: "CANCELLED",
  },
  CONTACT_VERIFICATION: {
    SECURE_OWNER_CHECK_IN: "ARMED",
    CONTACT_QUORUM_PASSED: "FINAL_HOLD",
    CONTACT_CONFLICT: "FROZEN",
    OWNER_PAUSED: "PAUSED",
    OWNER_CANCELLED: "CANCELLED",
  },
  FINAL_HOLD: {
    SECURE_OWNER_CHECK_IN: "ARMED",
    FINAL_HOLD_EXPIRED: "DELIVERY_IN_PROGRESS",
    OWNER_PAUSED: "PAUSED",
    OWNER_CANCELLED: "CANCELLED",
  },
  DELIVERY_IN_PROGRESS: { DELIVERY_COMPLETED: "DELIVERED" },
  PAUSED: { OWNER_RESUMED: "REHEARSAL_REQUIRED", OWNER_CANCELLED: "CANCELLED" },
  FROZEN: { OWNER_CANCELLED: "CANCELLED" },
};

const freezeEvents = new Set<PlanEventType>([
  "SECURITY_INCIDENT",
  "PROVIDER_UNCERTAIN",
  "PACKAGE_INTEGRITY_FAILED",
]);

export function initialSnapshot(policyVersion = 1): MachineSnapshot {
  return { state: "DRAFT", version: 1, policyVersion, processedEventIds: [] };
}

export function transition(
  snapshot: MachineSnapshot,
  event: PlanEvent,
): TransitionResult {
  if (snapshot.processedEventIds.includes(event.id)) {
    return {
      status: "DUPLICATE",
      snapshot,
      reason: "Event ID was already processed.",
    };
  }

  if (
    !Number.isInteger(event.policyVersion) ||
    event.policyVersion <= 0 ||
    event.policyVersion !== snapshot.policyVersion
  ) {
    return {
      status: "REJECTED",
      snapshot,
      reason:
        "Event policy version does not match the active immutable policy.",
    };
  }

  if (nonAuthorizingEvents.has(event.type)) {
    return {
      status: "IGNORED",
      snapshot,
      reason: "This event class is never authorization evidence.",
    };
  }

  if (terminalStates.has(snapshot.state)) {
    return {
      status: "REJECTED",
      snapshot,
      reason: "Terminal plans cannot transition.",
    };
  }

  let nextState: PlanState | undefined;

  if (freezeEvents.has(event.type)) {
    nextState = "FROZEN";
  } else if (event.type === "MATERIAL_CONFIGURATION_CHANGED") {
    nextState = "REHEARSAL_REQUIRED";
  } else {
    nextState = ordinaryTransitions[snapshot.state]?.[event.type];
  }

  if (!nextState) {
    return {
      status: "REJECTED",
      snapshot,
      reason: `Event ${event.type} is not permitted from ${snapshot.state}.`,
    };
  }

  if (nextState === "DELIVERY_IN_PROGRESS") {
    if (event.globalFreeze !== false) {
      nextState = "FROZEN";
    } else if (event.packageIntegrityValid !== true) {
      nextState = "FROZEN";
    }
  }

  const nextSnapshot: MachineSnapshot = {
    state: nextState,
    version: snapshot.version + 1,
    policyVersion: snapshot.policyVersion,
    processedEventIds: [...snapshot.processedEventIds, event.id],
    ...(nextState === "PAUSED" ? { pausedFrom: snapshot.state } : {}),
  };

  return {
    status: "APPLIED",
    snapshot: nextSnapshot,
    audit: {
      eventId: event.id,
      eventType: event.type,
      actorType: event.actorType,
      actorId: event.actorId,
      occurredAt: event.occurredAt,
      from: snapshot.state,
      to: nextState,
      stateVersion: nextSnapshot.version,
      policyVersion: snapshot.policyVersion,
    },
  };
}
