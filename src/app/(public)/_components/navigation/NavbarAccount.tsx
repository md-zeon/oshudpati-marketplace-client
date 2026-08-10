"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Box,
  ChevronRight,
  Heart,
  LayoutDashboard,
  LayoutGrid,
  MapPin,
  Plus,
  Store,
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

type AccountLink = {
  href: string;
  label: string;
  Icon: typeof User;
};

const ROLE_LABEL: Record<string, string> = {
  CUSTOMER: "Customer",
  SELLER: "Seller",
  ADMIN: "Admin",
};

const CUSTOMER_LINKS: AccountLink[] = [
  { href: "/dashboard/orders", label: "Orders", Icon: Box },
  { href: "/wishlist", label: "Wishlist", Icon: Heart },
  { href: "/dashboard/addresses", label: "Addresses", Icon: MapPin },
];

const SELLER_LINKS: AccountLink[] = [
  { href: "/seller/medicines", label: "Add Medicines", Icon: Plus },
  { href: "/seller/orders", label: "Manage Orders", Icon: Box },
  { href: "/seller/shop", label: "Manage Shop", Icon: Store },
];

const ADMIN_LINKS: AccountLink[] = [
  { href: "/admin/users", label: "Manage Users", Icon: UserCog },
  { href: "/admin/categories", label: "Categories", Icon: LayoutGrid },
];

function AccountLinkRow({ href, label, Icon }: AccountLink) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-foreground/70 transition-colors hover:bg-brand-50 hover:text-brand-700"
    >
      <span className="flex items-center gap-2.5 font-medium">
        <Icon
          className="size-4 text-muted-foreground transition-colors group-hover:text-brand-600"
          aria-hidden
        />
        {label}
      </span>
      <ChevronRight
        className="size-4 -translate-x-1 text-muted-foreground/60 transition-all group-hover:translate-x-0 group-hover:text-brand-600"
        aria-hidden
      />
    </Link>
  );
}

const NavbarAccount = ({ user }: NavbarAccountProps) => {
  const [mounted] = useState<boolean>(() => typeof window !== "undefined");

  const trigger = (
    <div className="flex cursor-pointer items-center gap-1.5 group">
      <div className="rounded-full border-2 border-transparent p-0.5 transition-colors duration-200 group-hover:border-brand-600">
        <User
          className="inline-block text-foreground/70 transition-colors group-hover:text-brand-600"
          size={24}
          aria-hidden
        />
      </div>
      <div className="font-medium leading-tight">
        {user ? (
          <>
            <span className="block text-base leading-tight font-medium text-foreground/70 transition-colors group-hover:text-brand-700">
              Welcome
            </span>
            <p className="max-w-24 truncate text-xs leading-tight">
              {user.name}
            </p>
          </>
        ) : (
          <>
            <p className="text-sm leading-tight font-medium text-foreground/70 transition-colors group-hover:text-brand-700">
              Sign in
            </p>
            <span className="block text-base leading-tight">Account</span>
          </>
        )}
      </div>
    </div>
  );

  if (!mounted) {
    return trigger;
  }

  if (!user) {
    return (
      <HoverCard openDelay={300} closeDelay={100}>
        <HoverCardTrigger asChild>{trigger}</HoverCardTrigger>
        <HoverCardContent className="flex w-64 flex-col gap-4 bg-background p-4">
          <p className="text-center text-xs text-muted-foreground">
            Sign up now and enjoy discounted shopping!
          </p>
          <Button
            variant="outline"
            size="sm"
            className="w-full rounded-full border-brand-600 py-4 text-brand-700 transition-colors hover:bg-brand-600 hover:text-white"
            asChild
          >
            <Link href="/signin" className="w-full">
              Sign In
            </Link>
          </Button>
          <div className="mt-1 text-center text-xs text-muted-foreground">
            <p>
              New Customer?{" "}
              <Link
                href="/signup"
                className="font-semibold text-brand-600 transition-colors hover:text-brand-700 hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  }

  const roleLinks =
    user.role === "CUSTOMER"
      ? CUSTOMER_LINKS
      : user.role === "SELLER"
        ? SELLER_LINKS
        : user.role === "ADMIN"
          ? ADMIN_LINKS
          : [];

  const roleGroupLabel =
    user.role === "CUSTOMER"
      ? "Shopping"
      : user.role === "SELLER"
        ? "Store"
        : user.role === "ADMIN"
          ? "Administration"
          : null;

  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>{trigger}</HoverCardTrigger>
      <HoverCardContent
        align="end"
        className="flex w-64 flex-col gap-1 bg-background px-2 py-2"
      >
        <div className="mb-1 flex items-center gap-3 rounded-lg bg-muted/60 px-3 py-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
            {(user.name?.charAt(0) || "U").toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {user.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {ROLE_LABEL[user.role ?? ""] ?? "Member"}
            </p>
          </div>
        </div>

        <Link
          href="/dashboard"
          className="flex items-center justify-between rounded-lg bg-brand-50 px-3 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-100"
        >
          <span className="flex items-center gap-2.5">
            <LayoutDashboard className="size-4" aria-hidden />
            Dashboard
          </span>
          <ArrowRight className="size-4" aria-hidden />
        </Link>

        {roleLinks.length > 0 && (
          <>
            <div className="mt-1 px-3 pt-2 text-[11px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
              {roleGroupLabel}
            </div>
            {roleLinks.map((link) => (
              <AccountLinkRow key={link.href} {...link} />
            ))}
          </>
        )}

        <div className="mt-1 px-3 pt-2 text-[11px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
          Account
        </div>
        <AccountLinkRow href="/dashboard/profile" label="My Profile" Icon={User} />
        <AccountLinkRow href="/account" label="My Account" Icon={UserCog} />

        <div className="my-1.5 border-t border-border" />
        <Signout />
      </HoverCardContent>
    </HoverCard>
  );
};

export default NavbarAccount;
