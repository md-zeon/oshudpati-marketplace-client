import { redirect } from "next/navigation";
import { userService } from "@/services/user.service";
import { ShopService } from "@/services/shop.service";
import { Store, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import ProfilePage from "@/components/shared/user/ProfilePage";
import { PageSection } from "@/components/shared/PageSection";

export const metadata = {
  title: "Seller Profile",
  description: "Manage your seller account details",
};

const SellerProfile = async () => {
  const session = await userService.getSession();
  if (!session?.success || !session.data?.user) return redirect("/signin");
  if (session.data.user.role !== "SELLER") return redirect("/dashboard");

  const shopRes = await ShopService.getMyShop().catch(() => ({ success: false }));
  const shop = shopRes?.success ? shopRes.data : null;

  return (
    <div className="space-y-6">
      <PageSection>
        <div className="rounded-xl border border-border-default bg-surface-card p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <ShieldCheck className="size-5" aria-hidden />
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-900">
                  Seller account
                </p>
                <p className="text-xs text-muted-foreground">
                  {shop
                    ? `Shop: ${shop.name}`
                    : "You don't have a shop yet"}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/seller/shop"
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-trust-600 transition-colors hover:bg-trust-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                <Store className="size-3.5" aria-hidden />
                {shop ? "Manage shop" : "Create shop"}
                <ArrowRight className="size-3.5" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </PageSection>

      <ProfilePage />
    </div>
  );
};

export default SellerProfile;
