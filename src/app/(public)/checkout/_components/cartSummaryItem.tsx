import Image from "next/image";
import { CartItem } from "@/types";

export function CartSummaryItem({ item }: { item: CartItem }) {
  const computedItemPrice = Number(
    item.medicine.discountPrice ?? item.medicine.price,
  );

  const primaryImage =
    item.medicine.images?.find((img) => img.isPrimary)?.imageUrl ||
    item.medicine.images?.[0]?.imageUrl;

  return (
    <div className="flex items-center justify-between gap-3 py-3 text-sm first:pt-0 last:pb-0">
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border-default bg-surface-card p-1">
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={item.medicine.name}
              width={36}
              height={36}
              className="max-h-full max-w-full object-contain mix-blend-multiply"
            />
          ) : (
            <span className="text-[9px] font-medium text-muted-foreground">
              No img
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-brand-900">
            {item.medicine.name}
          </p>
          <p className="text-xs font-medium text-muted-foreground">
            Qty: {item.quantity}
          </p>
        </div>
      </div>
      <span className="shrink-0 font-bold text-foreground">
        ৳{(computedItemPrice * item.quantity).toFixed(2)}
      </span>
    </div>
  );
}
