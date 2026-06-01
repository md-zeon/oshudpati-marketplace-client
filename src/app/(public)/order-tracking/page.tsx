import { getOrderByOrderNumber } from "@/actions/order.action";
import OrderTrackingForm from "./_components/OrderTrackingForm";
import OrderDetails from "./_components/OrderDetails";

interface Props {
  searchParams: Promise<{
    orderNumber?: string;
  }>;
}

const OrderTrackingPage = async ({ searchParams }: Props) => {
  const { orderNumber } = await searchParams;

  let order = null;

  if (orderNumber) {
    const res = await getOrderByOrderNumber(orderNumber);

    if (res?.success) {
      order = res.data;
    } else {
      return (
        <div className="container mx-auto py-10">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold">Track Your Order</h1>

              <p className="mt-2 text-muted-foreground">
                Enter your order number to view order details and delivery
                status.
              </p>
            </div>
            <OrderTrackingForm />

            <div className="mt-10 text-center">
              <p className="text-lg text-red-500">
                No order found with the number &quot;{orderNumber}&quot;
              </p>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Track Your Order</h1>

          <p className="mt-2 text-muted-foreground">
            Enter your order number to view order details and delivery status.
          </p>
        </div>

        <OrderTrackingForm />

        {order && (
          <div className="mt-10">
            <OrderDetails order={order} />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingPage;
