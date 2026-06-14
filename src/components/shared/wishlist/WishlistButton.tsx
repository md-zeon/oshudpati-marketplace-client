"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { toggleWishlistAction } from "@/actions/wishlist.action";

interface WishlistButtonProps {
  medicineId: string;
  isWishlisted?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  onToggle?: (newState: boolean) => void;
}

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

  const sizeClasses = {
    sm: "p-2",
    md: "p-2.5",
    lg: "p-3",
  };

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
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      disabled={loading || !authChecked}
      className={`${sizeClasses[size]} rounded-full bg-white/90 border border-slate-100 shadow-xs hover:bg-white transition-colors ${
        wishlisted
          ? "text-rose-500 hover:text-rose-600"
          : "text-slate-400 hover:text-rose-500"
      } ${className}`}
    >
      <Heart
        className={`w-4 h-4 transition-all ${
          wishlisted ? "fill-rose-500 scale-110" : ""
        }`}
      />
    </Button>
  );
}
