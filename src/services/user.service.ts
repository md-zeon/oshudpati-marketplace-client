import { env } from "@/env";
import { cookies } from "next/headers";

const AUTH_URL = env.AUTH_URL;
const API_URL = env.API_URL;

export const userService = {
  getSession: async () => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${AUTH_URL}/get-session`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store", // always get the latest session data
      });

      const session = await res.json();

      if (session == null) {
        return {
          success: false,
          message: "No active session found.",
          data: null,
        };
      }

      return {
        success: true,
        message: "Session retrieved successfully.",
        data: session,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to retrieve user session.",
        data: null,
      };
    }
  },
  updateProfile: async (payload: {
    name?: string;
    phoneNumber?: string;
    image?: string;
  }) => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/users/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error updating profile:", error);
      return {
        success: false,
        data: null,
        message: "Failed to update profile",
      };
    }
  },
};
