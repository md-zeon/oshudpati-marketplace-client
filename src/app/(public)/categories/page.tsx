import { CategoryService } from "@/services/category.service";
import { Category } from "@/types";
import { SanitizedHtml } from "@/components/shared/SanitizedHtml";
import { Grid3X3, Pill, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Categories",
  description: "Browse medicines by category",
};

const CategoriesPage = async () => {
  const res = await CategoryService.getCategories({
    revalidate: 60,
  });

  const categories: Category[] = res?.success ? res.data : [];

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 ring-1 ring-brand-100">
            <Grid3X3 className="h-7 w-7 text-brand-700" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-brand-900 sm:text-3xl">
              Medicine Categories
            </h1>

            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              Browse medicines by health conditions and categories
            </p>
          </div>
        </div>

        <div className="w-fit rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700">
          {categories.length} {categories.length === 1 ? "category" : "categories"}
        </div>
      </div>

      {/* Empty State */}
      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border-default py-24">
          <Pill className="mb-5 h-14 w-14 text-muted-foreground" />

          <h2 className="text-xl font-bold text-brand-900">
            No categories available
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Categories are being added. Check back soon.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className="group flex flex-col overflow-hidden rounded-3xl border border-border-default bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:outline-none"
            >
              {/* Image */}
              <div className="mb-5 flex h-44 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-brand-50 to-surface-card">
                {category.imageUrl ? (
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    width={220}
                    height={220}
                    className="object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <Pill className="h-14 w-14 text-brand-200" />
                )}
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-brand-900 transition-colors group-hover:text-brand-700">
                {category.name}
              </h3>

              {category.description && (
                <SanitizedHtml
                  html={category.description}
                  className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground"
                />
              )}

              {/* Footer */}
              <div className="mt-auto flex items-center justify-between pt-6">
                <span className="text-sm font-semibold text-brand-700">
                  Explore medicines
                </span>

                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition-all duration-300 group-hover:bg-brand-700 group-hover:text-white"
                  aria-hidden="true"
                >
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
