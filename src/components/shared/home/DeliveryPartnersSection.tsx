"use client";

import { InfiniteSlider } from "@/components/motion-primitives/infinite-slider";
import { Truck } from "lucide-react";
import Image from "next/image";

interface Partner {
  name: string;
  logoSrc: string;
}

const partners: Partner[] = [
  {
    name: "Pathao",
    logoSrc: "/logo/Pathao.svg",
  },
  {
    name: "Steadfast",
    logoSrc: "/logo/Steadfast_Courier_Limited.svg",
  },
  {
    name: "eCourier",
    logoSrc: "/logo/ECourier-com-bd.svg",
  },
  {
    name: "RedX",
    logoSrc: "/logo/RedX.png",
  },
  {
    name: "Paperfly",
    logoSrc: "/logo/Paperfly.svg",
  },
  {
    name: "Sundarban Courier",
    logoSrc: "/logo/scs-logo.webp",
  },
  {
    name: "Daraz Express",
    logoSrc: "/logo/Daraz-Express.webp",
  },
];

export function DeliveryPartnersSection() {
  return (
    <section className="py-10">
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-3 mb-10">
        <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-[11px] font-bold tracking-wider uppercase">
          <Truck className="w-3.5 h-3.5" />
          Delivery Partners
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Fast & Reliable Delivery Across Bangladesh
        </h2>
        <p className="text-sm text-gray-500 max-w-xl leading-relaxed">
          We partner with top courier and logistics companies to ensure your
          orders reach you quickly and safely.
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
              className="flex items-center justify-center px-6 py-4 select-none"
            >
              <Image
                src={partner.logoSrc}
                alt={partner.name}
                width={100}
                height={32}
                className="object-contain"
              />
            </div>
          ))}
        </InfiniteSlider>
      </div>
    </section>
  );
}
