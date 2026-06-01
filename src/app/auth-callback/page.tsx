"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { syncGuestCartWithDatabase } from "@/actions/cart.action";
import { clearLocalCart, getLocalCart } from "@/lib/local-cart";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const { data: session, isPending } = authClient.useSession();
  const syncStarted = useRef(false);
  const [message, setMessage] = useState("Finalizing your sign-in...");

  useEffect(() => {
    if (isPending) return;

    // If login failed or no session, send them back to login page
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
            console.error("Cart synchronization failed:", syncRes?.message);
            toast.error("Signed in, but temporary items could not sync.", {
              id: toastId,
            });
          }
        } catch (err) {
          console.error("Sync error:", err);
          toast.error("An error occurred during cart synchronization.", {
            id: toastId,
          });
        }
      }

      // Finally, redirect the user to the intended page
      setMessage("Redirecting you to your destination...");
      router.push(redirect);
    };

    syncCart();
  }, [session, isPending, router, redirect]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
      <p className="text-muted-foreground animate-pulse">{message}</p>
    </div>
  );
}
