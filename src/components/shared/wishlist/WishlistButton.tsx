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
}

export function WishlistButton({
  medicineId,
  isWishlisted = false,
  className = "",
  size = "sm",
}: WishlistButtonProps) {
  const [wishlisted, setWishlisted] = useState(isWishlisted);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await authClient.getSession();
      setIsLoggedIn(!!data?.user);
    };
    checkAuth();
  }, []);

  const sizeClasses = {
    sm: "p-2",
    md: "p-2.5",
    lg: "p-3",
  };

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    if (!isLoggedIn) {
      toast.error("Please sign in to save items to your wishlist");
      return;
    }

    setLoading(true);
    try {
      const res = await toggleWishlistAction(medicineId);
      if (res?.success) {
        const newState = !wishlisted;
        setWishlisted(newState);
        toast.success(newState ? "Added to wishlist" : "Removed from wishlist");
      } else {
        toast.error(res?.message || "Failed to update wishlist");
      }
    } catch {
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
      disabled={loading}
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
