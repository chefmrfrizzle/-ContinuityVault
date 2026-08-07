import { neon } from "@neondatabase/serverless";

const url =
  process.env.POSTGRES_URL ??
  process.env.DATABASE_URL_UNPOOLED ??
  process.env.DATABASE_URL;

if (!url) throw new Error("No Neon database URL is configured.");

const sql = neon(url);
const tables = await sql.query(
  "select count(*)::int as count from information_schema.tables where table_schema = $1",
  ["public"],
);
const migrations = await sql.query(
  "select count(*)::int as count from drizzle.__drizzle_migrations",
  [],
);

console.log(
  JSON.stringify({
    publicTables: tables[0].count,
    migrations: migrations[0].count,
  }),
);
