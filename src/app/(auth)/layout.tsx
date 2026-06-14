import React from "react";
import { Pill } from "lucide-react";
import Link from "next/link";
import { userService } from "@/services/user.service";
import { redirect } from "next/navigation";
import { Roles } from "@/constants/roles";
import { AppBreadcrumb } from "@/components/shared/AppBreadcrumb";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await userService.getSession();
  if (session?.success) {
    if (session.data.user?.role === Roles.ADMIN) {
      return redirect("/admin/dashboard");
    } else if (session.data.user?.role === Roles.SELLER) {
      return redirect("/seller/dashboard");
    } else if (session.data.user?.role === Roles.CUSTOMER) {
      return redirect("/dashboard");
    }
  }
  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50">
      {/* Top Brand Bar */}
      <div className="max-w-360 mx-auto px-4 py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-lg font-bold text-emerald-700 tracking-tight"
        >
          <span>Oshudpati</span>
        </Link>
      </div>
      <div className="max-w-360 mx-auto px-4 py-2">
        <AppBreadcrumb />
      </div>
      <main>{children}</main>
    </div>
  );
};

export default AuthLayout;
