"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WishlistButton } from "@/components/shared/wishlist/WishlistButton";
import { addToCart } from "@/actions/cart.action";
import { WishlistItem } from "@/types";
import { CircleAlert, Loader2, Package, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  item: WishlistItem;
}

export default function WishlistItemCard({ item }: Props) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);

  const { medicine } = item;

  const primaryImage =
    medicine.images?.find((img) => img.isPrimary)?.imageUrl ||
    medicine.images?.[0]?.imageUrl;

  const price = medicine.discountPrice
    ? Number(medicine.discountPrice)
    : Number(medicine.price);
  const originalPrice = Number(medicine.price);

  const hasDiscount =
    Boolean(medicine.discountPrice) && price < originalPrice;
  const discountPct = hasDiscount
    ? Math.round((1 - price / originalPrice) * 100)
    : 0;

  const outOfStock = medicine.stockQuantity <= 0;

  const handleAddToCart = async () => {
    if (adding) return;
    setAdding(true);
    try {
      const res = await addToCart(medicine.id, 1);
      if (res?.success) {
        toast.success("Added to cart");
      } else {
        toast.error(res?.message || "Failed to add to cart");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  const handleRemoved = (stillSaved: boolean) => {
    if (!stillSaved) router.refresh();
  };

  return (
    <Card className="group relative overflow-hidden rounded-2xl border border-border-default bg-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md focus-within:ring-2 focus-within:ring-brand-600">
      <Link
        href={`/medicine/${medicine.slug}`}
        aria-label={medicine.name}
        className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-card">
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={medicine.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Package className="size-8 text-muted-foreground" aria-hidden="true" />
            </div>
          )}
        </div>
      </Link>

      {hasDiscount && (
        <Badge className="absolute left-2.5 top-2.5 z-10 rounded-full border-brand-200 bg-brand-50 text-brand-800">
          {discountPct}% OFF
        </Badge>
      )}

      <div className="absolute right-2.5 top-2.5 z-10">
        <WishlistButton
          medicineId={medicine.id}
          isWishlisted
          size="sm"
          onToggle={handleRemoved}
        />
      </div>

      <CardContent className="p-3 sm:p-4">
        <span className="inline-block max-w-full truncate rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-700">
          {medicine.genericName}
        </span>

        <h3 className="mt-2">
          <Link
            href={`/medicine/${medicine.slug}`}
            className="line-clamp-2 text-sm font-bold leading-snug text-brand-900 transition-colors hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            {medicine.name}
          </Link>
        </h3>

        <div className="mt-2 flex flex-wrap items-baseline gap-1.5">
          <span className="text-base font-black text-foreground">
            ৳{price.toFixed(0)}
          </span>
          {hasDiscount && (
            <span className="text-xs font-medium text-muted-foreground line-through">
              ৳{originalPrice.toFixed(0)}
            </span>
          )}
        </div>

        <Button
          type="button"
          onClick={handleAddToCart}
          disabled={outOfStock || adding}
          aria-disabled={outOfStock || adding}
          className={cn(
            "mt-3 h-10 w-full rounded-xl text-xs font-bold transition-colors",
            outOfStock
              ? "cursor-not-allowed bg-muted text-muted-foreground"
              : "bg-brand-700 text-white hover:bg-brand-600 active:bg-brand-800",
          )}
        >
          {adding ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : outOfStock ? (
            <CircleAlert className="size-4" aria-hidden="true" />
          ) : (
            <ShoppingCart className="size-4" aria-hidden="true" />
          )}
          {adding ? "Adding..." : outOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      </CardContent>
    </Card>
  );
}
