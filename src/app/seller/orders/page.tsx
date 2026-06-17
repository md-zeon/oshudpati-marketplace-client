import { redirect } from "next/navigation";
import { userService } from "@/services/user.service";
import { Package } from "lucide-react";
import { PageSection } from "@/components/shared/PageSection";
import { OrdersView } from "./_components/OrdersView";
import { OrderService } from "@/services/order.service";

export const metadata = {
  title: "Orders",
  description: "Manage incoming orders",
};

export interface SellerOrderItem {
  id: string;
  medicineId: string;
  medicineNameSnapshot: string;
  medicineImageSnapshot: string | null;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
}

export interface SellerOrderCustomer {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
}

export interface SellerOrder {
  id: string;
  orderId: string;
  orderStatus: string;
  vendorSubtotal: string;
  createdAt: string;
  order: {
    id: string;
    orderNumber: string;
    placedAt: string;
    shippingAddressSnapshot: {
      fullName: string;
      phoneNumber: string;
      division: string;
      district: string;
      area: string;
      streetAddress: string;
    };
    customer: SellerOrderCustomer;
  };
  orderItems: SellerOrderItem[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface SearchParams {
  page?: string;
  limit?: string;
}

const SellerOrders = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const session = await userService.getSession();
  if (!session?.success || !session.data?.user) return redirect("/signin");
  if (session.data.user.role !== "SELLER") return redirect("/dashboard");

  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;
  const limit = params.limit ? parseInt(params.limit) : 10;

  const res = await OrderService.getSellerOrders({ page, limit });
  const orders: SellerOrder[] = res?.success ? res.data : [];
  const meta: PaginationMeta | null = res?.meta || null;

  return (
    <div>
      <PageSection>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-emerald-50">
            <Package className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Orders</h1>
            <p className="text-sm text-slate-500">
              {meta ? meta.total : orders.length} total orders
            </p>
          </div>
        </div>
      </PageSection>

      <OrdersView orders={orders} meta={meta} />
    </div>
  );
};
export default SellerOrders;
