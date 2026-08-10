"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { ArrowRight, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Signout = () => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleSignOut = async () => {
    if (isPending) return;
    setIsPending(true);
    const toastId = toast.loading("Signing you out...");
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed out successfully!", {
              id: toastId,
            });
            router.push("/signin");
          },
          onError: () => {
            toast.error("Failed to sign out. Please try again.", {
              id: toastId,
            });
            setIsPending(false);
          },
        },
      });
    } catch {
      toast.error("An unexpected error occurred. Please try again.", {
        id: toastId,
      });
      setIsPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isPending}
      aria-label="Sign out"
      className="group flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 cursor-pointer disabled:cursor-wait disabled:opacity-60"
    >
      <span className="flex items-center gap-2">
        <LogOut className="size-4" aria-hidden="true" />
        {isPending ? "Signing out..." : "Sign out"}
      </span>
      <ArrowRight
        className="size-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
        aria-hidden="true"
      />
    </button>
  );
};

export default Signout;
