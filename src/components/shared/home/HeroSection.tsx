import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Truck, ShieldCheck } from "lucide-react";
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
    <section className="relative flex min-h-130 items-center overflow-hidden rounded-2xl bg-linear-to-br from-brand-700 via-brand-800 to-brand-950 p-8 text-white shadow-xl md:p-16">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.06),transparent_50%)]" />
      <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-accent-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-trust-400/10 blur-3xl" />

      {/* Bangladesh Map */}
      <div className="absolute inset-y-0 right-0 z-0 flex w-full items-center justify-end pr-4 select-none md:w-1/2">
        <div className="relative h-120 w-85 opacity-20 md:h-175 md:w-125 md:opacity-30">
          <Image
            src="/bd.svg"
            alt="Bangladesh Map"
            fill
            priority
            className="pointer-events-none object-contain"
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
                    <div
                      className="h-4 w-4 animate-ping rounded-full bg-accent-400"
                      style={{ animationDuration: `${2.5 + index * 0.2}s` }}
                    />
                    <div className="absolute top-1 left-1 h-2 w-2 rounded-full bg-accent-500" />
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
      <div className="relative z-10 flex w-full max-w-3xl flex-col gap-8">
        <div className="max-w-2xl">
          <Badge className="mb-5 inline-flex bg-white/10 px-3 py-1 text-xs font-medium tracking-wide text-brand-100 backdrop-blur-md">
            Bangladesh&apos;s Trusted Healthcare Marketplace
          </Badge>

          <h1 className="text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            Authentic Medicines,{" "}
            <span className="text-accent-300">Delivered Across Bangladesh</span>
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-brand-50/80 md:text-lg">
            Shop from verified licensed pharmacies — genuine medicines,
            wellness essentials, and transparent pricing delivered fast to
            your doorstep.
          </p>
        </div>

        {/* Primary action + proof */}
        <div className="flex w-full max-w-2xl flex-col gap-4">
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 self-start rounded-xl bg-white px-6 py-3.5 font-bold text-brand-700 transition-all hover:bg-brand-50 hover:shadow-lg active:scale-[0.98]"
          >
            Browse Medicines
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <div className="flex items-center gap-2 text-sm text-brand-50/80">
            <div className="flex items-center gap-0.5" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-accent-400 text-accent-400" />
              ))}
            </div>
            <span className="font-semibold text-white">4.8/5</span>
            <span>from 12,000+ verified customers</span>
          </div>
        </div>

        {/* Micro-promises */}
        <div className="grid max-w-xl grid-cols-1 gap-4 border-t border-white/10 pt-6 sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-white/10 bg-white/5 p-2 text-brand-200">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Fast Delivery</p>
              <p className="text-xs text-brand-100/60">
                Straight to your doorstep across Bangladesh
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-white/10 bg-white/5 p-2 text-brand-200">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">100% Authentic</p>
              <p className="text-xs text-brand-100/60">
                Sourced exclusively from verified pharmacies
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
