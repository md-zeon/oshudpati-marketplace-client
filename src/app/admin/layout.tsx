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
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-360 mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <button className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors">
                  <Menu className="w-5 h-5 text-slate-600" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <SheetTitle className="sr-only">Admin Menu</SheetTitle>
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b border-slate-100 bg-linear-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border-2 border-blue-200">
                        <AvatarImage src={user.image || ""} alt={user.name} />
                        <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-bold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-sm">{user.name}</p>
                        <p className="text-[11px] text-slate-500">Admin</p>
                      </div>
                    </div>
                  </div>
                  <nav className="flex-1 p-3 space-y-1">
                    {sidebarLinks.map((link) => (
                      <AdminSidebar key={link.href} {...link} />
                    ))}
                  </nav>
                  <div className="p-3 border-t border-slate-100 space-y-1">
                    <Link
                      href="/"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors"
                    >
                      <Store className="w-4 h-4" />
                      Back to Store
                    </Link>
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
                      <Signout />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <Logo color="blue" />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
              Admin
            </span>
            <Avatar className="w-8 h-8 border-2 border-blue-100">
              <AvatarImage src={user.image || ""} alt={user.name} />
              <AvatarFallback className="bg-blue-50 text-blue-700 text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      <div className="max-w-360 mx-auto flex">
        <aside className="hidden md:flex flex-col w-64 bg-white/80 backdrop-blur-md border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 sticky top-16">
          <nav className="space-y-1 flex-1">
            {sidebarLinks.map((link) => (
              <AdminSidebar key={link.href} {...link} />
            ))}
          </nav>
          <div className="pt-4 border-t border-slate-100 space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors"
            >
              <Store className="w-4 h-4" />
              Back to Store
            </Link>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
              <Signout />
            </div>
          </div>
        </aside>
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6">{children}</main>
      </div>
      <MobileAdminNav sidebarLinks={sidebarLinks} />
    </div>
  );
};
export default AdminLayout;
