import { Truck } from "lucide-react";
import { NavbarSearch } from "./NavbarSearch";
import Link from "next/link";
import { userService } from "@/services/user.service";
import { CartService } from "@/services/cart.service";
import Cart from "@/components/shared/cart/Cart";
import NavbarAccount from "./NavbarAccount";
import { Medicine } from "@/types";
import Logo from "@/components/shared/Logo";

const NavbarContent = async ({ medicines = [] }: { medicines: Medicine[] }) => {
  const sessionPromise = userService.getSession();
  const cartPromise = CartService.getCartItems({ cache: "no-store" });

  const [session, cart] = await Promise.all([sessionPromise, cartPromise]);

  const user = session?.success ? session?.data?.user : null;

  return (
    // Desktop Navigation
    <nav className="sticky top-0 z-50 mx-auto hidden w-full max-w-360 border-b border-border-default bg-background/95 backdrop-blur lg:block">
      <div className="flex h-16 items-center justify-between gap-4 px-4">
        {/* Logo */}
        <Logo />

        {/* Search Area  */}
        <div className="mx-2 max-w-xl flex-1 md:mx-8">
          <NavbarSearch medicines={medicines} />
        </div>

        {/* Navigation */}
        <div className="flex shrink-0 items-center gap-2 md:gap-4">
          {/* Track Your Order */}
          <Link href="/order-tracking" className="group flex items-center gap-2">
            <div className="rounded-full border-2 border-border-default p-0.5 transition-colors duration-200 group-hover:border-brand-600">
              <Truck
                aria-hidden="true"
                className="text-muted-foreground transition-colors duration-200 group-hover:text-brand-600"
                size={24}
              />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-medium leading-tight text-muted-foreground transition-colors group-hover:text-brand-700">
                Track
              </p>
              <span className="text-base leading-tight">Your Order</span>
            </div>
          </Link>

          {/* Account */}
          <NavbarAccount user={user} />

          {/* Cart */}
          <Cart
            cart={cart.success ? cart?.data : []}
            isLoggedIn={session?.success}
          />
        </div>
      </div>
    </nav>
  );
};

export default NavbarContent;
