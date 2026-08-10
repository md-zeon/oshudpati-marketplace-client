"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
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
      className="group flex items-center justify-between w-full p-4 rounded-xl border border-danger/20 bg-card hover:border-danger/40 hover:shadow-sm transition-all cursor-pointer disabled:cursor-wait disabled:opacity-60"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-danger/10 flex items-center justify-center shrink-0 group-hover:bg-danger/20 transition-colors">
          <LogOut className="w-5 h-5 text-danger" />
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold text-foreground group-hover:text-danger transition-colors">
            {isPending ? "Signing out..." : "Sign Out"}
          </p>
          <p className="text-xs text-muted-foreground">
            Sign out of your account
          </p>
        </div>
      </div>
    </button>
  );
};

export default Signout;
