"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Box,
  Heart,
  LayoutDashboard,
  LayoutGrid,
  MapPin,
  Plus,
  User,
  UserCog,
} from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import Signout from "@/app/(auth)/_components/Signout";

type NavbarUser = {
  name?: string | null;
  role?: string | null;
} | null;

interface NavbarAccountProps {
  user: NavbarUser;
}

const NavbarAccount = ({ user }: NavbarAccountProps) => {
  // Ensure the component is only rendered on the client side to avoid hydration issues
  const [mounted] = useState<boolean>(() => typeof window !== "undefined");

  const trigger = (
    <div className="flex items-center gap-1 cursor-pointer group">
      <div className="rounded-full border-2 p-0.5 group-hover:border-emerald-600 transition-colors duration-200">
        <User
          className="text-slate-600 inline-block group-hover:text-emerald-600"
          size={24}
        />
      </div>
      <div className="font-medium leading-tight">
        {user ? (
          <>
            <span className="text-base leading-tight font-medium text-slate-600 group-hover:text-emerald-600">
              Welcome
            </span>
            <p className="text-xs leading-tight">{user.name}</p>
          </>
        ) : (
          <>
            <p className="text-sm leading-tight font-medium text-slate-600 group-hover:text-emerald-600">
              Sign in
            </p>
            <span className="text-base leading-tight">Account</span>
          </>
        )}
      </div>
    </div>
  );

  if (!mounted) {
    return trigger;
  }

  return user ? (
    <HoverCard openDelay={10} closeDelay={100}>
      <HoverCardTrigger asChild>{trigger}</HoverCardTrigger>
      <HoverCardContent className="flex max-w-56 flex-col gap-4 py-4 px-2 bg-background font-medium">
        <Link
          href="/dashboard"
          className="flex items-center justify-between group text-slate-700"
        >
          <div className="flex items-center gap-2 text-xs group-hover:text-slate-900">
            <LayoutDashboard
              className="text-emerald-600 inline-block"
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
          href="/dashboard/profile"
          className="flex items-center justify-between group text-slate-700"
        >
          <div className="flex items-center gap-2 text-xs group-hover:text-slate-900">
            <User className="text-emerald-600 inline-block" size={20} />
            My Profile
          </div>

          <ArrowRight
            className="text-slate-600 inline-block group-hover:text-black -translate-x-2 group-hover:translate-x-0 transition-transform duration-200"
            size={16}
          />
        </Link>

        {user.role === "CUSTOMER" && (
          <>
            <Link
              href="/dashboard/orders"
              className="flex items-center justify-between group text-slate-700"
            >
              <div className="flex items-center gap-2 text-xs group-hover:text-slate-900">
                <Box className="text-emerald-600 inline-block" size={20} />
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
                <Heart className="text-emerald-600 inline-block" size={20} />
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
                <MapPin className="text-emerald-600 inline-block" size={20} />
                Addresses
              </div>
              <ArrowRight
                className="text-slate-600 inline-block group-hover:text-black -translate-x-2 group-hover:translate-x-0 transition-transform duration-200"
                size={16}
              />
            </Link>
          </>
        )}

        {user.role === "SELLER" && (
          <>
            <Link
              href="/dashboard/medicines"
              className="flex items-center justify-between group text-slate-700"
            >
              <div className="flex items-center gap-2 text-xs group-hover:text-slate-900">
                <Plus className="text-emerald-600 inline-block" size={20} />
                Add Medicines
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
                <Box className="text-emerald-600 inline-block" size={20} />
                Manage Orders
              </div>

              <ArrowRight
                className="text-slate-600 inline-block group-hover:text-black -translate-x-2 group-hover:translate-x-0 transition-transform duration-200"
                size={16}
              />
            </Link>
          </>
        )}

        {user.role === "ADMIN" && (
          <>
            <Link
              href="/admin/users"
              className="flex items-center justify-between group text-slate-700"
            >
              <div className="flex items-center gap-2 text-xs group-hover:text-slate-900">
                <UserCog className="text-emerald-600 inline-block" size={20} />
                Manage Users
              </div>

              <ArrowRight
                className="text-slate-600 inline-block group-hover:text-black -translate-x-2 group-hover:translate-x-0 transition-transform duration-200"
                size={16}
              />
            </Link>

            <Link
              href="/admin/categories"
              className="flex items-center justify-between group text-slate-700"
            >
              <div className="flex items-center gap-2 text-xs group-hover:text-slate-900">
                <LayoutGrid
                  className="text-emerald-600 inline-block"
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

        <Link
          href="/account"
          className="flex items-center justify-between group text-slate-700"
        >
          <div className="flex items-center gap-2 text-xs group-hover:text-slate-900">
            <User className="text-emerald-600 inline-block" size={20} />
            My Account
          </div>

          <ArrowRight
            className="text-slate-600 inline-block group-hover:text-black -translate-x-2 group-hover:translate-x-0 transition-transform duration-200"
            size={16}
          />
        </Link>

        <hr className="border-slate-200" />
        <Signout />
      </HoverCardContent>
    </HoverCard>
  ) : (
    <HoverCard openDelay={10} closeDelay={100}>
      <HoverCardTrigger asChild>{trigger}</HoverCardTrigger>
      <HoverCardContent className="flex max-w-56 flex-col gap-4 p-4 bg-background">
        <p className="text-xs text-center">
          Sign up now and enjoy discounted shopping!
        </p>

        <Button
          variant="outline"
          size="sm"
          className="w-full rounded-full py-4 border-brand text-brand hover:bg-brand hover:text-white transition-colors duration-200"
          asChild
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
              className="font-semibold hover:underline cursor-pointer text-emerald-600"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default NavbarAccount;
