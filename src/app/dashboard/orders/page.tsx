import { redirect } from "next/navigation";
import { userService } from "@/services/user.service";
import { getMyOrdersAction } from "@/actions/order.action";
import { DashboardRecentOrder, DashboardVendorOrder } from "@/types";
import { ShoppingBag } from "lucide-react";
import { OrderList } from "./_components/OrderList";

export const metadata = {
  title: "My Orders",
  description: "View and track all your orders",
};

const OrdersPage = async () => {
  const session = await userService.getSession();

  if (!session?.success || !session.data?.user) {
    return redirect("/signin");
  }

  const res = await getMyOrdersAction();
  const rawOrders = res?.data || [];

  // Transform orders from the API response to match DashboardRecentOrder
  const orders: DashboardRecentOrder[] = rawOrders.map(
    (order: DashboardRecentOrder) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      totalAmount: Number(order.totalAmount),
      subtotalAmount: Number(order.subtotalAmount),
      deliveryFee: Number(order.deliveryFee),
      paymentStatus: order.paymentStatus,
      placedAt: order.placedAt,
      createdAt: order.createdAt,
      vendorOrders: (order.vendorOrders || []).map(
        (vo: DashboardVendorOrder) => ({
          id: vo.id,
          sellerId: vo.sellerId,
          orderStatus: vo.orderStatus,
          vendorSubtotal: Number(vo.vendorSubtotal),
          orderItems: (vo.orderItems || []).map((oi) => ({
            id: oi.id,
            medicineId: oi.medicineId,
            medicineNameSnapshot: oi.medicineNameSnapshot,
            medicineImageSnapshot: oi.medicineImageSnapshot,
            quantity: oi.quantity,
            unitPrice: Number(oi.unitPrice),
            totalPrice: Number(oi.totalPrice),
          })),
        }),
      ),
    }),
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-emerald-50">
          <ShoppingBag className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">My Orders</h1>
          <p className="text-sm text-slate-500">
            {orders.length} {orders.length === 1 ? "order" : "orders"} total
          </p>
        </div>
      </div>

      <OrderList orders={orders} />
    </div>
  );
};

export default OrdersPage;
