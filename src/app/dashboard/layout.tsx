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
    <SidebarProvider>
      <Sidebar collapsible="offcanvas">
        {/* ==================== SIDEBAR HEADER ==================== */}
        <SidebarHeader>
          <div className="flex items-center gap-3 px-1 py-1">
            <Avatar className="size-9 border-2 border-brand-200">
              <AvatarImage src={user.image || ""} alt={user.name} />
              <AvatarFallback className="bg-brand-100 text-brand-800 text-xs font-bold">
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
            <SidebarGroupLabel>Account</SidebarGroupLabel>
            <SidebarMenu>
              {sidebarLinks.map((link) => (
                <DashboardSidebar key={link.href} {...link} />
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

      <SidebarInset style={{ backgroundColor: "var(--surface-card)" }}>
        {/* ==================== TOP HEADER ==================== */}
        <header className="sticky top-0 z-40 border-b border-border-default bg-card/80 backdrop-blur-md">
          <div className="flex h-16 items-center gap-3 px-4 md:px-6">
            <SidebarTrigger />
            <Logo className="text-xl md:text-2xl" />
            <div className="ml-auto flex items-center gap-3">
              <Link
                href="/shop"
                className="hidden sm:block text-sm text-muted-foreground hover:text-brand-800 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 rounded-sm"
              >
                Shop
              </Link>
              <span className="hidden sm:block text-sm text-foreground font-medium">
                {user.name}
              </span>
              <Avatar className="size-8 border-2 border-brand-100">
                <AvatarImage src={user.image || ""} alt={user.name} />
                <AvatarFallback className="bg-brand-50 text-brand-800 text-xs font-bold">
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
      <MobileDashboardNav sidebarLinks={sidebarLinks} />
    </SidebarProvider>
  );
};

export default DashboardLayout;
