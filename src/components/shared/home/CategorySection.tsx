import Image from "next/image";
import Link from "next/link";

import { Category } from "@/types";
import { SectionHeader } from "@/components/shared/SectionHeader";

interface CategorySectionProps {
  categories: Category[];
}

export function CategorySection({ categories }: CategorySectionProps) {
  if (!categories.length) return null;

  return (
    <section className="space-y-8">
      <SectionHeader
        title="Shop by Category"
        description="Find what you need faster"
        viewAllHref="/shop"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {categories.slice(0, 8).map((cat) => {
          const items =
            "_count" in cat
              ? ((
                  cat as Category & {
                    _count?: { medicines?: number };
                  }
                )._count?.medicines ?? 0)
              : 0;

          return (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="
                group
                relative
                overflow-hidden
                rounded-3xl
                h-56
                shadow-sm
                hover:shadow-xl
                transition-all
                duration-300
                hover:-translate-y-1
              "
            >
              {/* Background image */}
              <Image
                src={cat.imageUrl || "/placeholder-category.jpg"}
                alt={cat.name}
                fill
                sizes="(max-width:768px) 50vw, 25vw"
                className="
                  object-cover
                  transition-transform
                  duration-500
                  group-hover:scale-110
                "
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-lg font-bold text-white line-clamp-2">
                  {cat.name}
                </h3>

                <p className="mt-1 text-sm text-white/80">{items} items</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
