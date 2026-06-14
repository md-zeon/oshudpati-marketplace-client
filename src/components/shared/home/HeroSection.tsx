import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-linear-to-br from-emerald-600 via-emerald-500 to-teal-500 p-8 md:p-12 text-white">
      <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white/5 animate-pulse-soft" />
      <div
        className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-white/5 animate-pulse-soft"
        style={{ animationDelay: "1s" }}
      />
      <div className="relative z-10 max-w-2xl animate-fade-in-up">
        <Badge className="bg-white/20 text-white border-white/30 mb-4 px-3 py-1">
          Bangladesh{"'"}s Trusted Healthcare Marketplace
        </Badge>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
          Your Health, <span className="text-emerald-100">Our Priority</span>
        </h1>
        <p className="mt-4 text-lg text-white/80 max-w-lg leading-relaxed">
          Shop authentic medicines, healthcare products, and wellness essentials
          from trusted pharmacies across Bangladesh. Safe, fast, and affordable.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-white text-emerald-700 font-bold px-6 py-3 rounded-xl hover:bg-emerald-50 transition-all hover:shadow-lg active:scale-[0.98]"
          >
            Browse Medicines{" "}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
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
  );
}
