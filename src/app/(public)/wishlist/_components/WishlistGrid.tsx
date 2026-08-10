import { WishlistService } from "@/services/wishlist.service";
import { WishlistItem } from "@/types";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { HeartCrack, ShoppingBag, Tags } from "lucide-react";
import Link from "next/link";
import WishlistItemCard from "./WishlistItemCard";

const WishlistGrid = async () => {
  const res = await WishlistService.getMyWishlist();
  const items: WishlistItem[] = res?.success ? res.data : [];

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border-default bg-card px-4 py-16 lg:py-24">
        <Empty className="border-none py-0">
          <EmptyMedia className="size-24 rounded-3xl bg-brand-50">
            <HeartCrack className="size-12 text-brand-400" aria-hidden="true" />
          </EmptyMedia>

          <EmptyHeader className="gap-2">
            <EmptyTitle className="text-xl font-bold text-brand-900">
              Your wishlist is empty
            </EmptyTitle>
            <EmptyDescription className="max-w-md text-base">
              Save medicines you love to find them easily later. Browse our
              trusted pharmacy and tap the heart on any medicine you like.
            </EmptyDescription>
          </EmptyHeader>

          <EmptyContent className="mt-4 flex-col gap-3">
            <Button
              asChild
              size="lg"
              className="h-12 w-full bg-brand-700 px-8 text-base font-bold text-white hover:bg-brand-600 active:bg-brand-800 sm:w-auto"
            >
              <Link href="/shop">
                <ShoppingBag className="size-5" aria-hidden="true" />
                Browse Shop
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="lg"
              className="h-11 w-full text-base font-semibold text-brand-700 hover:bg-brand-50 hover:text-brand-800 sm:w-auto"
            >
              <Link href="/categories">
                <Tags className="size-4" aria-hidden="true" />
                Browse Categories
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  return (
    <>
      <p
        className="mb-4 text-sm font-semibold text-muted-foreground"
        aria-live="polite"
      >
        {items.length} saved item{items.length === 1 ? "" : "s"}
      </p>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 stagger-children">
        {items.map((item) => (
          <WishlistItemCard key={item.id} item={item} />
        ))}
      </div>
    </>
  );
};

export default WishlistGrid;
