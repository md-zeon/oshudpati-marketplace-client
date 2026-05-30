"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
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
    if (res.success && res.mode === "database") {
      toast.success(
        `Added ${quantity} ${quantity === 1 ? "unit" : "units"} of ${medicine.name} to cart!`,
      );
      return;
    }

    if (res.mode === "guest") {
      const currentCart = getLocalCart();
      const existingItemIndex = currentCart.findIndex(
        (item) => item.medicineId === medicine.id,
      );

      // If item already exists in cart, update quantity (ensuring it doesn't exceed stock), otherwise add new item
      if (existingItemIndex > -1) {
        currentCart[existingItemIndex].quantity = Math.min(
          currentCart[existingItemIndex].quantity + quantity,
          medicine.stockQuantity,
        );
      } else {
        currentCart.push({
          id: medicine.id, // Using medicine ID directly as item index layout fallback
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

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center mt-4">
      <div className="flex items-center border border-slate-200 rounded-lg max-w-fit bg-white shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-l-lg hover:bg-slate-50 text-slate-600 transition-colors"
          onClick={decrementQuantity}
          disabled={quantity <= 1}
        >
          <Minus className="w-4 h-4" />
        </Button>
        <span className="w-12 text-center font-semibold text-slate-800 select-none">
          {quantity}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-r-lg hover:bg-slate-50 text-slate-600 transition-colors"
          onClick={incrementQuantity}
          disabled={quantity >= medicine.stockQuantity}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <Button
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center gap-2 shadow-sm transition-colors py-5"
        onClick={handleAddToCart}
        disabled={medicine.stockQuantity <= 0}
      >
        <ShoppingBag className="w-4 h-4" />
        {medicine.stockQuantity > 0 ? "Add to Cart" : "Out of Stock"}
      </Button>
    </div>
  );
}
