import { redirect } from "next/navigation";
import { Suspense } from "react";
import { userService } from "@/services/user.service";
import { Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageSection } from "@/components/shared/PageSection";
import WishlistGrid from "./_components/WishlistGrid";
import WishlistSkeleton from "./_components/WishlistSkeleton";

export const metadata = {
  title: "My Wishlist",
  description: "Your saved medicines",
};

const WishlistPage = async () => {
  const session = await userService.getSession();
  if (!session?.success || !session.data?.user) return redirect("/signin");

  return (
    <div className="min-h-[calc(100vh-180px)] bg-linear-to-t from-brand-subtle via-background to-background px-4 py-10 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <PageSection>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 ring-1 ring-brand-100">
                <Heart className="size-6 text-brand-600" aria-hidden="true" />
              </span>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-brand-900 sm:text-3xl">
                  My Wishlist
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your saved medicines, ready when you are.
                </p>
              </div>
            </div>

            <Button
              asChild
              variant="outline"
              className="h-11 rounded-xl border-border-default px-5 text-sm font-semibold"
            >
              <Link href="/shop">
                <ShoppingBag className="size-4 text-brand-600" aria-hidden="true" />
                Browse Shop
              </Link>
            </Button>
          </div>
        </PageSection>

        <Suspense fallback={<WishlistSkeleton />}>
          <WishlistGrid />
        </Suspense>
      </div>
    </div>
  );
};

export default WishlistPage;
