import React from "react";
import NavbarHeader from "../(public)/_components/navigation/NavbarHeader";
import { AppBreadcrumb } from "@/components/shared/AppBreadcrumb";
import { userService } from "@/services/user.service";
import { redirect } from "next/navigation";
import { Roles } from "@/constants/roles";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await userService.getSession();
  if (session?.success) {
    // Redirect to the appropriate dashboard based on user role
    if (session.data.user?.role === Roles.ADMIN) {
      return redirect("/admin/dashboard");
    } else if (session.data.user?.role === Roles.SELLER) {
      return redirect("/seller/dashboard");
    } else if (session.data.user?.role === Roles.CUSTOMER) {
      return redirect("/dashboard");
    }
  }
  return (
    <>
      <header>
        <NavbarHeader />
      </header>
      <main className="max-w-360 mx-auto px-4">
        <AppBreadcrumb />
        {children}
      </main>
    </>
  );
};

export default AuthLayout;
