import { createHash } from "node:crypto";

export type ReceiptInput = {
  eventId: string;
  eventType: string;
  objectId: string;
  occurredAt: string;
  previousEventHash: string | null;
  payload: Record<string, unknown>;
};

function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, child]) => `${JSON.stringify(key)}:${stable(child)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

export function receiptHash(input: ReceiptInput): string {
  return createHash("sha256").update(stable(input)).digest("hex");
}
