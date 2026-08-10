import React from "react";
import Link from "next/link";
import { Menu, Pill, Store } from "lucide-react";
import { userService } from "@/services/user.service";
import { redirect } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardSidebar } from "./_components/DashboardSidebar";
import { MobileDashboardNav } from "./_components/MobileDashboardNav";
import Signout from "../../components/shared/Signout";
import Logo from "@/components/shared/Logo";

const sidebarLinks = [
  { href: "/dashboard", label: "Overview", iconName: "overview" },
  { href: "/dashboard/orders", label: "Orders", iconName: "orders" },
  { href: "/dashboard/addresses", label: "Addresses", iconName: "addresses" },
  { href: "/dashboard/profile", label: "Profile", iconName: "profile" },
];

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await userService.getSession();

  if (!session?.success || !session.data?.user) {
    return redirect("/signin");
  }

  const user = session.data.user;
  const initials =
    user.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <div className="min-h-screen bg-surface-card">
      {/* ==================== TOP HEADER ==================== */}
      <header className="bg-card/80 backdrop-blur-md border-b border-border-default sticky top-0 z-40">
        <div className="max-w-360 mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <button
                  className="md:hidden p-2.5 rounded-lg text-muted-foreground hover:bg-brand-50 hover:text-brand-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
                  aria-label="Open navigation menu"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b border-border-default bg-linear-to-r from-brand-50 to-trust-50">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border-2 border-brand-200">
                        <AvatarImage src={user.image || ""} alt={user.name} />
                        <AvatarFallback className="bg-brand-100 text-brand-800 text-sm font-bold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-bold text-foreground text-sm truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {sidebarLinks.map((link) => (
                      <DashboardSidebar key={link.href} {...link} />
                    ))}
                  </nav>
                  <div className="p-3 border-t border-border-default space-y-1">
                    <Link
                      href="/"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-brand-50 hover:text-brand-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
                    >
                      <Pill className="w-4 h-4" />
                      Back to Store
                    </Link>
                    <div className="rounded-lg">
                      <Signout />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Logo />
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/shop"
              className="hidden sm:block text-sm text-muted-foreground hover:text-brand-800 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 rounded-sm"
            >
              Shop
            </Link>
            <div className="flex items-center gap-2.5">
              <span className="hidden sm:block text-sm text-foreground font-medium">
                {user.name}
              </span>
              <Avatar className="w-8 h-8 border-2 border-brand-100">
                <AvatarImage src={user.image || ""} alt={user.name} />
                <AvatarFallback className="bg-brand-50 text-brand-800 text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-360 mx-auto flex">
        {/* ==================== DESKTOP SIDEBAR ==================== */}
        <aside className="hidden md:flex flex-col w-64 bg-card/80 backdrop-blur-md border-r border-border-default min-h-[calc(100vh-4rem)] p-4 sticky top-16">
          <nav className="space-y-1 flex-1">
            {sidebarLinks.map((link) => (
              <DashboardSidebar key={link.href} {...link} />
            ))}
          </nav>

          <div className="pt-4 border-t border-border-default space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-brand-50 hover:text-brand-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
            >
              <Store className="w-4 h-4" />
              Back to Store
            </Link>
            <Signout />
          </div>
        </aside>

        {/* ==================== MAIN CONTENT ==================== */}
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6">{children}</main>
      </div>

      {/* ==================== MOBILE BOTTOM NAV ==================== */}
      <MobileDashboardNav sidebarLinks={sidebarLinks} />
    </div>
  );
};

export default DashboardLayout;
