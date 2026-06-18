import { getCategoriesAction } from "@/actions/admin.action";
import { CategoryManager } from "./_components/CategoryManager";

export const metadata = {
  title: "Manage Categories",
  description: "Admin category management",
};

const AdminCategories = async () => {
  const res = await getCategoriesAction();
  const categories = res?.success ? res.data : [];

  return <CategoryManager initialCategories={categories} />;
};
export default AdminCategories;