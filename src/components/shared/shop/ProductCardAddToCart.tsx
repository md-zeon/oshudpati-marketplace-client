"use client";

import { addToCart } from "@/actions/cart.action";
import { Button } from "@/components/ui/button";
import { getLocalCart, saveLocalCart } from "@/lib/local-cart";
import { Medicine } from "@/types";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";

const ProductCardAddToCart = ({
  medicine,
  isList,
}: {
  medicine: Medicine;
  isList: boolean;
}) => {
  const handleAddToCart = async (quantity: number) => {
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
    <Button
      className={isList ? "w-full cursor-pointer" : "cursor-pointer"}
      variant="outline"
      size="lg"
      aria-label={`Add ${medicine.name} to cart`}
      onClick={() => handleAddToCart(1)}
    >
      <ShoppingBag className="w-4 h-4" />
      Add to cart
    </Button>
  );
};

export default ProductCardAddToCart;
