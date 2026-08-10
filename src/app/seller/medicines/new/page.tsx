import { redirect } from "next/navigation";
import { userService } from "@/services/user.service";
import { CategoryService } from "@/services/category.service";
import { Category } from "@/types";
import { PackagePlus } from "lucide-react";
import { MedicineForm } from "../_components/MedicineForm";
import { SellerPageHeader } from "../../_components/SellerPageHeader";

export const metadata = {
  title: "Add Medicine",
  description: "Add a new medicine",
};

const NewMedicinePage = async () => {
  const session = await userService.getSession();
  if (!session?.success || !session.data?.user) return redirect("/signin");
  if (session.data.user.role !== "SELLER") return redirect("/dashboard");

  const res = await CategoryService.getCategories({ revalidate: 60 });
  const categories: Category[] = res?.success ? res.data : [];

  return (
    <div className="mx-auto max-w-3xl">
      <SellerPageHeader
        title="Add Medicine"
        subtitle="Fill in the details to list a new medicine in your shop"
        icon={<PackagePlus className="size-5" aria-hidden />}
        className="mb-6"
      />
      <div className="rounded-xl border border-border-default bg-card p-4 sm:p-6">
        <MedicineForm categories={categories} />
      </div>
    </div>
  );
};
export default NewMedicinePage;
