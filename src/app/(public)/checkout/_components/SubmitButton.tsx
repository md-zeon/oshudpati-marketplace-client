"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import useCheckout from "../_hooks/useCheckout";

export const SubmitButton = ({ disabled }: { disabled: boolean }) => {
  const { submitting } = useCheckout();
  return (
    <Button
      type="submit"
      disabled={submitting || disabled}
      className="w-full mt-2 h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wider uppercase rounded-xl transition cursor-pointer shadow-sm"
    >
      {submitting ? (
        <div className="flex items-center gap-2 justify-center">
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Finalizing order...
        </div>
      ) : (
        "Confirm Order"
      )}
    </Button>
  );
};
