import { Resend } from "resend";
import { IntegrationUnavailableError } from "@/db";

export function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new IntegrationUnavailableError("Resend");
  return new Resend(key);
}
