"use client";

import { useTransition, useState } from "react";
import { updateUserAccountStatusAction } from "@/actions/admin.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Ban, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface BanButtonProps {
  userId: string;
  userName?: string;
  currentStatus: string;
  isAdmin?: boolean;
}

export function BanButton({
  userId,
  userName,
  currentStatus,
  isAdmin,
}: BanButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isActive = currentStatus === "ACTIVE";

  const handleConfirm = () => {
    const newStatus = isActive ? "BANNED" : "ACTIVE";
    const actionLabel = isActive ? "Ban" : "Activate";

    startTransition(async () => {
      const toastId = toast.loading(
        isActive ? "Banning user..." : "Activating user...",
      );
      try {
        const res = await updateUserAccountStatusAction(userId, newStatus);
        if (res?.success) {
          toast.success(
            `User ${isActive ? "banned" : "activated"} successfully`,
            { id: toastId },
          );
          setConfirmOpen(false);
          router.refresh();
        } else {
          toast.error(
            res?.message || `Failed to ${actionLabel.toLowerCase()} user`,
            { id: toastId },
          );
        }
      } catch {
        toast.error("Unexpected error occurred", { id: toastId });
      }
    });
  };

  const handleClick = () => {
    if (isAdmin) {
      toast.error("Cannot ban an admin user");
      return;
    }
    setConfirmOpen(true);
  };

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={isPending || isAdmin}
        size="sm"
        variant={isActive ? "destructive" : "outline"}
        className={`cursor-pointer gap-1.5 rounded-lg ${
          isActive
            ? "bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
            : "bg-status-delivered/10 text-status-delivered hover:bg-status-delivered/20 border-status-delivered/20"
        }`}
      >
        {isPending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
        ) : isActive ? (
          <Ban className="h-3.5 w-3.5" aria-hidden />
        ) : (
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
        )}
        {isPending
          ? isActive
            ? "Banning…"
            : "Activating…"
          : isActive
            ? "Ban"
            : "Activate"}
      </Button>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="max-w-sm rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold">
              {isActive ? "Ban user" : "Activate user"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              {isActive ? (
                <>
                  Are you sure you want to ban{" "}
                  <span className="font-semibold text-foreground">
                    {userName || "this user"}
                  </span>
                  ? They will no longer be able to sign in to the platform.
                </>
              ) : (
                <>
                  This will restore{" "}
                  <span className="font-semibold text-foreground">
                    {userName || "this user"}
                  </span>
                  {"'"}s access to the platform.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setConfirmOpen(false)}
              className="cursor-pointer rounded-lg"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={isPending}
              className={`cursor-pointer rounded-lg ${
                isActive
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-brand-600 hover:bg-brand-700 text-white"
              }`}
            >
              {isPending && (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              )}
              {isActive ? "Ban user" : "Activate user"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
