import { redirect } from "next/navigation";
import { userService } from "@/services/user.service";
import { WishlistItem } from "@/types";
import { Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { WishlistService } from "@/services/wishlist.service";
import { PageSection } from "@/components/shared/PageSection";

export const metadata = {
  title: "My Wishlist",
  description: "Your saved medicines",
};

const WishlistPage = async () => {
  const session = await userService.getSession();
  if (!session?.success || !session.data?.user) return redirect("/signin");

  const res = await WishlistService.getMyWishlist();
  const items: WishlistItem[] = res?.success ? res.data : [];

  return (
    <div className="py-8">
      <PageSection>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-rose-50">
            <Heart className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Wishlist</h1>
            <p className="text-sm text-slate-500">{items.length} saved items</p>
          </div>
        </div>
      </PageSection>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p className="text-lg font-semibold text-slate-500">
            Your wishlist is empty
          </p>
          <p className="text-sm text-slate-400 mt-1 mb-6">
            Save medicines you love to find them easily later
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
          >
            <ShoppingBag className="w-4 h-4" /> Browse Shop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 stagger-children">
          {items.map((item) => {
            const primaryImage =
              item.medicine.images?.find((i) => i.isPrimary)?.imageUrl ||
              item.medicine.images?.[0]?.imageUrl;
            const price = item.medicine.discountPrice
              ? Number(item.medicine.discountPrice)
              : Number(item.medicine.price);
            const originalPrice = Number(item.medicine.price);

            return (
              <Link
                key={item.id}
                href={`/medicine/${item.medicine.slug}`}
                className="group bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="relative w-full h-32 bg-slate-50 rounded-lg overflow-hidden mb-3 flex items-center justify-center">
                  {primaryImage ? (
                    <Image
                      src={primaryImage}
                      alt={item.medicine.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <ShoppingBag className="w-8 h-8 text-slate-300" />
                  )}
                </div>
                <p className="text-xs text-emerald-600 font-semibold uppercase mb-0.5">
                  {item.medicine.genericName}
                </p>
                <p className="text-sm font-semibold text-slate-900 line-clamp-2 leading-tight">
                  {item.medicine.name}
                </p>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="font-bold text-slate-800">
                    ৳{price.toFixed(0)}
                  </span>
                  {originalPrice > price && (
                    <span className="text-xs text-slate-400 line-through">
                      ৳{originalPrice.toFixed(0)}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default WishlistPage;
