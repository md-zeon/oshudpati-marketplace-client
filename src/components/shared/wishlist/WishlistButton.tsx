"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { toggleWishlistAction } from "@/actions/wishlist.action";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  medicineId: string;
  isWishlisted?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  onToggle?: (newState: boolean) => void;
}

const sizeClasses = {
  sm: "size-9",
  md: "size-10",
  lg: "size-11",
} as const;

export function WishlistButton({
  medicineId,
  isWishlisted: initialWishlisted,
  className = "",
  size = "sm",
  onToggle,
}: WishlistButtonProps) {
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await authClient.getSession();
        setIsLoggedIn(!!data?.user);
      } catch {
        setIsLoggedIn(false);
      } finally {
        setAuthChecked(true);
      }
    };
    checkAuth();
  }, []);

  // initialWishlisted is used as initial state via useState(initialWishlisted)
  // Parent should use key={medicineId} to force re-mount when prop changes

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading || !authChecked) return;

    if (!isLoggedIn) {
      toast.error("Please sign in to save items to your wishlist");
      return;
    }

    const previousState = wishlisted;
    setWishlisted(!wishlisted);

    setLoading(true);
    try {
      const res = await toggleWishlistAction(medicineId);
      if (res?.success) {
        const actualState = res.data?.added ?? false;
        setWishlisted(actualState);
        onToggle?.(actualState);
        toast.success(
          actualState ? "Added to wishlist" : "Removed from wishlist",
        );
      } else {
        setWishlisted(previousState);
        toast.error(res?.message || "Failed to update wishlist");
      }
    } catch {
      setWishlisted(previousState);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={wishlisted}
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      disabled={loading || !authChecked}
      className={cn(
        sizeClasses[size],
        "rounded-full border border-border-default bg-card/90 shadow-xs backdrop-blur transition-colors",
        "focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        wishlisted
          ? "text-brand-600 hover:bg-brand-50 hover:text-brand-700"
          : "text-muted-foreground hover:bg-brand-50 hover:text-brand-600",
        loading && "cursor-wait opacity-60",
        className,
      )}
    >
      <Heart
        className={cn(
          size === "lg" ? "size-5" : "size-4",
          "transition-all",
          wishlisted && "fill-brand-600",
        )}
        aria-hidden="true"
      />
    </Button>
  );
}
