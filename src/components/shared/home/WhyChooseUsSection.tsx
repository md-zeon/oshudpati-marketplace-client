import { ShieldCheck, LucideIcon } from "lucide-react";
import { FeatureCard } from "@/components/shared/home/FeatureCard";

interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  bg: string;
}

interface WhyChooseUsSectionProps {
  features: FeatureItem[];
}

export function WhyChooseUsSection({ features }: WhyChooseUsSectionProps) {
  return (
    <section className="py-12 sm:py-16">
      {/* Header Container: Perfectly left-aligned on desktop for a premium feel */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-gray-100">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 rounded-full px-3 py-1 text-[11px] font-bold tracking-wider uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            Why Oshudpati
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Your Trusted Healthcare Partner
          </h2>
        </div>
        <p className="text-sm text-gray-500 max-w-md md:text-left leading-relaxed">
          We make healthcare accessible, authentic, and affordable for everyone
          in Bangladesh.
        </p>
      </div>

      {/* Grid: Flat, responsive, and borderless layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </section>
  );
}
