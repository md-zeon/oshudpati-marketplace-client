import { CategoryService } from "@/services/category.service";
import { Category } from "@/types";
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
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
            <Grid3X3 className="h-7 w-7 text-emerald-600" />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Medicine Categories
            </h1>

            <p className="mt-1 text-slate-500">
              Browse medicines by health conditions and categories
            </p>
          </div>
        </div>

        <div className="w-fit rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
          {categories.length} Categories
        </div>
      </div>

      {/* Empty State */}

      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 py-24">
          <Pill className="mb-5 h-14 w-14 text-slate-300" />

          <h2 className="text-xl font-bold text-slate-700">
            No categories available
          </h2>

          <p className="mt-2 text-slate-500">
            Categories are being added. Check back soon.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className="
              group
              overflow-hidden
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-6
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-emerald-200
              hover:shadow-xl
            "
            >
              {/* Image */}

              <div
                className="
                mb-5
                flex
                h-44
                items-center
                justify-center
                overflow-hidden
                rounded-2xl
                bg-linear-to-br
                from-emerald-50
                to-slate-50
              "
              >
                {category.imageUrl ? (
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    width={220}
                    height={220}
                    className="
                    h-32
                    w-32
                    object-contain
                    transition-transform
                    duration-300
                    group-hover:scale-110
                  "
                  />
                ) : (
                  <Pill className="h-14 w-14 text-slate-300" />
                )}
              </div>

              {/* Content */}

              <h3
                className="
                text-lg
                font-bold
                text-slate-900
                transition-colors
                group-hover:text-emerald-600
              "
              >
                {category.name}
              </h3>

              {category.description && (
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
                  {category.description}
                </p>
              )}

              {/* Footer */}

              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm font-medium text-emerald-600">
                  Explore medicines
                </span>

                <div
                  className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-emerald-50
                  text-emerald-600
                  transition-all
                  duration-300
                  group-hover:bg-emerald-600
                  group-hover:text-white
                "
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
