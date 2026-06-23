import { getOrderByOrderNumber } from "@/actions/order.action";
import OrderDetails from "./_components/OrderDetails";
import OrderTrackingForm from "./_components/OrderTrackingForm";

import { PackageSearch, SearchX } from "lucide-react";
import { userService } from "@/services/user.service";
import Link from "next/link";

interface Props {
  searchParams: Promise<{
    orderNumber?: string;
  }>;
}

const OrderTrackingPage = async ({ searchParams }: Props) => {
  const { orderNumber } = await searchParams;
  const session = await userService.getSession();
  const isAuthenticated = session.success && session.data ? true : false;

  let order = null;
  let hasError = false;

  if (orderNumber) {
    const res = await getOrderByOrderNumber(orderNumber);

    if (res?.success) {
      order = res.data;
    } else {
      hasError = true;
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-180px)] bg-linear-to-t from-brand-subtle via-background to-background px-4 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Hero */}

          <div className="mb-10 text-center animate-fade-in">
            <div className="animate-float mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-brand-light">
              <PackageSearch className="h-10 w-10 text-brand" />
            </div>

            <h1 className="text-4xl font-bold text-text-primary">
              Track Your Order
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-text-secondary">
              Sign in to track your orders and view delivery updates.
            </p>
          </div>

          {/* Auth Required Card */}

          <div className="mx-auto max-w-2xl animate-fade-in-up rounded-3xl border border-border-default p-10 text-center">
            <h2 className="text-2xl font-bold text-text-primary">
              Login Required 🔐
            </h2>

            <p className="mt-4 text-text-secondary">
              You need to sign in to access order tracking.
            </p>

            <p className="mt-2 text-sm text-text-muted">
              After signing in, you&apos;ll be able to search and monitor all
              your orders.
            </p>

            <Link
              href="/signin"
              className="mt-8 inline-flex rounded-full bg-brand px-6 py-3 font-medium text-white transition hover:bg-brand-dark"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-180px)] bg-linear-to-t from-brand-subtle via-background to-background py-12 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Hero */}

        <div className="mb-10 text-center animate-fade-in">
          <div className="animate-float mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-brand-light">
            <PackageSearch className="h-10 w-10 text-brand" />
          </div>

          <h1 className="text-4xl font-bold text-text-primary">
            Track Your Order
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-text-secondary">
            Enter your order number to view delivery updates, order details and
            shipment progress.
          </p>
        </div>

        {/* Form Card */}

        <div className="animate-fade-in-up p-6">
          <OrderTrackingForm />
        </div>

        {/* Error */}

        {hasError && (
          <div className="animate-fade-in-up mt-10">
            <div className="rounded-3xl p-5">
              <div className="flex flex-col items-center text-center">
                <SearchX className="mb-4 h-14 w-14 text-danger" />

                <h2 className="text-2xl font-bold text-text-primary">
                  Order Not Found
                </h2>

                <p className="mt-3 text-text-secondary">
                  We couldn&apos;t find an order with
                </p>

                <p className="mt-1 font-semibold text-text-primary">
                  &quot;{orderNumber}&quot;
                </p>

                <p className="mt-3 text-sm text-text-muted">
                  Please double-check your order number and try again.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Success */}

        {order && (
          <div className="animate-fade-in-up mt-10 space-y-6">
            {/* Tracking banner */}

            <div className="rounded-3xl p-6">
              <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-text-primary">
                    Order Found 🎉
                  </h2>

                  <p className="mt-1 text-text-secondary">
                    Your order information is available below.
                  </p>
                </div>

                <div className="rounded-full bg-brand-light px-5 py-2 font-semibold text-brand">
                  Tracking Active
                </div>
              </div>
            </div>

            {/* Order Details */}

            <div className="animate-scale-in">
              <OrderDetails order={order} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingPage;
