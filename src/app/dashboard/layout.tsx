import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingBag,
  MapPin,
  User,
  LogOut,
  Menu,
  Pill,
} from "lucide-react";
import { userService } from "@/services/user.service";
import { redirect } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const sidebarLinks = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/orders",
    label: "Orders",
    icon: ShoppingBag,
  },
  {
    href: "/dashboard/addresses",
    label: "Addresses",
    icon: MapPin,
  },
  {
    href: "/dashboard/profile",
    label: "Profile",
    icon: User,
  },
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
    <div className="min-h-screen bg-slate-50">
      {/* ==================== TOP HEADER ==================== */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-360 mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors">
                  <Menu className="w-5 h-5 text-slate-600" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <MobileSidebar user={user} initials={initials} />
              </SheetContent>
            </Sheet>

            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-bold text-emerald-700 tracking-tight"
            >
              <Pill className="w-5 h-5" />
              <span>Oshudpati</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/shop"
              className="hidden sm:block text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors"
            >
              Shop
            </Link>
            <div className="flex items-center gap-2.5">
              <span className="hidden sm:block text-sm text-slate-700 font-medium">
                {user.name}
              </span>
              <Avatar className="w-8 h-8 border-2 border-emerald-100">
                <AvatarImage src={user.image || ""} alt={user.name} />
                <AvatarFallback className="bg-emerald-50 text-emerald-700 text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-360 mx-auto flex">
        {/* ==================== DESKTOP SIDEBAR ==================== */}
        <aside className="hidden md:flex flex-col w-64 bg-white/80 backdrop-blur-md border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 sticky top-16">
          <nav className="space-y-1 flex-1">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 hover:font-semibold transition-all"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t border-slate-100 space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors"
            >
              <Pill className="w-4 h-4" />
              Back to Store
            </Link>
            <Link
              href="/api/auth/signout"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Link>
          </div>
        </aside>

        {/* ==================== MAIN CONTENT ==================== */}
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6">{children}</main>
      </div>

      {/* ==================== MOBILE BOTTOM NAV ==================== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 z-40 safe-area-bottom">
        <div className="flex justify-around py-2">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium text-slate-500 hover:text-emerald-600 transition-colors"
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

// Mobile Sidebar Content
interface MobileSidebarUser {
  name: string;
  email: string;
  image?: string | null;
}

function MobileSidebar({
  user,
  initials,
}: {
  user: MobileSidebarUser;
  initials: string;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border-2 border-emerald-200">
            <AvatarImage src={user.image || ""} alt={user.name} />
            <AvatarFallback className="bg-emerald-100 text-emerald-700 text-sm font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold text-slate-900 text-sm">{user.name}</p>
            <p className="text-[11px] text-slate-500">{user.email}</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {sidebarLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all"
          >
            <link.icon className="w-4 h-4" />
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="p-3 border-t border-slate-100 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors"
        >
          <Pill className="w-4 h-4" />
          Back to Store
        </Link>
        <Link
          href="/api/auth/signout"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Link>
      </div>
    </div>
  );
}

export default DashboardLayout;
