import { describe, expect, it } from "vitest";
import { integrationAvailability } from "@/lib/integrations/availability";
describe("integration availability", () => {
  it("fails closed with an explicit missing list", () => {
    expect(integrationAvailability("neon", {})).toEqual({
      configured: false,
      missing: ["POSTGRES_URL|DATABASE_URL_UNPOOLED|DATABASE_URL"],
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
  it("accepts Vercel Marketplace aliases", () => {
    expect(
      integrationAvailability("upstash", {
        KV_REST_API_URL: "test",
        KV_REST_API_TOKEN: "test",
      }).configured,
    ).toBe(true);
    expect(
      integrationAvailability("neon", { POSTGRES_URL: "test" }).configured,
    ).toBe(true);
  });
});
