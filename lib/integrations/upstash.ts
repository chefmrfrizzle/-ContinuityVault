import { Redis } from "@upstash/redis";
import { IntegrationUnavailableError } from "@/db";

export function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (!url || !token) throw new IntegrationUnavailableError("Upstash Redis");
  return new Redis({ url, token });
}

export async function consumeRateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
) {
  const redis = getRedis();
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, windowSeconds);
  return { allowed: count <= limit, remaining: Math.max(0, limit - count) };
}

export async function claimReplayKey(key: string, ttlSeconds: number) {
  const claimed = await getRedis().set(key, "processing", {
    nx: true,
    ex: ttlSeconds,
  });
  return claimed === "OK";
}

export async function completeReplayKey(key: string, ttlSeconds: number) {
  await getRedis().set(key, "done", { ex: ttlSeconds });
}

export async function releaseReplayKey(key: string) {
  await getRedis().del(key);
}
