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
import { AdminSidebar } from "./_components/AdminSidebar";
import { MobileAdminNav } from "./_components/MobileAdminNav";
import Signout from "@/components/shared/Signout";
import Logo from "@/components/shared/Logo";

const sidebarLinks = [
  { href: "/admin/dashboard", label: "Dashboard", iconName: "dashboard" },
  { href: "/admin/orders", label: "Orders", iconName: "orders" },
  { href: "/admin/users", label: "Users", iconName: "users" },
  { href: "/admin/reviews", label: "Reviews", iconName: "reviews" },
  { href: "/admin/categories", label: "Categories", iconName: "categories" },
  { href: "/admin/profile", label: "Profile", iconName: "user" },
];

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await userService.getSession();
  if (!session?.success || !session.data?.user) return redirect("/signin");
  if (session.data.user.role !== "ADMIN") return redirect("/dashboard");

  const user = session.data.user;
  const initials =
    user.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "A";

  return (
    <div className="min-h-screen bg-admin-bg">
      <header className="sticky top-0 z-40 border-b border-admin-border bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-360 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  aria-label="Open admin menu"
                  className="rounded-lg p-2 transition-colors outline-none hover:bg-admin-hover focus-visible:ring-2 focus-visible:ring-trust-600 md:hidden"
                >
                  <Menu className="h-5 w-5 text-admin-text" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <SheetTitle className="sr-only">Admin Menu</SheetTitle>
                <div className="flex h-full flex-col">
                  <div className="border-b border-trust-200 bg-gradient-to-r from-trust-50 to-trust-100 p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-trust-200">
                        <AvatarImage src={user.image || ""} alt={user.name} />
                        <AvatarFallback className="bg-trust-100 text-trust-700 text-sm font-bold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-trust-900">
                          {user.name}
                        </p>
                        <p className="text-[11px] text-admin-text/70">
                          Admin
                        </p>
                      </div>
                    </div>
                  </div>
                  <nav className="flex-1 space-y-1 p-3">
                    {sidebarLinks.map((link) => (
                      <AdminSidebar key={link.href} {...link} />
                    ))}
                  </nav>
                  <div className="space-y-1 border-t border-admin-border p-3">
                    <Link
                      href="/"
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-admin-text/70 transition-colors outline-none hover:bg-trust-50 hover:text-trust-700 focus-visible:ring-2 focus-visible:ring-trust-600"
                    >
                      <Store className="h-4 w-4" aria-hidden />
                      Back to Store
                    </Link>
                    <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 transition-colors outline-none hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-500">
                      <Signout />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <Logo color="blue" />
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-trust-200 bg-trust-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-trust-700">
              Admin
            </span>
            <Avatar className="h-8 w-8 border-2 border-trust-200">
              <AvatarImage src={user.image || ""} alt={user.name} />
              <AvatarFallback className="bg-trust-100 text-xs font-bold text-trust-700">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      <div className="mx-auto flex max-w-360">
        <aside className="sticky top-16 hidden w-64 flex-col border-r border-admin-border bg-white/80 p-4 backdrop-blur-md md:flex min-h-[calc(100vh-4rem)]">
          <nav className="flex-1 space-y-1">
            {sidebarLinks.map((link) => (
              <AdminSidebar key={link.href} {...link} />
            ))}
          </nav>
          <div className="space-y-1 border-t border-admin-border pt-4">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-admin-text/70 transition-colors outline-none hover:bg-trust-50 hover:text-trust-700 focus-visible:ring-2 focus-visible:ring-trust-600"
            >
              <Store className="h-4 w-4" aria-hidden />
              Back to Store
            </Link>
            <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 transition-colors outline-none hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-500">
              <Signout />
            </div>
          </div>
        </aside>
        <main className="flex-1 p-4 pb-24 md:p-6 md:pb-6">{children}</main>
      </div>
      <MobileAdminNav sidebarLinks={sidebarLinks} />
    </div>
  );
};
export default AdminLayout;
