import {
  ArrowRight,
  Box,
  Boxes,
  Heart,
  LayoutDashboard,
  LayoutGrid,
  MapPin,
  ShoppingCart,
  Truck,
  User,
  UserCog,
} from "lucide-react";
import { NavbarSearch } from "./NavbarSearch";
import Link from "next/link";
import { userService } from "@/services/user.service";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import Signout from "@/app/(auth)/_components/Signout";

const NavbarContent = async () => {
  const session = await userService.getSession();
  const user = session.success ? session.data.user : null;
  const role = user ? user.role : null;

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
          {user ? (
            <HoverCard openDelay={10} closeDelay={100}>
              <HoverCardTrigger asChild>
                <div className="flex items-center gap-1 cursor-pointer group">
                  <div className="rounded-full border-2 p-1">
                    <User
                      className="text-slate-600 inline-block"
                      size={24}
                      strokeWidth={2}
                    />
                  </div>
                  <div className="font-medium leading-tight">
                    <span className="text-base leading-tight font-medium text-slate-600 group-hover:text-blue-600">
                      Welcome
                    </span>
                    <p className="text-xs leading-tight">{user.name}</p>
                  </div>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="flex max-w-56 flex-col gap-4 py-4 px-2 bg-background font-medium">
                {/* Common Routes */}
                <Link
                  href="/dashboard"
                  className="flex items-center justify-between group text-slate-700"
                >
                  <div className="flex items-center gap-2 text-xs group-hover:text-slate-900">
                    <LayoutDashboard
                      className="text-blue-600 inline-block"
                      size={20}
                    />
                    Dashboard
                  </div>

                  <ArrowRight
                    className="text-slate-600 inline-block group-hover:text-black -translate-x-2 group-hover:translate-x-0 transition-transform duration-200"
                    size={16}
                  />
                </Link>

                <Link
                  href="/profile"
                  className="flex items-center justify-between group text-slate-700"
                >
                  <div className="flex items-center gap-2 text-xs group-hover:text-slate-900">
                    <User className="text-blue-600 inline-block" size={20} />
                    My Profile
                  </div>

                  <ArrowRight
                    className="text-slate-600 inline-block group-hover:text-black -translate-x-2 group-hover:translate-x-0 transition-transform duration-200"
                    size={16}
                  />
                </Link>

                {/* Customer Routes */}
                {role === "CUSTOMER" && (
                  <>
                    <Link
                      href="/dashboard/orders"
                      className="flex items-center justify-between group text-slate-700"
                    >
                      <div className="flex items-center gap-2 text-xs group-hover:text-slate-900">
                        <Box className="text-blue-600 inline-block" size={20} />
                        Orders
                      </div>

                      <ArrowRight
                        className="text-slate-600 inline-block group-hover:text-black -translate-x-2 group-hover:translate-x-0 transition-transform duration-200"
                        size={16}
                      />
                    </Link>

                    <Link
                      href="/wishlist"
                      className="flex items-center justify-between group text-slate-700"
                    >
                      <div className="flex items-center gap-2 text-xs group-hover:text-slate-900">
                        <Heart
                          className="text-blue-600 inline-block"
                          size={20}
                        />
                        Wishlist
                      </div>

                      <ArrowRight
                        className="text-slate-600 inline-block group-hover:text-black -translate-x-2 group-hover:translate-x-0 transition-transform duration-200"
                        size={16}
                      />
                    </Link>
                    <Link
                      href="/dashboard/addresses"
                      className="flex items-center justify-between group text-slate-700"
                    >
                      <div className="flex items-center gap-2 text-xs group-hover:text-slate-900">
                        <MapPin
                          className="text-blue-600 inline-block"
                          size={20}
                        />
                        Addresses
                      </div>
                      <ArrowRight
                        className="text-slate-600 inline-block group-hover:text-black -translate-x-2 group-hover:translate-x-0 transition-transform duration-200"
                        size={16}
                      />
                    </Link>
                  </>
                )}

                {/* Seller Routes */}
                {role === "SELLER" && (
                  <>
                    <Link
                      href="/dashboard/products"
                      className="flex items-center justify-between group text-slate-700"
                    >
                      <div className="flex items-center gap-2 text-xs group-hover:text-slate-900">
                        <Boxes
                          className="text-blue-600 inline-block"
                          size={20}
                        />
                        My Products
                      </div>

                      <ArrowRight
                        className="text-slate-600 inline-block group-hover:text-black -translate-x-2 group-hover:translate-x-0 transition-transform duration-200"
                        size={16}
                      />
                    </Link>

                    <Link
                      href="/dashboard/orders"
                      className="flex items-center justify-between group text-slate-700"
                    >
                      <div className="flex items-center gap-2 text-xs group-hover:text-slate-900">
                        <Box className="text-blue-600 inline-block" size={20} />
                        Manage Orders
                      </div>

                      <ArrowRight
                        className="text-slate-600 inline-block group-hover:text-black -translate-x-2 group-hover:translate-x-0 transition-transform duration-200"
                        size={16}
                      />
                    </Link>
                  </>
                )}

                {/* Admin Routes */}
                {role === "ADMIN" && (
                  <>
                    <Link
                      href="/dashboard/users"
                      className="flex items-center justify-between group text-slate-700"
                    >
                      <div className="flex items-center gap-2 text-xs group-hover:text-slate-900">
                        <UserCog
                          className="text-blue-600 inline-block"
                          size={20}
                        />
                        Manage Users
                      </div>

                      <ArrowRight
                        className="text-slate-600 inline-block group-hover:text-black -translate-x-2 group-hover:translate-x-0 transition-transform duration-200"
                        size={16}
                      />
                    </Link>

                    <Link
                      href="/dashboard/categories"
                      className="flex items-center justify-between group text-slate-700"
                    >
                      <div className="flex items-center gap-2 text-xs group-hover:text-slate-900">
                        <LayoutGrid
                          className="text-blue-600 inline-block"
                          size={20}
                        />
                        Categories
                      </div>

                      <ArrowRight
                        className="text-slate-600 inline-block group-hover:text-black -translate-x-2 group-hover:translate-x-0 transition-transform duration-200"
                        size={16}
                      />
                    </Link>
                  </>
                )}
                {/* Account Details */}
                <Link
                  href="/dashboard/account"
                  className="flex items-center justify-between group text-slate-700"
                >
                  <div className="flex items-center gap-2 text-xs group-hover:text-slate-900">
                    <User className="text-blue-600 inline-block" size={20} />
                    Account Details
                  </div>

                  <ArrowRight
                    className="text-slate-600 inline-block group-hover:text-black -translate-x-2 group-hover:translate-x-0 transition-transform duration-200"
                    size={16}
                  />
                </Link>

                {/* Logout */}
                <hr className="border-slate-200" />
                <Signout />
              </HoverCardContent>
            </HoverCard>
          ) : (
            <HoverCard openDelay={10} closeDelay={100}>
              <HoverCardTrigger asChild>
                <div className="flex items-center gap-1 cursor-pointer group">
                  <div className="rounded-full border-2 p-1">
                    <User className="text-slate-600 inline-block" size={24} />
                  </div>
                  <div className="font-medium leading-tight">
                    <p className="text-sm leading-tight font-medium text-slate-600 group-hover:text-blue-600">
                      Sign in
                    </p>
                    <span className="text-base leading-tight">Account</span>
                  </div>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="flex max-w-56 flex-col gap-4 p-4 bg-background">
                <p className="text-xs text-center">
                  Sign up now and enjoy discounted shopping!
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-full py-4"
                >
                  <Link href="/signin" className="w-full">
                    Sign In
                  </Link>
                </Button>

                <div className="mt-1 text-xs text-center">
                  <p>
                    New Customer?{" "}
                    <Link
                      href="/signup"
                      className="font-semibold hover:underline cursor-pointer"
                    >
                      Sign Up
                    </Link>
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          )}

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
