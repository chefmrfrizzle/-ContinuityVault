import { describe, expect, it } from "vitest";
import { integrationAvailability } from "@/lib/integrations/availability";
describe("integration availability", () => {
  it("fails closed with an explicit missing list", () => {
    expect(integrationAvailability("neon", {})).toEqual({
      configured: false,
      missing: ["DATABASE_URL"],
    });
  });
  it("reports configured only when every requirement exists", () => {
    expect(
      integrationAvailability("upstash", {
        UPSTASH_REDIS_REST_URL: "test",
        UPSTASH_REDIS_REST_TOKEN: "test",
      }).configured,
    ).toBe(true);
  });
});
