import { config } from "dotenv";

// Mirror Next.js env precedence for non-Next runtimes (Drizzle Kit, tsx seed):
// process env > .env.local > .env. `override: false` (default) never clobbers
// variables already set in the environment.
config({ path: ".env.local" });
config();
