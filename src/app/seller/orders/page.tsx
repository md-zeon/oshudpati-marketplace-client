import { redirect } from "next/navigation";
import { userService } from "@/services/user.service";
import { Package } from "lucide-react";
import { OrdersView } from "./_components/OrdersView";
import { OrderService } from "@/services/order.service";
import { SellerPageHeader } from "../_components/SellerPageHeader";

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
    <div className="space-y-6">
      <SellerPageHeader
        title="Orders"
        subtitle={
          meta
            ? `${meta.total} ${meta.total === 1 ? "order" : "orders"} to manage`
            : "Orders placed from your shop"
        }
        icon={<Package className="size-5" aria-hidden />}
      />

      <OrdersView orders={orders} meta={meta} />
    </div>
  );
};
export default SellerOrders;
