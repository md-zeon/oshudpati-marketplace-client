import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { PackageOpen, ShoppingBag, Tags } from "lucide-react";
import Link from "next/link";

const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 lg:py-20">
      <Empty className="border-none py-0">
        <EmptyMedia className="size-24 rounded-3xl bg-brand-50">
          <PackageOpen
            className="size-12 text-brand-400"
            aria-hidden="true"
          />
        </EmptyMedia>

        <EmptyHeader className="gap-2">
          <EmptyTitle className="text-xl font-bold text-brand-900">
            Your cart is currently empty
          </EmptyTitle>
          <EmptyDescription className="max-w-md text-base">
            Browse our trusted pharmacy for genuine medicines and wellness
            products. Free delivery on orders over ৳300 anywhere in
            Bangladesh.
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
              Start Shopping
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
};

export default EmptyCart;
