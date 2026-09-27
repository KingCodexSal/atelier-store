import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";

// Minimal Better Auth instance.
// - Uses Drizzle + Neon Postgres via `db`.
// - No full auth flows, schemas, or OAuth providers configured yet.
// - Run `npm run auth:generate` to scaffold auth tables into src/db/.
export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
});

export type Auth = typeof auth;
