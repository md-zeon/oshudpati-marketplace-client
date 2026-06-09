import { MedicineService } from "@/services/medicine.service";
import { CategoryService } from "@/services/category.service";
import { Medicine, Category } from "@/types";
import {
  Pill,
  Star,
  Truck,
  ShieldCheck,
  HeadphonesIcon,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { WishlistButton } from "@/components/shared/wishlist/WishlistButton";
import { TestimonialsSection } from "@/components/shared/TestimonialsSection";

export const metadata = {
  title: "Oshudpati | Trusted Online Medicine & Healthcare Marketplace",
  description:
    "Buy authentic medicines, healthcare products, and wellness essentials online from trusted pharmacies across Bangladesh.",
};

function getPrimaryImage(medicine: Medicine): string {
  return (
    medicine.images?.find((img) => img.isPrimary)?.imageUrl ||
    medicine.images?.[0]?.imageUrl ||
    ""
  );
}

function getPrice(medicine: Medicine): {
  current: number;
  original: number | null;
} {
  const original = Number(medicine.price);
  const current = medicine.discountPrice
    ? Number(medicine.discountPrice)
    : original;
  return { current, original: current < original ? original : null };
}

async function getFeaturedMedicines(): Promise<Medicine[]> {
  try {
    const res = await MedicineService.getMedicines(
      { isFeatured: true, limit: 8 },
      { revalidate: 60 },
    );
    return res?.success ? res.data : [];
  } catch {
    return [];
  }
}

async function getTopRatedMedicines(): Promise<Medicine[]> {
  try {
    const res = await MedicineService.getMedicines(
      { sortBy: "popular", limit: 8 },
      { revalidate: 60 },
    );
    return res?.success ? res.data : [];
  } catch {
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const res = await CategoryService.getCategories({ revalidate: 60 });
    return res?.success ? res.data : [];
  } catch {
    return [];
  }
}

const HomePage = async () => {
  const [featuredMedicines, topRatedMedicines, categories] = await Promise.all([
    getFeaturedMedicines(),
    getTopRatedMedicines(),
    getCategories(),
  ]);

  const stats = [
    {
      label: "Medicines",
      value: featuredMedicines.length > 0 ? "10,000+" : "Thousands of",
      icon: Pill,
    },
    { label: "Trusted Sellers", value: "50+", icon: ShieldCheck },
    { label: "Happy Customers", value: "5,000+", icon: Star },
    { label: "Fast Delivery", value: "24-48hr", icon: Truck },
  ];

  const features = [
    {
      icon: ShieldCheck,
      title: "100% Authentic",
      description:
        "All medicines are sourced from verified pharmacies and authorized distributors.",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      icon: Truck,
      title: "Free Delivery",
      description:
        "Free shipping on orders above ৳300. Fast delivery across all districts in Bangladesh.",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: HeadphonesIcon,
      title: "24/7 Support",
      description:
        "Our customer support team is always ready to help with your orders and queries.",
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      icon: Star,
      title: "Best Prices",
      description:
        "Competitive pricing with regular discounts and special offers on top brands.",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative overflow-hidden rounded-2xl bg-linear-to-br from-emerald-600 via-emerald-500 to-teal-500 p-8 md:p-12 text-white">
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white/5" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-white/5" />
        <div className="relative z-10 max-w-2xl">
          <Badge className="bg-white/20 text-white border-white/30 mb-4 px-3 py-1">
            {`Bangladesh's Trusted Healthcare Marketplace`}
          </Badge>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Your Health, <span className="text-emerald-100">Our Priority</span>
          </h1>
          <p className="mt-4 text-lg text-white/80 max-w-lg leading-relaxed">
            Shop authentic medicines, healthcare products, and wellness
            essentials from trusted pharmacies across Bangladesh. Safe, fast,
            and affordable.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-white text-emerald-700 font-bold px-6 py-3 rounded-xl hover:bg-emerald-50 transition-colors shadow-lg"
            >
              Browse Medicines <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== STATS BAR ==================== */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-slate-200 p-5 text-center hover:shadow-sm transition-shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                <Icon className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {stat.label}
              </p>
            </div>
          );
        })}
      </section>

      {/* ==================== FEATURED CATEGORIES ==================== */}
      {categories.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Shop by Category
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Find what you need faster
              </p>
            </div>
            <Link
              href="/shop"
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {categories.slice(0, 8).map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="group bg-white rounded-xl border border-slate-200 p-4 hover:border-emerald-200 hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-3 group-hover:bg-emerald-100 transition-colors">
                  <Pill className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-slate-900 text-sm">
                  {cat.name}
                </h3>
                {"_count" in cat && (
                  <p className="text-xs text-slate-400 mt-0.5">
                    {(cat as Category & { _count: { medicines: number } })
                      ._count?.medicines || 0}{" "}
                    items
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ==================== FEATURED MEDICINES ==================== */}
      {featuredMedicines.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Featured Medicines
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Handpicked for your health needs
              </p>
            </div>
            <Link
              href="/shop?isFeatured=true"
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredMedicines.slice(0, 8).map((medicine) => {
              const image = getPrimaryImage(medicine);
              const { current, original } = getPrice(medicine);
              const discount = original
                ? Math.round(((original - current) / original) * 100)
                : null;

              return (
                <div
                  key={medicine.id}
                  className="relative group bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-all"
                >
                  <div className="absolute top-3 right-3 z-10">
                    <WishlistButton medicineId={medicine.id} />
                  </div>
                  <Link href={`/medicine/${medicine.slug}`}>
                    <div className="relative w-full h-36 bg-slate-50 rounded-lg overflow-hidden mb-3 flex items-center justify-center">
                      {image ? (
                        <Image
                          src={image}
                          alt={medicine.name}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <Pill className="w-10 h-10 text-slate-300" />
                      )}
                      {discount && discount > 0 && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          -{discount}%
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-emerald-600 font-semibold uppercase mb-0.5">
                      {medicine.genericName}
                    </p>
                    <p className="text-sm font-semibold text-slate-900 line-clamp-2 leading-tight">
                      {medicine.name}
                    </p>
                    <div className="flex items-center gap-1 mt-1.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.round(medicine.averageRating)
                              ? "text-amber-400 fill-amber-400"
                              : "text-slate-200"
                          }`}
                        />
                      ))}
                      <span className="text-[10px] text-slate-400 ml-1">
                        ({medicine.reviewCount})
                      </span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-1.5">
                      <span className="font-bold text-slate-800">
                        ৳{current.toFixed(0)}
                      </span>
                      {original && (
                        <span className="text-xs text-slate-400 line-through">
                          ৳{original.toFixed(0)}
                        </span>
                      )}
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ==================== WHY CHOOSE US ==================== */}
      <section className="bg-white rounded-2xl border border-slate-200 p-8 md:p-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Why Choose Oshudpati?
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-lg mx-auto">
            We make healthcare accessible, authentic, and affordable for
            everyone in Bangladesh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="text-center">
                <div
                  className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mx-auto mb-3`}
                >
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {feature.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================== TOP RATED ==================== */}
      {topRatedMedicines.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Top Rated</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Most popular among our customers
              </p>
            </div>
            <Link
              href="/shop?sortBy=popular"
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {topRatedMedicines.slice(0, 8).map((medicine) => {
              const image = getPrimaryImage(medicine);
              const { current, original } = getPrice(medicine);
              const discount = original
                ? Math.round(((original - current) / original) * 100)
                : null;

              return (
                <div
                  key={medicine.id}
                  className="relative group bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-all"
                >
                  <div className="absolute top-3 right-3 z-10">
                    <WishlistButton medicineId={medicine.id} />
                  </div>
                  <Link href={`/medicine/${medicine.slug}`}>
                    <div className="relative w-full h-36 bg-slate-50 rounded-lg overflow-hidden mb-3 flex items-center justify-center">
                      {image ? (
                        <Image
                          src={image}
                          alt={medicine.name}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <Pill className="w-10 h-10 text-slate-300" />
                      )}
                      {discount && discount > 0 && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          -{discount}%
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-emerald-600 font-semibold uppercase mb-0.5">
                      {medicine.genericName}
                    </p>
                    <p className="text-sm font-semibold text-slate-900 line-clamp-2 leading-tight">
                      {medicine.name}
                    </p>
                    <div className="flex items-center gap-1 mt-1.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.round(medicine.averageRating)
                              ? "text-amber-400 fill-amber-400"
                              : "text-slate-200"
                          }`}
                        />
                      ))}
                      <span className="text-[10px] text-slate-400 ml-1">
                        ({medicine.reviewCount})
                      </span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-1.5">
                      <span className="font-bold text-slate-800">
                        ৳{current.toFixed(0)}
                      </span>
                      {original && (
                        <span className="text-xs text-slate-400 line-through">
                          ৳{original.toFixed(0)}
                        </span>
                      )}
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ==================== TESTIMONIALS ==================== */}
      <TestimonialsSection />

      {/* ==================== CTA BANNER ==================== */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-8 md:p-12 text-white text-center">
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-emerald-500/10" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-emerald-500/10" />
        <div className="relative z-10 max-w-lg mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Ready to Get Started?
          </h2>
          <p className="mt-3 text-slate-300 text-sm leading-relaxed">
            Join thousands of satisfied customers across Bangladesh. Shop
            authentic medicines from the comfort of your home.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-lg"
            >
              Create Account <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
