"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Loader2, MailCheck } from "lucide-react";
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
        <div className="rounded-2xl border border-border-default bg-card p-8 shadow-lg shadow-brand-900/5 md:p-10">
          <motion.div
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="mb-6 rounded-full bg-brand-50 p-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <CheckCircle2 className="h-12 w-12 text-brand-700" />
            </motion.div>

            <h1 className="text-3xl font-bold tracking-tight text-brand-900">
              Email Verified
            </h1>

            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Your email address has been verified successfully. Your account is
              now ready to use.
            </p>

            <motion.div
              className="mt-8 flex items-center gap-3 rounded-xl border border-border-default bg-trust-50 px-4 py-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Loader2 className="h-4 w-4 animate-spin text-brand-700" />
              <span className="text-sm text-muted-foreground">
                Redirecting in{" "}
                <span className="font-semibold text-foreground">
                  {countdown}
                </span>{" "}
                second{countdown !== 1 ? "s" : ""}
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                className="mt-6 cursor-pointer rounded-xl bg-brand-700 text-white font-semibold hover:bg-brand-600 active:bg-brand-800"
                onClick={() => router.push(destination)}
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </motion.div>

            <p className="mt-6 flex items-center gap-1.5 text-xs text-muted-foreground">
              <MailCheck className="size-3.5" aria-hidden="true" />
              You will be redirected automatically. If not, click the Continue
              button above.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
