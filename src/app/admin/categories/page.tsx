import { CategoryManager } from "./_components/CategoryManager";
import { AdminService } from "@/services/admin.service";

export const metadata = {
  title: "Manage Categories",
  description: "Admin category management",
};

const AdminCategories = async () => {
  const res = await AdminService.getCategories();
  const categories = res?.success ? res.data : [];

  return <CategoryManager initialCategories={categories} />;
};
export default AdminCategories;
