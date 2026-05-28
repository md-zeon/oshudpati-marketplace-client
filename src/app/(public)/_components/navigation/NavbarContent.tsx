import { ShoppingCart, Truck, UserCircle } from "lucide-react";
import { NavbarSearch } from "./NavbarSearch";

const NavbarContent = () => {
  return (
    // Desktop Navigation
    <nav className="max-lg:hidden sticky top-0 z-50 w-full backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-4">
        {/* Logo */}
        <div className="flex items-center gap-1 cursor-pointer shrink-0">
          <span className="text-4xl font-black tracking-tight">Oshudpati</span>
        </div>

        {/* Search Area  */}
        <div className="flex-1 max-w-xl mx-2 md:mx-8">
          <NavbarSearch />
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          {/* Track Your Order */}
          <div className="flex items-center gap-1 cursor-pointer">
            <Truck className="text-slate-600 inline-block" size={36} />
            <div className="font-medium leading-tight">
              <p className="text-sm leading-tight font-medium text-slate-600 hover:text-blue-600 cursor-pointer">
                Track
              </p>
              <span className="text-base leading-tight">Your Order</span>
            </div>
          </div>

          {/* Account */}
          <div className="flex items-center gap-1 cursor-pointer">
            <UserCircle className="text-slate-600 inline-block" size={36} />
            <div className="font-medium leading-tight">
              <p className="text-sm leading-tight font-medium text-slate-600 hover:text-blue-600 cursor-pointer">
                Hello, Sign in
              </p>
              <span className="text-base leading-tight">Account</span>
            </div>
          </div>

          {/* Cart */}
          <div className="flex items-center gap-1 cursor-pointer">
            <div className="rounded-full border-2 p-1">
              <ShoppingCart className="text-slate-600 inline-block" size={24} />
            </div>
            <div className="font-medium leading-tight">
              <p className="text-sm leading-tight font-medium text-slate-600 hover:text-blue-600 cursor-pointer">
                Cart
              </p>
              <span className="text-base leading-tight">0 items</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarContent;
