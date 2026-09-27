import "./env";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Minimal Neon + Drizzle client.
// Requires DATABASE_URL (see .env.example). The client is only constructed
// when a connection string exists so importing `db` without env never throws
// at module-evaluation time (pages import this via @/db/queries); queries
// without config fail fast with a clear message instead.
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("[db] DATABASE_URL is not set. Set it in .env.local.");
}

function missingDatabase(): never {
  throw new Error("[db] DATABASE_URL is not set. Copy .env.example to .env.local.");
}

// Stub satisfies the Neon query-function shape but always throws on use.
const stubClient = async () => missingDatabase();

const sql = connectionString
  ? neon(connectionString)
  : (stubClient as unknown as ReturnType<typeof neon>);

export const db = drizzle({ client: sql, schema });
export type Database = typeof db;
