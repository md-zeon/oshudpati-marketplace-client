"use client";

import { useTransition } from "react";
import { updateUserAccountStatusAction } from "@/actions/admin.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface BanButtonProps {
  userId: string;
  currentStatus: string;
  isAdmin?: boolean;
}

export function BanButton({ userId, currentStatus, isAdmin }: BanButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    if (isAdmin) {
      toast.error("Cannot ban an admin user");
      return;
    }

    const newStatus = currentStatus === "ACTIVE" ? "BANNED" : "ACTIVE";
    const actionLabel = currentStatus === "ACTIVE" ? "Ban" : "Activate";

    startTransition(async () => {
      const toastId = toast.loading(`${actionLabel}ning user...`);
      try {
        const res = await updateUserAccountStatusAction(userId, newStatus);
        if (res?.success) {
          toast.success(
            `User ${newStatus === "BANNED" ? "banned" : "activated"} successfully`,
            { id: toastId },
          );
          router.refresh();
        } else {
          toast.error(res?.message || `Failed to ${actionLabel.toLowerCase()} user`, {
            id: toastId,
          });
        }
      } catch {
        toast.error("Unexpected error occurred", { id: toastId });
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending || isAdmin}
      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
        currentStatus === "ACTIVE"
          ? "bg-red-50 text-red-600 hover:bg-red-100"
          : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
      }`}
    >
      {isPending
        ? "..."
        : currentStatus === "ACTIVE"
          ? "Ban"
          : "Activate"}
    </button>
  );
}