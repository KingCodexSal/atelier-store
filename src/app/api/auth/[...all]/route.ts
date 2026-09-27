import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Minimal Better Auth Next.js route handler.
// Mounted at /api/auth/[...all]. No custom flows added.
export const { GET, POST } = toNextJsHandler(auth);
