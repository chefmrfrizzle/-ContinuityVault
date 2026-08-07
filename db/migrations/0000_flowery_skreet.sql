CREATE TYPE "public"."plan_state" AS ENUM('DRAFT', 'REHEARSAL_REQUIRED', 'REHEARSAL_IN_PROGRESS', 'READY_TO_ARM', 'ARMED', 'CHECK_IN_DUE', 'REMINDER_WINDOW', 'GRACE_PERIOD', 'CONTACT_VERIFICATION', 'FINAL_HOLD', 'DELIVERY_IN_PROGRESS', 'DELIVERED', 'PAUSED', 'FROZEN', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."record_status" AS ENUM('ACTIVE', 'PENDING', 'DISABLED', 'DELETED');--> statement-breakpoint
CREATE TABLE "audit_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plan_id" uuid,
	"organization_id" uuid,
	"actor_type" text NOT NULL,
	"actor_id" text NOT NULL,
	"event_type" text NOT NULL,
	"event_version" integer NOT NULL,
	"object_type" text NOT NULL,
	"object_id" uuid NOT NULL,
	"payload_redacted_json" jsonb NOT NULL,
	"previous_event_hash" text,
	"event_hash" text NOT NULL,
	"request_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "audit_events_event_hash_unique" UNIQUE("event_hash")
);
--> statement-breakpoint
CREATE TABLE "check_in_cycles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plan_id" uuid NOT NULL,
	"policy_version_id" uuid NOT NULL,
	"scheduled_at" timestamp with time zone NOT NULL,
	"state" "plan_state" NOT NULL,
	"workflow_run_id" text,
	"reminder_window_started_at" timestamp with time zone,
	"grace_started_at" timestamp with time zone,
	"contact_verification_started_at" timestamp with time zone,
	"final_hold_started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "check_in_cycles_workflow_run_id_unique" UNIQUE("workflow_run_id")
);
--> statement-breakpoint
CREATE TABLE "check_in_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cycle_id" uuid NOT NULL,
	"actor_user_id" uuid,
	"auth_event_reference" text NOT NULL,
	"challenge_hash" text NOT NULL,
	"result" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cycle_id" uuid NOT NULL,
	"recipient_id" uuid NOT NULL,
	"challenge_hash" text NOT NULL,
	"response" text NOT NULL,
	"authenticated_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "delivery_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cycle_id" uuid NOT NULL,
	"package_version_id" uuid NOT NULL,
	"recipient_id" uuid NOT NULL,
	"channel" text NOT NULL,
	"idempotency_key" text NOT NULL,
	"status" text NOT NULL,
	"provider_reference" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	CONSTRAINT "delivery_attempts_idempotency_key_unique" UNIQUE("idempotency_key")
);
--> statement-breakpoint
CREATE TABLE "notification_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cycle_id" uuid,
	"recipient_type" text NOT NULL,
	"recipient_id" uuid NOT NULL,
	"channel" text NOT NULL,
	"template_version" integer NOT NULL,
	"idempotency_key" text NOT NULL,
	"provider_message_id" text,
	"status" text NOT NULL,
	"attempt_number" integer NOT NULL,
	"sent_at" timestamp with time zone,
	"delivered_at" timestamp with time zone,
	"failed_at" timestamp with time zone,
	"failure_code" text,
	CONSTRAINT "notification_attempts_idempotency_key_unique" UNIQUE("idempotency_key")
);
--> statement-breakpoint
CREATE TABLE "operator_cases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plan_id" uuid NOT NULL,
	"cycle_id" uuid,
	"case_type" text NOT NULL,
	"severity" text NOT NULL,
	"status" text NOT NULL,
	"assigned_operator_id" text,
	"redacted_summary" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resolved_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "organization_members" (
	"organization_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" text NOT NULL,
	"status" "record_status" DEFAULT 'ACTIVE' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "organization_members_organization_id_user_id_pk" PRIMARY KEY("organization_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"status" "record_status" DEFAULT 'ACTIVE' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "package_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plan_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"format_version" integer NOT NULL,
	"blob_key" text NOT NULL,
	"ciphertext_sha256" text NOT NULL,
	"encrypted_manifest" text NOT NULL,
	"algorithm_suite" text NOT NULL,
	"size_bytes" bigint NOT NULL,
	"created_by_user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plan_policies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plan_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"check_in_interval_days" integer NOT NULL,
	"reminder_schedule_json" jsonb NOT NULL,
	"grace_period_days" integer NOT NULL,
	"contact_verification_days" integer NOT NULL,
	"final_hold_hours" integer NOT NULL,
	"quorum_required" integer NOT NULL,
	"quorum_total" integer NOT NULL,
	"policy_json" jsonb NOT NULL,
	"policy_hash" text NOT NULL,
	"created_by_user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_user_id" uuid NOT NULL,
	"organization_id" uuid,
	"display_name" text NOT NULL,
	"purpose" text NOT NULL,
	"state" "plan_state" DEFAULT 'DRAFT' NOT NULL,
	"timezone" text NOT NULL,
	"active_policy_version_id" uuid,
	"active_package_version_id" uuid,
	"next_check_in_at" timestamp with time zone,
	"armed_at" timestamp with time zone,
	"paused_at" timestamp with time zone,
	"frozen_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipient_key_envelopes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"package_version_id" uuid NOT NULL,
	"recipient_id" uuid NOT NULL,
	"recipient_key_fingerprint" text NOT NULL,
	"wrapped_content_key" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plan_id" uuid NOT NULL,
	"user_id" uuid,
	"email_hash" text NOT NULL,
	"phone_hash" text,
	"display_label" text NOT NULL,
	"role" text NOT NULL,
	"status" "record_status" DEFAULT 'PENDING' NOT NULL,
	"public_key" text,
	"public_key_algorithm" text,
	"public_key_fingerprint" text,
	"verified_at" timestamp with time zone,
	"last_rehearsal_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rehearsal_checks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rehearsal_id" uuid NOT NULL,
	"check_type" text NOT NULL,
	"subject_id" uuid,
	"status" text NOT NULL,
	"evidence_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rehearsals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plan_id" uuid NOT NULL,
	"policy_version_id" uuid NOT NULL,
	"package_version_id" uuid NOT NULL,
	"status" text NOT NULL,
	"started_at" timestamp with time zone NOT NULL,
	"completed_at" timestamp with time zone,
	"failure_summary_code" text
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"organization_id" uuid,
	"stripe_customer_id" text NOT NULL,
	"stripe_subscription_id" text NOT NULL,
	"price_id" text NOT NULL,
	"tier" text NOT NULL,
	"status" text NOT NULL,
	"current_period_end" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "subscriptions_stripe_customer_id_unique" UNIQUE("stripe_customer_id"),
	CONSTRAINT "subscriptions_stripe_subscription_id_unique" UNIQUE("stripe_subscription_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"auth_provider_user_id" text NOT NULL,
	"primary_email_hash" text NOT NULL,
	"locale" text DEFAULT 'en-CA' NOT NULL,
	"timezone" text DEFAULT 'America/Toronto' NOT NULL,
	"status" "record_status" DEFAULT 'ACTIVE' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_auth_provider_user_id_unique" UNIQUE("auth_provider_user_id")
);
--> statement-breakpoint
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "check_in_cycles" ADD CONSTRAINT "check_in_cycles_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "check_in_cycles" ADD CONSTRAINT "check_in_cycles_policy_version_id_plan_policies_id_fk" FOREIGN KEY ("policy_version_id") REFERENCES "public"."plan_policies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "check_in_events" ADD CONSTRAINT "check_in_events_cycle_id_check_in_cycles_id_fk" FOREIGN KEY ("cycle_id") REFERENCES "public"."check_in_cycles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "check_in_events" ADD CONSTRAINT "check_in_events_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contact_responses" ADD CONSTRAINT "contact_responses_cycle_id_check_in_cycles_id_fk" FOREIGN KEY ("cycle_id") REFERENCES "public"."check_in_cycles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contact_responses" ADD CONSTRAINT "contact_responses_recipient_id_recipients_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."recipients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_attempts" ADD CONSTRAINT "delivery_attempts_cycle_id_check_in_cycles_id_fk" FOREIGN KEY ("cycle_id") REFERENCES "public"."check_in_cycles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_attempts" ADD CONSTRAINT "delivery_attempts_package_version_id_package_versions_id_fk" FOREIGN KEY ("package_version_id") REFERENCES "public"."package_versions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_attempts" ADD CONSTRAINT "delivery_attempts_recipient_id_recipients_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."recipients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_attempts" ADD CONSTRAINT "notification_attempts_cycle_id_check_in_cycles_id_fk" FOREIGN KEY ("cycle_id") REFERENCES "public"."check_in_cycles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "operator_cases" ADD CONSTRAINT "operator_cases_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "operator_cases" ADD CONSTRAINT "operator_cases_cycle_id_check_in_cycles_id_fk" FOREIGN KEY ("cycle_id") REFERENCES "public"."check_in_cycles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "package_versions" ADD CONSTRAINT "package_versions_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "package_versions" ADD CONSTRAINT "package_versions_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_policies" ADD CONSTRAINT "plan_policies_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_policies" ADD CONSTRAINT "plan_policies_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plans" ADD CONSTRAINT "plans_owner_user_id_users_id_fk" FOREIGN KEY ("owner_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plans" ADD CONSTRAINT "plans_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipient_key_envelopes" ADD CONSTRAINT "recipient_key_envelopes_package_version_id_package_versions_id_fk" FOREIGN KEY ("package_version_id") REFERENCES "public"."package_versions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipient_key_envelopes" ADD CONSTRAINT "recipient_key_envelopes_recipient_id_recipients_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."recipients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipients" ADD CONSTRAINT "recipients_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipients" ADD CONSTRAINT "recipients_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rehearsal_checks" ADD CONSTRAINT "rehearsal_checks_rehearsal_id_rehearsals_id_fk" FOREIGN KEY ("rehearsal_id") REFERENCES "public"."rehearsals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rehearsals" ADD CONSTRAINT "rehearsals_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rehearsals" ADD CONSTRAINT "rehearsals_policy_version_id_plan_policies_id_fk" FOREIGN KEY ("policy_version_id") REFERENCES "public"."plan_policies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rehearsals" ADD CONSTRAINT "rehearsals_package_version_id_package_versions_id_fk" FOREIGN KEY ("package_version_id") REFERENCES "public"."package_versions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "contact_response_unique" ON "contact_responses" USING btree ("cycle_id","recipient_id");--> statement-breakpoint
CREATE UNIQUE INDEX "package_version_unique" ON "package_versions" USING btree ("plan_id","version");--> statement-breakpoint
CREATE UNIQUE INDEX "plan_policy_version_unique" ON "plan_policies" USING btree ("plan_id","version");--> statement-breakpoint
CREATE UNIQUE INDEX "recipient_envelope_unique" ON "recipient_key_envelopes" USING btree ("package_version_id","recipient_id","recipient_key_fingerprint");