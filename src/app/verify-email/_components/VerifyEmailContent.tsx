"use client";

import { Button } from "@/components/ui/button";
import { env } from "@/env";
import { authClient } from "@/lib/auth-client";
import { Loader2, Mail, MailQuestion, RefreshCw, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "motion/react";

export default function VerifyEmailContent({
  redirect,
  email,
}: {
  redirect: string;
  email?: string;
}) {
  const [isPending, setIsPending] = useState(false);

  const handleResendVerification = async () => {
    if (!email || isPending) return;

    try {
      setIsPending(true);
      const toastId = toast.loading("Resending verification email...");

      const res = await authClient.sendVerificationEmail({
        email,
        callbackURL:
          `${env.NEXT_PUBLIC_FRONTEND_URL}/email-verified` +
          (redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""),
      });

      if (res.error) {
        toast.error(res.error.message, { id: toastId });
        return;
      }

      toast.success(
        "Verification email resent successfully! Please check your inbox.",
        { id: toastId },
      );
    } catch {
      toast.error("Failed to resend verification email. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-10">
      <motion.div
        className="w-full max-w-lg rounded-2xl border border-border-default bg-card p-8 shadow-lg shadow-brand-900/5 text-center md:p-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="mb-6 flex justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <div className="rounded-full bg-brand-50 p-4">
            <Mail className="h-12 w-12 text-brand-700" />
          </div>
        </motion.div>

        <h1 className="text-3xl font-bold tracking-tight text-brand-900">
          Check your email
        </h1>

        <p className="mt-3 text-sm text-muted-foreground">
          {email
            ? "We&apos;ve sent a verification link to your email address. Verify your account before signing in."
            : "Your account requires email verification before you can continue."}
        </p>

        {email ? (
          <>
            <div className="mt-6 inline-flex max-w-full items-center gap-2 rounded-xl bg-brand-subtle px-4 py-3 text-sm">
              <Mail className="h-4 w-4 shrink-0 text-brand-700" />
              <span className="font-medium break-all text-brand-900">
                {email}
              </span>
            </div>

            <div className="mt-6 flex flex-col gap-2 rounded-xl border border-border-default bg-trust-50 p-4 text-left text-sm text-muted-foreground">
              <p className="flex items-start gap-2">
                <MailQuestion className="mt-0.5 size-4 shrink-0 text-trust-600" />
                Open the email and click the verification link to activate your
                account.
              </p>
              <p className="flex items-start gap-2">
                <RefreshCw className="mt-0.5 size-4 shrink-0 text-trust-600" />
                If you don&apos;t see the email, check your spam, junk, or
                promotions folder.
              </p>
            </div>

            <motion.div
              className="mt-8 flex flex-col gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                onClick={handleResendVerification}
                disabled={isPending}
                variant="outline"
                size="lg"
                className="h-12 rounded-xl font-medium"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Resend Verification Email"
                )}
              </Button>

              <Button variant="ghost" asChild className="rounded-xl">
                <Link
                  href={
                    "/signin" +
                    (redirect
                      ? `?redirect=${encodeURIComponent(redirect)}`
                      : "")
                  }
                >
                  Back to Sign In
                </Link>
              </Button>
            </motion.div>

            <div className="mt-8 flex items-start gap-2 rounded-xl bg-brand-subtle p-4 text-left text-xs text-muted-foreground">
              <ShieldAlert className="mt-0.5 size-3.5 shrink-0 text-brand-700" />
              <p>
                Verification emails usually arrive within a minute. If it still
                hasn&apos;t arrived after a few minutes, you can request another
                email using the button above.
              </p>
            </div>
          </>
        ) : (
          <div className="mt-8">
            <Button variant="outline" asChild className="rounded-xl">
              <Link
                href={
                  "/signin" +
                  (redirect ? `?redirect=${encodeURIComponent(redirect)}` : "")
                }
              >
                Back to Sign In
              </Link>
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
