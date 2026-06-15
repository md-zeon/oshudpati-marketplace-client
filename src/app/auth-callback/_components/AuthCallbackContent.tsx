"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { syncGuestCartWithDatabase } from "@/actions/cart.action";
import { clearLocalCart, getLocalCart } from "@/lib/local-cart";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";
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
      }

      setMessage("Redirecting you to your destination...");
      router.push(redirect);
    };

    syncCart();
  }, [session, isPending, router, redirect]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-4"
      >
        <Logo />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-2 text-slate-500 text-sm"
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        {message}
      </motion.div>
    </div>
  );
}
