import { describe, expect, it } from "vitest";
import { POST as requestUpload } from "@/app/api/plans/[planId]/packages/upload-token/route";
import { POST as stripeWebhook } from "@/app/api/webhooks/stripe/route";

describe("API fail-closed boundaries", () => {
  it("keeps production package upload disabled", async () => {
    const response = await requestUpload(
      new Request("http://localhost/api/plans/test/packages/upload-token", {
        method: "POST",
      }),
      { params: Promise.resolve({ planId: "test" }) },
    );
    expect(response.status).toBe(423);
    await expect(response.json()).resolves.toMatchObject({
      error: "PRODUCTION_PACKAGE_UPLOAD_DISABLED",
    });
  });

  it("does not parse or accept Stripe callbacks without configuration", async () => {
    const response = await stripeWebhook(
      new Request("http://localhost/api/webhooks/stripe", { method: "POST" }),
    );
    expect(response.status).toBe(503);
  });
});
