import { MedicineService } from "@/services/medicine.service";
import { CategoryService } from "@/services/category.service";
import { Medicine, Category } from "@/types";
import { Pill, Star, Truck, ShieldCheck, HeadphonesIcon } from "lucide-react";
import Link from "next/link";
import { HeroSection } from "@/components/shared/home/HeroSection";
import { StatCard } from "@/components/shared/home/StatCard";
import { FeatureCard } from "@/components/shared/home/FeatureCard";
import { CtaBanner } from "@/components/shared/home/CtaBanner";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { TestimonialsSection } from "@/components/shared/home/TestimonialsSection";
import { MedicineCard } from "@/components/shared/medicine/MedicineCard";
import { CategorySection } from "@/components/shared/home/CategorySection";

export const metadata = {
  title: "Oshudpati | Trusted Online Medicine & Healthcare Marketplace",
  description:
    "Buy authentic medicines, healthcare products, and wellness essentials online from trusted pharmacies across Bangladesh.",
};

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
      {/* HERO SECTION */}
      <HeroSection />

      {/* STATS BAR */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      {/* CATEGORIES */}
      <CategorySection categories={categories} />

      {/* FEATURED MEDICINES */}
      {featuredMedicines.length > 0 && (
        <section>
          <SectionHeader
            title="Featured Medicines"
            description="Handpicked for your health needs"
            viewAllHref="/shop?isFeatured=true"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 stagger-children">
            {featuredMedicines.slice(0, 8).map((medicine) => (
              <MedicineCard key={medicine.id} medicine={medicine} />
            ))}
          </div>
        </section>
      )}

      {/* WHY CHOOSE US */}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      {/* TOP RATED */}
      {topRatedMedicines.length > 0 && (
        <section>
          <SectionHeader
            title="Top Rated"
            description="Most popular among our customers"
            viewAllHref="/shop?sortBy=popular"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 stagger-children">
            {topRatedMedicines.slice(0, 8).map((medicine) => (
              <MedicineCard key={medicine.id} medicine={medicine} />
            ))}
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      <TestimonialsSection />

      {/* CTA BANNER */}
      <CtaBanner />
    </div>
  );
};

export default HomePage;
