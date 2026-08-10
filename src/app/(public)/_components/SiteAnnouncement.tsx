"use client";

import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Truck, X } from "lucide-react";
import Link from "next/link";

const promoBannerData = {
  message: "Free shipping on orders over 300TK!",
  link: "/shop",
  linkText: "Shop Now",
  isDismissible: true,
};

const SiteAnnouncement = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative flex items-center justify-center gap-2 bg-brand-700 px-4 py-3 text-white">
      <Truck aria-hidden="true" className="h-4 w-4 shrink-0 text-brand-100" />
      <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-sm font-medium sm:text-sm">
        <span>{promoBannerData.message}</span>
        {promoBannerData.link && (
          <Link
            href={promoBannerData.link}
            className="inline-flex min-h-9 items-center rounded-md px-2 font-semibold text-brand-100 underline underline-offset-4 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {promoBannerData.linkText}
          </Link>
        )}
      </p>

      {promoBannerData.isDismissible && (
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Dismiss announcement"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-white/80 hover:bg-white/10 hover:text-white"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default SiteAnnouncement;
