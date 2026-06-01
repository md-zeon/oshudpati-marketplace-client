"use client";

import { Button } from "@/components/ui/button";
import { env } from "@/env";
import { authClient } from "@/lib/auth-client";
import { Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const email = params.get("email");
  const redirect = params.get("redirect");

  const [isPending, setIsPending] = useState(false);

  const handleResendVerification = async () => {
    if (!email) return;

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
        toast.error(res.error.message, {
          id: toastId,
        });
        return;
      }

      toast.success(
        "Verification email resent successfully! Please check your inbox.",
        {
          id: toastId,
        },
      );
    } catch {
      toast.error("Failed to resend verification email. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-primary/10 p-4">
            <Mail className="h-12 w-12 text-primary" />
          </div>
        </div>

        <h1 className="text-3xl font-bold tracking-tight">Check your email</h1>

        <p className="mt-3 text-muted-foreground">
          {email
            ? "We've sent a verification link to your email address. Verify your account before signing in."
            : "Your account requires email verification before you can continue."}
        </p>

        {email ? (
          <>
            <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-muted px-4 py-3 text-sm">
              <Mail className="h-4 w-4 shrink-0 text-primary" />
              <span className="font-medium break-all">{email}</span>
            </div>

            <div className="mt-8 space-y-2 text-sm text-muted-foreground">
              <p>
                Open the email and click the verification link to activate your
                account.
              </p>
              <p>
                If you don&apos;t see the email, check your spam, junk, or
                promotions folder.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <Button
                onClick={handleResendVerification}
                disabled={isPending}
                variant="outline"
                size="lg"
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

              <Button variant="ghost" asChild>
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
            </div>

            <div className="mt-8 rounded-xl bg-muted p-4 text-xs text-muted-foreground">
              Verification emails usually arrive within a minute. If it still
              hasn&apos;t arrived after a few minutes, you can request another
              email using the button above.
            </div>
          </>
        ) : (
          <div className="mt-8">
            <Button variant="outline" asChild>
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
      </div>
    </div>
  );
}
