import { getOrderByOrderNumber } from "@/actions/order.action";
import OrderDetails from "./_components/OrderDetails";
import OrderTrackingForm from "./_components/OrderTrackingForm";

import {
  PackageSearch,
  SearchX,
  ArrowRight,
  Lock,
  PartyPopper,
} from "lucide-react";
import { userService } from "@/services/user.service";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
          <div className="mb-10 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-brand-100">
              <PackageSearch className="h-10 w-10 text-brand-700" />
            </div>

            <h1 className="text-4xl font-bold text-brand-900">
              Track Your Order
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-text-secondary">
              Sign in to track your orders and view delivery updates.
            </p>
          </div>

          {/* Auth Required Card */}
          <div className="mx-auto max-w-2xl rounded-3xl border border-border-default bg-card p-10 text-center">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-trust-50">
              <Lock className="size-7 text-trust-600" />
            </div>
            <h2 className="text-2xl font-bold text-brand-900">
              Login Required
            </h2>

            <p className="mt-4 text-text-secondary">
              You need to sign in to access order tracking.
            </p>

            <p className="mt-2 text-sm text-text-muted">
              After signing in, you&apos;ll be able to search and monitor all
              your orders.
            </p>

            <Button
              asChild
              className="mt-8 h-12 rounded-xl bg-brand-700 px-8 text-sm font-bold text-white hover:bg-brand-600 active:bg-brand-800"
            >
              <Link href="/signin">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-180px)] bg-linear-to-t from-brand-subtle via-background to-background px-4 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Hero */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-brand-100">
            <PackageSearch className="h-10 w-10 text-brand-700" />
          </div>

          <h1 className="text-4xl font-bold text-brand-900">
            Track Your Order
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-text-secondary">
            Enter your order number to view delivery updates, order details and
            shipment progress.
          </p>
        </div>

        {/* Form Card */}
        <div className="p-6">
          <OrderTrackingForm />
        </div>

        {/* Error */}
        {hasError && (
          <div className="mt-10">
            <div className="mx-auto flex max-w-2xl flex-col items-center rounded-3xl border border-border-default bg-card p-10 text-center">
              <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-danger/10">
                <SearchX className="size-7 text-danger" />
              </div>

              <h2 className="text-2xl font-bold text-brand-900">
                Order Not Found
              </h2>

              <p className="mt-3 text-text-secondary">
                We couldn&apos;t find an order with
              </p>

              <p className="mt-1 rounded-lg bg-surface-card px-3 py-1.5 font-mono font-semibold text-foreground">
                &quot;{orderNumber}&quot;
              </p>

              <p className="mt-3 text-sm text-text-muted">
                Please double-check your order number and try again.
              </p>

              <Button
                asChild
                variant="outline"
                className="mt-6 h-11 rounded-xl border-border-default text-sm font-semibold"
              >
                <Link href="/order-tracking">Try Another Order Number</Link>
              </Button>
            </div>
          </div>
        )}

        {/* Success */}
        {order && (
          <div className="mt-10 space-y-6">
            {/* Tracking banner */}
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-brand-200 bg-brand-50 p-6 md:flex-row md:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-100">
                  <PartyPopper className="size-6 text-brand-700" />
                </span>
                <div>
                  <h2 className="text-2xl font-bold text-brand-900">
                    Order Found
                  </h2>
                  <p className="mt-1 text-text-secondary">
                    Your order information is available below.
                  </p>
                </div>
              </div>

              <Link
                href={`/checkout/order-received/${order.orderNumber}`}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-brand-700 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                View Receipt <ArrowRight className="size-4" />
              </Link>
            </div>

            {/* Order Details */}
            <OrderDetails order={order} />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingPage;
