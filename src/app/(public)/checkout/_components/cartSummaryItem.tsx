import { CartItem } from "@/types";

export function CartSummaryItem({ item }: { item: CartItem }) {
  const computedItemPrice = Number(
    item.medicine.discountPrice ?? item.medicine.price,
  );

  return (
    <div className="py-3 flex items-center justify-between gap-3 text-xs first:pt-0 last:pb-0">
      <div className="min-w-0 flex-1">
        <p className="font-bold text-slate-800 truncate">
          {item.medicine.name}
        </p>
        <p className="text-[10px] text-slate-400 font-medium tracking-wide">
          Quantity: {item.quantity}
        </p>
      </div>
      <span className="font-bold text-slate-900 shrink-0">
        ৳{(computedItemPrice * item.quantity).toFixed(2)}
      </span>
    </div>
  );
}
