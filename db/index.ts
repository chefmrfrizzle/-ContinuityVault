import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";

export class IntegrationUnavailableError extends Error {
  constructor(public readonly integration: string) {
    super(`${integration} is not configured.`);
    this.name = "IntegrationUnavailableError";
  }
}

export function getDb() {
  const url =
    process.env.POSTGRES_URL ??
    process.env.DATABASE_URL_UNPOOLED ??
    process.env.DATABASE_URL;
  if (!url) throw new IntegrationUnavailableError("Neon Postgres");
  return drizzle(neon(url), { schema });
}
