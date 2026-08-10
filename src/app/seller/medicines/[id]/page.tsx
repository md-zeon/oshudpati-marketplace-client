import { redirect } from "next/navigation";
import { userService } from "@/services/user.service";
import { CategoryService } from "@/services/category.service";
import { Category } from "@/types";
import { Pencil, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MedicineForm } from "../_components/MedicineForm";
import { MedicineService } from "@/services/medicine.service";
import { SellerPageHeader } from "../../_components/SellerPageHeader";

export const metadata = {
  title: "Edit Medicine",
  description: "Edit medicine details",
};

const EditMedicinePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const session = await userService.getSession();
  if (!session?.success || !session.data?.user) return redirect("/signin");
  if (session.data.user.role !== "SELLER") return redirect("/dashboard");

  const [medicineRes, categoryRes] = await Promise.all([
    MedicineService.getMedicineById(id, { cache: "no-store" }),
    CategoryService.getCategories({ revalidate: 60 }),
  ]);

  const categories: Category[] = categoryRes?.success ? categoryRes.data : [];
  const medicine = medicineRes?.success ? medicineRes.data : null;

  if (!medicine) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-default bg-card py-20 text-center">
        <h1 className="text-lg font-semibold text-brand-900">
          Medicine not found
        </h1>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          The medicine you are looking for may have been deleted or you do not
          have access to it.
        </p>
        <Button
          asChild
          variant="outline"
          className="mt-5 cursor-pointer"
        >
          <Link href="/seller/medicines">
            <ArrowLeft className="size-4" aria-hidden /> Back to Medicines
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <SellerPageHeader
        title="Edit Medicine"
        subtitle={medicine.name}
        icon={<Pencil className="size-5" aria-hidden />}
        className="mb-6"
      />
      <div className="rounded-xl border border-border-default bg-card p-4 sm:p-6">
        <MedicineForm
          categories={categories}
          initialData={medicine}
          isEditing
          medicineId={id}
        />
      </div>
    </div>
  );
};
export default EditMedicinePage;
