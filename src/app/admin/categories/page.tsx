import { CategoryService } from "@/services/category.service";
import { CategoryManager } from "./_components/CategoryManager";

export const metadata = {
  title: "Manage Categories",
  description: "Admin category management",
};

const AdminCategories = async () => {
  const [categoriesRes, trashCategoriesRes] = await Promise.all([
    CategoryService.getCategories({ cache: "no-store" }),
    CategoryService.getInactiveCategories({ cache: "no-store" }),
  ]);
  const categories = categoriesRes?.success ? categoriesRes.data : [];
  const trashCategories = trashCategoriesRes?.success
    ? trashCategoriesRes.data
    : [];

  return (
    <CategoryManager
      categories={categories}
      trashCategories={trashCategories}
    />
  );
};

export default AdminCategories;
