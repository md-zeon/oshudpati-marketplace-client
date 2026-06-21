import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  // The base URL of the authentication server
  baseURL: typeof window !== "undefined" ? window.location.origin : "",
  fetchOptions: {
    credentials: "include",
  },
});
