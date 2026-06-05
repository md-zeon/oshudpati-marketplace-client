import { redirect } from "next/navigation";
import { userService } from "@/services/user.service";
import { CategoryService } from "@/services/category.service";
import { Category } from "@/types";
import { MedicineForm } from "../_components/MedicineForm";

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
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-emerald-50">
          <div className="w-5 h-5 rounded bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">
            +
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Add Medicine</h1>
          <p className="text-sm text-slate-500">
            Fill in the details to add a new medicine
          </p>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <MedicineForm categories={categories} />
      </div>
    </div>
  );
};
export default NewMedicinePage;
