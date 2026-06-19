import { MedicineService } from "@/services/medicine.service";
import { CategoryService } from "@/services/category.service";
import { Medicine, Category } from "@/types";
import { Star, Truck, ShieldCheck, HeadphonesIcon } from "lucide-react";
import { HeroSection } from "@/components/shared/home/HeroSection";
import { TestimonialsSection } from "@/components/shared/home/TestimonialsSection";
import { CategorySection } from "@/components/shared/home/CategorySection";
import { FeaturedMedicinesSection } from "@/components/shared/home/FeaturedMedicinesSection";
import { TopRatedMedicinesSection } from "@/components/shared/home/TopRatedMedicinesSection";
import { WhyChooseUsSection } from "@/components/shared/home/WhyChooseUsSection";
import { CtaBannerSection } from "@/components/shared/home/CtaBannerSection";

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
    <div className="space-y-10 md:space-y-12 pb-12">
      {/* HERO SECTION */}
      <HeroSection />

      {/* CATEGORIES */}
      <CategorySection categories={categories} />

      {/* FEATURED MEDICINES */}
      <FeaturedMedicinesSection medicines={featuredMedicines} />

      {/* WHY CHOOSE US */}
      <WhyChooseUsSection features={features} />

      {/* TOP RATED */}
      <TopRatedMedicinesSection medicines={topRatedMedicines} />

      {/* TESTIMONIALS */}
      <TestimonialsSection />

      {/* CTA BANNER */}
      <CtaBannerSection />
    </div>
  );
};

export default HomePage;
