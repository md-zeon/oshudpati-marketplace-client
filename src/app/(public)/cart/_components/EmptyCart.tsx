import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12">
      <div className="relative w-40 h-40 mb-6 flex items-center justify-center select-none">
        <ShoppingCart className="w-20 h-20 text-slate-300" />
        <span className="absolute top-3 right-3 text-5xl text-amber-400 font-black font-serif bottom-16 animate-pulse">
          ?
        </span>
      </div>

      <div className="w-full max-w-4xl border border-gray-200 bg-white py-4 px-6 rounded text-center mb-8">
        <p className="text-sm text-gray-700 font-medium tracking-wide">
          Your cart is currently empty.
        </p>
      </div>

      <Button
        asChild
        className="bg-[#121824] hover:bg-[#1f293d] text-white text-xs font-bold px-7 py-5 tracking-wide rounded-lg transition-colors duration-150"
      >
        <Link href="/shop">Return to shop</Link>
      </Button>
    </div>
  );
};

export default EmptyCart;
