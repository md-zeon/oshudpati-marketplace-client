"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

export default function EmailVerifiedContent({
  redirect,
}: {
  redirect?: string;
}) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);
  const destination = redirect
    ? `/auth-callback?redirect=${encodeURIComponent(redirect)}`
    : "/";

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const redirectTimer = setTimeout(() => {
      router.push(destination);
    }, 3000);

    return () => {
      clearInterval(countdownInterval);
      clearTimeout(redirectTimer);
    };
  }, [destination, router]);

  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="p-8 md:p-10">
          <motion.div
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Success Icon */}
            <motion.div
              className="mb-6 rounded-full bg-green-500/10 p-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </motion.div>

            {/* Heading */}
            <h1 className="text-3xl font-bold tracking-tight">
              Email Verified
            </h1>

            <p className="mt-3 text-muted-foreground">
              Your email address has been verified successfully. Your account is
              now ready to use.
            </p>

            {/* Redirect Status */}
            <motion.div
              className="mt-8 flex items-center gap-3 rounded-xl border bg-muted px-4 py-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">
                Redirecting in{" "}
                <span className="font-semibold text-foreground">
                  {countdown}
                </span>{" "}
                second{countdown !== 1 ? "s" : ""}
              </span>
            </motion.div>

            {/* Continue Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                className="mt-6 cursor-pointer"
                onClick={() => router.push(destination)}
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>

            {/* Footer */}
            <p className="mt-6 text-xs text-muted-foreground">
              You will be redirected automatically. If not, click the Continue
              button above.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
