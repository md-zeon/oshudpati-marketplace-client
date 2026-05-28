import React from "react";
import NavbarHeader from "../(public)/_components/navigation/NavbarHeader";
import NavbarContent from "../(public)/_components/navigation/NavbarContent";
import { AppBreadcrumb } from "@/components/shared/AppBreadcrumb";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <header>
        <NavbarHeader />
      </header>
      <NavbarContent />
      <main className="max-w-360 mx-auto px-4">
        <AppBreadcrumb />
        {children}
      </main>
    </>
  );
};

export default AuthLayout;
