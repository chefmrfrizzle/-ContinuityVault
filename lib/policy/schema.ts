import { z } from "zod";

export const policySchema = z
  .object({
    version: z.number().int().positive(),
    checkInIntervalDays: z.number().int().min(14).max(365),
    reminderDays: z.array(z.number().int().positive()).min(1).max(8),
    gracePeriodDays: z.number().int().min(1).max(60),
    contactVerificationDays: z.number().int().min(1).max(30),
    finalHoldHours: z.number().int().min(24).max(168),
    quorumRequired: z.number().int().min(2),
    quorumTotal: z.number().int().min(2).max(10),
  })
  .superRefine((policy, context) => {
    if (policy.quorumRequired > policy.quorumTotal) {
      context.addIssue({
        code: "custom",
        path: ["quorumRequired"],
        message: "Quorum required cannot exceed total trusted contacts.",
      });
    }
    const ordered = [...policy.reminderDays].sort((a, b) => a - b);
    if (
      new Set(ordered).size !== ordered.length ||
      ordered.some((day, index) => day !== policy.reminderDays[index])
    ) {
      context.addIssue({
        code: "custom",
        path: ["reminderDays"],
        message: "Reminder days must be unique and strictly increasing.",
      });
    }
    if (ordered.at(-1) && ordered.at(-1)! >= policy.gracePeriodDays) {
      context.addIssue({
        code: "custom",
        path: ["reminderDays"],
        message: "Reminders must occur before the grace period ends.",
      });
    }
  });

export type PlanPolicy = z.infer<typeof policySchema>;

export const defaultPolicy: PlanPolicy = {
  version: 1,
  checkInIntervalDays: 30,
  reminderDays: [2, 5],
  gracePeriodDays: 14,
  contactVerificationDays: 7,
  finalHoldHours: 48,
  quorumRequired: 2,
  quorumTotal: 3,
};

export function quorumOutcome(
  responses: readonly ("AVAILABLE" | "UNAVAILABLE" | "UNCERTAIN")[],
  policy: PlanPolicy,
) {
  if (responses.includes("UNCERTAIN")) return "CONFLICT" as const;
  const available = responses.filter((value) => value === "AVAILABLE").length;
  const unavailable = responses.filter(
    (value) => value === "UNAVAILABLE",
  ).length;
  if (available > 0 && unavailable > 0) return "CONFLICT" as const;
  if (unavailable >= policy.quorumRequired) return "PASS" as const;
  if (responses.length >= policy.quorumTotal) return "FAIL" as const;
  return "PENDING" as const;
}
