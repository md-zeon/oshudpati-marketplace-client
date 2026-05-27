import Navbar from "@/components/layout/Navbar";
import SiteAnnouncement from "@/components/layout/SiteAnnouncement";
import React from "react";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <header>
        {/* Site Announcement */}
        <SiteAnnouncement />
        {/* Navbar */}
        <Navbar />
      </header>
      <main>{children}</main>
      <footer>Public Footer</footer>
    </div>
  );
};

export default PublicLayout;
