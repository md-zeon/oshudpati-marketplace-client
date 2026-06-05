import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

export const env = createEnv({
  server: {
    BACKEND_URL: z.url(),
    FRONTEND_URL: z.url(),
    API_URL: z.url(),
    AUTH_URL: z.url(),
    FREE_SHIPPING_THRESHOLD: z.string().regex(/^\d+$/).transform(Number),
    FLAT_SHIPPING_CHARGE: z.string().regex(/^\d+$/).transform(Number),
  },
  client: {
    NEXT_PUBLIC_BACKEND_URL: z.url(),
    NEXT_PUBLIC_FRONTEND_URL: z.url(),
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().min(1),
    NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD: z
      .string()
      .regex(/^\d+$/)
      .transform(Number),
    NEXT_PUBLIC_FLAT_SHIPPING_CHARGE: z
      .string()
      .regex(/^\d+$/)
      .transform(Number),
  },

  runtimeEnv: {
    BACKEND_URL: process.env.BACKEND_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,
    API_URL: process.env.API_URL,
    AUTH_URL: process.env.AUTH_URL,
    FREE_SHIPPING_THRESHOLD: process.env.FREE_SHIPPING_THRESHOLD,
    FLAT_SHIPPING_CHARGE: process.env.FLAT_SHIPPING_CHARGE,

    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD:
      process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD,
    NEXT_PUBLIC_FLAT_SHIPPING_CHARGE:
      process.env.NEXT_PUBLIC_FLAT_SHIPPING_CHARGE,
  },
});
