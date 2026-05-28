import NavbarContent from "@/app/(public)/_components/navigation/NavbarContent";
import NavbarHeader from "@/app/(public)/_components/navigation/NavbarHeader";
import SiteAnnouncement from "@/app/(public)/_components/SiteAnnouncement";
import React from "react";
import NavbarFooter from "./_components/navigation/NavbarFooter";
import MobileNavbarHeader from "./_components/navigation/MobileNavbarHeader";
import MobileNavbarFooter from "./_components/navigation/MobileNavbarFooter";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {/* ================= DESKTOP ================= */}
      <header>
        <SiteAnnouncement />
        <NavbarHeader />
      </header>
      <NavbarContent />
      <NavbarFooter />

      {/* ================= MOBILE ================= */}
      <MobileNavbarHeader />

      {/* Main Content */}
      <main>{children}</main>
      <footer>Public Footer</footer>
      <MobileNavbarFooter />
    </>
  );
};

export default PublicLayout;
