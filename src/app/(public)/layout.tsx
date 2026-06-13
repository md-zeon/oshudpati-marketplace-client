import NavbarContent from "@/app/(public)/_components/navigation/NavbarContent";
import NavbarHeader from "@/app/(public)/_components/navigation/NavbarHeader";
import SiteAnnouncement from "@/app/(public)/_components/SiteAnnouncement";
import React from "react";
import NavbarFooter from "./_components/navigation/NavbarFooter";
import PublicFooter from "./_components/navigation/PublicFooter";
import MobileNavbarHeader from "./_components/navigation/MobileNavbarHeader";
import MobileNavbarFooter from "./_components/navigation/MobileNavbarFooter";
import { AppBreadcrumb } from "@/components/shared/AppBreadcrumb";
import { MedicineService } from "@/services/medicine.service";
import { Medicine } from "@/types";

export const dynamic = "force-dynamic";

const PublicLayout = async ({ children }: { children: React.ReactNode }) => {
  const medicineResponse = await MedicineService.getMedicines(
    { limit: 100 },
    { revalidate: 60 },
  );

  const initialMedicines: Medicine[] = medicineResponse?.success
    ? medicineResponse.data
    : [];

  return (
    <>
      {/* ================= DESKTOP ================= */}
      <header>
        <SiteAnnouncement />
        <NavbarHeader />
      </header>
      <NavbarContent medicines={initialMedicines} />
      <NavbarFooter />

      {/* ================= MOBILE ================= */}
      <MobileNavbarHeader />

      {/* Main Content */}
      <main className="w-full max-w-360 mx-auto p-4">
        <AppBreadcrumb />
        {children}
      </main>
      <PublicFooter />
      <MobileNavbarFooter medicines={initialMedicines} />
    </>
  );
};

export default PublicLayout;
