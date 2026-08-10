import React from "react";
import Link from "next/link";
import { Store } from "lucide-react";
import { userService } from "@/services/user.service";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logo from "@/components/shared/Logo";
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

  return (
    <SidebarProvider>
      <Sidebar collapsible="offcanvas">
        {/* ==================== SIDEBAR HEADER ==================== */}
        <SidebarHeader>
          <div className="flex items-center gap-3 px-1 py-1">
            <Avatar className="size-9 border-2 border-brand-200">
              <AvatarImage src={user.image || ""} alt={user.name} />
              <AvatarFallback className="bg-brand-100 text-brand-900 text-xs font-bold">
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
            <SidebarGroupLabel>Seller Menu</SidebarGroupLabel>
            <SidebarMenu>
              {sidebarLinks.map((link) => (
                <SellerSidebar key={link.href} {...link} />
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

      <SidebarInset>
        {/* ==================== TOP HEADER ==================== */}
        <header className="sticky top-0 z-40 border-b border-border-default bg-background/80 backdrop-blur-md">
          <div className="flex h-16 items-center gap-3 px-4 md:px-6">
            <SidebarTrigger />
            <Logo className="text-xl md:text-2xl" />
            <div className="ml-auto flex items-center gap-3">
              <span className="rounded-full border border-brand-100 bg-brand-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-700">
                Seller
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
      <MobileSellerNav sidebarLinks={sidebarLinks} />
    </SidebarProvider>
  );
};

export default SellerLayout;
