import { redirect } from "next/navigation";
import { userService } from "@/services/user.service";
import { getAllOrdersAction } from "@/actions/admin.action";
import { Package, ShoppingBag } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Empty, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { PageSection } from "@/components/shared/PageSection";
import { OrderFilters } from "./_components/OrderFilters";
import { OrdersTable, type Order } from "./_components/OrdersTable";

export const metadata = {
  title: "Manage Orders",
  description: "Admin order management",
};

interface SearchParams {
  search?: string;
  status?: string;
}

const AdminOrders = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const session = await userService.getSession();
  if (!session?.success || !session.data?.user) return redirect("/signin");
  if (session.data.user.role !== "ADMIN") return redirect("/dashboard");

  const params = await searchParams;

  const res = await getAllOrdersAction();
  const orders: Order[] = res?.success ? res.data : [];

  const normalizedStatus = params.status?.toUpperCase() || "";
  const filteredOrders = orders.filter((o) => {
    const matchesSearch = !params.search
      ? true
      : o.orderNumber.toLowerCase().includes(params.search.toLowerCase()) ||
        o.customer.name
          .toLowerCase()
          .includes(params.search.toLowerCase()) ||
        o.customer.email.toLowerCase().includes(params.search.toLowerCase());

    const statuses = o.vendorOrders.map((vo) => vo.orderStatus);
    const displayStatus = statuses.every((s) => s === "DELIVERED")
      ? "DELIVERED"
      : statuses.some((s) => s === "CANCELLED") &&
          statuses.every((s) => s === "DELIVERED" || s === "CANCELLED")
        ? "DELIVERED"
        : statuses.some((s) => s === "CANCELLED")
          ? "CANCELLED"
          : statuses.some((s) => s === "SHIPPED")
            ? "SHIPPED"
            : statuses.some((s) => s === "PROCESSING")
              ? "PROCESSING"
              : "PLACED";

    const matchesStatus =
      !normalizedStatus || displayStatus === normalizedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageSection>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-trust-50 p-2.5">
            <Package className="h-5 w-5 text-trust-600" aria-hidden />
          </div>
          <div>
            <h1 className="text-xl font-bold text-trust-900">Orders</h1>
            <p className="text-sm text-muted-foreground">
              {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""}
              {params.search ? " matching your search" : ""}
            </p>
          </div>
        </div>
      </PageSection>

      <PageSection delay={0.05}>
        <Card className="border-admin-border">
          <CardHeader className="border-b border-admin-border">
            <OrderFilters
              initialSearch={params.search}
              initialStatus={normalizedStatus}
            />
          </CardHeader>
          {filteredOrders.length === 0 ? (
            <Empty className="py-16">
              <ShoppingBag className="h-10 w-10 text-trust-300" aria-hidden />
              <EmptyTitle>
                {params.search || normalizedStatus
                  ? "No orders match your filters"
                  : "No orders found"}
              </EmptyTitle>
              <EmptyDescription>
                {params.search || normalizedStatus
                  ? "Try adjusting your search or clearing the status filter."
                  : "Orders placed by customers will appear here."}
              </EmptyDescription>
            </Empty>
          ) : (
            <OrdersTable orders={filteredOrders} />
          )}
        </Card>
      </PageSection>
    </div>
  );
};
export default AdminOrders;
