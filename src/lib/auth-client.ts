"use client";

import { createAuthClient } from "better-auth/react";

// Minimal client-side helper. No sign-in/sign-up UI wired yet.
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});
