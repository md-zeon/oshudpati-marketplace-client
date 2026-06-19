import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Truck, ShieldCheck } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function HeroSection() {
  const divisions = [
    { name: "Dhaka", x: 485.3, y: 490.6 },
    { name: "Chattogram", x: 740.7, y: 628.8 },
    { name: "Sylhet", x: 683.8, y: 372.9 },
    { name: "Rajshahi", x: 282.8, y: 384 },
    { name: "Khulna", x: 359.9, y: 596.9 },
    { name: "Barishal", x: 486, y: 634.7 },
    { name: "Rangpur", x: 333.4, y: 287.6 },
    { name: "Mymensingh", x: 516, y: 380 },
  ];
  return (
    <section className="relative overflow-hidden rounded-2xl bg-linear-to-br from-[#00875A] via-[#00704A] to-[#004D33] p-8 md:p-16 text-white min-h-130 flex items-center shadow-xl">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.06),transparent_50%)]" />

      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />

      {/* Bangladesh Map */}
      <div className="absolute right-0 inset-y-0 w-full md:w-1/2 z-0 flex items-center justify-end pr-4 select-none">
        <div className="relative w-85 h-120 md:w-125 md:h-175 opacity-20 md:opacity-30">
          <Image
            src="/bd.svg"
            alt="Bangladesh Map"
            fill
            priority
            className="object-contain pointer-events-none"
          />
          <TooltipProvider>
            {divisions.map((division, index) => (
              <Tooltip key={division.name}>
                <div
                  className="absolute group"
                  style={{
                    left: `${(division.x / 1000) * 100}%`,
                    top: `${(division.y / 1000) * 100}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <TooltipTrigger className="cursor-pointer">
                    {/* Ping */}
                    <div
                      className="w-4 h-4 rounded-full bg-emerald-400 animate-ping"
                      style={{
                        animationDuration: `${2.5 + index * 0.2}s`,
                      }}
                    />

                    {/* Center Dot */}
                    <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-emerald-300" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm font-medium">{division.name}</p>
                  </TooltipContent>
                </div>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-3xl w-full flex flex-col gap-8">
        {/* Heading */}
        <div className="max-w-2xl">
          <Badge className="inline-flex bg-white/10 text-emerald-200 border-emerald-500/20 backdrop-blur-md mb-5 px-3 py-1 text-xs font-medium tracking-wide">
            Bangladesh&apos;s Trusted Healthcare Marketplace
          </Badge>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Your Health, <span className="text-emerald-300">Our Priority</span>
          </h1>

          <p className="mt-4 text-base md:text-lg text-emerald-50/80 max-w-xl leading-relaxed">
            Shop authentic medicines, healthcare products, and wellness
            essentials from trusted pharmacies across Bangladesh. Safe, fast,
            and affordable.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center max-w-2xl w-full">
          {/* Buttons */}
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 bg-white text-[#00704A] font-bold px-6 py-3.5 rounded-xl hover:bg-emerald-50 transition-all hover:shadow-lg active:scale-[0.98]"
            >
              Browse Medicines
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white font-semibold px-6 py-3.5 rounded-xl border border-white/10 hover:bg-white/20 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-emerald-300">
              <Truck className="w-5 h-5" />
            </div>

            <div>
              <p className="text-sm font-semibold">Fast Delivery</p>

              <p className="text-xs text-emerald-200/60">
                Straight to your doorstep across Bangladesh
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-emerald-300">
              <ShieldCheck className="w-5 h-5" />
            </div>

            <div>
              <p className="text-sm font-semibold">100% Authentic</p>

              <p className="text-xs text-emerald-200/60">
                Sourced exclusively from verified pharmacies
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
