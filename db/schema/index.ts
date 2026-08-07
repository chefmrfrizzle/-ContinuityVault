import {
  bigint,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { planStates } from "@/lib/policy/state-machine";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
};

export const planStateEnum = pgEnum("plan_state", planStates);
export const recordStatusEnum = pgEnum("record_status", [
  "ACTIVE",
  "PENDING",
  "DISABLED",
  "DELETED",
]);
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  authProviderUserId: text("auth_provider_user_id").notNull().unique(),
  primaryEmailHash: text("primary_email_hash").notNull(),
  locale: text("locale").notNull().default("en-CA"),
  timezone: text("timezone").notNull().default("America/Toronto"),
  status: recordStatusEnum("status").notNull().default("ACTIVE"),
  ...timestamps,
});
export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  status: recordStatusEnum("status").notNull().default("ACTIVE"),
  ...timestamps,
});
export const organizationMembers = pgTable(
  "organization_members",
  {
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    role: text("role").notNull(),
    status: recordStatusEnum("status").notNull().default("ACTIVE"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.organizationId, table.userId] })],
);
export const plans = pgTable("plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerUserId: uuid("owner_user_id")
    .notNull()
    .references(() => users.id),
  organizationId: uuid("organization_id").references(() => organizations.id),
  displayName: text("display_name").notNull(),
  purpose: text("purpose").notNull(),
  state: planStateEnum("state").notNull().default("DRAFT"),
  timezone: text("timezone").notNull(),
  activePolicyVersionId: uuid("active_policy_version_id"),
  activePackageVersionId: uuid("active_package_version_id"),
  nextCheckInAt: timestamp("next_check_in_at", { withTimezone: true }),
  armedAt: timestamp("armed_at", { withTimezone: true }),
  pausedAt: timestamp("paused_at", { withTimezone: true }),
  frozenAt: timestamp("frozen_at", { withTimezone: true }),
  ...timestamps,
});
export const planPolicies = pgTable(
  "plan_policies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    planId: uuid("plan_id")
      .notNull()
      .references(() => plans.id),
    version: integer("version").notNull(),
    checkInIntervalDays: integer("check_in_interval_days").notNull(),
    reminderScheduleJson: jsonb("reminder_schedule_json").notNull(),
    gracePeriodDays: integer("grace_period_days").notNull(),
    contactVerificationDays: integer("contact_verification_days").notNull(),
    finalHoldHours: integer("final_hold_hours").notNull(),
    quorumRequired: integer("quorum_required").notNull(),
    quorumTotal: integer("quorum_total").notNull(),
    policyJson: jsonb("policy_json").notNull(),
    policyHash: text("policy_hash").notNull(),
    createdByUserId: uuid("created_by_user_id")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("plan_policy_version_unique").on(table.planId, table.version),
  ],
);
export const packageVersions = pgTable(
  "package_versions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    planId: uuid("plan_id")
      .notNull()
      .references(() => plans.id),
    version: integer("version").notNull(),
    formatVersion: integer("format_version").notNull(),
    blobKey: text("blob_key").notNull(),
    ciphertextSha256: text("ciphertext_sha256").notNull(),
    encryptedManifest: text("encrypted_manifest").notNull(),
    algorithmSuite: text("algorithm_suite").notNull(),
    sizeBytes: bigint("size_bytes", { mode: "number" }).notNull(),
    createdByUserId: uuid("created_by_user_id")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("package_version_unique").on(table.planId, table.version),
  ],
);
export const recipients = pgTable("recipients", {
  id: uuid("id").primaryKey().defaultRandom(),
  planId: uuid("plan_id")
    .notNull()
    .references(() => plans.id),
  userId: uuid("user_id").references(() => users.id),
  emailHash: text("email_hash").notNull(),
  phoneHash: text("phone_hash"),
  displayLabel: text("display_label").notNull(),
  role: text("role").notNull(),
  status: recordStatusEnum("status").notNull().default("PENDING"),
  publicKey: text("public_key"),
  publicKeyAlgorithm: text("public_key_algorithm"),
  publicKeyFingerprint: text("public_key_fingerprint"),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
  lastRehearsalAt: timestamp("last_rehearsal_at", { withTimezone: true }),
  ...timestamps,
});
export const recipientKeyEnvelopes = pgTable(
  "recipient_key_envelopes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    packageVersionId: uuid("package_version_id")
      .notNull()
      .references(() => packageVersions.id),
    recipientId: uuid("recipient_id")
      .notNull()
      .references(() => recipients.id),
    recipientKeyFingerprint: text("recipient_key_fingerprint").notNull(),
    wrappedContentKey: text("wrapped_content_key").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("recipient_envelope_unique").on(
      table.packageVersionId,
      table.recipientId,
      table.recipientKeyFingerprint,
    ),
  ],
);
export const checkInCycles = pgTable("check_in_cycles", {
  id: uuid("id").primaryKey().defaultRandom(),
  planId: uuid("plan_id")
    .notNull()
    .references(() => plans.id),
  policyVersionId: uuid("policy_version_id")
    .notNull()
    .references(() => planPolicies.id),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }).notNull(),
  state: planStateEnum("state").notNull(),
  workflowRunId: text("workflow_run_id").unique(),
  reminderWindowStartedAt: timestamp("reminder_window_started_at", {
    withTimezone: true,
  }),
  graceStartedAt: timestamp("grace_started_at", { withTimezone: true }),
  contactVerificationStartedAt: timestamp("contact_verification_started_at", {
    withTimezone: true,
  }),
  finalHoldStartedAt: timestamp("final_hold_started_at", {
    withTimezone: true,
  }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
export const checkInEvents = pgTable("check_in_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  cycleId: uuid("cycle_id")
    .notNull()
    .references(() => checkInCycles.id),
  actorUserId: uuid("actor_user_id").references(() => users.id),
  authEventReference: text("auth_event_reference").notNull(),
  challengeHash: text("challenge_hash").notNull(),
  result: text("result").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
export const contactResponses = pgTable(
  "contact_responses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    cycleId: uuid("cycle_id")
      .notNull()
      .references(() => checkInCycles.id),
    recipientId: uuid("recipient_id")
      .notNull()
      .references(() => recipients.id),
    challengeHash: text("challenge_hash").notNull(),
    response: text("response").notNull(),
    authenticatedAt: timestamp("authenticated_at", {
      withTimezone: true,
    }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("contact_response_unique").on(table.cycleId, table.recipientId),
  ],
);
export const notificationAttempts = pgTable("notification_attempts", {
  id: uuid("id").primaryKey().defaultRandom(),
  cycleId: uuid("cycle_id").references(() => checkInCycles.id),
  recipientType: text("recipient_type").notNull(),
  recipientId: uuid("recipient_id").notNull(),
  channel: text("channel").notNull(),
  templateVersion: integer("template_version").notNull(),
  idempotencyKey: text("idempotency_key").notNull().unique(),
  providerMessageId: text("provider_message_id"),
  status: text("status").notNull(),
  attemptNumber: integer("attempt_number").notNull(),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  deliveredAt: timestamp("delivered_at", { withTimezone: true }),
  failedAt: timestamp("failed_at", { withTimezone: true }),
  failureCode: text("failure_code"),
});
export const deliveryAttempts = pgTable("delivery_attempts", {
  id: uuid("id").primaryKey().defaultRandom(),
  cycleId: uuid("cycle_id")
    .notNull()
    .references(() => checkInCycles.id),
  packageVersionId: uuid("package_version_id")
    .notNull()
    .references(() => packageVersions.id),
  recipientId: uuid("recipient_id")
    .notNull()
    .references(() => recipients.id),
  channel: text("channel").notNull(),
  idempotencyKey: text("idempotency_key").notNull().unique(),
  status: text("status").notNull(),
  providerReference: text("provider_reference"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});
export const rehearsals = pgTable("rehearsals", {
  id: uuid("id").primaryKey().defaultRandom(),
  planId: uuid("plan_id")
    .notNull()
    .references(() => plans.id),
  policyVersionId: uuid("policy_version_id")
    .notNull()
    .references(() => planPolicies.id),
  packageVersionId: uuid("package_version_id")
    .notNull()
    .references(() => packageVersions.id),
  status: text("status").notNull(),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  failureSummaryCode: text("failure_summary_code"),
});
export const rehearsalChecks = pgTable("rehearsal_checks", {
  id: uuid("id").primaryKey().defaultRandom(),
  rehearsalId: uuid("rehearsal_id")
    .notNull()
    .references(() => rehearsals.id),
  checkType: text("check_type").notNull(),
  subjectId: uuid("subject_id"),
  status: text("status").notNull(),
  evidenceHash: text("evidence_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
export const auditEvents = pgTable("audit_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  planId: uuid("plan_id").references(() => plans.id),
  organizationId: uuid("organization_id").references(() => organizations.id),
  actorType: text("actor_type").notNull(),
  actorId: text("actor_id").notNull(),
  eventType: text("event_type").notNull(),
  eventVersion: integer("event_version").notNull(),
  objectType: text("object_type").notNull(),
  objectId: uuid("object_id").notNull(),
  payloadRedactedJson: jsonb("payload_redacted_json").notNull(),
  previousEventHash: text("previous_event_hash"),
  eventHash: text("event_hash").notNull().unique(),
  requestId: text("request_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  organizationId: uuid("organization_id").references(() => organizations.id),
  stripeCustomerId: text("stripe_customer_id").notNull().unique(),
  stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
  priceId: text("price_id").notNull(),
  tier: text("tier").notNull(),
  status: text("status").notNull(),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
  ...timestamps,
});
export const operatorCases = pgTable("operator_cases", {
  id: uuid("id").primaryKey().defaultRandom(),
  planId: uuid("plan_id")
    .notNull()
    .references(() => plans.id),
  cycleId: uuid("cycle_id").references(() => checkInCycles.id),
  caseType: text("case_type").notNull(),
  severity: text("severity").notNull(),
  status: text("status").notNull(),
  assignedOperatorId: text("assigned_operator_id"),
  redactedSummary: text("redacted_summary").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
});
