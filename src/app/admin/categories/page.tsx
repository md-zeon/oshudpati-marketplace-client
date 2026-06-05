import { redirect } from "next/navigation";
import { userService } from "@/services/user.service";
import { Grid3X3 } from "lucide-react";

export const metadata = {
  title: "Manage Categories",
  description: "Admin category management",
};

const AdminCategories = async () => {
  const session = await userService.getSession();
  if (!session?.success || !session.data?.user) return redirect("/signin");
  if (session.data.user.role !== "ADMIN") return redirect("/dashboard");

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Grid3X3 className="w-5 h-5 text-blue-600" />
        <h1 className="text-xl font-bold text-slate-900">Categories</h1>
      </div>
      <p className="text-sm text-slate-500 text-center py-16">
        Category management coming soon.
      </p>
    </div>
  );
};
export default AdminCategories;
