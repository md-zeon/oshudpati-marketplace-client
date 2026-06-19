"use client";

import { authClient } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Signout = () => {
  const router = useRouter();
  const handleSignOut = async () => {
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
          },
        },
      });
    } catch {
      toast.error("An unexpected error occurred. Please try again.", {
        id: toastId,
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="group flex items-center justify-between w-full p-4 rounded-xl border border-red-200 bg-white hover:border-red-300 hover:shadow-sm transition-all cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0 group-hover:bg-red-100 transition-colors">
          <LogOut className="w-5 h-5 text-red-600" />
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold text-slate-800 group-hover:text-red-700 transition-colors">
            Sign Out
          </p>
          <p className="text-xs text-slate-400">Sign out of your account</p>
        </div>
      </div>
    </button>
  );
};

export default Signout;
