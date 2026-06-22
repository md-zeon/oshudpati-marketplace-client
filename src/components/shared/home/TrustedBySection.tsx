"use client";
import { InfiniteSlider } from "@/components/motion-primitives/infinite-slider";
import { ShieldCheck } from "lucide-react";

interface Partner {
  name: string;
  initials: string;
  bg: string;
  text: string;
}

const partners: Partner[] = [
  {
    name: "Square Pharmaceuticals",
    initials: "S",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
  },
  {
    name: "Beximco Pharma",
    initials: "B",
    bg: "bg-blue-100",
    text: "text-blue-700",
  },
  {
    name: "Incepta Pharmaceuticals",
    initials: "I",
    bg: "bg-violet-100",
    text: "text-violet-700",
  },
  {
    name: "Renata Limited",
    initials: "R",
    bg: "bg-amber-100",
    text: "text-amber-700",
  },
  {
    name: "Aci Limited",
    initials: "A",
    bg: "bg-rose-100",
    text: "text-rose-700",
  },
  {
    name: "Eskayef Pharmaceuticals",
    initials: "E",
    bg: "bg-cyan-100",
    text: "text-cyan-700",
  },
  {
    name: "Orion Pharma",
    initials: "O",
    bg: "bg-indigo-100",
    text: "text-indigo-700",
  },
  {
    name: "Radiant Pharmaceuticals",
    initials: "RP",
    bg: "bg-teal-100",
    text: "text-teal-700",
  },
  {
    name: "Drug International",
    initials: "DI",
    bg: "bg-orange-100",
    text: "text-orange-700",
  },
  {
    name: "Genex Pharma",
    initials: "G",
    bg: "bg-fuchsia-100",
    text: "text-fuchsia-700",
  },
];

export function TrustedBySection() {
  return (
    <section className="py-12 sm:py-16">
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-3 mb-10">
        <span className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-600 rounded-full px-3 py-1 text-[11px] font-bold tracking-wider uppercase">
          <ShieldCheck className="w-3.5 h-3.5" />
          Trusted By
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Partners & Brands We Work With
        </h2>
        <p className="text-sm text-gray-500 max-w-xl leading-relaxed">
          We collaborate with leading pharmaceutical companies and healthcare
          brands to bring you authentic products.
        </p>
      </div>

      {/* Infinite Slider */}
      <div className="relative">
        {/* Fade edges for a polished look */}
        <div className="absolute inset-y-0 left-0 w-24 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />

        <InfiniteSlider
          gap={24}
          speed={60}
          speedOnHover={0}
          direction="horizontal"
          reverse={false}
          className="py-4"
        >
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex items-center gap-3 px-5 py-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 select-none"
            >
              {/* Initials Avatar */}
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-lg text-sm font-bold ${partner.bg} ${partner.text}`}
              >
                {partner.initials}
              </div>

              {/* Partner Name */}
              <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                {partner.name}
              </span>
            </div>
          ))}
        </InfiniteSlider>
      </div>
    </section>
  );
}
