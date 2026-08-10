"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { syncGuestCartWithDatabase } from "@/actions/cart.action";
import { clearLocalCart, getLocalCart } from "@/lib/local-cart";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { motion } from "motion/react";
import { Loader2, ShoppingCart, CheckCircle2, PackageOpen } from "lucide-react";
import Logo from "@/components/shared/Logo";

export default function AuthCallbackContent({
  redirect,
}: {
  redirect: string;
}) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const syncStarted = useRef(false);
  const [message, setMessage] = useState("Finalizing your sign-in...");
  const [step, setStep] = useState<
    "auth" | "syncing" | "no-sync" | "redirecting"
  >("auth");

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.push("/signin");
      return;
    }

    const syncCart = async () => {
      if (syncStarted.current) return;
      syncStarted.current = true;

      const guestCart = getLocalCart();

      if (guestCart && guestCart.length > 0) {
        const toastId = toast.loading("Syncing your temporary cart items...");
        setStep("syncing");
        setMessage("Syncing your temporary cart items...");

        try {
          const syncRes = await syncGuestCartWithDatabase(guestCart);
          if (syncRes?.success) {
            clearLocalCart();
            toast.success("Cart synchronized successfully!", { id: toastId });
          } else {
            toast.error("Signed in, but temporary items could not sync.", {
              id: toastId,
            });
          }
        } catch {
          toast.error("An error occurred during cart synchronization.", {
            id: toastId,
          });
        }
      } else {
        setStep("no-sync");
      }

      setStep("redirecting");
      setMessage("Redirecting you to your destination...");
      router.push(redirect);
    };

    syncCart();
  }, [session, isPending, router, redirect]);

  const icon =
    step === "syncing" ? (
      <ShoppingCart className="size-6 text-brand-700" aria-hidden="true" />
    ) : step === "redirecting" ? (
      <PackageOpen className="size-6 text-brand-700" aria-hidden="true" />
    ) : (
      <CheckCircle2 className="size-6 text-brand-700" aria-hidden="true" />
    );

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-4"
      >
        <Logo />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex w-full max-w-md flex-col items-center gap-3 rounded-2xl border border-border-default bg-card p-8 text-center shadow-sm"
      >
        <motion.span
          className="flex size-14 items-center justify-center rounded-full bg-brand-50"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          {icon}
        </motion.span>
        <p className="text-sm font-medium text-foreground">{message}</p>
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          One moment please
        </p>
      </motion.div>
    </div>
  );
}
