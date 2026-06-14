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
    <div
      className="flex items-center gap-2 text-xs justify-between cursor-pointer hover:text-red-600 group"
      onClick={handleSignOut}
    >
      <span className="flex items-center gap-2">
        <LogOut className="text-red-600 inline-block" size={16} />
        Sign out
      </span>
    </div>
  );
};

export default Signout;
