"use client";

import { useState } from "react";
import { CircleX, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Medicine } from "@/types";
import { toast } from "sonner";
import { addToCart } from "@/actions/cart.action";
import { getLocalCart, saveLocalCart } from "@/lib/local-cart";

interface MedicineActionsProps {
  medicine: Medicine;
}

export function MedicineActions({ medicine }: MedicineActionsProps) {
  const [quantity, setQuantity] = useState(1);

  const isInStock = medicine.stockQuantity > 0;

  const incrementQuantity = () => {
    if (quantity < medicine.stockQuantity) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    const res = await addToCart(medicine.id, quantity);
    if (res?.success && res.mode === "database") {
      toast.success(
        `Added ${quantity} ${quantity === 1 ? "unit" : "units"} of ${medicine.name} to cart!`,
      );
      return;
    }

    if (res?.mode === "guest") {
      const currentCart = getLocalCart();
      const existingItemIndex = currentCart.findIndex(
        (item) => item.medicineId === medicine.id,
      );

      if (existingItemIndex > -1) {
        currentCart[existingItemIndex].quantity = Math.min(
          currentCart[existingItemIndex].quantity + quantity,
          medicine.stockQuantity,
        );
      } else {
        currentCart.push({
          id: medicine.id,
          userId: "guest",
          medicineId: medicine.id,
          quantity,
          medicine: {
            id: medicine.id,
            name: medicine.name,
            genericName: medicine.genericName,
            slug: medicine.slug,
            price: medicine.price.toString(),
            discountPrice: medicine.discountPrice?.toString() || "",
            stockQuantity: medicine.stockQuantity,
            images: medicine.images || [],
          },
        });
      }
      saveLocalCart(currentCart);
      toast.success(
        `Added ${quantity} ${quantity === 1 ? "unit" : "units"} of ${medicine.name} to guest cart!`,
      );
    }
  };

  const stepper = (
    <div className="flex items-center rounded-lg border border-border-default bg-card shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 cursor-pointer rounded-l-lg text-muted-foreground transition-colors hover:bg-brand-50 hover:text-brand-700"
        onClick={decrementQuantity}
        disabled={quantity <= 1}
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span
        className="w-12 select-none text-center font-semibold text-foreground"
        aria-live="polite"
      >
        {quantity}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 cursor-pointer rounded-r-lg text-muted-foreground transition-colors hover:bg-brand-50 hover:text-brand-700"
        onClick={incrementQuantity}
        disabled={quantity >= medicine.stockQuantity}
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );

  const addButton = isInStock ? (
    <Button
      className="cursor-pointer bg-brand-700 py-5 font-medium text-white shadow-sm transition-colors hover:bg-brand-600 active:bg-brand-800"
      onClick={handleAddToCart}
    >
      <ShoppingBag className="h-4 w-4" aria-hidden="true" />
      Add to Cart
    </Button>
  ) : (
    <Button
      className="cursor-not-allowed"
      variant="outline"
      disabled
      aria-label={`${medicine.name} is out of stock`}
    >
      <CircleX className="h-4 w-4" aria-hidden="true" />
      Out of Stock
    </Button>
  );

  return (
    <>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        {isInStock && stepper}
        {addButton}
      </div>

      {/* Mobile sticky purchase bar (above fixed bottom nav) */}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-border-default bg-card/95 px-4 py-3 backdrop-blur-sm lg:hidden">
        <div className="mx-auto flex max-w-360 items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-base font-black text-brand-900">
              ৳{medicine.discountPrice ? Number(medicine.discountPrice).toFixed(2) : Number(medicine.price).toFixed(2)}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {isInStock ? "In stock" : "Out of stock"}
            </p>
          </div>
          {isInStock && stepper}
          <Button
            className="shrink-0 cursor-pointer bg-brand-700 hover:bg-brand-600 active:bg-brand-800"
            onClick={handleAddToCart}
            disabled={!isInStock}
            aria-label={`Add ${quantity} to cart`}
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            Add
          </Button>
        </div>
      </div>
    </>
  );
}
