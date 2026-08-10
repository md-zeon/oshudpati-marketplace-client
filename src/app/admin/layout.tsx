import React from "react";
import Link from "next/link";
import { Store } from "lucide-react";
import { userService } from "@/services/user.service";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
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
    <SidebarProvider>
      <Sidebar
        collapsible="offcanvas"
        style={
          {
            "--sidebar-accent": "var(--trust-50)",
            "--sidebar-accent-foreground": "var(--trust-900)",
            "--sidebar-border": "var(--trust-200)",
            "--sidebar-ring": "var(--trust-600)",
            "--sidebar-primary": "var(--trust-700)",
            "--sidebar-primary-foreground": "#ffffff",
          } as React.CSSProperties
        }
      >
        {/* ==================== SIDEBAR HEADER ==================== */}
        <SidebarHeader>
          <div className="flex items-center gap-3 px-1 py-1">
            <Avatar className="size-9 border-2 border-trust-200">
              <AvatarImage src={user.image || ""} alt={user.name} />
              <AvatarFallback className="bg-trust-100 text-trust-700 text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-0.5 min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {user.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
        </SidebarHeader>

        {/* ==================== SIDEBAR NAV ==================== */}
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarMenu>
              {sidebarLinks.map((link) => (
                <AdminSidebar key={link.href} {...link} />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        {/* ==================== SIDEBAR FOOTER ==================== */}
        <SidebarFooter>
          <SidebarSeparator />
          <div className="space-y-1 p-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild size="lg">
                  <Link href="/">
                    <Store aria-hidden="true" />
                    <span>Back to Store</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <Signout />
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset style={{ backgroundColor: "var(--admin-bg)" }}>
        {/* ==================== TOP HEADER ==================== */}
        <header className="sticky top-0 z-40 border-b border-admin-border bg-white/80 backdrop-blur-md">
          <div className="flex h-16 items-center gap-3 px-4 md:px-6">
            <SidebarTrigger />
            <Logo color="blue" className="text-xl md:text-2xl" />
            <div className="ml-auto flex items-center gap-3">
              <span className="rounded-full border border-trust-200 bg-trust-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-trust-700">
                Admin
              </span>
              <Avatar className="size-8 border-2 border-trust-200">
                <AvatarImage src={user.image || ""} alt={user.name} />
                <AvatarFallback className="bg-trust-100 text-xs font-bold text-trust-700">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* ==================== MAIN CONTENT ==================== */}
        <div className="flex-1 p-4 pb-24 md:p-6 md:pb-6">{children}</div>
      </SidebarInset>

      {/* ==================== MOBILE BOTTOM NAV ==================== */}
      <MobileAdminNav sidebarLinks={sidebarLinks} />
    </SidebarProvider>
  );
};

export default AdminLayout;
