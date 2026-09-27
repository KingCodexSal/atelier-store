import "./src/db/env";
import { defineConfig } from "drizzle-kit";

// Minimal Drizzle Kit config for Neon Postgres.
// Schemas / migrations / e-commerce tables are intentionally NOT defined yet.
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
