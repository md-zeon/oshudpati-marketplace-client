import { env } from "@/env";
import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  // The base URL of the authentication server
  baseURL: env.NEXT_PUBLIC_BACKEND_URL,
});
