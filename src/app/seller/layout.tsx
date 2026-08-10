import React from "react";
import Link from "next/link";
import { Menu, Store } from "lucide-react";
import { userService } from "@/services/user.service";
import { redirect } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logo from "@/components/shared/Logo";
import { SellerSidebar } from "./_components/SellerSidebar";
import { MobileSellerNav } from "./_components/MobileSellerNav";
import Signout from "@/components/shared/Signout";

const sidebarLinks = [
  { href: "/seller/dashboard", label: "Dashboard", iconName: "dashboard" },
  { href: "/seller/medicines", label: "Medicines", iconName: "medicines" },
  { href: "/seller/orders", label: "Orders", iconName: "orders" },
  { href: "/seller/shop", label: "My Shop", iconName: "shop" },
  { href: "/seller/profile", label: "Profile", iconName: "profile" },
];

const SellerLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await userService.getSession();
  if (!session?.success || !session.data?.user) return redirect("/signin");
  if (session.data.user.role !== "SELLER") return redirect("/dashboard");

  const user = session.data.user;
  const initials =
    user.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  const sidebar = (
    <>
      <nav aria-label="Seller" className="flex-1 space-y-1 p-3">
        {sidebarLinks.map((link) => (
          <SellerSidebar key={link.href} {...link} />
        ))}
      </nav>
      <div className="space-y-1 border-t border-border-default p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-brand-50/60 hover:text-brand-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          <Store className="size-4" aria-hidden />
          Back to Store
        </Link>
        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 cursor-pointer">
          <Signout />
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border-default bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-360 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  aria-label="Open seller menu"
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-brand-50 hover:text-brand-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 md:hidden"
                >
                  <Menu className="size-5" aria-hidden />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <SheetTitle className="sr-only">Seller Menu</SheetTitle>
                <div className="flex h-full flex-col">
                  <div className="border-b border-border-default bg-gradient-to-r from-brand-50 to-trust-50 p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-brand-200">
                        <AvatarImage src={user.image || ""} alt={user.name} />
                        <AvatarFallback className="bg-brand-100 text-brand-900 text-sm font-bold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-brand-900">
                          {user.name}
                        </p>
                        <p className="truncate text-[11px] text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  {sidebar}
                </div>
              </SheetContent>
            </Sheet>
            <Logo />
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-brand-100 bg-brand-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-700">
              Seller
            </span>
            <Avatar className="h-8 w-8 border-2 border-brand-100">
              <AvatarImage src={user.image || ""} alt={user.name} />
              <AvatarFallback className="bg-brand-50 text-brand-800 text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      <div className="mx-auto flex max-w-360">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 flex-col border-r border-border-default bg-background/80 py-4 backdrop-blur-md md:flex">
          {sidebar}
        </aside>
        <main className="flex-1 p-4 pb-24 md:p-6 md:pb-6">{children}</main>
      </div>
      <MobileSellerNav sidebarLinks={sidebarLinks} />
    </div>
  );
};
export default SellerLayout;
