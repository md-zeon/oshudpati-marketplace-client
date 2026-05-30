"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Medicine } from "@/types";
import { toast } from "sonner";
import { addToCart } from "@/actions/cart.action";

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
    if (res.success) {
      toast.success(`Added ${quantity} of ${medicine.name} to cart!`);
    } else {
      toast.error("Failed to add item to cart. Please try again.");
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
