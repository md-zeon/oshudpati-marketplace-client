import { ShopService } from "@/services/shop.service";
import { Store } from "lucide-react";
import ShopForm from "./_components/ShopForm";

export default async function SellerShopPage() {
  const { success, data: shop } = await ShopService.getMyShop();
  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-6">
        <Store className="w-5 h-5 text-emerald-600" />
        <h1 className="text-xl font-bold text-slate-900">
          {success ? "My Shop" : "Create Your Shop"}
        </h1>
      </div>
      <ShopForm initialShop={success ? shop : null} />
    </div>
  );
}
