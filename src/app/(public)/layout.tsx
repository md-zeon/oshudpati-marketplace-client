import NavbarContent from "@/app/(public)/_components/navigation/NavbarContent";
import NavbarHeader from "@/app/(public)/_components/navigation/NavbarHeader";
import SiteAnnouncement from "@/app/(public)/_components/SiteAnnouncement";
import React from "react";
import NavbarFooter from "./_components/navigation/NavbarFooter";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <header>
        {/* Site Announcement */}
        <SiteAnnouncement />
        {/* Navbar header */}
        <NavbarHeader />
      </header>
      {/* Navigation Content */}
      <NavbarContent />
      {/* Navigation Footer */}
      <NavbarFooter />
      <main>{children}</main>
      <footer>Public Footer</footer>
    </>
  );
};

export default PublicLayout;
