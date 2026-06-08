import { CategoryService } from "@/services/category.service";
import { Category } from "@/types";
import { Grid3X3, Pill } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Categories",
  description: "Browse medicines by category",
};

const CategoriesPage = async () => {
  const res = await CategoryService.getCategories({ revalidate: 60 });
  const categories: Category[] = res?.success ? res.data : [];

  return (
    <div className="py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-xl bg-emerald-50">
          <Grid3X3 className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Medicine Categories
          </h1>
          <p className="text-sm text-slate-500">
            Browse our wide range of medicine categories
          </p>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-20">
          <Pill className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p className="text-lg font-semibold text-slate-500">
            No categories available
          </p>
          <p className="text-sm text-slate-400 mt-1">
            Categories are being added. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className="group bg-white rounded-xl border border-slate-200 p-5 hover:border-emerald-200 hover:shadow-md transition-all"
            >
              {/* Category Image */}
              <div className="w-full h-36 bg-slate-50 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                {category.imageUrl ? (
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    width={200}
                    height={200}
                    className="object-contain w-4/5 h-4/5 group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <Pill className="w-10 h-10 text-slate-300" />
                )}
              </div>

              <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors">
                {category.name}
              </h3>

              {category.description && (
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {category.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;