"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Lock } from "lucide-react";
import useCheckout from "../_hooks/useCheckout";

export const SubmitButton = ({ disabled }: { disabled: boolean }) => {
  const { submitting } = useCheckout();
  return (
    <Button
      type="submit"
      disabled={submitting || disabled}
      className="mt-3 h-12 w-full rounded-xl bg-brand-700 text-sm font-bold text-white transition-colors hover:bg-brand-600 active:bg-brand-800"
    >
      {submitting ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Placing your order...
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          <Lock className="size-4" aria-hidden="true" />
          Confirm Order
        </span>
      )}
    </Button>
  );
};
