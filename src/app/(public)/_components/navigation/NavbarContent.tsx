import { Truck } from "lucide-react";
import { NavbarSearch } from "./NavbarSearch";
import Link from "next/link";
import { userService } from "@/services/user.service";
import { CartService } from "@/services/cart.service";
import Cart from "@/components/shared/cart/Cart";
import NavbarAccount from "./NavbarAccount";
import { Medicine } from "@/types";

const NavbarContent = async ({ medicines = [] }: { medicines: Medicine[] }) => {
  const sessionPromise = userService.getSession();
  const cartPromise = CartService.getCartItems({ cache: "no-store" });

  const [session, cart] = await Promise.all([sessionPromise, cartPromise]);

  const user = session?.success ? session?.data?.user : null;

  return (
    // Desktop Navigation
    <nav className="max-lg:hidden sticky top-0 z-50 w-full backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-4">
        {/* Logo */}
        <div className="flex items-center gap-1 cursor-pointer shrink-0">
          <Link href="/" className="text-4xl font-black tracking-tight">
            Oshudpati
          </Link>
        </div>

        {/* Search Area  */}
        <div className="flex-1 max-w-xl mx-2 md:mx-8">
          <NavbarSearch medicines={medicines} />
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          {/* Track Your Order */}
          <Link href="/order-tracking" className="flex items-center gap-1">
            <Truck className="text-slate-600 inline-block" size={36} />
            <div className="font-medium leading-tight">
              <p className="text-sm leading-tight font-medium text-slate-600 hover:text-emerald-600 cursor-pointer">
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
