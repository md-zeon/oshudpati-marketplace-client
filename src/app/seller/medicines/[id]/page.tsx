import { redirect } from "next/navigation";
import { userService } from "@/services/user.service";
import { CategoryService } from "@/services/category.service";
import { Category } from "@/types";
import { MedicineForm } from "../_components/MedicineForm";
import { MedicineService } from "@/services/medicine.service";

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
      <div className="text-center py-20">
        <p className="text-lg font-semibold text-slate-500">
          Medicine not found
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-emerald-50">
          <div className="w-5 h-5 rounded bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">
            E
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Edit Medicine</h1>
          <p className="text-sm text-slate-500">{medicine.name}</p>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-6">
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
