import { ShopService } from "@/services/shop.service";
import { Store } from "lucide-react";
import ShopForm from "./_components/ShopForm";
import { SellerPageHeader } from "../_components/SellerPageHeader";

export const metadata = {
  title: "My Shop",
  description: "Manage your shop",
};

export default async function SellerShopPage() {
  const { success, data: shop } = await ShopService.getMyShop();
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <SellerPageHeader
        title={success ? "My Shop" : "Create Your Shop"}
        subtitle={
          success
            ? "Keep your shop name, logo and description up to date"
            : "Set up your shop to start selling on Oshudpati"
        }
        icon={<Store className="size-5" aria-hidden />}
      />
      <div className="rounded-xl border border-border-default bg-card p-4 sm:p-6">
        <ShopForm initialShop={success ? shop : null} />
      </div>
    </div>
  );
}
